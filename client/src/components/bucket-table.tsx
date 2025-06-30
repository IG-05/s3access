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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Database, ExternalLink, Info, Settings, Eye, Trash2, Users, FolderOpen } from "lucide-react";
import { useState } from "react";
import type { S3Bucket } from "@shared/schema";

interface BucketTableProps {
  buckets: any[];
  showActions?: boolean;
  isAdmin?: boolean;
}

export function BucketTable({ buckets, showActions = false, isAdmin = false }: BucketTableProps) {
  const [selectedBucket, setSelectedBucket] = useState<any>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleViewBucket = (bucket: any) => {
    setSelectedBucket(bucket);
    setDialogOpen(true);
  };

  const handleManagePermissions = (bucket: any) => {
    console.log('Managing permissions for bucket:', bucket.name);
    // TODO: Implement permission management
  };

  const handleDeleteBucket = (bucket: any) => {
    console.log('Deleting bucket:', bucket.name);
    // TODO: Implement bucket deletion
  };
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
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-blue-600 hover:text-blue-800 hover:bg-blue-50 dark:hover:bg-blue-950"
                          onClick={() => handleManagePermissions(bucket)}
                          title="Manage Permissions"
                        >
                          <Users className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-green-600 hover:text-green-800 hover:bg-green-50 dark:hover:bg-green-950"
                          onClick={() => handleViewBucket(bucket)}
                          title="View Details"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-red-600 hover:text-red-800 hover:bg-red-50 dark:hover:bg-red-950"
                          onClick={() => handleDeleteBucket(bucket)}
                          title="Delete Bucket"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-primary hover:text-primary/80 hover:bg-primary/10"
                          onClick={() => handleViewBucket(bucket)}
                          title="Open Bucket"
                        >
                          <FolderOpen className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-gray-600 hover:text-gray-800 hover:bg-gray-100 dark:hover:bg-gray-800"
                          onClick={() => handleViewBucket(bucket)}
                          title="View Details"
                        >
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

      {/* Bucket Details Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <Database className="h-5 w-5 mr-2" />
              {selectedBucket?.name}
            </DialogTitle>
          </DialogHeader>
          {selectedBucket && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Region</label>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">{selectedBucket.region}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">ARN</label>
                  <p className="text-sm font-mono text-gray-900 dark:text-white break-all">{selectedBucket.arn}</p>
                </div>
              </div>

              {isAdmin && (
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                    <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      {selectedBucket.objectCount?.toLocaleString() || 0}
                    </p>
                    <p className="text-sm text-blue-600 dark:text-blue-400">Objects</p>
                  </div>
                  <div className="text-center p-4 bg-green-50 dark:bg-green-950 rounded-lg">
                    <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                      {selectedBucket.size || '0 B'}
                    </p>
                    <p className="text-sm text-green-600 dark:text-green-400">Size</p>
                  </div>
                  <div className="text-center p-4 bg-purple-50 dark:bg-purple-950 rounded-lg">
                    <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                      {selectedBucket.userCount || 0}
                    </p>
                    <p className="text-sm text-purple-600 dark:text-purple-400">Users</p>
                  </div>
                </div>
              )}

              {!isAdmin && selectedBucket.accessLevel && (
                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Your Access Level</label>
                  <Badge className={`mt-2 ${getAccessLevelColor(selectedBucket.accessLevel)}`}>
                    {selectedBucket.accessLevel === 'write' ? 'Read/Write' : 
                     selectedBucket.accessLevel === 'read' ? 'Read Only' : 
                     selectedBucket.accessLevel}
                  </Badge>
                </div>
              )}

              <div className="flex justify-end space-x-3">
                <Button variant="outline" onClick={() => setDialogOpen(false)}>
                  Close
                </Button>
                {isAdmin && (
                  <Button 
                    onClick={() => handleManagePermissions(selectedBucket)}
                    className="bg-primary hover:bg-primary/90"
                  >
                    <Users className="h-4 w-4 mr-2" />
                    Manage Permissions
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
