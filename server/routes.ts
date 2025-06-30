import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { getCognitoUser, determineUserRole } from "./services/cognito";
import { listAllS3Buckets, getBucketStats, formatFileSize } from "./services/s3";
import { insertAccessRequestSchema, updateAccessRequestSchema } from "@shared/schema";
import { z } from "zod";

// Auth middleware
async function authenticateUser(req: any, res: any, next: any) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No access token provided' });
  }

  const token = authHeader.substring(7);
  const cognitoUser = await getCognitoUser(token);
  
  if (!cognitoUser) {
    return res.status(401).json({ error: 'Invalid access token' });
  }

  // Get or create user in our storage
  let user = await storage.getUserByCognitoId(cognitoUser.cognitoId);
  if (!user) {
    const role = determineUserRole(cognitoUser.groups);
    user = await storage.createUser({
      cognitoId: cognitoUser.cognitoId,
      username: cognitoUser.username,
      email: cognitoUser.email,
      role,
      cognitoGroups: cognitoUser.groups
    });
  }

  req.user = user;
  req.cognitoUser = cognitoUser;
  next();
}

// Admin middleware
function requireAdmin(req: any, res: any, next: any) {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth routes
  app.get("/api/auth/me", authenticateUser, async (req: any, res) => {
    res.json({
      user: req.user,
      cognitoUser: req.cognitoUser
    });
  });

  // S3 Bucket routes
  app.get("/api/buckets", authenticateUser, async (req: any, res) => {
    try {
      // Get all buckets from AWS
      const awsBuckets = await listAllS3Buckets();
      
      // Sync with our storage
      for (const awsBucket of awsBuckets) {
        let bucket = await storage.getBucketByName(awsBucket.name);
        if (!bucket) {
          bucket = await storage.createBucket({
            name: awsBucket.name,
            region: awsBucket.region,
            arn: awsBucket.arn
          });
        }
      }

      const allBuckets = await storage.getAllBuckets();
      
      // For regular users, filter by permissions
      if (req.user.role === 'user') {
        const userPermissions = await storage.getUserBucketPermissions(req.user.id);
        const accessibleBuckets = userPermissions.map(p => p.bucket);
        
        // Add stats for accessible buckets
        const bucketsWithStats = await Promise.all(
          accessibleBuckets.map(async (bucket) => {
            try {
              const stats = await getBucketStats(bucket.name);
              return {
                ...bucket,
                objectCount: stats.objectCount,
                size: formatFileSize(stats.totalSize),
                accessLevel: userPermissions.find(p => p.bucketId === bucket.id)?.accessLevel || 'read'
              };
            } catch (error) {
              return {
                ...bucket,
                objectCount: 0,
                size: '0 B',
                accessLevel: 'read'
              };
            }
          })
        );
        
        res.json({
          accessible: bucketsWithStats,
          all: allBuckets,
          restricted: allBuckets.filter(b => !accessibleBuckets.find(ab => ab.id === b.id))
        });
      } else {
        // For admins, return all buckets with stats
        const bucketsWithStats = await Promise.all(
          allBuckets.map(async (bucket) => {
            try {
              const stats = await getBucketStats(bucket.name);
              const permissions = await storage.getBucketPermissions(bucket.id);
              return {
                ...bucket,
                objectCount: stats.objectCount,
                size: formatFileSize(stats.totalSize),
                userCount: permissions.length
              };
            } catch (error) {
              return {
                ...bucket,
                objectCount: 0,
                size: '0 B',
                userCount: 0
              };
            }
          })
        );
        
        res.json({ all: bucketsWithStats });
      }
    } catch (error) {
      console.error('Error fetching buckets:', error);
      res.status(500).json({ error: 'Failed to fetch buckets' });
    }
  });

  // User permissions
  app.get("/api/permissions/my", authenticateUser, async (req: any, res) => {
    try {
      const permissions = await storage.getUserBucketPermissions(req.user.id);
      res.json(permissions);
    } catch (error) {
      console.error('Error fetching user permissions:', error);
      res.status(500).json({ error: 'Failed to fetch permissions' });
    }
  });

  // Access requests
  app.get("/api/access-requests", authenticateUser, async (req: any, res) => {
    try {
      if (req.user.role === 'admin') {
        const allRequests = await storage.getAccessRequests();
        res.json(allRequests);
      } else {
        const userRequests = await storage.getUserAccessRequests(req.user.id);
        res.json(userRequests);
      }
    } catch (error) {
      console.error('Error fetching access requests:', error);
      res.status(500).json({ error: 'Failed to fetch access requests' });
    }
  });

  app.get("/api/access-requests/pending", authenticateUser, requireAdmin, async (req: any, res) => {
    try {
      const pendingRequests = await storage.getPendingAccessRequests();
      res.json(pendingRequests);
    } catch (error) {
      console.error('Error fetching pending requests:', error);
      res.status(500).json({ error: 'Failed to fetch pending requests' });
    }
  });

  app.post("/api/access-requests", authenticateUser, async (req: any, res) => {
    try {
      const requestData = insertAccessRequestSchema.parse({
        ...req.body,
        userId: req.user.id
      });
      
      const request = await storage.createAccessRequest(requestData);
      res.json(request);
    } catch (error) {
      console.error('Error creating access request:', error);
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: 'Invalid request data', details: error.errors });
      } else {
        res.status(500).json({ error: 'Failed to create access request' });
      }
    }
  });

  app.patch("/api/access-requests/:id", authenticateUser, requireAdmin, async (req: any, res) => {
    try {
      const requestId = parseInt(req.params.id);
      const updateData = updateAccessRequestSchema.parse({
        ...req.body,
        approvedBy: req.body.status === 'approved' ? req.user.id : undefined,
        approvedAt: req.body.status === 'approved' ? new Date() : undefined,
        expiresAt: req.body.status === 'approved' && req.body.duration ? 
          new Date(Date.now() + req.body.duration * 60 * 60 * 1000) : undefined
      });
      
      const updatedRequest = await storage.updateAccessRequest(requestId, updateData);
      
      if (!updatedRequest) {
        return res.status(404).json({ error: 'Access request not found' });
      }

      // If approved, create temporary bucket permission
      if (updateData.status === 'approved' && updatedRequest.bucketId && updatedRequest.userId) {
        await storage.createBucketPermission({
          userId: updatedRequest.userId,
          bucketId: updatedRequest.bucketId,
          accessLevel: 'read'
        });
      }
      
      res.json(updatedRequest);
    } catch (error) {
      console.error('Error updating access request:', error);
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: 'Invalid update data', details: error.errors });
      } else {
        res.status(500).json({ error: 'Failed to update access request' });
      }
    }
  });

  // Dashboard stats
  app.get("/api/stats", authenticateUser, async (req: any, res) => {
    try {
      if (req.user.role === 'admin') {
        const allBuckets = await storage.getAllBuckets();
        const allRequests = await storage.getAccessRequests();
        const pendingRequests = await storage.getPendingAccessRequests();
        
        res.json({
          totalBuckets: allBuckets.length,
          totalRequests: allRequests.length,
          pendingRequests: pendingRequests.length,
          activeUsers: 0, // TODO: Implement active users tracking
          securityAlerts: 0 // TODO: Implement security alerts
        });
      } else {
        const userPermissions = await storage.getUserBucketPermissions(req.user.id);
        const userRequests = await storage.getUserAccessRequests(req.user.id);
        const allBuckets = await storage.getAllBuckets();
        const pendingRequests = userRequests.filter(r => r.status === 'pending');
        
        res.json({
          accessibleBuckets: userPermissions.length,
          pendingRequests: pendingRequests.length,
          restrictedBuckets: allBuckets.length - userPermissions.length,
          totalRequests: userRequests.length
        });
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
      res.status(500).json({ error: 'Failed to fetch stats' });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
