import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Database, ExternalLink, Info, Settings, Eye, Trash2 } from "lucide-react";
import type { S3Bucket } from "@shared/schema";

interface BucketTableProps {
  buckets: any[];
  showActions?: boolean;
  isAdmin?: boolean;
}

export function BucketTable({ buckets, showActions = false, isAdmin = false }: BucketTableProps) {
  const getAccessLevelColor = (level: string) => {
    switch (level) {
      case 'admin':
        return 'bg-red-100 text-red-800';
      case 'write':
        return 'bg-green-100 text-green-800';
      case 'read':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatLastAccess = (date: Date | string | undefined) => {
    if (!date) return 'Never';
    const now = new Date();
    const lastAccess = new Date(date);
    const diff = now.getTime() - lastAccess.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);
    
    if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    return 'Just now';
  };

  if (buckets.length === 0) {
    return (
      <div className="text-center py-8">
        <Database className="h-8 w-8 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-500">No buckets available</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50 dark:bg-gray-800">
            <TableHead className="font-semibold text-gray-900 dark:text-white">Bucket Name</TableHead>
            <TableHead className="font-semibold text-gray-900 dark:text-white">Region</TableHead>
            {!isAdmin && <TableHead className="font-semibold text-gray-900 dark:text-white">Access Level</TableHead>}
            {isAdmin && <TableHead className="font-semibold text-gray-900 dark:text-white">Objects</TableHead>}
            {isAdmin && <TableHead className="font-semibold text-gray-900 dark:text-white">Size</TableHead>}
            {isAdmin && <TableHead className="font-semibold text-gray-900 dark:text-white">Users</TableHead>}
            {!isAdmin && <TableHead className="font-semibold text-gray-900 dark:text-white">Last Access</TableHead>}
            {showActions && <TableHead className="font-semibold text-gray-900 dark:text-white">Actions</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {buckets.map((bucket) => (
            <TableRow key={bucket.id}>
              <TableCell>
                <div className="flex items-center">
                  <Database className="text-primary h-4 w-4 mr-3" />
                  <span className="font-medium">{bucket.name}</span>
                </div>
              </TableCell>
              <TableCell className="text-gray-500">{bucket.region}</TableCell>
              {!isAdmin && (
                <TableCell>
                  <Badge className={getAccessLevelColor(bucket.accessLevel)}>
                    {bucket.accessLevel === 'write' ? 'Read/Write' : 
                     bucket.accessLevel === 'read' ? 'Read Only' : 
                     bucket.accessLevel}
                  </Badge>
                </TableCell>
              )}
              {isAdmin && (
                <>
                  <TableCell className="text-gray-500">
                    {bucket.objectCount?.toLocaleString() || 0}
                  </TableCell>
                  <TableCell className="text-gray-500">
                    {bucket.size || '0 B'}
                  </TableCell>
                  <TableCell>
                    <div className="flex -space-x-1">
                      <div className="w-6 h-6 bg-blue-500 rounded-full border-2 border-white text-xs text-white flex items-center justify-center">
                        {bucket.userCount || 0}
                      </div>
                    </div>
                  </TableCell>
                </>
              )}
              {!isAdmin && (
                <TableCell className="text-gray-500">
                  {formatLastAccess(bucket.lastAccess)}
                </TableCell>
              )}
              {showActions && (
                <TableCell>
                  <div className="flex space-x-2">
                    {isAdmin ? (
                      <>
                        <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-800">
                          <Settings className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-green-600 hover:text-green-800">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-800">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80">
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-800">
                          <Info className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                  </div>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
