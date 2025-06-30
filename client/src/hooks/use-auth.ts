import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { redirectToLogin, signOut, getStoredTokens, storeTokens, exchangeCodeForTokens, getAuthCodeFromUrl } from '@/lib/auth';
import { apiRequest } from '@/lib/queryClient';
import type { User } from '@shared/schema';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export function useAuth() {
  const queryClient = useQueryClient();
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,
  });

  // Check authentication status
  const { data: authData, isLoading: isCheckingAuth } = useQuery({
    queryKey: ['/api/auth/me'],
    enabled: !!getStoredTokens().idToken,
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Handle OAuth callback
  useEffect(() => {
    const handleOAuthCallback = async () => {
      const code = getAuthCodeFromUrl();
      if (code) {
        try {
          const tokens = await exchangeCodeForTokens(code);
          storeTokens({
            accessToken: tokens.accessToken,
            idToken: tokens.idToken,
            refreshToken: tokens.refreshToken || '',
          });
          // Clear the code from URL and redirect to home
          window.history.replaceState({}, document.title, window.location.pathname);
          queryClient.invalidateQueries({ queryKey: ['/api/auth/me'] });
        } catch (error) {
          console.error('OAuth callback error:', error);
          setAuthState(prev => ({ ...prev, error: 'Authentication failed' }));
        }
      }
    };

    handleOAuthCallback();
  }, [queryClient]);

  // Login function - redirects to Cognito
  const login = () => {
    redirectToLogin();
  };

  // Logout mutation
  const logoutMutation = useMutation({
    mutationFn: async () => {
      signOut();
    },
    onSuccess: () => {
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });
      queryClient.clear();
    },
  });

  // Update auth state based on query results
  useEffect(() => {
    if (authData && authData.user) {
      setAuthState({
        user: authData.user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
    } else if (!isCheckingAuth && !getStoredTokens().idToken) {
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });
    }
  }, [authData, isCheckingAuth]);

  return {
    ...authState,
    login,
    logout: logoutMutation.mutate,
    isLoggingIn: false,
    isLoggingOut: logoutMutation.isPending,
  };
}

// Custom query client with auth headers
export function useAuthenticatedQuery(queryKey: string[], options = {}) {
  const tokens = getStoredTokens();
  
  return useQuery({
    queryKey,
    queryFn: async () => {
      const response = await fetch(queryKey[0], {
        headers: {
          'Authorization': `Bearer ${tokens.accessToken}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      return response.json();
    },
    ...options,
  });
}

export function useAuthenticatedMutation() {
  const tokens = getStoredTokens();
  
  return useMutation({
    mutationFn: async ({ url, method = 'POST', data }: { url: string; method?: string; data?: any }) => {
      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${tokens.accessToken}`,
          'Content-Type': 'application/json',
        },
        body: data ? JSON.stringify(data) : undefined,
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      return response.json();
    },
  });
}
