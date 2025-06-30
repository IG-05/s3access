import { useUpdateAccessRequest } from "@/hooks/use-s3";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Database, User, Check, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { AccessRequest, User as UserType, S3Bucket } from "@shared/schema";

interface PendingRequestsProps {
  requests: (AccessRequest & { user: UserType; bucket: S3Bucket })[];
}

export function PendingRequests({ requests }: PendingRequestsProps) {
  const updateRequest = useUpdateAccessRequest();
  const { toast } = useToast();

  const handleApprove = async (requestId: number, duration: number) => {
    try {
      await updateRequest.mutateAsync({
        id: requestId,
        status: 'approved',
        duration,
      });
      toast({
        title: "Request Approved",
        description: "Access has been granted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to approve request",
        variant: "destructive",
      });
    }
  };

  const handleDeny = async (requestId: number) => {
    try {
      await updateRequest.mutateAsync({
        id: requestId,
        status: 'denied',
      });
      toast({
        title: "Request Denied",
        description: "Access request has been denied",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to deny request",
        variant: "destructive",
      });
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

  if (requests.length === 0) {
    return (
      <div className="text-center py-8">
        <Database className="h-8 w-8 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-500">No pending requests</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User</TableHead>
            <TableHead>Bucket</TableHead>
            <TableHead>Duration</TableHead>
            <TableHead>Justification</TableHead>
            <TableHead>Requested</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {requests.map((request) => (
            <TableRow key={request.id}>
              <TableCell>
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                    <User className="h-4 w-4 text-gray-600" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">{request.user.username}</p>
                    <p className="text-xs text-gray-500">{request.user.email}</p>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center">
                  <Database className="text-primary h-4 w-4 mr-2" />
                  <span className="text-sm text-gray-900">{request.bucket.name}</span>
                </div>
              </TableCell>
              <TableCell className="text-gray-500">
                {formatDuration(request.requestedDuration)}
              </TableCell>
              <TableCell className="max-w-xs">
                <p className="text-sm text-gray-900 truncate" title={request.justification}>
                  {request.justification}
                </p>
              </TableCell>
              <TableCell className="text-gray-500">
                {formatTimeAgo(request.createdAt)}
              </TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleApprove(request.id, request.requestedDuration)}
                    disabled={updateRequest.isPending}
                    className="text-green-700 border-green-200 hover:bg-green-50"
                  >
                    <Check className="h-4 w-4 mr-1" />
                    Approve
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeny(request.id)}
                    disabled={updateRequest.isPending}
                    className="text-red-700 border-red-200 hover:bg-red-50"
                  >
                    <X className="h-4 w-4 mr-1" />
                    Deny
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
