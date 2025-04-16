
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import FeedbackForm from './FeedbackForm';
import { Button } from '@/components/ui/button';

const Footer = () => {
  const [showFeedback, setShowFeedback] = useState(false);

  return (
    <footer className="bg-white border-t mt-auto">
      <div className="container mx-auto px-4 py-6">
        {/* Feedback Form Section */}
        <div className="mb-8 border-b pb-8">
          <div className="text-center mb-6">
            <h2 className="text-xl font-semibold text-gray-800">Having Issues with the Portal?</h2>
            <p className="text-sm text-gray-600 mt-2">
              If you're facing any problems with attendance, mid marks, or student details not showing correctly, please let us know.
            </p>
            {!showFeedback ? (
              <Button
                onClick={() => setShowFeedback(true)}
                className="mt-4 bg-nbkr hover:bg-nbkr-dark"
              >
                Report an Issue
              </Button>
            ) : (
              <div className="max-w-md mx-auto mt-4">
                <FeedbackForm />
                <div className="text-center mt-4">
                  <Button
                    variant="outline"
                    onClick={() => setShowFeedback(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Regular Footer Content */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">N.B.K.R.I.S.T</h3>
            <p className="text-sm text-gray-600">
              Providing quality education and empowering students for a brighter future.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="text-sm text-gray-600 hover:text-nbkr">Home</Link></li>
              <li><Link to="/about" className="text-sm text-gray-600 hover:text-nbkr">About</Link></li>
              <li><Link to="/contact" className="text-sm text-gray-600 hover:text-nbkr">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Resources</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-sm text-gray-600 hover:text-nbkr">Academic Calendar</a></li>
              <li><a href="#" className="text-sm text-gray-600 hover:text-nbkr">Library</a></li>
              <li><a href="#" className="text-sm text-gray-600 hover:text-nbkr">Departments</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Contact</h3>
            <address className="text-sm text-gray-600 not-italic">
              <p>Vidyanagar, Nellore District</p>
              <p>Andhra Pradesh, India</p>
              <p className="mt-2">Email: info@nbkrist.ac.in</p>
              <p>Phone: +91 1234567890</p>
            </address>
          </div>
        </div>
        <div className="border-t mt-8 pt-6 text-center">
          <p className="text-sm text-gray-600">
            &copy; {new Date().getFullYear()} N.B.K.R.I.S.T. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
