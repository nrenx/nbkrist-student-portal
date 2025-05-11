import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BlogPost } from '@/types/blog';
import { Calendar, User } from 'lucide-react';
import { AdPlaceholder } from '@/features/ads';

interface BlogListProps {
  posts: BlogPost[];
  isLoading: boolean;
}

const BlogList: React.FC<BlogListProps> = ({ posts, isLoading }) => {
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
  const truncateContent = (content: string, maxLength: number = 150) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="w-full animate-pulse">
            <CardHeader className="pb-2">
              <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            </CardHeader>
            <CardContent>
              <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </CardContent>
            <CardFooter>
              <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <Card className="w-full">
        <CardContent className="pt-6 text-center">
          <p className="text-muted-foreground">No blog posts available yet.</p>
          <p className="mt-2">Be the first to contribute!</p>
          <Button asChild className="mt-4">
            <Link to="/blog/submit">Submit a Blog Post</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Insert ad placeholders between posts
  const postsWithAds = posts.reduce((acc: React.ReactNode[], post, index) => {
    // Add the post
    acc.push(
      <Card key={post.id} className="w-full hover:shadow-md transition-shadow">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl">
            <Link to={`/blog/post/${post.id}`} className="hover:text-nbkr transition-colors">
              {post.title}
            </Link>
          </CardTitle>
          <div className="flex items-center text-sm text-muted-foreground space-x-4">
            <div className="flex items-center">
              <Calendar className="h-3.5 w-3.5 mr-1" />
              <span>{post.published_at ? formatDate(post.published_at) : formatDate(post.created_at)}</span>
            </div>
            {post.author_name && (
              <div className="flex items-center">
                <User className="h-3.5 w-3.5 mr-1" />
                <span>{post.author_name}</span>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">
            {truncateContent(post.content)}
          </p>
          {post.image_url && (
            <div className="mt-4">
              <img 
                src={post.image_url} 
                alt={post.title} 
                className="rounded-md max-h-48 object-cover"
              />
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button variant="outline" asChild>
            <Link to={`/blog/post/${post.id}`}>Read More</Link>
          </Button>
        </CardFooter>
      </Card>
    );

    // Add an ad placeholder after every 2 posts (except the last one)
    if (index % 2 === 1 && index < posts.length - 1) {
      acc.push(
        <div key={`ad-${index}`} className="w-full">
          <AdPlaceholder
            width="w-full"
            height="h-24"
            label="In-content Blog Ad"
          />
        </div>
      );
    }

    return acc;
  }, []);

  return <div className="space-y-6">{postsWithAds}</div>;
};

export default BlogList;
