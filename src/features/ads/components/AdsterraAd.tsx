import React, { useEffect, useRef, useState } from 'react';

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
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      // Create a unique ID for this ad instance
      const uniqueId = `adsterra-${adKey}-${Math.random().toString(36).substring(2, 9)}`;

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

      // Check if script already exists to prevent duplicates
      const existingScript = document.querySelector(`script[src*="${adKey}/invoke.js"]`);
      if (existingScript) {
        console.log('Adsterra script already exists, reusing it');
        return;
      }

      // Create and inject the script
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = `//www.highperformanceformat.com/${adKey}/invoke.js`;
      script.async = true;
      script.onerror = (e) => {
        console.error('Error loading Adsterra script:', e);
        setError('Failed to load advertisement');
      };

      // Add the script to the document head instead of the container
      document.head.appendChild(script);

      // Cleanup function to remove the script when component unmounts
      return () => {
        // Only remove if this is the last instance using this script
        const remainingAds = document.querySelectorAll(`.adsterra-container[data-key="${adKey}"]`);
        if (remainingAds.length <= 1 && script.parentNode) {
          script.parentNode.removeChild(script);
        }
      };
    } catch (err) {
      console.error('Error setting up Adsterra ad:', err);
      setError('Failed to initialize advertisement');
    }
  }, [adKey, width, height, format]);

  return (
    <div className={`adsterra-container relative overflow-hidden ${className}`} data-key={adKey}>
      <div className="absolute top-1 left-1 bg-black/10 text-xs px-1 rounded">
        Advertisement
      </div>
      {error ? (
        <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400 text-sm">
          Ad could not be loaded
        </div>
      ) : (
        <div
          ref={adContainerRef}
          className="w-full h-full"
          style={{ minHeight: `${height}px`, minWidth: `${width}px` }}
        >
          <div id={`container-${adKey}`} />
        </div>
      )}
    </div>
  );
};

export default AdsterraAd;
