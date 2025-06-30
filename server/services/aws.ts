import { 
  CognitoIdentityProviderClient,
  GetUserCommand,
  AdminGetUserCommand,
  ListUsersInGroupCommand
} from "@aws-sdk/client-cognito-identity-provider";
import { 
  S3Client,
  ListBucketsCommand,
  GetBucketLocationCommand,
  ListObjectsV2Command,
  HeadObjectCommand
} from "@aws-sdk/client-s3";
import { 
  STSClient,
  AssumeRoleCommand,
  GetCallerIdentityCommand
} from "@aws-sdk/client-sts";

const region = process.env.AWS_REGION || 'us-east-1';

export const cognitoClient = new CognitoIdentityProviderClient({ 
  region,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  }
});

export const s3Client = new S3Client({ 
  region,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  }
});

export const stsClient = new STSClient({ 
  region,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  }
});

export const getUserPoolId = () => process.env.AWS_USER_POOL_ID || '';
export const getUserPoolClientId = () => process.env.AWS_USER_POOL_CLIENT_ID || '';
