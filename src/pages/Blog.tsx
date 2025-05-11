import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import BlogList from '@/components/BlogList';
import { Button } from '@/components/ui/button';
import { AdPlaceholder } from '@/features/ads';
import { useIsMobile } from '@/hooks/use-mobile';
import { fetchPublishedBlogPosts } from '@/services/blogService';
import { BlogPost } from '@/types/blog';
import { PenLine, Loader2 } from 'lucide-react';

const Blog = () => {
  const isMobile = useIsMobile();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadBlogPosts = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const blogPosts = await fetchPublishedBlogPosts();
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

  return (
    <Layout
      title="NBKRIST Blog | College Updates and Student Stories"
      description="Read the latest updates, news, and stories from NBKR Institute of Science & Technology. Stay informed about college events, academic achievements, and student experiences."
      keywords="nbkr blog, nbkrist news, nbkr college updates, nbkrist events, nbkr student stories, nbkr institute blog"
      ogImage="https://nbkrstudenthub.me/NBKRIST_logo.png"
    >
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Main content area */}
          <div className="md:w-2/3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8">
              <h1 className="text-3xl font-bold mb-4 sm:mb-0">NBKRIST Blog</h1>
              <Button asChild>
                <Link to="/blog/submit" className="flex items-center">
                  <PenLine className="mr-2 h-4 w-4" />
                  Submit a Post
                </Link>
              </Button>
            </div>

            {/* Top Banner Ad */}
            <div className="mb-8">
              <AdPlaceholder
                width="w-full"
                height="h-28"
                label="Blog Top Banner Ad"
              />
            </div>

            {error ? (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
                {error}
              </div>
            ) : (
              <BlogList posts={posts} isLoading={isLoading} />
            )}

            {/* Bottom Banner Ad */}
            <div className="mt-8">
              <AdPlaceholder
                width="w-full"
                height="h-28"
                label="Blog Bottom Banner Ad"
              />
            </div>
          </div>

          {/* Sidebar */}
          <div className="md:w-1/3">
            {/* Sidebar content */}
            <div className="sticky top-24 space-y-6">
              {/* Submit CTA */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
                <h3 className="text-lg font-semibold mb-2">Share Your Story</h3>
                <p className="text-gray-600 mb-4">
                  Have something to share about NBKRIST? Submit your blog post for review.
                </p>
                <Button asChild>
                  <Link to="/blog/submit">Submit a Post</Link>
                </Button>
              </div>

              {/* Sidebar Ad */}
              <div className="hidden md:block">
                <AdPlaceholder
                  width="w-full"
                  height="h-[600px]"
                  label="Blog Sidebar Ad"
                />
              </div>

              {/* Recent Posts */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4">Recent Posts</h3>
                {isLoading ? (
                  <div className="flex justify-center py-4">
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                  </div>
                ) : posts.length > 0 ? (
                  <ul className="space-y-3">
                    {posts.slice(0, 5).map(post => (
                      <li key={post.id}>
                        <Link 
                          to={`/blog/post/${post.id}`}
                          className="text-gray-700 hover:text-nbkr transition-colors line-clamp-2"
                        >
                          {post.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500 text-center py-2">No posts yet</p>
                )}
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
              label="Mobile Blog Ad"
            />
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Blog;
