import React, { useEffect, useState } from 'react';
import { useAdFrequency } from '../hooks/useAdFrequency';
import { useAdPreferences } from '../hooks/useAdPreferences';

interface AdsterraPopunderProps {
  scriptSrc: string;
}

/**
 * AdsterraPopunder component
 * 
 * This component loads an Adsterra Popunder advertisement.
 * It's designed to be included once in the app layout to work site-wide.
 * It respects user preferences and frequency limits.
 */
const AdsterraPopunder: React.FC<AdsterraPopunderProps> = ({
  scriptSrc
}) => {
  const [error, setError] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);
  
  // Ad frequency control - limit popunders to avoid annoying users
  const { shouldShowAd, recordImpression } = useAdFrequency();
  
  // Ad preferences - check if user allows popunders
  const { isAdTypeAllowed } = useAdPreferences();
  
  useEffect(() => {
    // Only show popunder if allowed by preferences and frequency
    const canShowPopunder = isAdTypeAllowed('interstitial') && shouldShowAd('popunder');
    
    if (!canShowPopunder) {
      console.log('Popunder ad blocked by preferences or frequency limits');
      return;
    }
    
    try {
      // Check if script already exists to prevent duplicates
      const existingScript = document.querySelector(`script[src="${scriptSrc}"]`);
      if (existingScript) {
        console.log('Adsterra Popunder script already exists');
        return;
      }
      
      // Create and inject the script
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = scriptSrc;
      script.async = true;
      script.onerror = (e) => {
        console.error('Error loading Adsterra Popunder script:', e);
        setError('Failed to load advertisement');
      };
      script.onload = () => {
        setLoaded(true);
        // Record impression for frequency limiting
        recordImpression('popunder', 'interstitial');
      };
      
      // Add the script to the document head
      document.head.appendChild(script);
      
      // Cleanup function to remove the script when component unmounts
      return () => {
        if (script.parentNode) {
          script.parentNode.removeChild(script);
        }
      };
    } catch (err) {
      console.error('Error setting up Adsterra Popunder:', err);
      setError('Failed to initialize advertisement');
    }
  }, [scriptSrc, isAdTypeAllowed, shouldShowAd, recordImpression]);
  
  // This component doesn't render anything visible
  return null;
};

export default AdsterraPopunder;
