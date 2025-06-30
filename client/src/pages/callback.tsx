import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Cloud, CheckCircle, XCircle } from "lucide-react";
import { exchangeCodeForTokens, storeTokens } from "@/lib/auth";

export default function CallbackPage() {
  const [status, setStatus] = useState<'processing' | 'success' | 'error'>('processing');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const handleCallback = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get('code');
      const error = urlParams.get('error');
      const errorDescription = urlParams.get('error_description');

      console.log('Callback handler - URL params:', Object.fromEntries(urlParams));

      if (error) {
        console.error('OAuth error:', error, errorDescription);
        setStatus('error');
        setError(`${error}: ${errorDescription}`);
        return;
      }

      if (!code) {
        console.error('No authorization code received');
        setStatus('error');
        setError('No authorization code received from Cognito');
        return;
      }

      try {
        console.log('Processing authorization code:', code);
        const tokens = await exchangeCodeForTokens(code);
        storeTokens(tokens);
        setStatus('success');
        
        // Redirect to main app after successful authentication
        setTimeout(() => {
          window.location.href = '/';
        }, 2000);
      } catch (err: any) {
        console.error('Token exchange failed:', err);
        setStatus('error');
        setError(err.message || 'Token exchange failed');
      }
    };

    handleCallback();
  }, []);

  return (
    <div className="min-h-screen aws-gradient flex items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardContent className="pt-6">
          <div className="text-center">
            <div className="mx-auto w-16 h-16 bg-primary rounded-lg flex items-center justify-center mb-4">
              {status === 'processing' && <Cloud className="text-white text-2xl h-8 w-8 animate-pulse" />}
              {status === 'success' && <CheckCircle className="text-white text-2xl h-8 w-8" />}
              {status === 'error' && <XCircle className="text-white text-2xl h-8 w-8" />}
            </div>
            
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              {status === 'processing' && 'Signing you in...'}
              {status === 'success' && 'Sign in successful!'}
              {status === 'error' && 'Sign in failed'}
            </h1>
            
            {status === 'processing' && (
              <p className="text-gray-600">
                Please wait while we complete your authentication...
              </p>
            )}
            
            {status === 'success' && (
              <p className="text-gray-600">
                Redirecting you to the dashboard...
              </p>
            )}
            
            {status === 'error' && (
              <div className="text-red-600">
                <p className="mb-2">Authentication failed:</p>
                <p className="text-sm">{error}</p>
                <button 
                  onClick={() => window.location.href = '/'}
                  className="mt-4 px-4 py-2 bg-primary text-white rounded hover:bg-primary/90"
                >
                  Try Again
                </button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}