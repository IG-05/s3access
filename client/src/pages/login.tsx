import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Cloud } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

export default function LoginPage() {
  const { login } = useAuth();

  const handleLogin = () => {
    console.log('Login button clicked');
    login();
  };

  return (
    <div className="min-h-screen aws-gradient flex items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardContent className="pt-6">
          <div className="text-center mb-8">
            <div className="mx-auto w-16 h-16 bg-primary rounded-lg flex items-center justify-center mb-4">
              <Cloud className="text-white text-2xl h-8 w-8" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">S3 Access Manager</h1>
            <p className="text-gray-600 mt-2">Secure access to your AWS S3 resources</p>
          </div>

          <div className="space-y-6">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-4">
                Click below to sign in with your AWS Cognito account. You'll be redirected to a secure AWS login page.
              </p>
            </div>

            <Button
              onClick={handleLogin}
              className="w-full bg-primary hover:bg-primary/90 text-white py-3 px-4 rounded-md transition duration-200 text-base font-medium"
            >
              Sign In with AWS Cognito
            </Button>

            <div className="text-center">
              <p className="text-xs text-gray-500">
                Don't have an account? Contact your administrator to get access.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
