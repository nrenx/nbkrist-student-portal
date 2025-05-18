import React, { useEffect, useRef, useState } from 'react';

interface AdsterraDirectImplementationProps {
  adKey: string;
  width: number;
  height: number;
  className?: string;
  format?: 'iframe' | 'img'; // Format of the ad
  adType?: 'banner' | 'native' | 'popunder' | 'social' | 'direct'; // Type of ad for logging
}

/**
 * AdsterraDirectImplementation component
 *
 * This component implements Adsterra ads using the exact code provided by Adsterra.
 * It follows the official Adsterra implementation guidelines with no customization.
 *
 * This is the most reliable implementation and should be used for testing or when
 * other implementations fail.
 */
const AdsterraDirectImplementation: React.FC<AdsterraDirectImplementationProps> = ({
  adKey,
  width,
  height,
  className = '',
  format = 'iframe',
  adType = 'banner'
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    try {
      // Clear any existing content
      containerRef.current.innerHTML = '';

      // Create a unique container ID
      const containerId = `adsterra-container-${adKey}`;
      const containerDiv = document.createElement('div');
      containerDiv.id = containerId;
      containerRef.current.appendChild(containerDiv);

      // Create the script element exactly as provided by Adsterra
      const scriptElement = document.createElement('script');
      scriptElement.type = 'text/javascript';
      scriptElement.text = `
        atOptions = {
          'key' : '${adKey}',
          'format' : '${format}',
          'height' : ${height},
          'width' : ${width},
          'params' : {}
        };
      `;
      containerRef.current.appendChild(scriptElement);

      // Create the second script element
      const scriptElement2 = document.createElement('script');
      scriptElement2.type = 'text/javascript';
      scriptElement2.setAttribute('data-cfasync', 'false'); // CloudFlare compatibility
      scriptElement2.src = `//www.highperformanceformat.com/${adKey}/invoke.js`;
      scriptElement2.async = true;

      scriptElement2.onload = () => {
        setIsLoaded(true);
        console.log(`Adsterra ${adType} loaded successfully (direct implementation): ${adKey}`);
      };

      scriptElement2.onerror = (e) => {
        console.error(`Error loading Adsterra ${adType} script (direct implementation):`, e);
        setError('Failed to load advertisement');
      };

      containerRef.current.appendChild(scriptElement2);

      return () => {
        // Clean up on unmount
        if (containerRef.current) {
          containerRef.current.innerHTML = '';
        }
      };
    } catch (err) {
      console.error(`Error setting up Adsterra ${adType} (direct implementation):`, err);
      setError('Failed to initialize advertisement');
    }
  }, [adKey, width, height, format, adType]);

  return (
    <div className={`adsterra-direct-implementation relative ${className}`}>
      <div className="absolute top-1 left-1 bg-black/10 text-xs px-1 rounded z-10">
        Advertisement
      </div>
      {error ? (
        <div className="w-full flex items-center justify-center bg-gray-100 text-gray-400 text-sm"
             style={{ minHeight: `${height}px`, minWidth: `${width}px` }}>
          Ad could not be loaded
        </div>
      ) : (
        <div
          ref={containerRef}
          className="w-full"
          style={{ minHeight: `${height}px`, minWidth: `${width}px` }}
        />
      )}
    </div>
  );
};

export default AdsterraDirectImplementation;
