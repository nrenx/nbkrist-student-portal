import React, { useEffect, useRef, useState } from 'react';

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
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      // Create a unique ID for this ad instance
      const uniqueId = `adsterra-native-${adKey}-${Math.random().toString(36).substring(2, 9)}`;

      // Check if script already exists to prevent duplicates
      const existingScript = document.querySelector(`script[src*="${adKey}/invoke.js"]`);
      if (existingScript) {
        console.log('Adsterra Native Banner script already exists, reusing it');
        return;
      }

      // Create and inject the script
      const script = document.createElement('script');
      script.async = true;
      script.setAttribute('data-cfasync', 'false');
      script.src = `//pl26675368.profitableratecpm.com/${adKey}/invoke.js`;
      script.onerror = (e) => {
        console.error('Error loading Adsterra Native Banner script:', e);
        setError('Failed to load advertisement');
      };

      // Add the script to the document head
      document.head.appendChild(script);

      // Cleanup function to remove the script when component unmounts
      return () => {
        // Only remove if this is the last instance using this script
        const remainingAds = document.querySelectorAll(`.adsterra-native-container[data-key="${adKey}"]`);
        if (remainingAds.length <= 1 && script.parentNode) {
          script.parentNode.removeChild(script);
        }
      };
    } catch (err) {
      console.error('Error setting up Adsterra Native Banner:', err);
      setError('Failed to initialize advertisement');
    }
  }, [adKey]);

  return (
    <div className={`adsterra-native-container relative ${className}`} data-key={adKey}>
      <div className="absolute top-1 left-1 bg-black/10 text-xs px-1 rounded z-10">
        Advertisement
      </div>
      {error ? (
        <div className="w-full min-h-[250px] flex items-center justify-center bg-gray-100 text-gray-400 text-sm">
          Ad could not be loaded
        </div>
      ) : (
        <div id={`container-${adKey}`} className="w-full" />
      )}
    </div>
  );
};

export default AdsterraNativeBanner;
