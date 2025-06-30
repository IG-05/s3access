const region = import.meta.env.VITE_AWS_REGION || 'us-east-1';
const userPoolId = import.meta.env.VITE_AWS_USER_POOL_ID || '';
const clientId = import.meta.env.VITE_AWS_USER_POOL_CLIENT_ID || '';
const redirectUri = `${window.location.origin}/callback`;

export interface AuthResult {
  accessToken: string;
  idToken: string;
  refreshToken?: string;
}

// Generate Cognito Hosted UI URLs
function getCognitoHostedUIUrl() {
  const domain = `https://${userPoolId.split('_')[1]}-cognito.auth.${region}.amazonaws.com`;
  return domain;
}

export function redirectToLogin() {
  const cognitoDomain = getCognitoHostedUIUrl();
  const loginUrl = `${cognitoDomain}/login?client_id=${clientId}&response_type=code&scope=email+openid+profile&redirect_uri=${encodeURIComponent(redirectUri)}`;
  window.location.href = loginUrl;
}

export function redirectToLogout() {
  const cognitoDomain = getCognitoHostedUIUrl();
  const logoutUrl = `${cognitoDomain}/logout?client_id=${clientId}&logout_uri=${encodeURIComponent(window.location.origin)}`;
  window.location.href = logoutUrl;
}

export async function exchangeCodeForTokens(code: string): Promise<AuthResult> {
  const cognitoDomain = getCognitoHostedUIUrl();
  
  const response = await fetch(`${cognitoDomain}/oauth2/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      client_id: clientId,
      code,
      redirect_uri: redirectUri,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to exchange code for tokens');
  }

  const tokens = await response.json();
  return {
    accessToken: tokens.access_token,
    idToken: tokens.id_token,
    refreshToken: tokens.refresh_token,
  };
}

export function signOut(): void {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('idToken');
  localStorage.removeItem('refreshToken');
  redirectToLogout();
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

// Parse URL parameters to get authorization code
export function getAuthCodeFromUrl(): string | null {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('code');
}
