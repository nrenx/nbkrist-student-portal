
import { useState } from 'react';
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
              <li><Link to="/how-it-works" className="text-sm text-gray-600 hover:text-nbkr">How It Works</Link></li>
              <li><Link to="/blog" className="text-sm text-gray-600 hover:text-nbkr">Blog</Link></li>
              <li><Link to="/college-logo" className="text-sm text-gray-600 hover:text-nbkr">College Logo</Link></li>
              <li><Link to="/contact" className="text-sm text-gray-600 hover:text-nbkr">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Resources</h3>
            <ul className="space-y-2">
              <li><Link to="/admin/dashboard" className="text-sm text-gray-600 hover:text-nbkr">Admin Dashboard</Link></li>
              <li><Link to="/ad-policy" className="text-sm text-gray-600 hover:text-nbkr">Ad Policy</Link></li>
              {/* This link is used for railway.com for backend purpose */}
              <li><a href="https://nbkr-webupload-render-production-8a09.up.railway.app/" target="_blank" rel="noopener noreferrer" className="text-sm text-gray-600 hover:text-nbkr">Update Student Details</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Contact</h3>
            <address className="text-sm text-gray-600 not-italic">
              <p>Vidyanagar, Nellore District</p>
              <p>Andhra Pradesh, India</p>
              <p className="mt-2">Email: info@nbkrist.ac.in</p>
              <p>Phone: +91 1234567890</p>
              <div className="mt-3 pt-3 border-t border-gray-100">
                <p className="font-medium flex items-center">
                  Admin WhatsApp
                  <span className="ml-2 bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded-full">Messages Only</span>
                </p>
                <p>+91 9849839819</p>
                <a
                  href="https://wa.me/919849839819"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center mt-1 text-green-600 hover:text-green-700 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 mr-1">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  Chat on WhatsApp
                </a>
              </div>
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
