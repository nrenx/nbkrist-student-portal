import React, { useEffect, useState } from 'react';
import { useAdFrequency } from '../hooks/useAdFrequency';
import { useAdPreferences } from '../hooks/useAdPreferences';

interface AdsterraPopunderProps {
  scriptSrc: string;
  adKey?: string; // Optional ad key for direct implementation
  exitIntent?: boolean; // Whether to show on exit intent only
}

/**
 * AdsterraPopunder component
 *
 * This component loads an Adsterra Popunder advertisement following official guidelines.
 * It's designed to be included once in the app layout to work site-wide.
 * It respects user preferences and frequency limits.
 *
 * Implementation follows Adsterra's official guidelines for Popunder ads.
 */
const AdsterraPopunder: React.FC<AdsterraPopunderProps> = ({
  scriptSrc,
  adKey,
  exitIntent = false
}) => {
  const [error, setError] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);

  // Ad frequency control - limit popunders to avoid annoying users
  const { shouldShowAd, recordImpression } = useAdFrequency();

  // Ad preferences - check if user allows popunders
  const { isAdTypeAllowed } = useAdPreferences();

  useEffect(() => {
    // Only show popunder if allowed by preferences and frequency
    const canShowPopunder = isAdTypeAllowed('interstitial') && shouldShowAd('popunder', 'interstitial');

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

      // For direct implementation with adKey
      if (adKey) {
        // Create the atOptions script
        const optionsScript = document.createElement('script');
        optionsScript.type = 'text/javascript';
        optionsScript.text = `
          atOptions = {
            'key' : '${adKey}',
            'format' : 'iframe',
            'height' : 60,
            'width' : 468,
            'params' : ${JSON.stringify(exitIntent ? { exitIntent: true } : {})}
          };
        `;
        document.head.appendChild(optionsScript);

        // Create the invoke script
        const invokeScript = document.createElement('script');
        invokeScript.type = 'text/javascript';
        invokeScript.async = true;
        invokeScript.src = `//www.highperformanceformat.com/${adKey}/invoke.js`;
        invokeScript.onerror = (e) => {
          console.error('Error loading Adsterra Popunder script:', e);
          setError('Failed to load advertisement');
        };
        invokeScript.onload = () => {
          setLoaded(true);
          recordImpression('popunder', 'interstitial');
          console.log('Adsterra Popunder loaded successfully');
        };

        document.head.appendChild(invokeScript);

        return () => {
          if (optionsScript.parentNode) optionsScript.parentNode.removeChild(optionsScript);
          if (invokeScript.parentNode) invokeScript.parentNode.removeChild(invokeScript);
        };
      }
      // For script URL implementation
      else {
        // Create and inject the script
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = scriptSrc;
        script.async = true;
        script.setAttribute('data-cfasync', 'false'); // CloudFlare compatibility
        script.onerror = (e) => {
          console.error('Error loading Adsterra Popunder script:', e);
          setError('Failed to load advertisement');
        };
        script.onload = () => {
          setLoaded(true);
          // Record impression for frequency limiting
          recordImpression('popunder', 'interstitial');
          console.log('Adsterra Popunder loaded successfully');
        };

        // Add the script to the document head
        document.head.appendChild(script);

        // Cleanup function to remove the script when component unmounts
        return () => {
          if (script.parentNode) {
            script.parentNode.removeChild(script);
          }
        };
      }
    } catch (err) {
      console.error('Error setting up Adsterra Popunder:', err);
      setError('Failed to initialize advertisement');
    }
  }, [scriptSrc, adKey, exitIntent, isAdTypeAllowed, shouldShowAd, recordImpression]);

  // This component doesn't render anything visible
  return null;
};

export default AdsterraPopunder;
