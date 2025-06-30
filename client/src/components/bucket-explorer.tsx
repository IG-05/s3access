import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Database, File, Folder, Download, Search, Calendar, HardDrive, X } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

interface BucketExplorerProps {
  bucketName: string;
  isOpen: boolean;
  onClose: () => void;
}

export function BucketExplorer({ bucketName, isOpen, onClose }: BucketExplorerProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const { data: objects, isLoading, error } = useQuery({
    queryKey: [`/api/buckets/${bucketName}/objects`],
    enabled: isOpen && !!bucketName,
    queryFn: async () => {
      const response = await fetch(`/api/buckets/${bucketName}/objects`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('idToken')}`,
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error(`Failed to fetch bucket contents: ${response.statusText}`);
      }
      return await response.json();
    },
  });

  const filteredObjects = Array.isArray(objects) ? objects.filter((obj: any) => 
    obj.key.toLowerCase().includes(searchTerm.toLowerCase())
  ) : [];

  const formatLastModified = (date: string | Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getFileIcon = (type: string) => {
    const fileType = type.toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(fileType)) {
      return <File className="h-4 w-4 text-blue-500" />;
    }
    if (['pdf', 'doc', 'docx', 'txt'].includes(fileType)) {
      return <File className="h-4 w-4 text-red-500" />;
    }
    if (['zip', 'rar', '7z', 'tar', 'gz'].includes(fileType)) {
      return <File className="h-4 w-4 text-yellow-500" />;
    }
    return <File className="h-4 w-4 text-gray-500" />;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden">
        <DialogHeader className="border-b pb-4">
          <DialogTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <Database className="h-5 w-5 mr-2" />
              <span>Explore: {bucketName}</span>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 overflow-hidden">
          {/* Search */}
          <div className="flex items-center space-x-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search files..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Badge variant="outline">
              {filteredObjects.length} object{filteredObjects.length !== 1 ? 's' : ''}
            </Badge>
          </div>

          {/* Content */}
          <div className="overflow-auto max-h-96">
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : error ? (
              <div className="text-center py-8">
                <Database className="h-8 w-8 text-red-400 mx-auto mb-4" />
                <p className="text-red-600 dark:text-red-400">Failed to load bucket contents</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                  {error instanceof Error ? error.message : 'Unknown error occurred'}
                </p>
              </div>
            ) : filteredObjects.length === 0 ? (
              <div className="text-center py-8">
                <Folder className="h-8 w-8 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400">
                  {searchTerm ? 'No files match your search' : 'This bucket is empty'}
                </p>
              </div>
            ) : (
              <div className="rounded-lg border border-gray-200 dark:border-gray-700">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50 dark:bg-gray-800">
                      <TableHead className="font-semibold">Name</TableHead>
                      <TableHead className="font-semibold">Size</TableHead>
                      <TableHead className="font-semibold">Modified</TableHead>
                      <TableHead className="font-semibold">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredObjects.map((obj: any, index: number) => (
                      <TableRow key={index} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                        <TableCell>
                          <div className="flex items-center">
                            {getFileIcon(obj.type)}
                            <span className="ml-2 font-medium text-gray-900 dark:text-white">
                              {obj.key}
                            </span>
                            <Badge variant="outline" className="ml-2 text-xs">
                              {obj.type}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell className="text-gray-500 dark:text-gray-400">
                          <div className="flex items-center">
                            <HardDrive className="h-3 w-3 mr-1" />
                            {obj.size}
                          </div>
                        </TableCell>
                        <TableCell className="text-gray-500 dark:text-gray-400">
                          <div className="flex items-center">
                            <Calendar className="h-3 w-3 mr-1" />
                            {formatLastModified(obj.lastModified)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            className="text-blue-600 hover:text-blue-800 hover:bg-blue-50 dark:hover:bg-blue-950"
                            title="Download file"
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex justify-between items-center pt-4 border-t">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Total: {filteredObjects.length} objects
            </div>
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}