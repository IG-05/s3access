import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Database, File, Calendar, HardDrive, Users, Eye, X, FileText, Image, Archive } from "lucide-react";

interface BucketDetailsModalProps {
  bucket: any;
  isOpen: boolean;
  onClose: () => void;
}

export function BucketDetailsModal({ bucket, isOpen, onClose }: BucketDetailsModalProps) {
  const [viewingObjects, setViewingObjects] = useState(false);

  const { data: objects, isLoading } = useQuery({
    queryKey: [`/api/buckets/${bucket?.name}/objects`],
    enabled: isOpen && !!bucket?.name && viewingObjects,
    queryFn: async () => {
      const response = await fetch(`/api/buckets/${bucket.name}/objects`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('idToken')}`,
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch objects');
      }
      return await response.json();
    },
  });

  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getFileIcon = (type: string) => {
    const fileType = type?.toLowerCase() || '';
    if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(fileType)) {
      return <Image className="h-4 w-4 text-blue-500" />;
    }
    if (['pdf', 'doc', 'docx', 'txt', 'md'].includes(fileType)) {
      return <FileText className="h-4 w-4 text-red-500" />;
    }
    if (['zip', 'rar', '7z', 'tar', 'gz'].includes(fileType)) {
      return <Archive className="h-4 w-4 text-yellow-500" />;
    }
    return <File className="h-4 w-4 text-gray-500" />;
  };

  if (!bucket) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[85vh] overflow-hidden">
        <DialogHeader className="border-b pb-4">
          <DialogTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <Database className="h-5 w-5 mr-2 text-primary" />
              <span>{bucket.name}</span>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 overflow-auto">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <Database className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Region</p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">{bucket.region}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <HardDrive className="h-8 w-8 text-green-500 mx-auto mb-2" />
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Objects</p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    {bucket.objectCount?.toLocaleString() || '0'}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <Calendar className="h-8 w-8 text-purple-500 mx-auto mb-2" />
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Created</p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    {bucket.lastModified ? formatDate(bucket.lastModified) : 'Unknown'}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* ARN Info */}
          <Card>
            <CardContent className="p-4">
              <div>
                <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Amazon Resource Name (ARN)</label>
                <p className="text-sm font-mono text-gray-900 dark:text-white mt-1 p-2 bg-gray-100 dark:bg-gray-800 rounded break-all">
                  {bucket.arn}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Objects Section */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Bucket Contents</h3>
                <Button 
                  onClick={() => setViewingObjects(!viewingObjects)}
                  variant="outline"
                  size="sm"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  {viewingObjects ? 'Hide' : 'View'} Objects
                </Button>
              </div>

              {viewingObjects && (
                <div className="mt-4">
                  {isLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                    </div>
                  ) : objects && objects.length > 0 ? (
                    <div className="max-h-64 overflow-auto">
                      <Table>
                        <TableHeader>
                          <TableRow className="bg-gray-50 dark:bg-gray-800">
                            <TableHead>Name</TableHead>
                            <TableHead>Size</TableHead>
                            <TableHead>Modified</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {objects.slice(0, 10).map((obj: any, index: number) => (
                            <TableRow key={index}>
                              <TableCell>
                                <div className="flex items-center">
                                  {getFileIcon(obj.type)}
                                  <span className="ml-2 text-sm font-medium truncate max-w-xs">
                                    {obj.key}
                                  </span>
                                </div>
                              </TableCell>
                              <TableCell className="text-sm text-gray-500">
                                {obj.size}
                              </TableCell>
                              <TableCell className="text-sm text-gray-500">
                                {obj.lastModified ? formatDate(obj.lastModified) : '-'}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                      {objects.length > 10 && (
                        <div className="text-center mt-2">
                          <Badge variant="outline">
                            Showing 10 of {objects.length} objects
                          </Badge>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-6">
                      <File className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-500 dark:text-gray-400">No objects found</p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}