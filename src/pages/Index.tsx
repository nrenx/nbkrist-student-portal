import React, { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import SearchBox from '@/components/SearchBox';
import { AdBanner } from '@/features/ads';
import { useIsMobile } from '@/hooks/use-mobile';
import { useAdNetworks } from '@/hooks/use-ad-networks';

const Index = () => {
  const isMobile = useIsMobile();

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

  // Initialize content for ads
  useEffect(() => {
    // In a real implementation, you would initialize your ad service here
    console.log('Home page loaded - ensuring content is ready before ads');
  }, []);

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
    <Layout
      title="NBKRIST Student Portal | NBKR Student Hub | Official Student Information"
      description="NBKRIST Student Portal - Access your academic information, attendance records, and exam results. The official NBKR student hub for all student information."
      keywords="nbkr, nbkrist, nbkr student portal, nbkr student login, nbkr student information, nbkr ist, nbkr student hub, nbkr hub"
      ogImage="https://nbkrstudenthub.me/NBKRIST_logo.png"
    >
      <div className="container mx-auto px-4 py-8">
        {/* Removed interstitial ad on page load to comply with AdSense policies */}

        {/* Add more content before the first ad to comply with AdSense policies */}
        <div className="max-w-4xl mx-auto text-center mb-10 animate-fade-in">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            N.B.K.R.I.S.T Student Portal
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-4">
            Access your academic information by entering your roll number below. Quick, easy, and secure.
          </p>
          <p className="text-md text-gray-500 max-w-2xl mx-auto">
            The official student portal for N.B.K.R Institute of Science & Technology students.
            Check your attendance, mid-term marks, and personal details with a simple search.
          </p>
        </div>

        {/* Top Ad Banner - Prime position (after sufficient content) */}
        <div className="mb-8">
          <AdBanner
            width="w-full"
            height="h-28"
            slotId="9557785615"
            network="google"
            adConfig={{
              'data-ad-client': 'ca-pub-7831792005606531',
              'data-ad-slot': '9557785615',
              'data-ad-format': 'auto',
              'data-full-width-responsive': 'true'
            }}
          />
        </div>



        {/* Pre-search ad for mobile - high visibility */}
        {isMobile && (
          <div className="mb-6">
            <AdBanner
              width="w-full"
              height="h-auto"
              slotId="4852253846"
              network="google"
              adConfig={{
                'data-ad-client': 'ca-pub-7831792005606531',
                'data-ad-slot': '4852253846',
                'data-ad-format': 'auto',
                'data-full-width-responsive': 'true'
              }}
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

        {/* Side Ads on larger screens */}
        <div className="hidden md:flex justify-between my-12">
          <div className="w-1/4 flex justify-center">
            <AdBanner
              width="w-[160px]"
              height="h-[600px]"
              slotId="4884043433"
              network="google"
              adConfig={{
                'data-ad-client': 'ca-pub-7831792005606531',
                'data-ad-slot': '4884043433',
                'data-ad-format': 'vertical'
              }}
            />
          </div>
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

              {/* In-content ad - between paragraphs for high engagement */}
              <div className="my-6">
                <AdBanner
                  width="w-full"
                  height="h-auto"
                  slotId="7861560560"
                  network="google"
                  adConfig={{
                    'data-ad-client': 'ca-pub-7831792005606531',
                    'data-ad-slot': '7861560560',
                    'data-ad-format': 'auto',
                    'data-full-width-responsive': 'true'
                  }}
                />
              </div>

              <p className="text-gray-600">
                The institution is committed to providing quality education with state-of-the-art infrastructure,
                well-qualified and experienced faculty, well-equipped laboratories, and a well-stocked library.
              </p>
            </div>
          </div>
          <div className="w-1/4 flex justify-center">
            <AdBanner
              width="w-[160px]"
              height="h-[600px]"
              slotId="4884043433"
              network="google"
              adConfig={{
                'data-ad-client': 'ca-pub-7831792005606531',
                'data-ad-slot': '4884043433',
                'data-ad-format': 'vertical'
              }}
            />
          </div>
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

            {/* In-content ad for mobile - between paragraphs */}
            <div className="my-6">
              <AdBanner
                width="w-full"
                height="h-auto"
                slotId="7861560560"
                network="google"
                adConfig={{
                  'data-ad-client': 'ca-pub-7831792005606531',
                  'data-ad-slot': '7861560560',
                  'data-ad-format': 'auto',
                  'data-full-width-responsive': 'true'
                }}
              />
            </div>

            <p className="text-gray-600">
              The institution is committed to providing quality education with state-of-the-art infrastructure,
              well-qualified and experienced faculty, well-equipped laboratories, and a well-stocked library.
            </p>
          </div>
        )}

        {/* Bottom Banner Ad - for all devices */}
        <div className="mt-8">
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

        {/* Removed push notification ad to comply with AdSense policies */}

        {/* Removed exit intent ad to comply with AdSense policies */}

        {/* Removed floating footer ad to comply with AdSense policies */}

        {/* Mobile Banner ad - for mobile users */}
        {isMobile && (
          <div className="mt-8">
            <AdBanner
              width="w-full"
              height="h-auto"
              slotId="8380435316"
              network="google"
              adConfig={{
                'data-ad-client': 'ca-pub-7831792005606531',
                'data-ad-slot': '8380435316',
                'data-ad-format': 'auto',
                'data-full-width-responsive': 'true'
              }}
            />
          </div>
        )}
      </div>

      {/* Notification feature removed as requested */}
    </Layout>
  );
};

export default Index;
