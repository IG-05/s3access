import { useS3Buckets, useStats, useAccessRequests } from "@/hooks/use-s3";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sidebar } from "@/components/layout/sidebar";
import { BucketTable } from "@/components/bucket-table";
import { AccessRequestForm } from "@/components/access-request-form";
import { CheckCircle, Clock, Ban, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export default function UserDashboard() {
  const { data: buckets, isLoading: bucketsLoading, refetch: refetchBuckets } = useS3Buckets();
  const { data: stats, isLoading: statsLoading } = useStats();
  const { data: requests, isLoading: requestsLoading } = useAccessRequests();
  const [searchTerm, setSearchTerm] = useState("");

  const accessibleBuckets = buckets?.accessible || [];
  const restrictedBuckets = buckets?.restricted || [];

  const filteredAccessibleBuckets = accessibleBuckets.filter(bucket =>
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
        <Sidebar />
        
        <main className="flex-1 p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">My S3 Buckets</h1>
            <p className="text-gray-600 mt-1">Manage your accessible S3 buckets and request additional access</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <CheckCircle className="text-green-600 h-5 w-5" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Accessible Buckets</p>
                    <p className="text-2xl font-bold text-gray-900">{stats?.accessibleBuckets || 0}</p>
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
                    <Ban className="text-red-600 h-5 w-5" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Restricted Buckets</p>
                    <p className="text-2xl font-bold text-gray-900">{stats?.restrictedBuckets || 0}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Accessible Buckets Table */}
          <Card className="mb-8">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Accessible Buckets</CardTitle>
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
              </div>
            </CardHeader>
            <CardContent>
              <BucketTable buckets={filteredAccessibleBuckets} showActions={true} />
            </CardContent>
          </Card>

          {/* Request Access Section */}
          <Card>
            <CardHeader>
              <CardTitle>Request Additional Access</CardTitle>
              <p className="text-sm text-gray-600">Request temporary access to restricted buckets</p>
            </CardHeader>
            <CardContent>
              <AccessRequestForm 
                restrictedBuckets={restrictedBuckets} 
                onSuccess={() => refetchBuckets()}
              />
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
