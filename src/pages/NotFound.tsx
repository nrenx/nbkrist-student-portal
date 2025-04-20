
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Layout from '@/components/Layout';
import { AdBanner } from '@/features/ads';
import { useIsMobile } from '@/hooks/use-mobile';

const NotFound = () => {
  const isMobile = useIsMobile();

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-lg mx-auto text-center">
          <h1 className="text-7xl font-bold text-nbkr mb-4">404</h1>
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Page Not Found</h2>
          <p className="text-gray-600 mb-8">
            The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
          </p>
          <Link to="/">
            <Button className="bg-nbkr hover:bg-nbkr-dark">
              Back to Home
            </Button>
          </Link>

          {/* Post-search ad - high engagement area */}
          <div className="mt-8">
            <AdBanner
              width="w-full"
              height="h-auto"
              slotId="2501197332"
              network="google"
              adConfig={{
                'data-ad-client': 'ca-pub-7831792005606531',
                'data-ad-slot': '2501197332',
                'data-ad-format': 'auto',
                'data-full-width-responsive': 'true'
              }}
            />
          </div>

          {/* Bottom Banner Ad */}
          <div className="mt-12">
            <AdBanner
              width="w-full"
              height="h-auto"
              slotId="8416703140"
              network="google"
              adConfig={{
                'data-ad-client': 'ca-pub-7831792005606531',
                'data-ad-slot': '8416703140',
                'data-ad-format': 'auto',
                'data-full-width-responsive': 'true'
              }}
            />
          </div>

          {/* Mobile Sticky ad - fixed at bottom of screen on mobile */}
          {isMobile && (
            <AdBanner
              width="w-[320px]"
              height="h-[50px]"
              slotId="8380435316"
              type="sticky"
              network="google"
              adConfig={{
                'data-ad-client': 'ca-pub-7831792005606531',
                'data-ad-slot': '8380435316'
              }}
            />
          )}

          {/* Exit intent ad - appears when user tries to leave page */}
          <AdBanner
            width="w-[336px]"
            height="h-[280px]"
            slotId="1085008031"
            type="exit-intent"
            network="google"
            adConfig={{
              'data-ad-client': 'ca-pub-7831792005606531',
              'data-ad-slot': '1085008031'
            }}
          />
        </div>
      </div>
    </Layout>
  );
};

export default NotFound;
