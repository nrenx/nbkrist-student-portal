import React, { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import SearchBox from '@/components/SearchBox';
import { AdPlaceholder } from '@/features/ads';
import { useIsMobile } from '@/hooks/use-mobile';

const Index = () => {
  const isMobile = useIsMobile();

  return (
    <Layout
      title="NBKRIST Student Portal | NBKR Student Hub | Official Student Information"
      description="NBKRIST Student Portal - Access your academic information, attendance records, and exam results. The official NBKR student hub for all student information."
      keywords="nbkr, nbkrist, nbkr student portal, nbkr student login, nbkr student information, nbkr ist, nbkr student hub, nbkr hub"
      ogImage="https://nbkrstudenthub.me/NBKRIST_logo.png"
    >
      <div className="container mx-auto px-4 py-8">


        {/* Add more content before the first ad to comply with AdSense policies */}
        <div className="max-w-4xl mx-auto text-center mb-10 animate-fade-in">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            N.B.K.R.I.S.T Student Portal
          </h1>
        </div>

        {/* Top Ad Banner - Prime position (after sufficient content) */}
        <div className="mb-8">
          <AdPlaceholder
            width="w-full"
            height="h-28"
            label="Top Banner Ad"
          />
        </div>



        {/* Pre-search ad for mobile - high visibility */}
        {isMobile && (
          <div className="mb-6">
            <AdPlaceholder
              width="w-full"
              height="h-16"
              label="Pre-search Mobile Ad"
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
          <AdPlaceholder
            width="w-full"
            height="h-20"
            label="Post-search Ad"
          />
        </div>

        {/* Side Ads on larger screens */}
        <div className="hidden md:flex justify-between my-12">
          <div className="w-1/4 flex justify-center">
            <AdPlaceholder
              width="w-[160px]"
              height="h-[600px]"
              label="Side Ad (Left)"
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
                <AdPlaceholder
                  width="w-full"
                  height="h-20"
                  label="In-content Ad"
                />
              </div>

              <p className="text-gray-600">
                The institution is committed to providing quality education with state-of-the-art infrastructure,
                well-qualified and experienced faculty, well-equipped laboratories, and a well-stocked library.
              </p>
            </div>
          </div>
          <div className="w-1/4 flex justify-center">
            <AdPlaceholder
              width="w-[160px]"
              height="h-[600px]"
              label="Side Ad (Right)"
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
              <AdPlaceholder
                width="w-full"
                height="h-20"
                label="Mobile In-content Ad"
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
          <AdPlaceholder
            width="w-full"
            height="h-24"
            label="Bottom Banner Ad"
          />
        </div>



        {/* Mobile Banner ad - for mobile users */}
        {isMobile && (
          <div className="mt-8">
            <AdPlaceholder
              width="w-full"
              height="h-16"
              label="Mobile Sticky Ad"
            />
          </div>
        )}
      </div>


    </Layout>
  );
};

export default Index;
