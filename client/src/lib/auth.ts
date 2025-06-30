import { CognitoUserPool, CognitoUser, AuthenticationDetails } from 'amazon-cognito-identity-js';

const userPoolId = import.meta.env.VITE_AWS_USER_POOL_ID || '';
const clientId = import.meta.env.VITE_AWS_USER_POOL_CLIENT_ID || '';

export const userPool = new CognitoUserPool({
  UserPoolId: userPoolId,
  ClientId: clientId,
});

export interface AuthResult {
  accessToken: string;
  idToken: string;
  refreshToken: string;
  user: CognitoUser;
}

export function authenticateUser(username: string, password: string): Promise<AuthResult> {
  return new Promise((resolve, reject) => {
    const authenticationDetails = new AuthenticationDetails({
      Username: username,
      Password: password,
    });

    const cognitoUser = new CognitoUser({
      Username: username,
      Pool: userPool,
    });

    cognitoUser.authenticateUser(authenticationDetails, {
      onSuccess: (result) => {
        resolve({
          accessToken: result.getAccessToken().getJwtToken(),
          idToken: result.getIdToken().getJwtToken(),
          refreshToken: result.getRefreshToken().getToken(),
          user: cognitoUser,
        });
      },
      onFailure: (err) => {
        reject(err);
      },
    });
  });
}

export function getCurrentUser(): CognitoUser | null {
  return userPool.getCurrentUser();
}

export function signOut(): void {
  const user = getCurrentUser();
  if (user) {
    user.signOut();
  }
  localStorage.removeItem('accessToken');
  localStorage.removeItem('idToken');
  localStorage.removeItem('refreshToken');
}

export function getStoredTokens(): { accessToken: string | null; idToken: string | null; refreshToken: string | null } {
  return {
    accessToken: localStorage.getItem('accessToken'),
    idToken: localStorage.getItem('idToken'),
    refreshToken: localStorage.getItem('refreshToken'),
  };
}

export function storeTokens(tokens: { accessToken: string; idToken: string; refreshToken: string }): void {
  localStorage.setItem('accessToken', tokens.accessToken);
  localStorage.setItem('idToken', tokens.idToken);
  localStorage.setItem('refreshToken', tokens.refreshToken);
}
