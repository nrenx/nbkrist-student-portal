import React, { useEffect, useRef, useState } from 'react';

interface AdsterraNativeBannerProps {
  adKey: string;
  className?: string;
  widgetLayout?: string; // e.g., "1:1", "2:2", "3:1", "4:1"
  fontSize?: string; // e.g., "inherit", "14px", "16px", "18px", "20px"
  fontColor?: string; // e.g., "inherit", "#000000", "#333333"
}

/**
 * AdsterraNativeBanner component
 *
 * This component renders an Adsterra Native Banner advertisement.
 * It follows the official Adsterra Native Banner implementation guidelines.
 *
 * Widget Layout options: "1:1", "2:2", "3:1", "4:1"
 * Font Size options: "inherit", "14px", "16px", "18px", "20px"
 * Font Color options: "inherit", "#000000", "#333333", etc.
 */
const AdsterraNativeBanner: React.FC<AdsterraNativeBannerProps> = ({
  adKey,
  className = '',
  widgetLayout = '2:2', // Default layout
  fontSize = 'inherit', // Default font size
  fontColor = 'inherit' // Default font color
}) => {
  const adContainerRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      // Clear any existing content in the container
      if (adContainerRef.current) {
        adContainerRef.current.innerHTML = '';
      }

      // Create the script element with the correct parameters
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.setAttribute('data-cfasync', 'false');
      script.async = true;

      // Set the correct URL with parameters for Native Banner
      // Format: //pl26675368.profitableratecpm.com/KEY/invoke.js?widget-layout=X:X&font-size=XXpx&font-color=XXXXXX
      let scriptUrl = `//pl26675368.profitableratecpm.com/${adKey}/invoke.js`;

      // Add parameters if provided
      const params = [];
      if (widgetLayout) params.push(`widget-layout=${widgetLayout}`);
      if (fontSize) params.push(`font-size=${fontSize}`);
      if (fontColor && fontColor !== 'inherit') {
        // Remove # from hex color if present
        const color = fontColor.startsWith('#') ? fontColor.substring(1) : fontColor;
        params.push(`font-color=${color}`);
      }

      if (params.length > 0) {
        scriptUrl += `?${params.join('&')}`;
      }

      script.src = scriptUrl;

      script.onerror = (e) => {
        console.error('Error loading Adsterra Native Banner script:', e);
        setError('Failed to load advertisement');
      };

      script.onload = () => {
        setIsLoaded(true);
        console.log(`Adsterra Native Banner loaded successfully: ${adKey}`);
      };

      // Add the script to the container
      if (adContainerRef.current) {
        adContainerRef.current.appendChild(script);
      }

      return () => {
        // Clean up on unmount
        if (adContainerRef.current) {
          adContainerRef.current.innerHTML = '';
        }
      };
    } catch (err) {
      console.error('Error setting up Adsterra Native Banner:', err);
      setError('Failed to initialize advertisement');
    }
  }, [adKey, widgetLayout, fontSize, fontColor]);

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
        <div
          ref={adContainerRef}
          className="w-full"
          style={{ minHeight: '250px' }}
        />
      )}
    </div>
  );
};

export default AdsterraNativeBanner;
