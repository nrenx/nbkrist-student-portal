
import * as React from "react";

type AdNetwork = 'default' | 'google' | 'facebook' | 'amazon' | 'taboola' | 'outbrain';

interface UseAdNetworksProps {
  networks?: AdNetwork[];
  onInitialized?: (network: AdNetwork) => void;
  onError?: (network: AdNetwork, error: any) => void;
}

export function useAdNetworks({ 
  networks = ['default'], 
  onInitialized,
  onError 
}: UseAdNetworksProps = {}) {
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
  
  // Load network script
  const loadNetworkScript = React.useCallback(async (network: AdNetwork): Promise<boolean> => {
    return new Promise((resolve) => {
      // If already initialized, return true
      if (initializedNetworks[network]) {
        resolve(true);
        return;
      }
      
      // Network-specific script loading
      let scriptUrl = '';
      let scriptId = `${network}-ad-script`;
      
      // Don't add script again if it already exists
      if (document.getElementById(scriptId)) {
        resolve(true);
        return;
      }
      
      // Set script URL based on network
      switch (network) {
        case 'google':
          scriptUrl = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js';
          break;
        case 'facebook':
          scriptUrl = 'https://connect.facebook.net/en_US/fbadnw.js';
          break;
        case 'amazon':
          scriptUrl = 'https://c.amazon-adsystem.com/aax2/apstag.js';
          break;
        case 'taboola':
          scriptUrl = 'https://cdn.taboola.com/libtrc/example-publisher/loader.js';
          break;
        case 'outbrain':
          scriptUrl = 'https://widgets.outbrain.com/outbrain.js';
          break;
        default:
          // No script needed for default/custom
          resolve(true);
          return;
      }
      
      try {
        const script = document.createElement('script');
        script.id = scriptId;
        script.src = scriptUrl;
        script.async = true;
        
        script.onload = () => {
          console.log(`${network} ad network script loaded successfully`);
          setInitializedNetworks(prev => ({ ...prev, [network]: true }));
          if (onInitialized) onInitialized(network);
          resolve(true);
        };
        
        script.onerror = (e) => {
          console.error(`Error loading ${network} ad network script:`, e);
          if (onError) onError(network, e);
          resolve(false);
        };
        
        document.head.appendChild(script);
      } catch (err) {
        console.error(`Error setting up ${network} ad network:`, err);
        if (onError) onError(network, err);
        resolve(false);
      }
    });
  }, [initializedNetworks, onInitialized, onError]);
  
  // Initialize all specified networks
  const initializeNetworks = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const results = await Promise.all(
        networks.map(network => loadNetworkScript(network))
      );
      
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
  }, [networks, loadNetworkScript]);
  
  // Initialize networks on mount
  React.useEffect(() => {
    initializeNetworks();
  }, [initializeNetworks]);
  
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
    reinitialize: initializeNetworks
  };
}
