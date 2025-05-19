import { useState, useEffect } from 'react';

// Define the ad spaces that should be hidden
// This can be expanded in the future as needed
export interface AdVisibilityConfig {
  // Key is the ad label or identifier, value is whether it should be visible
  [key: string]: boolean;
}

// Default configuration - all placeholders are hidden by default
// Active ad spaces should be explicitly set to true
const DEFAULT_VISIBILITY_CONFIG: AdVisibilityConfig = {
  // Currently active ads
  'Top Banner Ad': true,
  'In-content Blog Ad': true,
  
  // Reserved for future use (hidden)
  'Pre-search Mobile Ad (Removed duplicate)': false,
  'Post-search Ad': false,
  'Side Ad (Left)': false,
  'Side Ad (Right) (Removed duplicate)': false,
  'Mobile In-content Ad (Removed duplicate)': false,
  'Bottom Banner Ad (Removed duplicate)': false,
  'Mobile Sticky Ad (Removed duplicate)': false,
  'Blog Top Banner Ad': false,
  'Blog Bottom Banner Ad': false,
  'Blog Sidebar Ad': false,
  'Blog Post Sidebar Ad': false,
  'Mobile Blog Post Ad': false,
  'Post-Blog Ad': false,
  'Related Content Ad': false,
  'In-content Logo Ad': false,
};

export function useAdVisibility() {
  const [visibilityConfig, setVisibilityConfig] = useState<AdVisibilityConfig>(DEFAULT_VISIBILITY_CONFIG);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load visibility config from localStorage on mount
  useEffect(() => {
    try {
      const storedConfig = localStorage.getItem('ad_visibility_config');
      if (storedConfig) {
        setVisibilityConfig(JSON.parse(storedConfig));
      }
      setIsInitialized(true);
    } catch (error) {
      console.error('Error loading ad visibility config:', error);
      setIsInitialized(true);
    }
  }, []);

  // Save visibility config to localStorage whenever it changes
  useEffect(() => {
    if (isInitialized) {
      try {
        localStorage.setItem('ad_visibility_config', JSON.stringify(visibilityConfig));
      } catch (error) {
        console.error('Error saving ad visibility config:', error);
      }
    }
  }, [visibilityConfig, isInitialized]);

  // Check if an ad space should be visible
  const isAdSpaceVisible = (label: string): boolean => {
    if (!isInitialized) return false; // Default to hidden while loading
    
    // If the label is not in the config, default to hidden
    return visibilityConfig[label] || false;
  };

  // Set visibility for a specific ad space
  const setAdSpaceVisibility = (label: string, isVisible: boolean): void => {
    setVisibilityConfig(prev => ({
      ...prev,
      [label]: isVisible
    }));
  };

  // Set visibility for multiple ad spaces at once
  const updateVisibilityConfig = (newConfig: Partial<AdVisibilityConfig>): void => {
    setVisibilityConfig(prev => ({
      ...prev,
      ...newConfig
    }));
  };

  // Reset to default visibility config
  const resetVisibilityConfig = (): void => {
    setVisibilityConfig(DEFAULT_VISIBILITY_CONFIG);
  };

  return {
    visibilityConfig,
    isAdSpaceVisible,
    setAdSpaceVisibility,
    updateVisibilityConfig,
    resetVisibilityConfig,
    isInitialized
  };
}
