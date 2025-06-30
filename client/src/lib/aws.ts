import { CognitoIdentityClient } from "@aws-sdk/client-cognito-identity";
import { S3Client } from "@aws-sdk/client-s3";

const region = import.meta.env.VITE_AWS_REGION || 'us-east-1';

export const cognitoIdentityClient = new CognitoIdentityClient({
  region,
});

export const s3Client = new S3Client({
  region,
});

export function getAWSConfig() {
  return {
    region,
    userPoolId: import.meta.env.VITE_AWS_USER_POOL_ID || '',
    userPoolClientId: import.meta.env.VITE_AWS_USER_POOL_CLIENT_ID || '',
    identityPoolId: import.meta.env.VITE_AWS_IDENTITY_POOL_ID || '',
  };
}
