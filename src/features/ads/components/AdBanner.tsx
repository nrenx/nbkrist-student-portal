import React, { useRef, useEffect, useState } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useAdFrequency } from '@/features/ads/hooks/useAdFrequency';
import { useAdPreferences, AdPreferenceType } from '@/features/ads/hooks/useAdPreferences';
import { useAdPerformance } from '@/features/ads/hooks/useAdPerformance';

interface AdBannerProps {
  width: string;
  height: string;
  slotId?: string;
  type?: 'standard' | 'sticky' | 'interstitial' | 'exit-intent' | 'push-notification' | 'floating-footer';
  network?: 'default' | 'google' | 'facebook' | 'amazon' | 'taboola' | 'outbrain'; // Add supported networks
  adConfig?: Record<string, any>; // Additional network-specific configuration
}

const AdBanner = ({
  width,
  height,
  slotId = "default-ad",
  type = "standard",
  network = "default",
  adConfig = {}
}: AdBannerProps) => {
  const isMobile = useIsMobile();
  const adRef = useRef<HTMLDivElement>(null);
  const [adLoaded, setAdLoaded] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [viewStartTime, setViewStartTime] = useState<number | null>(null);

  // Ad frequency control
  const { shouldShowAd, recordImpression, getImpressionCount } = useAdFrequency();

  // Ad preferences
  const { isAdTypeAllowed } = useAdPreferences();

  // Ad performance tracking
  const { recordImpression: trackImpression, recordClick, updateViewTime, updateViewability } = useAdPerformance();

  // Check if this ad should be shown based on frequency, preferences, and content visibility
  const shouldRenderAd = isAdTypeAllowed(type as AdPreferenceType) &&
    shouldShowAd(slotId, type as any);

  // Set up Intersection Observer for lazy loading
  useEffect(() => {
    if (!adRef.current) {
      return;
    }

    // Ensure we have at least 200px of content visible before showing ads
    // Increased margin to ensure more content is visible before ads load
    const options = {
      rootMargin: '200px',
      threshold: [0, 0.25, 0.5, 0.75, 1]
    };

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;

        // Only set visible if the ad is at least 25% in view
        const isSignificantlyVisible = entry.isIntersecting && entry.intersectionRatio >= 0.25;

        // Check if there's enough content on the page before showing ads
        const hasEnoughContent = document.body.textContent &&
          document.body.textContent.trim().length > 500 && // Ensure there's at least 500 characters of text content
          document.body.querySelectorAll('p, h1, h2, h3, h4, h5, h6, li').length >= 3; // At least 3 content elements

        setIsVisible(isSignificantlyVisible && hasEnoughContent);

        if (isSignificantlyVisible) {
          // Start tracking view time when ad becomes visible
          if (!viewStartTime) {
            setViewStartTime(Date.now());
          }

          // Track viewability percentage
          if (entry.intersectionRatio) {
            updateViewability(slotId, network, entry.intersectionRatio * 100);
          }
        } else if (viewStartTime) {
          // Calculate view time when ad goes out of view
          const viewTimeSeconds = Math.floor((Date.now() - viewStartTime) / 1000);
          if (viewTimeSeconds > 0) {
            updateViewTime(slotId, network, viewTimeSeconds);
          }
          setViewStartTime(null);
        }
      },
      options
    );

    observer.observe(adRef.current);

    return () => {
      observer.disconnect();

      // If component unmounts while ad is visible, record the view time
      if (viewStartTime) {
        const viewTimeSeconds = Math.floor((Date.now() - viewStartTime) / 1000);
        if (viewTimeSeconds > 0) {
          updateViewTime(slotId, network, viewTimeSeconds);
        }
      }
    };
  }, [adRef, slotId, network, viewStartTime, updateViewTime, updateViewability, type]);



  // Single useEffect for ad initialization and cleanup
  useEffect(() => {
    // Don't initialize if ad shouldn't be shown due to frequency caps or preferences
    if (!shouldRenderAd) return;

    // For all ads, only initialize when they become visible (lazy loading)
    // This ensures we don't show ads on screens without content
    if (!isVisible) return;

    // Additional check to ensure we have enough content on the page
    const contentElements = document.body.querySelectorAll('p, h1, h2, h3, h4, h5, h6, li');
    if (contentElements.length < 3) return;

    // Check if we're on a loading screen or error page without sufficient content
    const hasLoadingIndicator = document.body.querySelector('.animate-spin') !== null;
    const hasErrorMessage = document.body.querySelector('[role="alert"]') !== null;
    if (hasLoadingIndicator && contentElements.length < 5) return;
    if (hasErrorMessage && contentElements.length < 5) return;

    // Wait a longer delay to ensure content is loaded and visible first
    const initDelay = setTimeout(() => {
      // Record impression when ad is shown
      recordImpression(slotId, type as any);
      trackImpression(slotId, network);
    }, 800); // Increased from 300ms to 800ms

    // Set a flag to indicate the ad is loaded
    setAdLoaded(true);

    // Initialize Google AdSense after a longer delay to ensure DOM is ready and content is loaded
    if (network === 'google') {
      const timer = setTimeout(() => {
        // Final check before initializing ad to ensure we have content
        const contentElements = document.body.querySelectorAll('p, h1, h2, h3, h4, h5, h6, li');
        if (contentElements.length < 3) return;

        if (window.adsbygoogle) {
          try {
            (window.adsbygoogle = window.adsbygoogle || []).push({});
          } catch (error) {
            console.error('Error initializing AdSense:', error);
          }
        }
      }, 1000); // Increased delay to ensure content is fully loaded

      return () => {
        clearTimeout(timer);
        clearTimeout(initDelay);
        setAdLoaded(false);
      };
    }

    return () => {
      clearTimeout(initDelay);
      setAdLoaded(false);
    };
  }, [network, slotId, isVisible, shouldRenderAd, recordImpression, trackImpression, type]);

  const getAdStyling = () => {
    let baseStyles = `ad-container ${width} ${height} relative overflow-hidden`;

    switch (type) {
      case "sticky":
        return `${baseStyles} fixed bottom-0 left-0 w-full z-40`;
      default:
        return baseStyles;
    }
  };

  const handleCloseAd = () => {
    // If we're tracking view time, record it when ad is closed
    if (viewStartTime) {
      const viewTimeSeconds = Math.floor((Date.now() - viewStartTime) / 1000);
      if (viewTimeSeconds > 0) {
        updateViewTime(slotId, network, viewTimeSeconds);
      }
      setViewStartTime(null);
    }
  };

  // Don't render if shouldn't be shown or if frequency/preference limits are reached
  if (!shouldRenderAd) return null;

  // For debugging: show impression count
  const impressionCount = getImpressionCount(slotId, type as any);

  // Handle click tracking
  const handleAdClick = () => {
    recordClick(slotId, network);
  };



  return (
    <div
      className={getAdStyling()}
      role="complementary"
      aria-label="Advertisement"
      ref={adRef}
      onClick={handleAdClick}
    >
      <div className="absolute top-1 left-1 bg-black/10 text-xs px-1 rounded">
        Advertisement
      </div>
      {!adLoaded ? (
        <div className="animate-pulse bg-gray-200 w-full h-full flex items-center justify-center text-gray-400">
          Loading ad...
        </div>
      ) : (
        <ins
          className="adsbygoogle"
          style={{
            display: 'block',
            width: adConfig['width'] || '100%',
            height: adConfig['height'] || '100%'
          }}
          data-ad-client={adConfig['data-ad-client'] || 'ca-pub-7831792005606531'}
          data-ad-slot={adConfig['data-ad-slot'] || slotId}
          data-ad-format={adConfig['data-ad-format'] || 'auto'}
          data-full-width-responsive={adConfig['data-full-width-responsive'] || 'true'}
        />
      )}
    </div>
  );
};

export default AdBanner;
