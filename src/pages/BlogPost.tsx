import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import BlogPostDetail from '@/components/BlogPostDetail';
import { AdPlaceholder } from '@/features/ads';
import { useIsMobile } from '@/hooks/use-mobile';
import { fetchBlogPostById } from '@/services/blogService';
import { BlogPost } from '@/types/blog';
import { Loader2 } from 'lucide-react';

const BlogPostPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  
  const [post, setPost] = useState<BlogPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadBlogPost = async () => {
      if (!id) {
        navigate('/blog');
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        
        const blogPost = await fetchBlogPostById(id);
        
        if (!blogPost) {
          setError('Blog post not found');
          return;
        }
        
        setPost(blogPost);
      } catch (err) {
        console.error('Error loading blog post:', err);
        setError('Failed to load blog post. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    loadBlogPost();
  }, [id, navigate]);

  return (
    <Layout
      title={post ? `${post.title} | NBKRIST Blog` : 'Blog Post | NBKRIST'}
      description={post ? post.content.substring(0, 160) : 'Read this blog post from NBKR Institute of Science & Technology.'}
      keywords="nbkr blog, nbkrist news, nbkr college updates, nbkrist events, nbkr student stories"
      ogImage={post?.image_url || 'https://nbkrstudenthub.me/NBKRIST_logo.png'}
    >
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Main content area */}
          <div className="md:w-2/3">
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : error ? (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
                {error}
              </div>
            ) : post ? (
              <BlogPostDetail post={post} />
            ) : null}
          </div>

          {/* Sidebar */}
          <div className="md:w-1/3">
            {/* Sidebar content */}
            <div className="sticky top-24 space-y-6">
              {/* Sidebar Ad */}
              <div className="hidden md:block">
                <AdPlaceholder
                  width="w-full"
                  height="h-[600px]"
                  label="Blog Post Sidebar Ad"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Banner ad - for mobile users */}
        {isMobile && (
          <div className="mt-8">
            <AdPlaceholder
              width="w-full"
              height="h-16"
              label="Mobile Blog Post Ad"
            />
          </div>
        )}
      </div>
    </Layout>
  );
};

export default BlogPostPage;
