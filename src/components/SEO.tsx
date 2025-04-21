import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  ogImage?: string;
  ogType?: string;
  children?: React.ReactNode;
}

/**
 * SEO component that updates document metadata for better search engine optimization
 */
const SEO: React.FC<SEOProps> = ({
  title = 'NBKRIST Student Portal | NBKR Student Hub',
  description = 'NBKRIST Student Portal - Access your academic information, attendance records, and exam results. The official NBKR student hub.',
  keywords = 'nbkr, nbkrist, nbkr student portal, nbkr student login, nbkr student information, nbkr ist, nbkr student hub, nbkr hub',
  ogImage = 'https://nbkrstudenthub.me/NBKRIST_logo.png',
  ogType = 'website',
  children,
}) => {
  const location = useLocation();
  const currentUrl = `https://nbkrstudenthub.me${location.pathname}`;
  
  // Combine with default title if not the home page
  const fullTitle = location.pathname !== '/' 
    ? `${title} | NBKR Student Hub` 
    : title;

  useEffect(() => {
    // Update document title
    document.title = fullTitle;
    
    // Update meta tags
    const metaTags = {
      description,
      keywords,
      'og:title': fullTitle,
      'og:description': description,
      'og:type': ogType,
      'og:url': currentUrl,
      'og:image': ogImage,
      'twitter:title': fullTitle,
      'twitter:description': description,
      'twitter:image': ogImage,
    };
    
    // Update existing meta tags or create new ones
    Object.entries(metaTags).forEach(([name, content]) => {
      // Handle both name and property attributes
      const selector = name.startsWith('og:') || name.startsWith('twitter:')
        ? `meta[property="${name}"]`
        : `meta[name="${name}"]`;
        
      const element = document.querySelector(selector);
      
      if (element) {
        // Update existing tag
        element.setAttribute('content', content);
      } else {
        // Create new tag if it doesn't exist
        const meta = document.createElement('meta');
        if (name.startsWith('og:') || name.startsWith('twitter:')) {
          meta.setAttribute('property', name);
        } else {
          meta.setAttribute('name', name);
        }
        meta.setAttribute('content', content);
        document.head.appendChild(meta);
      }
    });
    
    // Update canonical link
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (canonicalLink) {
      canonicalLink.setAttribute('href', currentUrl);
    } else {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      canonicalLink.setAttribute('href', currentUrl);
      document.head.appendChild(canonicalLink);
    }
    
    // Cleanup function to remove any meta tags we added
    return () => {
      // We don't remove tags on cleanup as they should be updated by the next page
    };
  }, [fullTitle, description, keywords, ogImage, ogType, currentUrl]);
  
  return <>{children}</>;
};

export default SEO;
