import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CollegeLogo, LogoStatus } from '@/types/logo';
import { Calendar, User, Check, X, Trash2, Download, Loader2 } from 'lucide-react';
import { updateLogo, deleteLogo } from '@/services/logoService';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface AdminLogoListProps {
  logos: CollegeLogo[];
  isLoading: boolean;
  onLogoUpdated: () => void;
}

const AdminLogoList: React.FC<AdminLogoListProps> = ({ logos, isLoading, onLogoUpdated }) => {
  const [activeTab, setActiveTab] = useState<string>('all');
  const [processingLogos, setProcessingLogos] = useState<Record<string, boolean>>({});
  const [logoToDelete, setLogoToDelete] = useState<CollegeLogo | null>(null);

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Get filtered logos based on active tab
  const getFilteredLogos = () => {
    switch (activeTab) {
      case 'pending':
        return logos.filter(logo => logo.status === 'pending');
      case 'approved':
        return logos.filter(logo => logo.status === 'approved');
      case 'rejected':
        return logos.filter(logo => logo.status === 'rejected');
      default:
        return logos;
    }
  };

  // Get status badge
  const getStatusBadge = (status: LogoStatus) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Pending</Badge>;
      case 'approved':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Approved</Badge>;
      case 'rejected':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Rejected</Badge>;
      default:
        return null;
    }
  };

  // Handle logo approval
  const handleApprove = async (logoId: string) => {
    try {
      setProcessingLogos(prev => ({ ...prev, [logoId]: true }));
      
      const success = await updateLogo(logoId, {
        status: 'approved',
        approved_at: new Date().toISOString()
      });
      
      if (success) {
        toast.success('Logo approved and published');
        onLogoUpdated();
      } else {
        toast.error('Failed to approve logo');
      }
    } catch (error) {
      console.error('Error approving logo:', error);
      toast.error('An error occurred while approving the logo');
    } finally {
      setProcessingLogos(prev => ({ ...prev, [logoId]: false }));
    }
  };

  // Handle logo rejection
  const handleReject = async (logoId: string) => {
    try {
      setProcessingLogos(prev => ({ ...prev, [logoId]: true }));
      
      const success = await updateLogo(logoId, {
        status: 'rejected'
      });
      
      if (success) {
        toast.success('Logo rejected');
        onLogoUpdated();
      } else {
        toast.error('Failed to reject logo');
      }
    } catch (error) {
      console.error('Error rejecting logo:', error);
      toast.error('An error occurred while rejecting the logo');
    } finally {
      setProcessingLogos(prev => ({ ...prev, [logoId]: false }));
    }
  };

  // Handle logo deletion
  const handleDelete = async () => {
    if (!logoToDelete) return;
    
    try {
      setProcessingLogos(prev => ({ ...prev, [logoToDelete.id]: true }));
      
      const success = await deleteLogo(logoToDelete.id);
      
      if (success) {
        toast.success('Logo deleted successfully');
        onLogoUpdated();
      } else {
        toast.error('Failed to delete logo');
      }
    } catch (error) {
      console.error('Error deleting logo:', error);
      toast.error('An error occurred while deleting the logo');
    } finally {
      setProcessingLogos(prev => ({ ...prev, [logoToDelete.id]: false }));
      setLogoToDelete(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const filteredLogos = getFilteredLogos();

  return (
    <>
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Manage College Logos</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="all">All Logos</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="approved">Approved</TabsTrigger>
              <TabsTrigger value="rejected">Rejected</TabsTrigger>
            </TabsList>
            
            <TabsContent value={activeTab} className="mt-4">
              {filteredLogos.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No logos found.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredLogos.map(logo => (
                    <Card key={logo.id} className="overflow-hidden">
                      <div className="p-4 sm:p-6">
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="text-lg font-semibold">{logo.name}</h3>
                              {getStatusBadge(logo.status)}
                            </div>
                            
                            {logo.description && (
                              <p className="text-gray-600 mb-2">{logo.description}</p>
                            )}
                            
                            <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-muted-foreground mb-3">
                              <div className="flex items-center">
                                <Calendar className="h-4 w-4 mr-1" />
                                <span>{formatDate(logo.created_at)}</span>
                              </div>
                              
                              {logo.uploader_name && (
                                <div className="flex items-center">
                                  <User className="h-4 w-4 mr-1" />
                                  <span>{logo.uploader_name}</span>
                                  {logo.uploader_email && (
                                    <span className="ml-1">({logo.uploader_email})</span>
                                  )}
                                </div>
                              )}
                              
                              <div className="flex items-center">
                                <Download className="h-4 w-4 mr-1" />
                                <span>{logo.download_count} downloads</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex-shrink-0">
                            <img
                              src={logo.image_url}
                              alt={logo.name}
                              className="w-24 h-24 object-contain rounded-md border"
                            />
                          </div>
                        </div>
                        
                        <div className="flex flex-wrap gap-2 mt-4">
                          {logo.status === 'pending' && (
                            <>
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-green-600 hover:text-green-700 hover:bg-green-50"
                                onClick={() => handleApprove(logo.id)}
                                disabled={processingLogos[logo.id]}
                              >
                                {processingLogos[logo.id] ? (
                                  <Loader2 className="h-4 w-4 animate-spin mr-1" />
                                ) : (
                                  <Check className="h-4 w-4 mr-1" />
                                )}
                                Approve
                              </Button>
                              
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                onClick={() => handleReject(logo.id)}
                                disabled={processingLogos[logo.id]}
                              >
                                {processingLogos[logo.id] ? (
                                  <Loader2 className="h-4 w-4 animate-spin mr-1" />
                                ) : (
                                  <X className="h-4 w-4 mr-1" />
                                )}
                                Reject
                              </Button>
                            </>
                          )}
                          
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            onClick={() => setLogoToDelete(logo)}
                            disabled={processingLogos[logo.id]}
                          >
                            {processingLogos[logo.id] ? (
                              <Loader2 className="h-4 w-4 animate-spin mr-1" />
                            ) : (
                              <Trash2 className="h-4 w-4 mr-1" />
                            )}
                            Delete
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!logoToDelete} onOpenChange={(open) => !open && setLogoToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the logo "{logoToDelete?.name}". This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default AdminLogoList;
