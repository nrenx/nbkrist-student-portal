import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { toast } from "sonner";
import { submitBlogPost } from '@/services/blogService';
import { BlogPostSubmission } from '@/types/blog';
import { Image, Loader2 } from 'lucide-react';

const BlogSubmissionForm: React.FC = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [authorEmail, setAuthorEmail] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle image selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      
      // Check file size (limit to 5MB)
      if (selectedFile.size > 5 * 1024 * 1024) {
        toast.error('Image size must be less than 5MB');
        return;
      }
      
      // Check file type
      if (!selectedFile.type.startsWith('image/')) {
        toast.error('File must be an image');
        return;
      }
      
      setImage(selectedFile);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (event) => {
        setImagePreview(event.target?.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  // Remove selected image
  const removeImage = () => {
    setImage(null);
    setImagePreview(null);
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!title.trim()) {
      toast.error('Please enter a title');
      return;
    }
    
    if (!content.trim()) {
      toast.error('Please enter content');
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      const blogPost: BlogPostSubmission = {
        title: title.trim(),
        content: content.trim(),
        author_name: authorName.trim() || undefined,
        author_email: authorEmail.trim() || undefined,
        image: image || undefined
      };
      
      await submitBlogPost(blogPost);
      
      toast.success('Blog post submitted successfully! It will be reviewed by an admin before publishing.');
      
      // Reset form
      setTitle('');
      setContent('');
      setAuthorName('');
      setAuthorEmail('');
      setImage(null);
      setImagePreview(null);
    } catch (error) {
      console.error('Error submitting blog post:', error);
      toast.error('Failed to submit blog post. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>Submit a Blog Post</CardTitle>
        <CardDescription>
          Share your thoughts, experiences, or updates about NBKRIST. Your post will be reviewed before publishing.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="Enter a title for your blog post"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={isSubmitting}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="content">Content</Label>
            <Textarea
              id="content"
              placeholder="Write your blog post content here..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              disabled={isSubmitting}
              required
              className="min-h-[200px]"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="image">Image (Optional)</Label>
            <div className="flex items-center gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => document.getElementById('image')?.click()}
                disabled={isSubmitting}
                className="flex items-center gap-2"
              >
                <Image className="h-4 w-4" />
                {image ? 'Change Image' : 'Upload Image'}
              </Button>
              {image && (
                <Button
                  type="button"
                  variant="ghost"
                  onClick={removeImage}
                  disabled={isSubmitting}
                  className="text-destructive"
                >
                  Remove
                </Button>
              )}
              <Input
                id="image"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                disabled={isSubmitting}
                className="hidden"
              />
            </div>
            {imagePreview && (
              <div className="mt-2">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="max-h-48 rounded-md object-contain"
                />
              </div>
            )}
            <p className="text-xs text-muted-foreground">
              Max file size: 5MB. Supported formats: JPG, PNG, GIF.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="authorName">Your Name (Optional)</Label>
              <Input
                id="authorName"
                placeholder="Enter your name"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                disabled={isSubmitting}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="authorEmail">Your Email (Optional)</Label>
              <Input
                id="authorEmail"
                type="email"
                placeholder="Enter your email"
                value={authorEmail}
                onChange={(e) => setAuthorEmail(e.target.value)}
                disabled={isSubmitting}
              />
              <p className="text-xs text-muted-foreground">
                Your email will not be published. It will only be used to contact you about your post.
              </p>
            </div>
          </div>
          
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              'Submit Blog Post'
            )}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex justify-between border-t px-6 py-4">
        <p className="text-sm text-muted-foreground">
          By submitting, you agree to our content guidelines.
        </p>
      </CardFooter>
    </Card>
  );
};

export default BlogSubmissionForm;
