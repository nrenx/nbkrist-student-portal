
import React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';

interface AdBannerProps {
  width: string;
  height: string;
  slotId?: string;
  type?: 'standard' | 'interstitial' | 'sticky';
}

const AdBanner = ({ width, height, slotId = "default-ad", type = "standard" }: AdBannerProps) => {
  const isMobile = useIsMobile();
  
  const getAdStyling = () => {
    let baseStyles = `ad-container ${width} ${height} relative overflow-hidden`;
    
    if (type === "sticky") {
      return `${baseStyles} fixed bottom-0 left-0 w-full z-50`;
    }
    
    return baseStyles;
  };

  return (
    <div 
      className={getAdStyling()}
      role="complementary"
      aria-label="Advertisement"
      data-ad-slot={slotId}
      data-ad-format={isMobile ? "mobile" : "desktop"}
    >
      <div className="absolute top-1 left-1 bg-black/10 text-xs px-1 rounded">
        Advertisement
      </div>
      {/* Ad content will be inserted here by your ad provider */}
    </div>
  );
};

export default AdBanner;
