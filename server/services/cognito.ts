import { 
  AdminGetUserCommand,
  ListUsersInGroupCommand
} from "@aws-sdk/client-cognito-identity-provider";
import { cognitoClient, getUserPoolId } from "./aws";

export interface CognitoUser {
  username: string;
  email: string;
  groups: string[];
  cognitoId: string;
  enabled: boolean;
}

export async function getCognitoUser(idToken: string): Promise<CognitoUser | null> {
  try {
    // Decode the ID token to extract user information
    const tokenParts = idToken.split('.');
    if (tokenParts.length !== 3) {
      console.error('Invalid ID token format');
      return null;
    }

    const payload = JSON.parse(Buffer.from(tokenParts[1], 'base64').toString());
    
    // Extract user information from ID token
    const username = payload['cognito:username'] || payload.sub || '';
    const email = payload.email || '';
    const groups = payload['cognito:groups'] || [];
    
    return {
      username,
      email,
      groups,
      cognitoId: payload.sub || username,
      enabled: true // If we have a valid token, user is enabled
    };
  } catch (error) {
    console.error('Error decoding ID token:', error);
    return null;
  }
}

export async function getCognitoUserByUsername(username: string): Promise<CognitoUser | null> {
  try {
    const command = new AdminGetUserCommand({
      UserPoolId: getUserPoolId(),
      Username: username
    });
    
    const response = await cognitoClient.send(command);
    
    if (!response.UserAttributes) {
      return null;
    }

    const email = response.UserAttributes.find(attr => attr.Name === 'email')?.Value || '';
    const groups = response.UserAttributes.find(attr => attr.Name === 'cognito:groups')?.Value?.split(',') || [];
    
    return {
      username: response.Username || '',
      email,
      groups,
      cognitoId: response.Username || '',
      enabled: response.UserStatus === 'CONFIRMED'
    };
  } catch (error) {
    console.error('Error getting Cognito user by username:', error);
    return null;
  }
}

export async function listUsersInGroup(groupName: string): Promise<string[]> {
  try {
    const command = new ListUsersInGroupCommand({
      UserPoolId: getUserPoolId(),
      GroupName: groupName
    });
    
    const response = await cognitoClient.send(command);
    return response.Users?.map(user => user.Username || '') || [];
  } catch (error) {
    console.error('Error listing users in group:', error);
    return [];
  }
}

export function determineUserRole(groups: string[]): 'admin' | 'user' {
  const adminGroups = ['admin', 'administrators', 'Admin'];
  return groups.some(group => adminGroups.includes(group)) ? 'admin' : 'user';
}
