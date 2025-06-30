import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AdminSidebar } from "@/components/layout/admin-sidebar";
import { BarChart3, TrendingUp, Activity, Users, Database, Download } from "lucide-react";

export default function AdminAnalytics() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="flex">
        <AdminSidebar />
        
        <main className="flex-1 p-4 md:p-6 lg:p-8 max-w-full overflow-hidden">
          <div className="mb-6">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">Analytics</h1>
            <p className="text-gray-600 dark:text-gray-300 mt-1">Monitor usage patterns and system performance</p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
            <Card className="transition-all duration-200 hover:shadow-lg">
              <CardContent className="p-4 md:p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                    <Activity className="text-blue-600 dark:text-blue-400 h-5 w-5" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Daily Active Users</p>
                    <p className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">0</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="transition-all duration-200 hover:shadow-lg">
              <CardContent className="p-4 md:p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                    <Download className="text-green-600 dark:text-green-400 h-5 w-5" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Downloads Today</p>
                    <p className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">0</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="transition-all duration-200 hover:shadow-lg">
              <CardContent className="p-4 md:p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                    <Database className="text-purple-600 dark:text-purple-400 h-5 w-5" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Storage Used</p>
                    <p className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">0 GB</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="transition-all duration-200 hover:shadow-lg">
              <CardContent className="p-4 md:p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-orange-100 dark:bg-orange-900 rounded-lg">
                    <TrendingUp className="text-orange-600 dark:text-orange-400 h-5 w-5" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Growth Rate</p>
                    <p className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">0%</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Analytics Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <Card className="transition-all duration-200 hover:shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg md:text-xl text-gray-900 dark:text-white flex items-center">
                  <BarChart3 className="h-5 w-5 mr-2" />
                  Usage Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-lg">
                  <p className="text-gray-500 dark:text-gray-400">Analytics charts will be displayed here</p>
                </div>
              </CardContent>
            </Card>

            <Card className="transition-all duration-200 hover:shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg md:text-xl text-gray-900 dark:text-white flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  User Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-lg">
                  <p className="text-gray-500 dark:text-gray-400">User activity charts will be displayed here</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Detailed Analytics */}
          <Card className="transition-all duration-200 hover:shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg md:text-xl text-gray-900 dark:text-white">Detailed Analytics</CardTitle>
              <p className="text-sm text-gray-600 dark:text-gray-400">Comprehensive system usage and performance metrics</p>
            </CardHeader>
            <CardContent>
              <div className="h-96 flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-lg">
                <div className="text-center">
                  <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 dark:text-gray-400">Analytics dashboard coming soon</p>
                  <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
                    Charts and detailed metrics will be available once data collection is enabled
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}