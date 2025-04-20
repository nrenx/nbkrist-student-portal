import * as React from "react";
import { useAdPreferences } from "@/features/ads";

export type AdNetwork = 'default' | 'google' | 'facebook' | 'amazon' | 'taboola' | 'outbrain';

interface UseAdNetworksProps {
  networks?: AdNetwork[];
  onInitialized?: (network: AdNetwork) => void;
  onError?: (network: AdNetwork, error: any) => void;
  staggerDelay?: number; // Delay between loading scripts in ms
  respectPreferences?: boolean; // Whether to respect user ad preferences
  retryOnError?: boolean; // Whether to retry loading on error
  maxRetries?: number; // Maximum number of retries
}

export function useAdNetworks({
  networks = ['default'],
  onInitialized,
  onError,
  staggerDelay = 300, // Default 300ms delay between scripts
  respectPreferences = true,
  retryOnError = true,
  maxRetries = 2
}: UseAdNetworksProps = {}) {
  // Get user preferences if enabled
  const { preferences, isInitialized: preferencesInitialized } = useAdPreferences();
  const [initializedNetworks, setInitializedNetworks] = React.useState<Record<AdNetwork, boolean>>({
    default: false,
    google: false,
    facebook: false,
    amazon: false,
    taboola: false,
    outbrain: false
  });

  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [retryCount, setRetryCount] = React.useState<Record<AdNetwork, number>>({
    default: 0,
    google: 0,
    facebook: 0,
    amazon: 0,
    taboola: 0,
    outbrain: 0
  });
  const [networkScripts, setNetworkScripts] = React.useState<Record<string, HTMLScriptElement>>({});

  // Get network script URL
  const getNetworkScriptUrl = (network: AdNetwork): string => {
    switch (network) {
      case 'google':
        return 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7831792005606531';
      case 'facebook':
        return 'https://connect.facebook.net/en_US/fbadnw.js';
      case 'amazon':
        return 'https://c.amazon-adsystem.com/aax2/apstag.js';
      case 'taboola':
        return 'https://cdn.taboola.com/libtrc/example-publisher/loader.js';
      case 'outbrain':
        return 'https://widgets.outbrain.com/outbrain.js';
      default:
        return '';
    }
  };

  // Check if a network should be loaded based on user preferences
  const shouldLoadNetwork = React.useCallback((network: AdNetwork): boolean => {
    if (!respectPreferences || !preferencesInitialized) return true;

    // If user has preferred networks set, only load those
    if (preferences.preferredNetworks && preferences.preferredNetworks.length > 0) {
      return preferences.preferredNetworks.includes(network);
    }

    return true;
  }, [respectPreferences, preferencesInitialized, preferences]);

  // Load network script with conflict prevention and retry logic
  const loadNetworkScript = React.useCallback(async (network: AdNetwork): Promise<boolean> => {
    return new Promise((resolve) => {
      // If already initialized, return true
      if (initializedNetworks[network]) {
        resolve(true);
        return;
      }

      // Skip if user preferences indicate this network shouldn't be loaded
      if (!shouldLoadNetwork(network)) {
        console.log(`Skipping ${network} ad network due to user preferences`);
        resolve(false);
        return;
      }

      // Network-specific script loading
      const scriptUrl = getNetworkScriptUrl(network);
      const scriptId = `${network}-ad-script`;

      // No script needed for default/custom
      if (network === 'default' || scriptUrl === '') {
        setInitializedNetworks(prev => ({ ...prev, [network]: true }));
        if (onInitialized) onInitialized(network);
        resolve(true);
        return;
      }

      // Don't add script again if it already exists
      if (document.getElementById(scriptId)) {
        // If script exists but network isn't marked as initialized, mark it now
        if (!initializedNetworks[network]) {
          setInitializedNetworks(prev => ({ ...prev, [network]: true }));
          if (onInitialized) onInitialized(network);
        }
        resolve(true);
        return;
      }

      try {
        // Create a script element with error handling
        const script = document.createElement('script');
        script.id = scriptId;
        script.src = scriptUrl;
        script.async = true;
        script.defer = true; // Add defer to prevent blocking

        // Add crossorigin for Google AdSense
        if (network === 'google') {
          script.setAttribute('crossorigin', 'anonymous');
        }

        // Add data attributes to help with debugging
        script.setAttribute('data-ad-network', network);
        script.setAttribute('data-load-timestamp', Date.now().toString());

        // Store the script element for potential cleanup
        setNetworkScripts(prev => ({ ...prev, [network]: script }));

        // Set up load handler
        script.onload = () => {
          console.log(`${network} ad network script loaded successfully`);
          setInitializedNetworks(prev => ({ ...prev, [network]: true }));
          if (onInitialized) onInitialized(network);
          resolve(true);
        };

        // Set up error handler with retry logic
        script.onerror = (e) => {
          console.error(`Error loading ${network} ad network script:`, e);

          // Check if we should retry
          const currentRetryCount = retryCount[network] || 0;
          if (retryOnError && currentRetryCount < maxRetries) {
            console.log(`Retrying ${network} ad network script (attempt ${currentRetryCount + 1}/${maxRetries})`);

            // Remove the failed script
            if (script.parentNode) {
              script.parentNode.removeChild(script);
            }

            // Increment retry count
            setRetryCount(prev => ({ ...prev, [network]: currentRetryCount + 1 }));

            // Retry after a delay
            setTimeout(() => {
              loadNetworkScript(network).then(resolve);
            }, 2000); // 2 second delay before retry

            return;
          }

          if (onError) onError(network, e);
          resolve(false);
        };

        // Add the script to the document
        document.head.appendChild(script);
      } catch (err) {
        console.error(`Error setting up ${network} ad network:`, err);
        if (onError) onError(network, err);
        resolve(false);
      }
    });
  }, [initializedNetworks, onInitialized, onError, retryCount, retryOnError, maxRetries, shouldLoadNetwork]);

  // Initialize networks with staggered loading to prevent conflicts
  const initializeNetworks = React.useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Filter networks based on user preferences
      const networksToLoad = networks.filter(shouldLoadNetwork);

      // Load networks one by one with a delay between each
      const results = [];
      for (const network of networksToLoad) {
        const result = await loadNetworkScript(network);
        results.push(result);

        // Add delay between script loads to prevent conflicts
        if (staggerDelay > 0 && network !== networksToLoad[networksToLoad.length - 1]) {
          await new Promise(resolve => setTimeout(resolve, staggerDelay));
        }
      }

      // Check if any network failed to load
      if (results.some(result => !result)) {
        setError('Some ad networks failed to initialize');
      }
    } catch (err) {
      console.error('Error initializing ad networks:', err);
      setError('Failed to initialize ad networks');
    } finally {
      setLoading(false);
    }
  }, [networks, loadNetworkScript, staggerDelay, shouldLoadNetwork]);

  // Initialize networks on mount and when preferences change
  React.useEffect(() => {
    // Only initialize once preferences are loaded
    if (preferencesInitialized) {
      initializeNetworks();
    }
  }, [initializeNetworks, preferencesInitialized]);

  // Cleanup function to remove scripts on unmount
  React.useEffect(() => {
    return () => {
      // Clean up any scripts that might cause conflicts
      Object.values(networkScripts).forEach(script => {
        if (script && script.parentNode) {
          script.parentNode.removeChild(script);
        }
      });
    };
  }, [networkScripts]);

  // Check if a specific network is initialized
  const isNetworkInitialized = React.useCallback(
    (network: AdNetwork) => initializedNetworks[network],
    [initializedNetworks]
  );

  return {
    initializedNetworks,
    loading,
    error,
    isNetworkInitialized,
    reinitialize: initializeNetworks,
    retryCount
  };
}
