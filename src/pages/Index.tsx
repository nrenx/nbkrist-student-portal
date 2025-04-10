
import React, { useEffect } from 'react';
import Layout from '@/components/Layout';
import SearchBox from '@/components/SearchBox';
import AdBanner from '@/components/AdBanner';
import { useIsMobile } from '@/hooks/use-mobile';

const Index = () => {
  const isMobile = useIsMobile();
  
  // This could be used to show an interstitial ad on page load
  useEffect(() => {
    // In a real implementation, you would initialize your ad service here
    console.log('Home page loaded - ideal place to initialize ads');
  }, []);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Top Ad Banner - Prime position */}
        <div className="mb-8">
          <AdBanner width="w-full" height="h-28" slotId="home-top-banner" />
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
            <AdBanner width="w-full" height="h-20" slotId="pre-search-mobile" />
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
          <AdBanner width="w-full" height="h-24" slotId="post-search" />
        </div>

        {/* Side Ads on larger screens */}
        <div className="hidden md:flex justify-between my-12">
          <AdBanner width="w-1/4" height="h-96" slotId="home-left-sidebar" />
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
          <AdBanner width="w-1/4" height="h-96" slotId="home-right-sidebar" />
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
            <AdBanner width="w-full" height="h-32" slotId="home-bottom-mobile" />
          </div>
        )}
        
        {/* Sticky ad for mobile only - constant visibility */}
        {isMobile && (
          <AdBanner width="w-full" height="h-16" slotId="home-sticky-mobile" type="sticky" />
        )}
      </div>
    </Layout>
  );
};

export default Index;
