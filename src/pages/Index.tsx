
import React from 'react';
import Layout from '@/components/Layout';
import SearchBox from '@/components/SearchBox';
import AdBanner from '@/components/AdBanner';

const Index = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        {/* Top Ad Banner */}
        <div className="mb-8">
          <AdBanner width="w-full" height="h-24" />
        </div>

        <div className="max-w-4xl mx-auto text-center mb-10 animate-fade-in">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            N.B.K.R.I.S.T Student Portal
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Access your academic information by entering your roll number below. Quick, easy, and secure.
          </p>
        </div>

        <div className="max-w-xl mx-auto bg-white rounded-lg shadow-md p-6 mb-10">
          <h2 className="text-xl font-semibold text-center mb-4">
            Enter Your Roll Number
          </h2>
          <SearchBox />
        </div>

        {/* Side Ads on larger screens */}
        <div className="hidden md:flex justify-between mt-12">
          <AdBanner width="w-1/4" height="h-96" />
          <AdBanner width="w-1/4" height="h-96" />
        </div>

        {/* Bottom Ad on smaller screens */}
        <div className="md:hidden mt-8">
          <AdBanner width="w-full" height="h-32" />
        </div>

        <div className="mt-12 max-w-4xl mx-auto">
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
    </Layout>
  );
};

export default Index;
