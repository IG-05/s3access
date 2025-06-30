import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AdminSidebar } from "@/components/layout/admin-sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Settings, Shield, Bell, Database, Save } from "lucide-react";

export default function AdminSettings() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="flex">
        <AdminSidebar />
        
        <main className="flex-1 p-4 md:p-6 lg:p-8 max-w-full overflow-hidden">
          <div className="mb-6">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">Settings</h1>
            <p className="text-gray-600 dark:text-gray-300 mt-1">Configure system settings and preferences</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Security Settings */}
            <Card className="transition-all duration-200 hover:shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg md:text-xl text-gray-900 dark:text-white flex items-center">
                  <Shield className="h-5 w-5 mr-2" />
                  Security Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium text-gray-900 dark:text-white">Two-Factor Authentication</Label>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Require 2FA for admin access</p>
                  </div>
                  <Switch />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium text-gray-900 dark:text-white">Session Timeout</Label>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Auto-logout inactive sessions</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-900 dark:text-white">Session Duration (hours)</Label>
                  <Input type="number" defaultValue="8" className="w-24" />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium text-gray-900 dark:text-white">IP Restrictions</Label>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Limit access by IP address</p>
                  </div>
                  <Switch />
                </div>
              </CardContent>
            </Card>

            {/* Notification Settings */}
            <Card className="transition-all duration-200 hover:shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg md:text-xl text-gray-900 dark:text-white flex items-center">
                  <Bell className="h-5 w-5 mr-2" />
                  Notifications
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium text-gray-900 dark:text-white">Access Request Alerts</Label>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Email when new requests arrive</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium text-gray-900 dark:text-white">Security Alerts</Label>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Notify of security events</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium text-gray-900 dark:text-white">System Maintenance</Label>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Scheduled maintenance notifications</p>
                  </div>
                  <Switch />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-900 dark:text-white">Admin Email</Label>
                  <Input type="email" placeholder="admin@company.com" />
                </div>
              </CardContent>
            </Card>

            {/* System Configuration */}
            <Card className="transition-all duration-200 hover:shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg md:text-xl text-gray-900 dark:text-white flex items-center">
                  <Database className="h-5 w-5 mr-2" />
                  System Configuration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-900 dark:text-white">Default Access Duration (hours)</Label>
                  <Input type="number" defaultValue="24" />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-900 dark:text-white">Max Access Duration (hours)</Label>
                  <Input type="number" defaultValue="168" />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium text-gray-900 dark:text-white">Auto-approve Requests</Label>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Auto-approve from trusted users</p>
                  </div>
                  <Switch />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium text-gray-900 dark:text-white">Audit Logging</Label>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Log all system activities</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </CardContent>
            </Card>

            {/* General Settings */}
            <Card className="transition-all duration-200 hover:shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg md:text-xl text-gray-900 dark:text-white flex items-center">
                  <Settings className="h-5 w-5 mr-2" />
                  General Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-900 dark:text-white">System Name</Label>
                  <Input defaultValue="S3 Access Manager" />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-900 dark:text-white">Support Email</Label>
                  <Input type="email" defaultValue="support@company.com" />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium text-gray-900 dark:text-white">Dark Mode</Label>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Enable dark theme</p>
                  </div>
                  <Switch />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium text-gray-900 dark:text-white">Maintenance Mode</Label>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Temporarily disable access</p>
                  </div>
                  <Switch />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Save Button */}
          <div className="mt-8 flex justify-end">
            <Button className="bg-red-600 hover:bg-red-700">
              <Save className="h-4 w-4 mr-2" />
              Save Settings
            </Button>
          </div>
        </main>
      </div>
    </div>
  );
}