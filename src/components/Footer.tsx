
import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-white border-t mt-auto">
      <div className="container mx-auto px-4 py-6">
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
