
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AdPreferencesDialog, AdAnalyticsDashboard } from '@/features/ads';

const Header = () => {
  const [adPreferencesOpen, setAdPreferencesOpen] = useState(false);
  const [adAnalyticsOpen, setAdAnalyticsOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Close mobile menu when window is resized to desktop size
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) { // md breakpoint
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      // Check if the click is outside the mobile menu and the menu button
      if (mobileMenuOpen &&
          !target.closest('.mobile-menu') &&
          !target.closest('.mobile-menu-button')) {
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [mobileMenuOpen]);

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
            <button
              className="text-gray-600 focus:outline-none transition-transform duration-200 mobile-menu-button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle mobile menu"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`h-6 w-6 transition-transform duration-300 ${mobileMenuOpen ? 'rotate-90' : ''}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d={mobileMenuOpen
                    ? "M6 18L18 6M6 6l12 12"
                    : "M4 6h16M4 12h16M4 18h16"}
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 right-0 bg-white shadow-md z-50 border-t border-gray-200 animate-fade-in mobile-menu">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="flex flex-col py-2">
              <Link
                to="/"
                className="px-4 py-3 text-gray-600 hover:bg-gray-100 hover:text-nbkr transition-colors rounded-md"
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/about"
                className="px-4 py-3 text-gray-600 hover:bg-gray-100 hover:text-nbkr transition-colors rounded-md"
                onClick={() => setMobileMenuOpen(false)}
              >
                About
              </Link>
              <Link
                to="/contact"
                className="px-4 py-3 text-gray-600 hover:bg-gray-100 hover:text-nbkr transition-colors rounded-md"
                onClick={() => setMobileMenuOpen(false)}
              >
                Contact
              </Link>
            </nav>
          </div>
        </div>
      )}

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
