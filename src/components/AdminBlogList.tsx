import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BlogPost, BlogPostStatus } from '@/types/blog';
import { Calendar, User, Check, X, Trash2, Edit, Eye, Loader2 } from 'lucide-react';
import { updateBlogPost, deleteBlogPost } from '@/services/blogService';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';

interface AdminBlogListProps {
  posts: BlogPost[];
  isLoading: boolean;
  onPostUpdated: () => void;
}

const AdminBlogList: React.FC<AdminBlogListProps> = ({ posts, isLoading, onPostUpdated }) => {
  const [activeTab, setActiveTab] = useState<string>('all');
  const [processingPosts, setProcessingPosts] = useState<Record<string, boolean>>({});

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Truncate content for preview
  const truncateContent = (content: string, maxLength: number = 100) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };

  // Handle post approval
  const handleApprove = async (postId: string) => {
    try {
      setProcessingPosts(prev => ({ ...prev, [postId]: true }));
      
      const success = await updateBlogPost(postId, {
        status: 'approved',
        published_at: new Date().toISOString()
      });
      
      if (success) {
        toast.success('Blog post approved and published');
        onPostUpdated();
      } else {
        toast.error('Failed to approve blog post');
      }
    } catch (error) {
      console.error('Error approving blog post:', error);
      toast.error('An error occurred while approving the blog post');
    } finally {
      setProcessingPosts(prev => ({ ...prev, [postId]: false }));
    }
  };

  // Handle post rejection
  const handleReject = async (postId: string) => {
    try {
      setProcessingPosts(prev => ({ ...prev, [postId]: true }));
      
      const success = await updateBlogPost(postId, {
        status: 'rejected'
      });
      
      if (success) {
        toast.success('Blog post rejected');
        onPostUpdated();
      } else {
        toast.error('Failed to reject blog post');
      }
    } catch (error) {
      console.error('Error rejecting blog post:', error);
      toast.error('An error occurred while rejecting the blog post');
    } finally {
      setProcessingPosts(prev => ({ ...prev, [postId]: false }));
    }
  };

  // Handle post deletion
  const handleDelete = async (postId: string) => {
    if (!window.confirm('Are you sure you want to delete this blog post? This action cannot be undone.')) {
      return;
    }
    
    try {
      setProcessingPosts(prev => ({ ...prev, [postId]: true }));
      
      const success = await deleteBlogPost(postId);
      
      if (success) {
        toast.success('Blog post deleted');
        onPostUpdated();
      } else {
        toast.error('Failed to delete blog post');
      }
    } catch (error) {
      console.error('Error deleting blog post:', error);
      toast.error('An error occurred while deleting the blog post');
    } finally {
      setProcessingPosts(prev => ({ ...prev, [postId]: false }));
    }
  };

  // Filter posts based on active tab
  const getFilteredPosts = () => {
    if (activeTab === 'all') {
      return posts;
    }
    return posts.filter(post => post.status === activeTab);
  };

  // Get status badge
  const getStatusBadge = (status: BlogPostStatus) => {
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const filteredPosts = getFilteredPosts();

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Manage Blog Posts</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="all">All Posts</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="approved">Approved</TabsTrigger>
          </TabsList>
          
          <TabsContent value={activeTab} className="mt-4">
            {filteredPosts.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No blog posts found.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredPosts.map(post => (
                  <Card key={post.id} className="overflow-hidden">
                    <div className="p-4 sm:p-6">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="text-lg font-semibold">{post.title}</h3>
                            {getStatusBadge(post.status)}
                          </div>
                          
                          <div className="flex items-center text-sm text-muted-foreground space-x-4 mb-2">
                            <div className="flex items-center">
                              <Calendar className="h-3.5 w-3.5 mr-1" />
                              <span>{formatDate(post.created_at)}</span>
                            </div>
                            {post.author_name && (
                              <div className="flex items-center">
                                <User className="h-3.5 w-3.5 mr-1" />
                                <span>{post.author_name}</span>
                              </div>
                            )}
                          </div>
                          
                          <p className="text-gray-600 text-sm">
                            {truncateContent(post.content)}
                          </p>
                        </div>
                        
                        {post.image_url && (
                          <div className="sm:w-24 sm:h-24 rounded overflow-hidden">
                            <img 
                              src={post.image_url} 
                              alt={post.title} 
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                      </div>
                      
                      <div className="flex flex-wrap gap-2 mt-4">
                        <Button
                          variant="outline"
                          size="sm"
                          asChild
                        >
                          <Link to={`/blog/post/${post.id}`} target="_blank">
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Link>
                        </Button>
                        
                        {post.status === 'pending' && (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-green-600 hover:text-green-700 hover:bg-green-50"
                              onClick={() => handleApprove(post.id)}
                              disabled={processingPosts[post.id]}
                            >
                              {processingPosts[post.id] ? (
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
                              onClick={() => handleReject(post.id)}
                              disabled={processingPosts[post.id]}
                            >
                              {processingPosts[post.id] ? (
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
                          onClick={() => handleDelete(post.id)}
                          disabled={processingPosts[post.id]}
                        >
                          {processingPosts[post.id] ? (
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
  );
};

export default AdminBlogList;
