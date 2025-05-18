import React, { useEffect, useRef, useState } from 'react';

interface AdsterraDirectLinkProps {
  url: string;
  className?: string;
  buttonText?: string;
}

/**
 * AdsterraDirectLink component
 * 
 * This component renders an Adsterra Direct Link advertisement as a button.
 * When clicked, it opens the Direct Link URL.
 */
const AdsterraDirectLink: React.FC<AdsterraDirectLinkProps> = ({
  url,
  className = '',
  buttonText = 'Learn More'
}) => {
  const [error, setError] = useState<string | null>(null);
  
  const handleClick = () => {
    try {
      // Open the Direct Link URL in a new tab
      window.open(url, '_blank');
    } catch (err) {
      console.error('Error opening Direct Link:', err);
      setError('Failed to open link');
    }
  };
  
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
