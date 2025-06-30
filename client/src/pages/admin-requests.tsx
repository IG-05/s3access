import { usePendingRequests } from "@/hooks/use-s3";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AdminSidebar } from "@/components/layout/admin-sidebar";
import { PendingRequests } from "@/components/pending-requests";
import { Clock, CheckCircle, XCircle, AlertTriangle } from "lucide-react";

export default function AdminRequests() {
  const { data: pendingRequests, isLoading: requestsLoading } = usePendingRequests();

  if (requestsLoading) {
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
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">Access Requests</h1>
            <p className="text-gray-600 dark:text-gray-300 mt-1">Review and manage user access requests</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
            <Card className="transition-all duration-200 hover:shadow-lg">
              <CardContent className="p-4 md:p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
                    <Clock className="text-yellow-600 dark:text-yellow-400 h-5 w-5" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Pending</p>
                    <p className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">{pendingRequests?.length || 0}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="transition-all duration-200 hover:shadow-lg">
              <CardContent className="p-4 md:p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                    <CheckCircle className="text-green-600 dark:text-green-400 h-5 w-5" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Approved Today</p>
                    <p className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">0</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="transition-all duration-200 hover:shadow-lg">
              <CardContent className="p-4 md:p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-red-100 dark:bg-red-900 rounded-lg">
                    <XCircle className="text-red-600 dark:text-red-400 h-5 w-5" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Denied Today</p>
                    <p className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">0</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="transition-all duration-200 hover:shadow-lg">
              <CardContent className="p-4 md:p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-orange-100 dark:bg-orange-900 rounded-lg">
                    <AlertTriangle className="text-orange-600 dark:text-orange-400 h-5 w-5" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Urgent</p>
                    <p className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">0</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Pending Requests */}
          <Card className="transition-all duration-200 hover:shadow-lg">
            <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
              <div>
                <CardTitle className="text-lg md:text-xl text-gray-900 dark:text-white">Pending Access Requests</CardTitle>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Review and approve user access requests</p>
              </div>
            </CardHeader>
            <CardContent className="overflow-x-auto">
              <PendingRequests requests={pendingRequests || []} />
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}