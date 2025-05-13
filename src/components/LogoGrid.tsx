import React from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CollegeLogo } from '@/types/logo';
import { Download, Calendar } from 'lucide-react';
import { incrementDownloadCount } from '@/services/logoService';
import { toast } from 'sonner';
import { AdPlaceholder } from '@/features/ads';
import { useIsMobile } from '@/hooks/use-mobile';

interface LogoGridProps {
  logos: CollegeLogo[];
}

const LogoGrid: React.FC<LogoGridProps> = ({ logos }) => {
  const isMobile = useIsMobile();

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Handle logo download
  const handleDownload = async (logo: CollegeLogo) => {
    try {
      // Increment download count
      await incrementDownloadCount(logo.id);

      // Download the image
      const response = await fetch(logo.image_url);
      const blob = await response.blob();
      
      // Create a download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${logo.name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.${blob.type.split('/')[1]}`;
      document.body.appendChild(a);
      a.click();
      
      // Clean up
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast.success('Logo downloaded successfully!');
    } catch (error) {
      console.error('Error downloading logo:', error);
      toast.error('Failed to download logo. Please try again.');
    }
  };

  // Insert ad placeholders between logos
  const logosWithAds = logos.reduce((acc: React.ReactNode[], logo, index) => {
    // Add the logo
    acc.push(
      <Card key={logo.id} className="overflow-hidden hover:shadow-md transition-shadow">
        <div className="p-4">
          <div className="aspect-square relative overflow-hidden rounded-md bg-gray-100 mb-3">
            <img
              src={logo.image_url}
              alt={`${logo.name} - NBKR College Logo`}
              className="object-contain w-full h-full"
            />
          </div>
          <h3 className="font-semibold text-lg mb-1">{logo.name}</h3>
          {logo.description && (
            <p className="text-sm text-gray-600 mb-2 line-clamp-2">{logo.description}</p>
          )}
          <div className="flex items-center text-xs text-muted-foreground mb-3">
            <Calendar className="h-3 w-3 mr-1" />
            <span>{formatDate(logo.created_at)}</span>
            <span className="mx-2">•</span>
            <span>{logo.download_count} downloads</span>
          </div>
        </div>
        <CardFooter className="pt-0 pb-4 px-4">
          <Button 
            onClick={() => handleDownload(logo)} 
            variant="outline" 
            className="w-full"
          >
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
        </CardFooter>
      </Card>
    );

    // Add an ad placeholder after every 3 logos (except the last set)
    if ((index + 1) % 3 === 0 && index < logos.length - 1) {
      acc.push(
        <div key={`ad-${index}`} className="col-span-full my-4">
          <AdPlaceholder
            width="w-full"
            height={isMobile ? "h-20" : "h-24"}
            label="In-content Logo Ad"
          />
        </div>
      );
    }

    return acc;
  }, []);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {logosWithAds}
    </div>
  );
};

export default LogoGrid;
