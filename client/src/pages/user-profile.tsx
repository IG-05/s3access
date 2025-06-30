import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sidebar } from "@/components/layout/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { User, Mail, Shield, Calendar, Save, LogOut } from "lucide-react";

export default function UserProfile() {
  const { user, logout } = useAuth();

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="flex">
        <Sidebar />
        
        <main className="flex-1 p-4 md:p-6 lg:p-8 max-w-full overflow-hidden">
          <div className="mb-6">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">Profile</h1>
            <p className="text-gray-600 dark:text-gray-300 mt-1">Manage your account information and preferences</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Profile Overview */}
            <Card className="lg:col-span-1 transition-all duration-200 hover:shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg md:text-xl text-gray-900 dark:text-white flex items-center">
                  <User className="h-5 w-5 mr-2" />
                  Profile Overview
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                    <User className="h-10 w-10 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{user?.username}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{user?.email}</p>
                  <div className="mt-3">
                    <Badge className={user?.role === 'admin' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300' : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'}>
                      {user?.role === 'admin' ? 'Administrator' : 'User'}
                    </Badge>
                  </div>
                </div>

                <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                  <div className="space-y-3">
                    <div className="flex items-center text-sm">
                      <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                      <span className="text-gray-600 dark:text-gray-300">
                        Joined {user?.createdAt ? formatDate(user.createdAt) : 'Recently'}
                      </span>
                    </div>
                    <div className="flex items-center text-sm">
                      <Mail className="h-4 w-4 text-gray-400 mr-2" />
                      <span className="text-gray-600 dark:text-gray-300">Email verified</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <Shield className="h-4 w-4 text-gray-400 mr-2" />
                      <span className="text-gray-600 dark:text-gray-300">Account secured</span>
                    </div>
                  </div>
                </div>

                <Button 
                  onClick={() => logout()} 
                  variant="outline" 
                  className="w-full mt-4 text-red-600 border-red-200 hover:bg-red-50 dark:text-red-400 dark:border-red-800 dark:hover:bg-red-950"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </Button>
              </CardContent>
            </Card>

            {/* Account Settings */}
            <Card className="lg:col-span-2 transition-all duration-200 hover:shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg md:text-xl text-gray-900 dark:text-white">Account Settings</CardTitle>
                <p className="text-sm text-gray-600 dark:text-gray-400">Update your account information and preferences</p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-900 dark:text-white">Username</Label>
                    <Input value={user?.username || ''} readOnly className="bg-gray-50 dark:bg-gray-800" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-900 dark:text-white">Email Address</Label>
                    <Input value={user?.email || ''} readOnly className="bg-gray-50 dark:bg-gray-800" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-900 dark:text-white">Role</Label>
                  <Input value={user?.role === 'admin' ? 'Administrator' : 'User'} readOnly className="bg-gray-50 dark:bg-gray-800" />
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Contact your administrator to change your role
                  </p>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-900 dark:text-white">Cognito Groups</Label>
                  <div className="flex flex-wrap gap-2">
                    {user?.cognitoGroups && user.cognitoGroups.length > 0 ? (
                      user.cognitoGroups.map((group, index) => (
                        <Badge key={index} variant="outline">
                          {group}
                        </Badge>
                      ))
                    ) : (
                      <Badge variant="outline" className="text-gray-500">
                        No groups assigned
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-4">Account Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">Account ID:</span>
                      <p className="text-gray-900 dark:text-white font-mono text-xs mt-1">{user?.cognitoId}</p>
                    </div>
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">Last Updated:</span>
                      <p className="text-gray-900 dark:text-white mt-1">
                        {user?.updatedAt ? formatDate(user.updatedAt) : 'Never'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-4">
                  <Button className="bg-primary hover:bg-primary/90" disabled>
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </Button>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                  Profile information is managed through AWS Cognito and cannot be modified here
                </p>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}