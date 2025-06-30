import { 
  AdminGetUserCommand,
  ListUsersInGroupCommand,
  GetUserCommand
} from "@aws-sdk/client-cognito-identity-provider";
import { cognitoClient, getUserPoolId } from "./aws";

export interface CognitoUser {
  username: string;
  email: string;
  groups: string[];
  cognitoId: string;
  enabled: boolean;
}

export async function getCognitoUser(accessToken: string): Promise<CognitoUser | null> {
  try {
    const command = new GetUserCommand({
      AccessToken: accessToken
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
    console.error('Error getting Cognito user:', error);
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
