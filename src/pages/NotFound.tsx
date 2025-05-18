
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Layout from '@/components/Layout';
import { AdBanner, AdsterraDirectLink } from '@/features/ads';

const NotFound = () => {
  return (
    <Layout
      title="Page Not Found | NBKRIST Student Portal"
      description="The page you are looking for might have been removed, had its name changed, or is temporarily unavailable. Return to the NBKR Student Hub homepage."
      keywords="nbkr, nbkrist, nbkr student portal, page not found, 404"
      ogImage="https://nbkrstudenthub.me/NBKRIST_logo.png"
    >
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-lg mx-auto text-center">
          <h1 className="text-7xl font-bold text-nbkr mb-4">404</h1>
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Page Not Found</h2>
          <p className="text-gray-600 mb-6">
            The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
          </p>

          {/* Add more meaningful content to increase content-to-ad ratio */}
          <div className="text-left mb-8 bg-gray-50 p-6 rounded-lg shadow-sm">
            <h3 className="text-xl font-medium text-gray-800 mb-3">Looking for something?</h3>
            <p className="text-gray-600 mb-3">
              You might find what you're looking for in one of these sections:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-gray-600 mb-4">
              <li>Check the <Link to="/" className="text-nbkr hover:underline">homepage</Link> to search for student information</li>
              <li>Visit the <Link to="/about" className="text-nbkr hover:underline">about page</Link> to learn more about N.B.K.R.I.S.T</li>
              <li>Need help? Go to our <Link to="/contact" className="text-nbkr hover:underline">contact page</Link></li>
            </ul>
          </div>

          <Link to="/">
            <Button className="bg-nbkr hover:bg-nbkr-dark mb-8">
              Back to Home
            </Button>
          </Link>

          {/* Single ad with proper spacing from content */}
          <div className="mt-8 max-w-md mx-auto">
            <AdsterraDirectLink
              url="https://www.profitableratecpm.com/xjm97v2v?key=79ca1dfc649daac131b1fae37f663154"
              buttonText="Find What You're Looking For"
              className="w-full"
            />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default NotFound;
