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
  return 'https://w3vhnpm5d.auth.us-east-1.amazoncognito.com';
}

export function redirectToLogin() {
  const cognitoDomain = getCognitoHostedUIUrl();
  const currentRedirectUri = `${window.location.origin}/callback`;
  const loginUrl = `${cognitoDomain}/login?client_id=${clientId}&response_type=code&scope=email+openid+profile&redirect_uri=${encodeURIComponent(currentRedirectUri)}`;
  console.log('Redirecting to login URL:', loginUrl);
  console.log('Client ID:', clientId);
  console.log('Redirect URI:', currentRedirectUri);
  window.location.href = loginUrl;
}

export function redirectToLogout() {
  const cognitoDomain = getCognitoHostedUIUrl();
  const logoutUrl = `${cognitoDomain}/logout?client_id=${clientId}&redirect_uri=${encodeURIComponent(window.location.origin)}`;
  window.location.href = logoutUrl;
}

export async function exchangeCodeForTokens(code: string): Promise<AuthResult> {
  const cognitoDomain = getCognitoHostedUIUrl();
  
  console.log('Token exchange details:');
  console.log('- Domain:', cognitoDomain);
  console.log('- Client ID:', clientId);
  console.log('- Code:', code);
  console.log('- Redirect URI:', redirectUri);
  
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

  console.log('Token response status:', response.status);
  
  if (!response.ok) {
    const errorText = await response.text();
    console.error('Token exchange error:', errorText);
    throw new Error(`Failed to exchange code for tokens: ${response.status} - ${errorText}`);
  }

  const tokens = await response.json();
  console.log('Token exchange successful');
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

export function storeTokens(tokens: { accessToken: string; idToken: string; refreshToken?: string }): void {
  localStorage.setItem('accessToken', tokens.accessToken);
  localStorage.setItem('idToken', tokens.idToken);
  if (tokens.refreshToken) {
    localStorage.setItem('refreshToken', tokens.refreshToken);
  }
}

// Parse URL parameters to get authorization code
export function getAuthCodeFromUrl(): string | null {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('code');
}
