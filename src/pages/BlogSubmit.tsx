import React from 'react';
import Layout from '@/components/Layout';
import BlogSubmissionForm from '@/components/BlogSubmissionForm';
import { AdPlaceholder } from '@/features/ads';
import { useIsMobile } from '@/hooks/use-mobile';

const BlogSubmit = () => {
  const isMobile = useIsMobile();

  return (
    <Layout
      title="Submit a Blog Post | NBKRIST Blog"
      description="Share your thoughts, experiences, or updates about NBKR Institute of Science & Technology. Submit your blog post for review."
      keywords="nbkr blog submit, nbkrist blog contribution, submit blog post, nbkr student stories, share nbkr experience"
      ogImage="https://nbkrstudenthub.me/NBKRIST_logo.png"
    >
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-center mb-8">Submit a Blog Post</h1>
          
          {/* Top Banner Ad */}
          <div className="mb-8">
            <AdPlaceholder
              width="w-full"
              height="h-28"
              label="Blog Submit Top Banner Ad"
            />
          </div>
          
          <BlogSubmissionForm />
          
          {/* Bottom Banner Ad */}
          <div className="mt-8">
            <AdPlaceholder
              width="w-full"
              height="h-28"
              label="Blog Submit Bottom Banner Ad"
            />
          </div>
          
          {/* Mobile Banner ad - for mobile users */}
          {isMobile && (
            <div className="mt-8">
              <AdPlaceholder
                width="w-full"
                height="h-16"
                label="Mobile Blog Submit Ad"
              />
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default BlogSubmit;
