import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BlogPost } from '@/types/blog';
import { Calendar, User, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AdPlaceholder } from '@/features/ads';

interface BlogPostDetailProps {
  post: BlogPost;
}

const BlogPostDetail: React.FC<BlogPostDetailProps> = ({ post }) => {
  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Format content with paragraphs
  const formatContent = (content: string) => {
    return content.split('\n').map((paragraph, index) => (
      paragraph.trim() ? <p key={index} className="mb-4">{paragraph}</p> : <br key={index} />
    ));
  };

  return (
    <div className="space-y-6">
      <Button variant="ghost" asChild className="mb-4">
        <Link to="/blog" className="flex items-center">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Blog
        </Link>
      </Button>

      <Card className="w-full">
        <CardHeader className="pb-2">
          <CardTitle className="text-2xl md:text-3xl">{post.title}</CardTitle>
          <div className="flex items-center text-sm text-muted-foreground space-x-4 mt-2">
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
        
        {post.image_url && (
          <div className="px-6 pt-2">
            <img 
              src={post.image_url} 
              alt={post.title} 
              className="rounded-md w-full max-h-96 object-cover"
            />
          </div>
        )}
        
        <CardContent className="pt-6">
          <div className="prose max-w-none">
            {formatContent(post.content)}
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-between border-t px-6 py-4">
          <Button variant="outline" asChild>
            <Link to="/blog">Back to Blog</Link>
          </Button>
          
          <Button variant="outline" asChild>
            <Link to="/blog/submit">Submit Your Own</Link>
          </Button>
        </CardFooter>
      </Card>

      {/* Ad placeholder below the post */}
      <div className="w-full mt-6">
        <AdPlaceholder
          width="w-full"
          height="h-28"
          label="Post-Blog Ad"
        />
      </div>

      {/* Related content section with ad placeholder */}
      <Card className="w-full mt-8">
        <CardHeader>
          <CardTitle className="text-xl">Related Content</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <AdPlaceholder
                width="w-full"
                height="h-24"
                label="Related Content Ad"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BlogPostDetail;
