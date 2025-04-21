import React, { useRef, useEffect, useState } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useAdFrequency } from '@/features/ads/hooks/useAdFrequency';
import { useAdPreferences, AdPreferenceType } from '@/features/ads/hooks/useAdPreferences';
import { useAdPerformance } from '@/features/ads/hooks/useAdPerformance';

interface AdBannerProps {
  width: string;
  height: string;
  slotId?: string;
  type?: 'standard' | 'interstitial' | 'sticky' | 'floating-footer' | 'exit-intent' | 'push-notification';
  delay?: number; // For timed ads
  network?: 'default' | 'google' | 'facebook' | 'amazon' | 'taboola' | 'outbrain'; // Add supported networks
  adConfig?: Record<string, any>; // Additional network-specific configuration
}

const AdBanner = ({
  width,
  height,
  slotId = "default-ad",
  type = "standard",
  delay = 0,
  network = "default",
  adConfig = {}
}: AdBannerProps) => {
  const isMobile = useIsMobile();
  const adRef = useRef<HTMLDivElement>(null);
  const [showAd, setShowAd] = useState(type !== 'exit-intent' && type !== 'interstitial');
  const [showExitIntent, setShowExitIntent] = useState(false);
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
  const shouldRenderAd = (type === 'standard' ||
    (isAdTypeAllowed(type as AdPreferenceType) &&
     shouldShowAd(slotId, type as any))) &&
    // Disable problematic ad types that violate AdSense policies
    type !== 'interstitial' &&
    type !== 'exit-intent' &&
    type !== 'push-notification';

  // Set up Intersection Observer for lazy loading
  useEffect(() => {
    if (!adRef.current) {
      return;
    }

    // Ensure we have at least 100px of content visible before showing ads
    const options = {
      rootMargin: '100px',
      threshold: [0, 0.25, 0.5, 0.75, 1]
    };

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;

        // Only set visible if the ad is at least 25% in view
        const isSignificantlyVisible = entry.isIntersecting && entry.intersectionRatio >= 0.25;
        setIsVisible(isSignificantlyVisible);

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

  // Handle delayed ads and exit intent
  useEffect(() => {
    // Handle delayed ads (interstitials)
    if ((type === 'interstitial' || type === 'push-notification') && delay > 0 && shouldRenderAd) {
      const timer = setTimeout(() => {
        setShowAd(true);
      }, delay);
      return () => clearTimeout(timer);
    }

    // Set up exit intent detection
    if (type === 'exit-intent' && shouldRenderAd) {
      const handleMouseLeave = (e: MouseEvent) => {
        // Only trigger if the mouse is leaving the top of the viewport
        if (e.clientY <= 0) {
          setShowExitIntent(true);
          // Record impression for exit intent ad
          recordImpression(slotId, type as any);
          trackImpression(slotId, network);
        }
      };

      // Only add the listener on non-mobile devices
      if (!isMobile) {
        document.addEventListener('mouseleave', handleMouseLeave);
        return () => document.removeEventListener('mouseleave', handleMouseLeave);
      }
    }
  }, [type, delay, isMobile, shouldRenderAd, slotId, network, recordImpression, trackImpression]);

  // Single useEffect for ad initialization and cleanup
  useEffect(() => {
    // Don't initialize if ad shouldn't be shown due to frequency caps or preferences
    if ((!showAd && !showExitIntent) || !shouldRenderAd) return;

    // For all ads, only initialize when they become visible (lazy loading)
    // This ensures we don't show ads on screens without content
    if (!isVisible) return;

    // Wait a short delay to ensure content is loaded and visible first
    const initDelay = setTimeout(() => {
      // Record impression when ad is shown
      recordImpression(slotId, type as any);
      trackImpression(slotId, network);
    }, 300);

    // Set a flag to indicate the ad is loaded
    setAdLoaded(true);

    // Initialize Google AdSense after a short delay to ensure DOM is ready
    if (network === 'google') {
      const timer = setTimeout(() => {
        if (window.adsbygoogle) {
          try {
            (window.adsbygoogle = window.adsbygoogle || []).push({});
          } catch (error) {
            console.error('Error initializing AdSense:', error);
          }
        }
      }, 500); // Increased delay to ensure content is fully loaded

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
  }, [showAd, showExitIntent, network, slotId, isVisible, shouldRenderAd, recordImpression, trackImpression, type]);

  const getAdStyling = () => {
    let baseStyles = `ad-container ${width} ${height} relative overflow-hidden`;

    switch (type) {
      case "sticky":
        return `${baseStyles} fixed bottom-0 left-0 w-full z-40`;
      case "floating-footer":
        return `${baseStyles} fixed bottom-0 left-0 right-0 w-full z-50 shadow-lg`;
      case "exit-intent":
      case "interstitial":
        return `${baseStyles} fixed inset-0 flex items-center justify-center z-50`;
      case "push-notification":
        return `${baseStyles} fixed top-4 right-4 z-50 shadow-lg rounded-lg`;
      default:
        return baseStyles;
    }
  };

  const handleCloseAd = () => {
    setShowAd(false);
    setShowExitIntent(false);

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
  if ((!showAd && !showExitIntent) || !shouldRenderAd) return null;

  // For debugging: show impression count
  const impressionCount = getImpressionCount(slotId, type as any);

  // Handle click tracking
  const handleAdClick = () => {
    recordClick(slotId, network);
  };

  // For fullscreen/modal ads (exit intent & interstitial)
  if ((type === 'exit-intent' && showExitIntent) || (type === 'interstitial' && showAd)) {
    return (
      <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center">
        <div className={`${width} ${height} max-w-screen-md relative bg-white p-4 rounded-lg`}>
          <button
            onClick={handleCloseAd}
            className="absolute top-2 right-2 bg-gray-200 rounded-full p-1 hover:bg-gray-300 transition-colors"
            aria-label="Close advertisement"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
          <div className="absolute top-1 left-1 bg-black/10 text-xs px-1 rounded">
            Advertisement
          </div>
          <div
            className="w-full h-full flex items-center justify-center"
            role="complementary"
            aria-label="Advertisement"
            ref={adRef}
            onClick={handleAdClick}
          >
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
        </div>
      </div>
    );
  }

  // For push notification style ads
  if (type === 'push-notification' && showAd) {
    return (
      <div className={getAdStyling()}>
        <button
          onClick={handleCloseAd}
          className="absolute top-2 right-2 bg-gray-200 rounded-full p-1 hover:bg-gray-300 transition-colors"
          aria-label="Close advertisement"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
        <div className="absolute top-1 left-1 bg-black/10 text-xs px-1 rounded">
          Notification
        </div>
        <div
          className="w-full h-full"
          role="complementary"
          aria-label="Advertisement"
          ref={adRef}
          onClick={handleAdClick}
        >
          {!adLoaded ? (
            <div className="animate-pulse bg-gray-200 w-full h-full flex items-center justify-center text-gray-400 text-xs">
              Loading...
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
      </div>
    );
  }

  // Standard ads and floating footer
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
