import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import AdminBlogList from '@/components/AdminBlogList';
import AdminAuthGuard from '@/components/AdminAuthGuard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAdminAuth } from '@/hooks/use-admin-auth';
import { fetchAllBlogPosts } from '@/services/blogService';
import { BlogPost } from '@/types/blog';
import { LogOut, Loader2 } from 'lucide-react';

const AdminDashboard = () => {
  const { isAuthenticated, isLoading: authLoading, logout, adminUser } = useAdminAuth();
  const navigate = useNavigate();

  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load blog posts
  useEffect(() => {
    const loadBlogPosts = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const blogPosts = await fetchAllBlogPosts();
        setPosts(blogPosts);
      } catch (err) {
        console.error('Error loading blog posts:', err);
        setError('Failed to load blog posts. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    loadBlogPosts();
  }, []);

  // Handle logout
  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  // Refresh posts
  const refreshPosts = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const blogPosts = await fetchAllBlogPosts();
      setPosts(blogPosts);
    } catch (err) {
      console.error('Error refreshing blog posts:', err);
      setError('Failed to refresh blog posts. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };



  return (
    <AdminAuthGuard>
      <Layout
        title="Admin Dashboard | NBKRIST Student Portal"
        description="Admin dashboard for NBKRIST Student Portal."
      >
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            {adminUser && (
              <p className="text-muted-foreground">
                Logged in as {adminUser.email}
              </p>
            )}
          </div>
          <Button variant="outline" onClick={handleLogout} className="flex items-center">
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Total Posts</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{posts.length}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Pending Review</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">
                {posts.filter(post => post.status === 'pending').length}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Published</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">
                {posts.filter(post => post.status === 'approved').length}
              </p>
            </CardContent>
          </Card>
        </div>

        {error ? (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-6">
            {error}
          </div>
        ) : null}

        <AdminBlogList
          posts={posts}
          isLoading={isLoading}
          onPostUpdated={refreshPosts}
        />
      </div>
      </Layout>
    </AdminAuthGuard>
  );
};

export default AdminDashboard;
