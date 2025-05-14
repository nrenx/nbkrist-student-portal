import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  ogImage?: string;
  ogType?: string;
  children?: React.ReactNode;
  author?: string;
  robots?: string;
  canonicalUrl?: string;
  publishedTime?: string;
  modifiedTime?: string;
  articleTags?: string[];
  locale?: string;
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
  author = 'NBKR Student Hub',
  robots = 'index, follow',
  canonicalUrl,
  publishedTime,
  modifiedTime,
  articleTags,
  locale = 'en_US',
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
      author,
      robots,
      'og:title': fullTitle,
      'og:description': description,
      'og:type': ogType,
      'og:url': canonicalUrl || currentUrl,
      'og:image': ogImage,
      'og:locale': locale,
      'twitter:title': fullTitle,
      'twitter:description': description,
      'twitter:image': ogImage,
      'twitter:card': 'summary_large_image',
    };

    // Add article specific tags if ogType is article
    if (ogType === 'article') {
      if (publishedTime) metaTags['article:published_time'] = publishedTime;
      if (modifiedTime) metaTags['article:modified_time'] = modifiedTime;
      if (articleTags && articleTags.length > 0) {
        articleTags.forEach((tag, index) => {
          metaTags[`article:tag:${index}`] = tag;
        });
      }
    }

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
    const canonicalHref = canonicalUrl || currentUrl;
    if (canonicalLink) {
      canonicalLink.setAttribute('href', canonicalHref);
    } else {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      canonicalLink.setAttribute('href', canonicalHref);
      document.head.appendChild(canonicalLink);
    }

    // Add JSON-LD structured data for better SEO
    let structuredDataScript = document.querySelector('script[type="application/ld+json"]');
    if (!structuredDataScript) {
      structuredDataScript = document.createElement('script');
      structuredDataScript.setAttribute('type', 'application/ld+json');
      document.head.appendChild(structuredDataScript);
    }

    // Basic WebSite schema
    const structuredData: any = {
      '@context': 'https://schema.org',
      '@type': ogType === 'article' ? 'Article' : 'WebSite',
      'url': canonicalHref,
      'name': fullTitle,
      'description': description,
      'image': ogImage,
    };

    // Add article specific structured data
    if (ogType === 'article') {
      Object.assign(structuredData, {
        'headline': title,
        'author': {
          '@type': 'Person',
          'name': author
        },
        'publisher': {
          '@type': 'Organization',
          'name': 'NBKR Student Hub',
          'logo': {
            '@type': 'ImageObject',
            'url': 'https://nbkrstudenthub.me/NBKRIST_logo.png'
          }
        }
      });

      if (publishedTime) structuredData.datePublished = publishedTime;
      if (modifiedTime) structuredData.dateModified = modifiedTime;
    }

    structuredDataScript.textContent = JSON.stringify(structuredData);

    // Cleanup function to remove any meta tags we added
    return () => {
      // We don't remove tags on cleanup as they should be updated by the next page
    };
  }, [fullTitle, description, keywords, ogImage, ogType, currentUrl]);

  return <>{children}</>;
};

export default SEO;
