import { 
  users, 
  s3Buckets, 
  bucketPermissions, 
  accessRequests,
  type User, 
  type InsertUser,
  type S3Bucket,
  type InsertS3Bucket,
  type BucketPermission,
  type InsertBucketPermission,
  type AccessRequest,
  type InsertAccessRequest,
  type UpdateAccessRequest
} from "@shared/schema";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByCognitoId(cognitoId: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, user: Partial<InsertUser>): Promise<User | undefined>;
  
  // S3 Bucket operations
  getAllBuckets(): Promise<S3Bucket[]>;
  getBucket(id: number): Promise<S3Bucket | undefined>;
  getBucketByName(name: string): Promise<S3Bucket | undefined>;
  createBucket(bucket: InsertS3Bucket): Promise<S3Bucket>;
  
  // Bucket Permission operations
  getUserBucketPermissions(userId: number): Promise<(BucketPermission & { bucket: S3Bucket })[]>;
  getBucketPermissions(bucketId: number): Promise<(BucketPermission & { user: User })[]>;
  createBucketPermission(permission: InsertBucketPermission): Promise<BucketPermission>;
  deleteBucketPermission(userId: number, bucketId: number): Promise<void>;
  
  // Access Request operations
  getAccessRequests(): Promise<(AccessRequest & { user: User; bucket: S3Bucket })[]>;
  getPendingAccessRequests(): Promise<(AccessRequest & { user: User; bucket: S3Bucket })[]>;
  getUserAccessRequests(userId: number): Promise<(AccessRequest & { bucket: S3Bucket })[]>;
  createAccessRequest(request: InsertAccessRequest): Promise<AccessRequest>;
  updateAccessRequest(id: number, request: UpdateAccessRequest): Promise<AccessRequest | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User> = new Map();
  private buckets: Map<number, S3Bucket> = new Map();
  private permissions: Map<number, BucketPermission> = new Map();
  private requests: Map<number, AccessRequest> = new Map();
  private currentUserId = 1;
  private currentBucketId = 1;
  private currentPermissionId = 1;
  private currentRequestId = 1;

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByCognitoId(cognitoId: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.cognitoId === cognitoId);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { 
      ...insertUser, 
      id,
      cognitoGroups: insertUser.cognitoGroups || null,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: number, updates: Partial<InsertUser>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...updates, updatedAt: new Date() };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async getAllBuckets(): Promise<S3Bucket[]> {
    return Array.from(this.buckets.values());
  }

  async getBucket(id: number): Promise<S3Bucket | undefined> {
    return this.buckets.get(id);
  }

  async getBucketByName(name: string): Promise<S3Bucket | undefined> {
    return Array.from(this.buckets.values()).find(bucket => bucket.name === name);
  }

  async createBucket(insertBucket: InsertS3Bucket): Promise<S3Bucket> {
    const id = this.currentBucketId++;
    const bucket: S3Bucket = { 
      ...insertBucket, 
      id,
      createdAt: new Date()
    };
    this.buckets.set(id, bucket);
    return bucket;
  }

  async getUserBucketPermissions(userId: number): Promise<(BucketPermission & { bucket: S3Bucket })[]> {
    const userPermissions = Array.from(this.permissions.values()).filter(p => p.userId === userId);
    return userPermissions.map(permission => ({
      ...permission,
      bucket: this.buckets.get(permission.bucketId!)!
    }));
  }

  async getBucketPermissions(bucketId: number): Promise<(BucketPermission & { user: User })[]> {
    const bucketPermissions = Array.from(this.permissions.values()).filter(p => p.bucketId === bucketId);
    return bucketPermissions.map(permission => ({
      ...permission,
      user: this.users.get(permission.userId!)!
    }));
  }

  async createBucketPermission(insertPermission: InsertBucketPermission): Promise<BucketPermission> {
    const id = this.currentPermissionId++;
    const permission: BucketPermission = { 
      ...insertPermission, 
      id,
      userId: insertPermission.userId || null,
      bucketId: insertPermission.bucketId || null,
      createdAt: new Date()
    };
    this.permissions.set(id, permission);
    return permission;
  }

  async deleteBucketPermission(userId: number, bucketId: number): Promise<void> {
    const permission = Array.from(this.permissions.entries()).find(
      ([_, p]) => p.userId === userId && p.bucketId === bucketId
    );
    if (permission) {
      this.permissions.delete(permission[0]);
    }
  }

  async getAccessRequests(): Promise<(AccessRequest & { user: User; bucket: S3Bucket })[]> {
    return Array.from(this.requests.values()).map(request => ({
      ...request,
      user: this.users.get(request.userId!)!,
      bucket: this.buckets.get(request.bucketId!)!
    }));
  }

  async getPendingAccessRequests(): Promise<(AccessRequest & { user: User; bucket: S3Bucket })[]> {
    const pendingRequests = Array.from(this.requests.values()).filter(r => r.status === 'pending');
    return pendingRequests.map(request => ({
      ...request,
      user: this.users.get(request.userId!)!,
      bucket: this.buckets.get(request.bucketId!)!
    }));
  }

  async getUserAccessRequests(userId: number): Promise<(AccessRequest & { bucket: S3Bucket })[]> {
    const userRequests = Array.from(this.requests.values()).filter(r => r.userId === userId);
    return userRequests.map(request => ({
      ...request,
      bucket: this.buckets.get(request.bucketId!)!
    }));
  }

  async createAccessRequest(insertRequest: InsertAccessRequest): Promise<AccessRequest> {
    const id = this.currentRequestId++;
    const request: AccessRequest = { 
      ...insertRequest, 
      id,
      userId: insertRequest.userId || null,
      bucketId: insertRequest.bucketId || null,
      status: 'pending',
      createdAt: new Date(),
      approvedBy: null,
      approvedAt: null,
      expiresAt: null
    };
    this.requests.set(id, request);
    return request;
  }

  async updateAccessRequest(id: number, updates: UpdateAccessRequest): Promise<AccessRequest | undefined> {
    const request = this.requests.get(id);
    if (!request) return undefined;
    
    const updatedRequest = { ...request, ...updates };
    this.requests.set(id, updatedRequest);
    return updatedRequest;
  }
}

export const storage = new MemStorage();
