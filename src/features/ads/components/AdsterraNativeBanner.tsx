import React, { useEffect, useRef } from 'react';

interface AdsterraNativeBannerProps {
  adKey: string;
  className?: string;
}

/**
 * AdsterraNativeBanner component
 * 
 * This component renders an Adsterra Native Banner advertisement using their provided script.
 * It dynamically injects the script and creates the necessary container div.
 */
const AdsterraNativeBanner: React.FC<AdsterraNativeBannerProps> = ({
  adKey,
  className = ''
}) => {
  const adContainerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Create and inject the script
    const script = document.createElement('script');
    script.async = true;
    script.setAttribute('data-cfasync', 'false');
    script.src = `//pl26675368.profitableratecpm.com/${adKey}/invoke.js`;
    
    // Add the script to the document
    document.head.appendChild(script);
    
    // Cleanup function to remove the script when component unmounts
    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, [adKey]);
  
  return (
    <div className={`adsterra-native-container relative ${className}`}>
      <div className="absolute top-1 left-1 bg-black/10 text-xs px-1 rounded z-10">
        Advertisement
      </div>
      <div id={`container-${adKey}`} className="w-full" />
    </div>
  );
};

export default AdsterraNativeBanner;
