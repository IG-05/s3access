import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Cloud, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const { login, isLoggingIn, error } = useAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login({ username, password });
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
            <p className="text-gray-600 mt-2">Sign in with your AWS Cognito account</p>
          </div>

          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                Username or Email
              </Label>
              <Input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="your.email@company.com"
                required
                className="focus:ring-primary focus:border-primary"
              />
            </div>

            <div>
              <Label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </Label>
              <Input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="focus:ring-primary focus:border-primary"
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remember"
                  checked={rememberMe}
                  onCheckedChange={setRememberMe}
                />
                <Label htmlFor="remember" className="text-sm text-gray-700">
                  Remember me
                </Label>
              </div>
              <a href="#" className="text-sm text-primary hover:text-primary/80">
                Forgot password?
              </a>
            </div>

            <Button
              type="submit"
              disabled={isLoggingIn}
              className="w-full bg-primary hover:bg-primary/90 text-white py-2 px-4 rounded-md transition duration-200"
            >
              {isLoggingIn ? "Signing In..." : "Sign In"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{" "}
              <a href="#" className="text-primary hover:text-primary/80">
                Contact your administrator
              </a>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
