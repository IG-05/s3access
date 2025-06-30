import { useS3Buckets } from "@/hooks/use-s3";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AdminSidebar } from "@/components/layout/admin-sidebar";
import { BucketTable } from "@/components/bucket-table";
import { Plus, RefreshCw, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export default function AdminBuckets() {
  const { data: buckets, isLoading: bucketsLoading, refetch: refetchBuckets } = useS3Buckets();
  const [searchTerm, setSearchTerm] = useState("");

  const allBuckets = buckets?.all || [];
  const filteredBuckets = allBuckets.filter((bucket: any) =>
    bucket.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (bucketsLoading) {
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
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">All S3 Buckets</h1>
            <p className="text-gray-600 dark:text-gray-300 mt-1">Manage all S3 buckets and their permissions</p>
          </div>

          <Card className="transition-all duration-200 hover:shadow-lg">
            <CardHeader className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
              <CardTitle className="text-lg md:text-xl text-gray-900 dark:text-white">Bucket Management</CardTitle>
              <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search buckets..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-full sm:w-64"
                  />
                </div>
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