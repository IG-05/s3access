import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Cloud, AlertCircle, Key } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { completeNewPasswordChallenge, storeTokens } from "@/lib/auth";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showNewPasswordForm, setShowNewPasswordForm] = useState(false);
  const [cognitoUser, setCognitoUser] = useState(null);
  const [isSettingPassword, setIsSettingPassword] = useState(false);
  const { login, isLoggingIn, error } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login({ username, password });
    } catch (err: any) {
      if (err.code === 'NewPasswordRequired') {
        setCognitoUser(err.user);
        setShowNewPasswordForm(true);
      }
    }
  };

  const handleNewPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      return;
    }

    if (!cognitoUser) return;

    setIsSettingPassword(true);
    try {
      const result = await completeNewPasswordChallenge(cognitoUser, newPassword);
      storeTokens({
        accessToken: result.accessToken,
        idToken: result.idToken,
        refreshToken: result.refreshToken,
      });
      // Refresh the page to trigger auth check
      window.location.reload();
    } catch (error) {
      console.error('Error setting new password:', error);
    } finally {
      setIsSettingPassword(false);
    }
  };

  if (showNewPasswordForm) {
    return (
      <div className="min-h-screen aws-gradient flex items-center justify-center px-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center mb-8">
              <div className="mx-auto w-16 h-16 bg-primary rounded-lg flex items-center justify-center mb-4">
                <Key className="text-white text-2xl h-8 w-8" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">Set New Password</h1>
              <p className="text-gray-600 mt-2">Please set a new password for your account</p>
            </div>

            <form onSubmit={handleNewPasswordSubmit} className="space-y-6">
              <div>
                <Label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-2">
                  New Password
                </Label>
                <Input
                  type="password"
                  id="newPassword"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="focus:ring-primary focus:border-primary"
                />
              </div>

              <div>
                <Label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm Password
                </Label>
                <Input
                  type="password"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="focus:ring-primary focus:border-primary"
                />
              </div>

              {newPassword !== confirmPassword && confirmPassword && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>Passwords do not match</AlertDescription>
                </Alert>
              )}

              <Button
                type="submit"
                disabled={isSettingPassword || newPassword !== confirmPassword || !newPassword}
                className="w-full bg-primary hover:bg-primary/90 text-white py-2 px-4 rounded-md transition duration-200"
              >
                {isSettingPassword ? "Setting Password..." : "Set Password"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

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
                  onCheckedChange={(checked) => setRememberMe(checked === true)}
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
