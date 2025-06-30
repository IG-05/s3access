import { 
  ListBucketsCommand,
  GetBucketLocationCommand,
  ListObjectsV2Command,
  HeadObjectCommand,
  GetObjectCommand
} from "@aws-sdk/client-s3";
import { s3Client } from "./aws";

export interface S3BucketInfo {
  name: string;
  region: string;
  arn: string;
  objectCount?: number;
  size?: string;
  lastModified?: Date;
}

export async function listAllS3Buckets(): Promise<S3BucketInfo[]> {
  try {
    const command = new ListBucketsCommand({});
    const response = await s3Client.send(command);
    
    if (!response.Buckets) {
      return [];
    }

    const buckets: S3BucketInfo[] = [];
    
    for (const bucket of response.Buckets) {
      if (!bucket.Name) continue;
      
      try {
        const locationCommand = new GetBucketLocationCommand({
          Bucket: bucket.Name
        });
        const locationResponse = await s3Client.send(locationCommand);
        const region = locationResponse.LocationConstraint || 'us-east-1';
        
        buckets.push({
          name: bucket.Name,
          region,
          arn: `arn:aws:s3:::${bucket.Name}`,
          lastModified: bucket.CreationDate
        });
      } catch (error) {
        console.error(`Error getting bucket location for ${bucket.Name}:`, error);
        // Add bucket with default region if location fetch fails
        buckets.push({
          name: bucket.Name,
          region: 'us-east-1',
          arn: `arn:aws:s3:::${bucket.Name}`,
          lastModified: bucket.CreationDate
        });
      }
    }
    
    return buckets;
  } catch (error) {
    console.error('Error listing S3 buckets:', error);
    return [];
  }
}

export async function getBucketObjects(bucketName: string): Promise<any[]> {
  try {
    const command = new ListObjectsV2Command({
      Bucket: bucketName,
      MaxKeys: 1000
    });
    
    const response = await s3Client.send(command);
    
    return response.Contents?.map(obj => ({
      key: obj.Key,
      size: obj.Size ? formatFileSize(obj.Size) : '0 B',
      sizeBytes: obj.Size || 0,
      lastModified: obj.LastModified,
      etag: obj.ETag,
      type: obj.Key?.split('.').pop() || 'file'
    })) || [];
  } catch (error) {
    console.error(`Error listing objects in bucket ${bucketName}:`, error);
    throw new Error(`Failed to access bucket ${bucketName}: ${error instanceof Error ? error.message : 'Access denied'}`);
  }
}

export async function getBucketStats(bucketName: string): Promise<{ objectCount: number; totalSize: number }> {
  try {
    const objects = await getBucketObjects(bucketName);
    const totalSize = objects.reduce((sum, obj) => sum + (obj.Size || 0), 0);
    
    return {
      objectCount: objects.length,
      totalSize
    };
  } catch (error) {
    console.error(`Error getting bucket stats for ${bucketName}:`, error);
    return { objectCount: 0, totalSize: 0 };
  }
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}


