import React, { useEffect, useRef } from 'react';

interface AdsterraAdProps {
  adKey: string;
  width: number;
  height: number;
  format?: string;
  className?: string;
}

/**
 * AdsterraAd component
 * 
 * This component renders an Adsterra advertisement using their provided script.
 * It dynamically injects the script and creates the necessary container.
 */
const AdsterraAd: React.FC<AdsterraAdProps> = ({
  adKey,
  width,
  height,
  format = 'iframe',
  className = ''
}) => {
  const adContainerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Create a global atOptions object if it doesn't exist
    if (!(window as any).atOptions) {
      (window as any).atOptions = {};
    }
    
    // Set the ad options for this specific ad
    (window as any).atOptions = {
      'key': adKey,
      'format': format,
      'height': height,
      'width': width,
      'params': {}
    };
    
    // Create and inject the script
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = `//www.highperformanceformat.com/${adKey}/invoke.js`;
    script.async = true;
    
    // Add the script to the container
    if (adContainerRef.current) {
      adContainerRef.current.appendChild(script);
    }
    
    // Cleanup function to remove the script when component unmounts
    return () => {
      if (adContainerRef.current && script.parentNode) {
        adContainerRef.current.removeChild(script);
      }
    };
  }, [adKey, width, height, format]);
  
  return (
    <div className={`adsterra-container relative overflow-hidden ${className}`}>
      <div className="absolute top-1 left-1 bg-black/10 text-xs px-1 rounded">
        Advertisement
      </div>
      <div 
        ref={adContainerRef} 
        className="w-full h-full"
        style={{ minHeight: `${height}px`, minWidth: `${width}px` }}
      />
    </div>
  );
};

export default AdsterraAd;
