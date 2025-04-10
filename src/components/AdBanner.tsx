import React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';

interface AdBannerProps {
  width: string;
  height: string;
  slotId?: string;
  type?: 'standard' | 'interstitial' | 'sticky' | 'floating-footer' | 'exit-intent' | 'push-notification';
  delay?: number; // For timed ads
}

const AdBanner = ({ 
  width, 
  height, 
  slotId = "default-ad", 
  type = "standard",
  delay = 0
}: AdBannerProps) => {
  const isMobile = useIsMobile();
  const [showAd, setShowAd] = React.useState(type !== 'exit-intent' && type !== 'interstitial');
  const [showExitIntent, setShowExitIntent] = React.useState(false);
  
  React.useEffect(() => {
    // Handle delayed ads (interstitials)
    if ((type === 'interstitial' || type === 'push-notification') && delay > 0) {
      const timer = setTimeout(() => {
        setShowAd(true);
      }, delay);
      return () => clearTimeout(timer);
    }
    
    // Set up exit intent detection
    if (type === 'exit-intent') {
      const handleMouseLeave = (e: MouseEvent) => {
        // Only trigger if the mouse is leaving the top of the viewport
        if (e.clientY <= 0) {
          setShowExitIntent(true);
        }
      };
      
      // Only add the listener on non-mobile devices
      if (!isMobile) {
        document.addEventListener('mouseleave', handleMouseLeave);
        return () => document.removeEventListener('mouseleave', handleMouseLeave);
      }
    }
  }, [type, delay, isMobile]);
  
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
  };
  
  // Don't render if shouldn't be shown
  if (!showAd && !showExitIntent) return null;
  
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
            data-ad-slot={slotId}
            data-ad-format={isMobile ? "mobile" : "desktop"}
            data-ad-type={type}
          >
            {/* Ad content will be inserted here by your ad provider */}
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
          data-ad-slot={slotId}
          data-ad-format={isMobile ? "mobile" : "desktop"}
          data-ad-type={type}
        >
          {/* Ad content will be inserted here by your ad provider */}
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
      data-ad-slot={slotId}
      data-ad-format={isMobile ? "mobile" : "desktop"}
      data-ad-type={type}
    >
      <div className="absolute top-1 left-1 bg-black/10 text-xs px-1 rounded">
        Advertisement
      </div>
      {/* Ad content will be inserted here by your ad provider */}
    </div>
  );
};

export default AdBanner;
