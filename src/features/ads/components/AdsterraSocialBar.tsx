import React, { useEffect, useRef, useState } from 'react';

interface AdsterraSocialBarProps {
  scriptSrc: string;
  className?: string;
}

/**
 * AdsterraSocialBar component
 * 
 * This component renders an Adsterra Social Bar advertisement using their provided script.
 * It dynamically injects the script and creates the necessary container.
 */
const AdsterraSocialBar: React.FC<AdsterraSocialBarProps> = ({
  scriptSrc,
  className = ''
}) => {
  const adContainerRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);
  
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
      script.src = scriptSrc;
      script.async = true;
      script.onerror = (e) => {
        console.error('Error loading Adsterra Social Bar script:', e);
        setError('Failed to load advertisement');
      };
      
      // Add the script to the document head
      document.head.appendChild(script);
      
      // Cleanup function to remove the script when component unmounts
      return () => {
        // Only remove if this is the last instance using this script
        const remainingAds = document.querySelectorAll(`.adsterra-social-bar[data-script="${scriptSrc}"]`);
        if (remainingAds.length <= 1 && script.parentNode) {
          script.parentNode.removeChild(script);
        }
      };
    } catch (err) {
      console.error('Error setting up Adsterra Social Bar:', err);
      setError('Failed to initialize advertisement');
    }
  }, [scriptSrc]);
  
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
    </div>
  );
};

export default AdsterraSocialBar;
