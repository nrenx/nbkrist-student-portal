
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { AdPreferencesDialog, AdAnalyticsDashboard } from '@/features/ads';

const Header = () => {
  const [adPreferencesOpen, setAdPreferencesOpen] = useState(false);
  const [adAnalyticsOpen, setAdAnalyticsOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto py-4 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center">
            <span className="text-2xl font-bold text-nbkr">N.B.K.R.I.S.T</span>
            <span className="ml-2 text-xs sm:text-sm text-gray-500">Student Portal</span>
          </Link>
          <nav className="hidden md:flex space-x-6">
            <Link to="/" className="text-gray-600 hover:text-nbkr transition-colors">Home</Link>
            <Link to="/about" className="text-gray-600 hover:text-nbkr transition-colors">About</Link>
            <Link to="/contact" className="text-gray-600 hover:text-nbkr transition-colors">Contact</Link>
          </nav>
          <div className="md:hidden flex items-center space-x-2">
            <button className="text-gray-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Ad Preferences Dialog */}
      <AdPreferencesDialog
        open={adPreferencesOpen}
        onOpenChange={setAdPreferencesOpen}
      />

      {/* Ad Analytics Dashboard */}
      <AdAnalyticsDashboard
        open={adAnalyticsOpen}
        onOpenChange={setAdAnalyticsOpen}
      />
    </header>
  );
};

export default Header;
