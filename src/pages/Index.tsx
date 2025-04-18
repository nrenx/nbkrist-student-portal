import React, { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import SearchBox from '@/components/SearchBox';
import { AdBanner } from '@/features/ads';
import { useIsMobile } from '@/hooks/use-mobile';
import { useAdNetworks } from '@/hooks/use-ad-networks';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';

const Index = () => {
  const isMobile = useIsMobile();
  const [showNotificationDialog, setShowNotificationDialog] = useState(false);
  const [showStickyAd, setShowStickyAd] = useState(true);

  // Initialize ad networks
  const { initializedNetworks, loading: adsLoading, error: adsError } = useAdNetworks({
    networks: ['default', 'google'], // Add the networks you want to use
    onInitialized: (network) => {
      console.log(`${network} ad network initialized successfully`);
    },
    onError: (network, error) => {
      console.error(`Error initializing ${network} ad network:`, error);
    }
  });

  // This could be used to show an interstitial ad on page load
  useEffect(() => {
    // In a real implementation, you would initialize your ad service here
    console.log('Home page loaded - ideal place to initialize ads');

    // Show notification opt-in dialog after 3 seconds
    const timer = setTimeout(() => {
      setShowNotificationDialog(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const handleAllowNotifications = () => {
    // In production, this would trigger the actual notification permission request
    console.log('User allowed notifications');
    setShowNotificationDialog(false);
    // Code to register for push notifications would go here
  };

  // When floating footer ad is displayed, hide the sticky ad
  useEffect(() => {
    // Check if floating footer ad exists and hide sticky ad if it does
    const floatingFooterExists = document.querySelector('[data-ad-type="floating-footer"]') !== null;
    setShowStickyAd(!floatingFooterExists);
  }, []);

  // Display any ad network loading errors
  if (adsError) {
    console.error('Ad network error:', adsError);
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Interstitial ad on page load - shown immediately */}
        <AdBanner
          width="w-full"
          height="h-96"
          slotId="interstitial-pageload"
          type="interstitial"
          network="google"
        />

        {/* Top Ad Banner - Prime position */}
        <div className="mb-8">
          <AdBanner
            width="w-full"
            height="h-28"
            slotId="home-top-banner"
            network="google"
            adConfig={{ 'data-ad-client': 'ca-pub-example' }}
          />
        </div>

        <div className="max-w-4xl mx-auto text-center mb-10 animate-fade-in">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            N.B.K.R.I.S.T Student Portal
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Access your academic information by entering your roll number below. Quick, easy, and secure.
          </p>
        </div>

        {/* Pre-search ad - high visibility */}
        {isMobile && (
          <div className="mb-6">
            <AdBanner
              width="w-full"
              height="h-20"
              slotId="pre-search-mobile"
              network="facebook"
            />
          </div>
        )}

        <div className="max-w-xl mx-auto bg-white rounded-lg shadow-md p-6 mb-10">
          <h2 className="text-xl font-semibold text-center mb-4">
            Enter Your Roll Number
          </h2>
          <SearchBox />
        </div>

        {/* Post-search ad - high engagement area */}
        <div className="my-8">
          <AdBanner
            width="w-full"
            height="h-24"
            slotId="post-search"
            network="taboola"
          />
        </div>

        {/* Side Ads on larger screens */}
        <div className="hidden md:flex justify-between my-12">
          <AdBanner
            width="w-1/4"
            height="h-96"
            slotId="home-left-sidebar"
            network="amazon"
          />
          <div className="w-2/4 px-4">
            <div className="mt-8 max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">
                About N.B.K.R.I.S.T
              </h2>
              <p className="text-gray-600 mb-4">
                N.B.K.R. Institute of Science & Technology (N.B.K.R.I.S.T), established in 1979, is one of the premier
                engineering institutions in Andhra Pradesh. The institute offers undergraduate, postgraduate and doctoral
                programs in various disciplines of engineering and science.
              </p>
              <p className="text-gray-600">
                The institution is committed to providing quality education with state-of-the-art infrastructure,
                well-qualified and experienced faculty, well-equipped laboratories, and a well-stocked library.
              </p>
            </div>
          </div>
          <AdBanner
            width="w-1/4"
            height="h-96"
            slotId="home-right-sidebar"
            network="outbrain"
          />
        </div>

        {/* Mobile about section */}
        {isMobile && (
          <div className="mt-6 max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">
              About N.B.K.R.I.S.T
            </h2>
            <p className="text-gray-600 mb-4">
              N.B.K.R. Institute of Science & Technology (N.B.K.R.I.S.T), established in 1979, is one of the premier
              engineering institutions in Andhra Pradesh. The institute offers undergraduate, postgraduate and doctoral
              programs in various disciplines of engineering and science.
            </p>
            <p className="text-gray-600">
              The institution is committed to providing quality education with state-of-the-art infrastructure,
              well-qualified and experienced faculty, well-equipped laboratories, and a well-stocked library.
            </p>
          </div>
        )}

        {/* Bottom Ad on mobile screens - closing experience */}
        {isMobile && (
          <div className="mt-8">
            <AdBanner
              width="w-full"
              height="h-32"
              slotId="home-bottom-mobile"
              network="google"
            />
          </div>
        )}

        {/* Push notification ad that appears after a delay */}
        <AdBanner
          width="w-72"
          height="h-24"
          slotId="push-notification-ad"
          type="push-notification"
          delay={10000} // Show after 10 seconds
          network="default"
        />

        {/* Exit intent ad - appears when user tries to leave page */}
        <AdBanner
          width="w-full max-w-md"
          height="h-80"
          slotId="exit-intent-ad"
          type="exit-intent"
          network="google"
        />

        {/* Floating footer ad - always visible */}
        <AdBanner
          width="w-full"
          height="h-16"
          slotId="floating-footer-ad"
          type="floating-footer"
          network="amazon"
        />

        {/* Sticky ad for mobile only - replaced by floating footer */}
        {isMobile && showStickyAd && (
          <AdBanner
            width="w-full"
            height="h-16"
            slotId="home-sticky-mobile"
            type="sticky"
            network="facebook"
          />
        )}
      </div>

      {/* Notification permission dialog */}
      <Dialog open={showNotificationDialog} onOpenChange={setShowNotificationDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Enable Notifications</DialogTitle>
            <DialogDescription>
              Get instant updates about your results, upcoming exams, and important college announcements.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0 mt-4">
            <button
              className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90"
              onClick={handleAllowNotifications}
            >
              Allow Notifications
            </button>
            <button
              className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300"
              onClick={() => setShowNotificationDialog(false)}
            >
              Not Now
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default Index;
