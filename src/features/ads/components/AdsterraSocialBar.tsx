import React, { useEffect, useRef, useState } from 'react';
import { useAdFrequency } from '../hooks/useAdFrequency';

interface AdsterraSocialBarProps {
  scriptSrc: string;
  className?: string;
  position?: 'bottom' | 'top'; // Position of the social bar
  trackImpression?: boolean; // Whether to track impressions for frequency limiting
}

/**
 * AdsterraSocialBar component
 *
 * This component renders an Adsterra Social Bar advertisement following official guidelines.
 * Social Bar is a mobile-specific ad format that appears at the bottom or top of the screen.
 *
 * Implementation follows Adsterra's official guidelines for Social Bar ads.
 */
const AdsterraSocialBar: React.FC<AdsterraSocialBarProps> = ({
  scriptSrc,
  className = '',
  position = 'bottom',
  trackImpression = true
}) => {
  const adContainerRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Ad frequency control
  const { recordImpression } = useAdFrequency();

  useEffect(() => {
    try {
      // Extract the unique identifier from the script src
      const scriptId = scriptSrc.split('/').pop()?.replace('.js', '') ||
                       `social-bar-${Math.random().toString(36).substring(2, 9)}`;

      // Check if script already exists to prevent duplicates
      const existingScript = document.querySelector(`script[src="${scriptSrc}"]`);
      if (existingScript) {
        console.log('Adsterra Social Bar script already exists, reusing it');
        return;
      }

      // Create and inject the script
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.setAttribute('data-cfasync', 'false'); // CloudFlare compatibility
      script.src = scriptSrc;
      script.async = true;

      // Add position attribute if specified
      if (position === 'top') {
        script.setAttribute('data-position', 'top');
      }

      script.onerror = (e) => {
        console.error('Error loading Adsterra Social Bar script:', e);
        setError('Failed to load advertisement');
      };

      script.onload = () => {
        setIsLoaded(true);
        console.log('Adsterra Social Bar loaded successfully');

        // Track impression for frequency limiting
        if (trackImpression) {
          recordImpression('socialbar', 'impression');
        }
      };

      // Add the script to the document head
      document.head.appendChild(script);

      // Cleanup function to remove the script when component unmounts
      return () => {
        // Only remove if this is the last instance using this script
        const remainingAds = document.querySelectorAll(`.adsterra-social-bar[data-script="${scriptSrc}"]`);
        if (remainingAds.length <= 1 && script.parentNode) {
          script.parentNode.removeChild(script);

          // Also remove any elements created by the Social Bar script
          const socialBarElements = document.querySelectorAll('.adsterra-social-bar-element');
          socialBarElements.forEach(element => {
            if (element.parentNode) {
              element.parentNode.removeChild(element);
            }
          });
        }
      };
    } catch (err) {
      console.error('Error setting up Adsterra Social Bar:', err);
      setError('Failed to initialize advertisement');
    }
  }, [scriptSrc, position, trackImpression, recordImpression]);

  // Social Bar is typically injected directly into the body by the script
  // This component serves as a placeholder and script loader
  return (
    <div
      className={`adsterra-social-bar relative ${className}`}
      data-script={scriptSrc}
      ref={adContainerRef}
    >
      <div className="absolute top-1 left-1 bg-black/10 text-xs px-1 rounded z-10">
        Advertisement
      </div>
      {error && (
        <div className="w-full h-[50px] flex items-center justify-center bg-gray-100 text-gray-400 text-sm">
          Ad could not be loaded
        </div>
      )}
      {/* The actual Social Bar will be injected by the script into the body */}
    </div>
  );
};

export default AdsterraSocialBar;
