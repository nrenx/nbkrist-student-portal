import { useState, useEffect } from 'react';

export type AdPreferenceType = 'all' | 'standard' | 'interstitial' | 'exit-intent' | 'push-notification' | 'floating-footer' | 'sticky';

interface AdPreferences {
  disabledTypes: AdPreferenceType[];
  reducedMotion: boolean;
  preferredNetworks?: string[];
}

const DEFAULT_PREFERENCES: AdPreferences = {
  disabledTypes: [],
  reducedMotion: false,
};

export function useAdPreferences() {
  const [preferences, setPreferences] = useState<AdPreferences>(DEFAULT_PREFERENCES);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load preferences from localStorage on mount
  useEffect(() => {
    try {
      const storedPreferences = localStorage.getItem('ad_preferences');
      if (storedPreferences) {
        setPreferences(JSON.parse(storedPreferences));
      }
      setIsInitialized(true);
    } catch (error) {
      console.error('Error loading ad preferences:', error);
      setIsInitialized(true);
    }
  }, []);

  // Save preferences to localStorage whenever they change
  useEffect(() => {
    if (isInitialized) {
      try {
        localStorage.setItem('ad_preferences', JSON.stringify(preferences));
      } catch (error) {
        console.error('Error saving ad preferences:', error);
      }
    }
  }, [preferences, isInitialized]);

  // Check if an ad type is allowed based on user preferences
  const isAdTypeAllowed = (adType: AdPreferenceType): boolean => {
    if (!isInitialized) return true;
    
    // If 'all' is disabled, no ads are allowed
    if (preferences.disabledTypes.includes('all')) return false;
    
    // Check if this specific type is disabled
    return !preferences.disabledTypes.includes(adType);
  };

  // Toggle a specific ad type preference
  const toggleAdType = (adType: AdPreferenceType): void => {
    setPreferences(prev => {
      const isCurrentlyDisabled = prev.disabledTypes.includes(adType);
      
      if (isCurrentlyDisabled) {
        // Enable this ad type
        return {
          ...prev,
          disabledTypes: prev.disabledTypes.filter(type => type !== adType)
        };
      } else {
        // Disable this ad type
        return {
          ...prev,
          disabledTypes: [...prev.disabledTypes, adType]
        };
      }
    });
  };

  // Toggle reduced motion preference
  const toggleReducedMotion = (): void => {
    setPreferences(prev => ({
      ...prev,
      reducedMotion: !prev.reducedMotion
    }));
  };

  // Set preferred networks
  const setPreferredNetworks = (networks: string[]): void => {
    setPreferences(prev => ({
      ...prev,
      preferredNetworks: networks
    }));
  };

  // Reset all preferences to default
  const resetPreferences = (): void => {
    setPreferences(DEFAULT_PREFERENCES);
  };

  return {
    preferences,
    isAdTypeAllowed,
    toggleAdType,
    toggleReducedMotion,
    setPreferredNetworks,
    resetPreferences,
    isInitialized
  };
}
