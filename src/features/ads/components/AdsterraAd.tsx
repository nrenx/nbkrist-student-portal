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
 * It follows the official Adsterra implementation guidelines.
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
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      // Create a container ID for this specific ad
      const containerId = `atContainer-${adKey}`;

      // Clear any existing content in the container
      if (adContainerRef.current) {
        adContainerRef.current.innerHTML = '';
      }

      // Create the script element for atOptions
      const optionsScript = document.createElement('script');
      optionsScript.type = 'text/javascript';
      optionsScript.text = `
        atOptions = {
          'key' : '${adKey}',
          'format' : '${format}',
          'height' : ${height},
          'width' : ${width},
          'params' : {}
        };
      `;

      // Create the invoke script element
      const invokeScript = document.createElement('script');
      invokeScript.type = 'text/javascript';
      invokeScript.async = true;
      invokeScript.src = `//www.highperformanceformat.com/${adKey}/invoke.js`;
      invokeScript.onerror = (e) => {
        console.error('Error loading Adsterra script:', e);
        setError('Failed to load advertisement');
      };
      invokeScript.onload = () => {
        setIsLoaded(true);
        console.log(`Adsterra banner loaded successfully: ${adKey}`);
      };

      // Add scripts to the container in the correct order
      if (adContainerRef.current) {
        adContainerRef.current.appendChild(optionsScript);
        adContainerRef.current.appendChild(invokeScript);
      }

      return () => {
        // Clean up on unmount
        if (adContainerRef.current) {
          adContainerRef.current.innerHTML = '';
        }
      };
    } catch (err) {
      console.error('Error setting up Adsterra ad:', err);
      setError('Failed to initialize advertisement');
    }
  }, [adKey, width, height, format]);

  return (
    <div className={`adsterra-container relative overflow-hidden ${className}`} data-key={adKey}>
      <div className="absolute top-1 left-1 bg-black/10 text-xs px-1 rounded z-10">
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
        />
      )}
    </div>
  );
};

export default AdsterraAd;
