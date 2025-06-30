import { useS3Buckets, useStats, usePendingRequests } from "@/hooks/use-s3";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AdminSidebar } from "@/components/layout/admin-sidebar";
import { BucketTable } from "@/components/bucket-table";
import { PendingRequests } from "@/components/pending-requests";
import { Database, Users, Clock, AlertTriangle, Plus, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export default function AdminDashboard() {
  const { data: buckets, isLoading: bucketsLoading, refetch: refetchBuckets } = useS3Buckets();
  const { data: stats, isLoading: statsLoading } = useStats();
  const { data: pendingRequests, isLoading: requestsLoading } = usePendingRequests();
  const [searchTerm, setSearchTerm] = useState("");

  const allBuckets = buckets?.all || [];
  const filteredBuckets = allBuckets.filter((bucket: any) =>
    bucket.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (bucketsLoading || statsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="flex">
        <AdminSidebar />
        
        <main className="flex-1 p-4 md:p-6 lg:p-8 max-w-full overflow-hidden">
          <div className="mb-6">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
            <p className="text-gray-600 dark:text-gray-300 mt-1">Manage S3 buckets, users, and access requests</p>
          </div>

          {/* Admin Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
            <Card className="transition-all duration-200 hover:shadow-lg">
              <CardContent className="p-4 md:p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                    <Database className="text-blue-600 dark:text-blue-400 h-5 w-5" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Total Buckets</p>
                    <p className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">{stats?.totalBuckets || 0}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="transition-all duration-200 hover:shadow-lg">
              <CardContent className="p-4 md:p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                    <Users className="text-green-600 dark:text-green-400 h-5 w-5" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Active Users</p>
                    <p className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">{stats?.activeUsers || 0}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="transition-all duration-200 hover:shadow-lg">
              <CardContent className="p-4 md:p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
                    <Clock className="text-yellow-600 dark:text-yellow-400 h-5 w-5" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Pending Requests</p>
                    <p className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">{stats?.pendingRequests || 0}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="transition-all duration-200 hover:shadow-lg">
              <CardContent className="p-4 md:p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-red-100 dark:bg-red-900 rounded-lg">
                    <AlertTriangle className="text-red-600 dark:text-red-400 h-5 w-5" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Security Alerts</p>
                    <p className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">{stats?.securityAlerts || 0}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Pending Access Requests */}
          <Card className="mb-8 transition-all duration-200 hover:shadow-lg">
            <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
              <div>
                <CardTitle className="text-lg md:text-xl text-gray-900 dark:text-white">Pending Access Requests</CardTitle>
                <span className="bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-300 text-sm px-3 py-1 rounded-full mt-2 inline-block">
                  {pendingRequests?.length || 0} Pending
                </span>
              </div>
            </CardHeader>
            <CardContent className="overflow-x-auto">
              <PendingRequests requests={pendingRequests || []} />
            </CardContent>
          </Card>

          {/* All Buckets Management */}
          <Card className="transition-all duration-200 hover:shadow-lg">
            <CardHeader className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
              <CardTitle className="text-lg md:text-xl text-gray-900 dark:text-white">All S3 Buckets</CardTitle>
              <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
                <Input
                  placeholder="Search buckets..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full sm:w-64"
                />
                <div className="flex space-x-3">
                  <Button onClick={() => refetchBuckets()} variant="outline" className="flex-1 sm:flex-none">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Refresh
                  </Button>
                  <Button className="bg-red-600 hover:bg-red-700 flex-1 sm:flex-none">
                    <Plus className="h-4 w-4 mr-2" />
                    New Bucket
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="overflow-x-auto">
              <BucketTable buckets={filteredBuckets} showActions={true} isAdmin={true} />
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
