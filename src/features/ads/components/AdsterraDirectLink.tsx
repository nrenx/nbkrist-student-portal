import React, { useEffect, useRef, useState } from 'react';
import { useAdFrequency } from '../hooks/useAdFrequency';

interface AdsterraDirectLinkProps {
  url: string;
  className?: string;
  buttonText?: string;
  adKey?: string; // Optional ad key for direct implementation
  trackImpression?: boolean; // Whether to track impressions for frequency limiting
}

/**
 * AdsterraDirectLink component
 *
 * This component renders an Adsterra Direct Link advertisement following official guidelines.
 * It can be implemented either as a button with a direct URL or using Adsterra's script.
 *
 * Implementation follows Adsterra's official guidelines for Direct Link ads.
 */
const AdsterraDirectLink: React.FC<AdsterraDirectLinkProps> = ({
  url,
  className = '',
  buttonText = 'Learn More',
  adKey,
  trackImpression = true
}) => {
  const [error, setError] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Ad frequency control
  const { recordImpression } = useAdFrequency();

  // Handle direct URL implementation
  const handleClick = () => {
    try {
      // Open the Direct Link URL in a new tab
      window.open(url, '_blank');

      // Track click for analytics if needed
      if (trackImpression) {
        recordImpression('directlink', 'click');
      }
    } catch (err) {
      console.error('Error opening Direct Link:', err);
      setError('Failed to open link');
    }
  };

  // Handle script-based implementation
  useEffect(() => {
    // Only run script implementation if adKey is provided
    if (!adKey) return;

    try {
      // Clear any existing content in the container
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }

      // Create the script element
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.async = true;
      script.setAttribute('data-cfasync', 'false');

      // Set the correct URL for Direct Link
      script.src = `//www.profitableratecpm.com/${adKey}`;

      script.onerror = (e) => {
        console.error('Error loading Adsterra Direct Link script:', e);
        setError('Failed to load advertisement');
      };

      script.onload = () => {
        setIsLoaded(true);
        console.log(`Adsterra Direct Link loaded successfully: ${adKey}`);

        // Track impression for frequency limiting
        if (trackImpression) {
          recordImpression('directlink', 'impression');
        }
      };

      // Add the script to the container
      if (containerRef.current) {
        containerRef.current.appendChild(script);
      }

      return () => {
        // Clean up on unmount
        if (containerRef.current) {
          containerRef.current.innerHTML = '';
        }
      };
    } catch (err) {
      console.error('Error setting up Adsterra Direct Link:', err);
      setError('Failed to initialize advertisement');
    }
  }, [adKey, trackImpression, recordImpression]);

  // If using script implementation with adKey
  if (adKey) {
    return (
      <div className={`adsterra-direct-link-container relative ${className}`}>
        <div className="absolute top-1 left-1 bg-black/10 text-xs px-1 rounded z-10">
          Advertisement
        </div>
        {error ? (
          <div className="w-full p-4 flex items-center justify-center bg-gray-100 text-gray-400 text-sm">
            Ad could not be loaded
          </div>
        ) : (
          <div
            ref={containerRef}
            className="w-full min-h-[60px]"
          />
        )}
      </div>
    );
  }

  // If using direct URL implementation
  return (
    <div className={`adsterra-direct-link-container relative ${className}`}>
      <div className="absolute top-1 left-1 bg-black/10 text-xs px-1 rounded z-10">
        Advertisement
      </div>
      {error ? (
        <div className="w-full p-4 flex items-center justify-center bg-gray-100 text-gray-400 text-sm">
          Ad could not be loaded
        </div>
      ) : (
        <button
          onClick={handleClick}
          className="w-full py-3 px-4 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-md transition-colors flex items-center justify-center"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 7l5 5m0 0l-5 5m5-5H6"
            />
          </svg>
          {buttonText}
        </button>
      )}
    </div>
  );
};

export default AdsterraDirectLink;
