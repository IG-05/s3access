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
  const filteredBuckets = allBuckets.filter(bucket =>
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
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <AdminSidebar />
        
        <main className="flex-1 p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600 mt-1">Manage S3 buckets, users, and access requests</p>
          </div>

          {/* Admin Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Database className="text-blue-600 h-5 w-5" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Buckets</p>
                    <p className="text-2xl font-bold text-gray-900">{stats?.totalBuckets || 0}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Users className="text-green-600 h-5 w-5" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Active Users</p>
                    <p className="text-2xl font-bold text-gray-900">{stats?.activeUsers || 0}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <Clock className="text-yellow-600 h-5 w-5" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Pending Requests</p>
                    <p className="text-2xl font-bold text-gray-900">{stats?.pendingRequests || 0}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-red-100 rounded-lg">
                    <AlertTriangle className="text-red-600 h-5 w-5" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Security Alerts</p>
                    <p className="text-2xl font-bold text-gray-900">{stats?.securityAlerts || 0}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Pending Access Requests */}
          <Card className="mb-8">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Pending Access Requests</CardTitle>
                <span className="bg-red-100 text-red-600 text-sm px-3 py-1 rounded-full">
                  {pendingRequests?.length || 0} Pending
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <PendingRequests requests={pendingRequests || []} />
            </CardContent>
          </Card>

          {/* All Buckets Management */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>All S3 Buckets</CardTitle>
              <div className="flex space-x-3">
                <Input
                  placeholder="Search buckets..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-64"
                />
                <Button onClick={() => refetchBuckets()} variant="outline">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh
                </Button>
                <Button className="bg-red-600 hover:bg-red-700">
                  <Plus className="h-4 w-4 mr-2" />
                  New Bucket
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <BucketTable buckets={filteredBuckets} showActions={true} isAdmin={true} />
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
