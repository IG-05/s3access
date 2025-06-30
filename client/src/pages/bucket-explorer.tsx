import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRoute } from "wouter";
import { AdminSidebar } from "@/components/layout/admin-sidebar";
import { Sidebar } from "@/components/layout/sidebar";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Database, File, Search, Calendar, HardDrive, ArrowLeft, Download, FileText, Image, Archive, Folder } from "lucide-react";

export default function BucketExplorerPage() {
  const [match, params] = useRoute("/bucket/:bucketName");
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  
  const bucketName = params?.bucketName || "";
  const isAdmin = user?.role === 'admin';

  const { data: objects, isLoading, error } = useQuery({
    queryKey: [`/api/buckets/${bucketName}/objects`],
    enabled: !!bucketName,
    queryFn: async () => {
      const response = await fetch(`/api/buckets/${bucketName}/objects`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('idToken')}`,
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch bucket contents');
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

  const totalSize = filteredObjects.reduce((sum, obj) => sum + (obj.sizeBytes || 0), 0);
  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  if (!match) {
    return <div>Bucket not found</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="flex">
        {isAdmin ? <AdminSidebar /> : <Sidebar />}
        
        <main className="flex-1 p-4 md:p-6 lg:p-8 ml-0">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center mb-4">
              <Button 
                variant="ghost" 
                onClick={() => window.history.back()}
                className="mr-4"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <div className="flex items-center">
                <Database className="h-6 w-6 mr-3 text-primary" />
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">{bucketName}</h1>
                  <p className="text-gray-600 dark:text-gray-300">S3 Bucket Contents</p>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 mb-8">
            <Card className="border-l-4 border-l-blue-500">
              <CardContent className="p-4 md:p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                    <File className="text-blue-600 dark:text-blue-400 h-5 w-5" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Total Objects</p>
                    <p className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
                      {filteredObjects.length.toLocaleString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-green-500">
              <CardContent className="p-4 md:p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                    <HardDrive className="text-green-600 dark:text-green-400 h-5 w-5" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Total Size</p>
                    <p className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
                      {formatSize(totalSize)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-purple-500">
              <CardContent className="p-4 md:p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                    <Folder className="text-purple-600 dark:text-purple-400 h-5 w-5" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Access Level</p>
                    <p className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
                      {isAdmin ? 'Full' : 'Read'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Search and Content */}
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <CardTitle className="text-lg md:text-xl text-gray-900 dark:text-white">Object Browser</CardTitle>
                <div className="flex items-center space-x-2 w-full sm:w-auto">
                  <div className="relative flex-1 sm:w-80">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Search objects..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Badge variant="outline">
                    {filteredObjects.length} object{filteredObjects.length !== 1 ? 's' : ''}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : error ? (
                <div className="text-center py-12">
                  <Database className="h-12 w-12 text-red-400 mx-auto mb-4" />
                  <p className="text-red-600 dark:text-red-400 text-lg">Failed to load bucket contents</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                    {error instanceof Error ? error.message : 'Access denied or bucket not found'}
                  </p>
                </div>
              ) : filteredObjects.length === 0 ? (
                <div className="text-center py-12">
                  <Folder className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 dark:text-gray-400 text-lg">
                    {searchTerm ? 'No objects match your search' : 'This bucket is empty'}
                  </p>
                  {searchTerm && (
                    <Button 
                      variant="outline" 
                      onClick={() => setSearchTerm("")}
                      className="mt-4"
                    >
                      Clear search
                    </Button>
                  )}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gray-50 dark:bg-gray-800">
                        <TableHead className="font-semibold">Object Key</TableHead>
                        <TableHead className="font-semibold">Size</TableHead>
                        <TableHead className="font-semibold">Last Modified</TableHead>
                        <TableHead className="font-semibold">Type</TableHead>
                        <TableHead className="font-semibold">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredObjects.map((obj: any, index: number) => (
                        <TableRow key={index} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                          <TableCell>
                            <div className="flex items-center">
                              {getFileIcon(obj.type)}
                              <span className="ml-3 font-medium text-gray-900 dark:text-white">
                                {obj.key}
                              </span>
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
                            <Badge variant="outline" className="text-xs">
                              {obj.type || 'file'}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              className="text-blue-600 hover:text-blue-800 hover:bg-blue-50 dark:hover:bg-blue-950"
                              title="Download object"
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
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}