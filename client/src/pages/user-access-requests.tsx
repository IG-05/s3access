import { useAccessRequests } from "@/hooks/use-s3";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sidebar } from "@/components/layout/sidebar";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Clock, CheckCircle, XCircle, Database } from "lucide-react";

export default function UserAccessRequests() {
  const { data: requests, isLoading: requestsLoading } = useAccessRequests();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'denied':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="h-4 w-4" />;
      case 'denied':
        return <XCircle className="h-4 w-4" />;
      case 'pending':
        return <Clock className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const formatDuration = (hours: number) => {
    if (hours === 1) return '1 hour';
    if (hours < 24) return `${hours} hours`;
    return `${Math.floor(hours / 24)} day${Math.floor(hours / 24) > 1 ? 's' : ''}`;
  };

  const formatTimeAgo = (date: Date | string) => {
    const now = new Date();
    const requestTime = new Date(date);
    const diff = now.getTime() - requestTime.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor(diff / (1000 * 60));
    
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    return 'Just now';
  };

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
        <Sidebar />
        
        <main className="flex-1 p-4 md:p-6 lg:p-8 max-w-full overflow-hidden">
          <div className="mb-6">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">My Access Requests</h1>
            <p className="text-gray-600 dark:text-gray-300 mt-1">Track your bucket access requests and their status</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-8">
            <Card className="transition-all duration-200 hover:shadow-lg">
              <CardContent className="p-4 md:p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
                    <Clock className="text-yellow-600 dark:text-yellow-400 h-5 w-5" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Pending</p>
                    <p className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
                      {requests?.filter((r: any) => r.status === 'pending').length || 0}
                    </p>
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
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Approved</p>
                    <p className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
                      {requests?.filter((r: any) => r.status === 'approved').length || 0}
                    </p>
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
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Denied</p>
                    <p className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
                      {requests?.filter((r: any) => r.status === 'denied').length || 0}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Requests Table */}
          <Card className="transition-all duration-200 hover:shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg md:text-xl text-gray-900 dark:text-white">Request History</CardTitle>
              <p className="text-sm text-gray-600 dark:text-gray-400">All your access requests and their current status</p>
            </CardHeader>
            <CardContent className="overflow-x-auto">
              {requests && requests.length > 0 ? (
                <div className="rounded-lg border border-gray-200 dark:border-gray-700">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gray-50 dark:bg-gray-800">
                        <TableHead className="font-semibold text-gray-900 dark:text-white">Bucket</TableHead>
                        <TableHead className="font-semibold text-gray-900 dark:text-white">Duration</TableHead>
                        <TableHead className="font-semibold text-gray-900 dark:text-white">Status</TableHead>
                        <TableHead className="font-semibold text-gray-900 dark:text-white">Justification</TableHead>
                        <TableHead className="font-semibold text-gray-900 dark:text-white">Requested</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {requests.map((request: any) => (
                        <TableRow key={request.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                          <TableCell>
                            <div className="flex items-center">
                              <Database className="text-primary h-4 w-4 mr-2" />
                              <span className="text-sm text-gray-900 dark:text-white">{request.bucket.name}</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-gray-500 dark:text-gray-400">
                            {formatDuration(request.requestedDuration)}
                          </TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(request.status)}>
                              <div className="flex items-center">
                                {getStatusIcon(request.status)}
                                <span className="ml-1 capitalize">{request.status}</span>
                              </div>
                            </Badge>
                          </TableCell>
                          <TableCell className="max-w-xs">
                            <p className="text-sm text-gray-900 dark:text-white truncate" title={request.justification}>
                              {request.justification}
                            </p>
                          </TableCell>
                          <TableCell className="text-gray-500 dark:text-gray-400">
                            {formatTimeAgo(request.createdAt)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Database className="h-8 w-8 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 dark:text-gray-400">No access requests found</p>
                  <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
                    You haven't made any access requests yet
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}