import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import LogoGrid from '@/components/LogoGrid';
import LogoSubmissionForm from '@/components/LogoSubmissionForm';
import { AdPlaceholder } from '@/features/ads';
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { fetchApprovedLogos } from '@/services/logoService';
import { CollegeLogo } from '@/types/logo';
import { Loader2 } from 'lucide-react';

const CollegeLogos = () => {
  const isMobile = useIsMobile();
  const [logos, setLogos] = useState<CollegeLogo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitDialogOpen, setIsSubmitDialogOpen] = useState(false);

  // Load approved logos
  useEffect(() => {
    const loadLogos = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const approvedLogos = await fetchApprovedLogos();
        setLogos(approvedLogos);
      } catch (err) {
        console.error('Error loading logos:', err);
        setError('Failed to load logos. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    loadLogos();
  }, []);

  // Handle successful logo submission
  const handleLogoSubmitted = () => {
    setIsSubmitDialogOpen(false);
    // Show success message or refresh the list
  };

  return (
    <Layout
      title="NBKR College Logo Downloads | NBKRIST Logos"
      description="Download NBKR and NBKRIST college logos in high quality. Upload your college logo and explore others. Admin approval system in place."
      keywords="nbkr, nbkrist, nbkr logo, nbkrist logo, download nbkr logo, download nbkrist logo, nbkr college logo, nbkrist college logo, nbkr clg logo, nbkrist clg logo, college logo download"
      ogImage="https://nbkrstudenthub.me/NBKRIST_logo.png"
      ogType="website"
    >
      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="max-w-4xl mx-auto text-center mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            NBKR College Logos
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            Download high-quality NBKR and NBKRIST college logos for your projects.
          </p>
          <Button 
            onClick={() => setIsSubmitDialogOpen(true)}
            className="bg-nbkr hover:bg-nbkr-dark"
          >
            Upload Logo
          </Button>
        </div>

        {/* Top Ad Banner */}
        <div className="mb-8">
          <AdPlaceholder
            width="w-full"
            height="h-28"
            label="Top Banner Ad"
          />
        </div>

        {/* Error Message */}
        {error && (
          <div className="max-w-4xl mx-auto bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-6">
            {error}
          </div>
        )}

        {/* Loading State */}
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-nbkr" />
            <span className="ml-2 text-gray-600">Loading logos...</span>
          </div>
        ) : (
          <>
            {/* Logo Grid */}
            {logos.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-600">No logos available yet. Be the first to upload!</p>
              </div>
            ) : (
              <LogoGrid logos={logos} />
            )}
          </>
        )}

        {/* Bottom Ad Banner */}
        <div className="mt-8">
          <AdPlaceholder
            width="w-full"
            height="h-24"
            label="Bottom Banner Ad"
          />
        </div>

        {/* Mobile Sticky Ad */}
        {isMobile && (
          <div className="mt-8">
            <AdPlaceholder
              width="w-full"
              height="h-16"
              label="Mobile Sticky Ad"
            />
          </div>
        )}

        {/* Logo Submission Dialog */}
        <Dialog open={isSubmitDialogOpen} onOpenChange={setIsSubmitDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Upload College Logo</DialogTitle>
            </DialogHeader>
            <LogoSubmissionForm onSubmitSuccess={handleLogoSubmitted} />
          </DialogContent>
        </Dialog>

        {/* Structured Data for SEO */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            "name": "NBKR College Logo Downloads",
            "description": "Download NBKR and NBKRIST college logos in high quality. Upload your college logo and explore others.",
            "url": "https://nbkrstudenthub.me/college-logos",
            "mainEntity": {
              "@type": "ItemList",
              "itemListElement": logos.map((logo, index) => ({
                "@type": "ListItem",
                "position": index + 1,
                "item": {
                  "@type": "ImageObject",
                  "contentUrl": logo.image_url,
                  "name": logo.name,
                  "description": logo.description || `${logo.name} - NBKR College Logo`,
                  "uploadDate": logo.created_at
                }
              }))
            }
          })
        }} />
      </div>
    </Layout>
  );
};

export default CollegeLogos;
