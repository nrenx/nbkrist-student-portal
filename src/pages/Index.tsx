import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import SearchBox from '@/components/SearchBox';
import { AdPlaceholder, AdsterraAd, AdsterraNativeBanner } from '@/features/ads';
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
          <AdsterraAd
            adKey="df08e80e0411f467a2bf4c4b472cfa73"
            width={728}
            height={90}
            className="mx-auto"
          />
        </div>



        {/* Pre-search ad for mobile - high visibility */}
        {isMobile && (
          <div className="mb-6">
            <AdsterraAd
              adKey="df08e80e0411f467a2bf4c4b472cfa73"
              width={728}
              height={90}
              className="mx-auto"
            />
          </div>
        )}


        <div className="max-w-xl mx-auto bg-white rounded-lg shadow-md p-6 mb-10">
          <h2 className="text-xl font-semibold text-center mb-4">
            Enter Your Roll Number
          </h2>
          <SearchBox />
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-500 mb-2">Don't know the roll number?</p>
            <Link
              to="/student-name-search"
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Search by Student Name →
            </Link>
          </div>
        </div>

        {/* How It Works Section */}
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6 mb-10">
          <h2 className="text-xl font-semibold text-center mb-4">
            How NBKR Student Portal Works
          </h2>
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="md:w-1/2">
              <p className="text-gray-600 mb-4">
                Curious about how this portal works? We've created an interactive visual flowchart
                that explains the entire system - from data collection to display.
              </p>
              <p className="text-gray-600 mb-4">
                Explore the student search flow, admin data update process, and how information
                moves through our system.
              </p>
              <div className="text-center md:text-left">
                <Link
                  to="/how-it-works"
                  className="inline-flex items-center justify-center px-4 py-2 bg-nbkr text-white rounded-md hover:bg-nbkr-dark transition-colors"
                >
                  View Interactive Flowchart
                </Link>
              </div>
            </div>
            <div className="md:w-1/2 flex justify-center">
              <div className="bg-gray-100 rounded-lg p-4 w-full max-w-xs h-48 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="text-nbkr">
                  <rect x="3" y="3" width="7" height="7" rx="1"></rect>
                  <rect x="14" y="3" width="7" height="7" rx="1"></rect>
                  <rect x="14" y="14" width="7" height="7" rx="1"></rect>
                  <rect x="3" y="14" width="7" height="7" rx="1"></rect>
                  <path d="M10 7h4"></path>
                  <path d="M7 10v4"></path>
                  <path d="M17 10v4"></path>
                  <path d="M10 17h4"></path>
                </svg>
              </div>
            </div>
          </div>
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
                <AdsterraNativeBanner
                  adKey="0ff47a52378e603887c6c43532a138d8"
                  className="w-full"
                />
              </div>

              <p className="text-gray-600">
                The institution is committed to providing quality education with state-of-the-art infrastructure,
                well-qualified and experienced faculty, well-equipped laboratories, and a well-stocked library.
              </p>
            </div>
          </div>
          <div className="w-1/4 flex justify-center">
            <AdsterraNativeBanner
              adKey="0ff47a52378e603887c6c43532a138d8"
              className="w-[160px] min-h-[600px]"
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
              <AdsterraNativeBanner
                adKey="0ff47a52378e603887c6c43532a138d8"
                className="w-full"
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
          <AdsterraAd
            adKey="df08e80e0411f467a2bf4c4b472cfa73"
            width={728}
            height={90}
            className="mx-auto"
          />
        </div>



        {/* Mobile Banner ad - for mobile users */}
        {isMobile && (
          <div className="mt-8 sticky bottom-0 z-50">
            <AdsterraNativeBanner
              adKey="0ff47a52378e603887c6c43532a138d8"
              className="w-full"
            />
          </div>
        )}
      </div>


    </Layout>
  );
};

export default Index;
