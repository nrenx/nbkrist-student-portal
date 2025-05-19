import { useState, useEffect } from 'react';

type AdType = 'sticky' | 'standard' | 'interstitial' | 'exit-intent' | 'push-notification' | 'floating-footer';

interface AdFrequencyConfig {
  maxImpressions: number;
  timeWindow: number; // in hours
}

// Default frequency limits for different ad types
const DEFAULT_FREQUENCY_LIMITS: Record<AdType, AdFrequencyConfig> = {
  'sticky': { maxImpressions: 5, timeWindow: 24 }, // 5 per day
  'standard': { maxImpressions: 10, timeWindow: 24 }, // 10 per day
  'interstitial': { maxImpressions: 1, timeWindow: 24 }, // 1 per day (reduced from 3)
  'exit-intent': { maxImpressions: 1, timeWindow: 48 }, // 1 every 2 days (reduced from 2 per day)
  'push-notification': { maxImpressions: 2, timeWindow: 24 }, // 2 per day (reduced from 3)
  'floating-footer': { maxImpressions: 3, timeWindow: 24 }, // 3 per day (reduced from 5)
};

interface AdImpressionRecord {
  count: number;
  lastReset: number; // timestamp
}

export function useAdFrequency() {
  const [impressions, setImpressions] = useState<Record<string, AdImpressionRecord>>({});
  const [isInitialized, setIsInitialized] = useState(false);

  // Load impression data from localStorage on mount
  useEffect(() => {
    try {
      const storedImpressions = localStorage.getItem('ad_impressions');
      if (storedImpressions) {
        setImpressions(JSON.parse(storedImpressions));
      }
      setIsInitialized(true);
    } catch (error) {
      console.error('Error loading ad impression data:', error);
      setIsInitialized(true);
    }
  }, []);

  // Save impressions to localStorage whenever they change
  useEffect(() => {
    if (isInitialized && Object.keys(impressions).length > 0) {
      try {
        localStorage.setItem('ad_impressions', JSON.stringify(impressions));
      } catch (error) {
        console.error('Error saving ad impression data:', error);
      }
    }
  }, [impressions, isInitialized]);

  // Check if an ad should be shown based on frequency limits
  const shouldShowAd = (adId: string, adType: any): boolean => {
    // If not initialized yet, default to showing the ad
    if (!isInitialized) return true;

    // Check if this is a valid ad type with frequency limits
    const limits = DEFAULT_FREQUENCY_LIMITS[adType as AdType];
    if (!limits) return true; // If no limits defined, always show

    const key = `${adType}_${adId}`;
    const record = impressions[key];

    // If no record exists, this is the first impression
    if (!record) return true;

    // Check if we need to reset the counter (new time window)
    const now = Date.now();
    const timeWindowMs = limits.timeWindow * 60 * 60 * 1000;
    if (now - record.lastReset > timeWindowMs) {
      // Time window has passed, reset counter
      return true;
    }

    // Check if we're under the impression limit
    return record.count < limits.maxImpressions;
  };

  // Record an impression for an ad
  const recordImpression = (adId: string, adType: any): void => {
    if (!isInitialized) return;

    const key = `${adType}_${adId}`;
    const now = Date.now();
    const record = impressions[key];

    // Get frequency limits for this ad type if they exist
    const limits = DEFAULT_FREQUENCY_LIMITS[adType as AdType];

    // If no record exists or time window has passed, create a new record
    if (!record || (limits && now - record.lastReset > limits.timeWindow * 60 * 60 * 1000)) {
      setImpressions(prev => ({
        ...prev,
        [key]: { count: 1, lastReset: now }
      }));
      return;
    }

    // Increment the counter
    setImpressions(prev => ({
      ...prev,
      [key]: {
        count: record.count + 1,
        lastReset: record.lastReset
      }
    }));
  };

  // Get the current impression count for an ad
  const getImpressionCount = (adId: string, adType: any): number => {
    if (!isInitialized) return 0;

    const key = `${adType}_${adId}`;
    const record = impressions[key];

    if (!record) return 0;

    // Check if we need to reset the counter (new time window)
    const now = Date.now();
    const limits = DEFAULT_FREQUENCY_LIMITS[adType as AdType];

    // If no limits defined for this ad type, return the current count
    if (!limits) return record.count;

    const timeWindowMs = limits.timeWindow * 60 * 60 * 1000;
    if (now - record.lastReset > timeWindowMs) {
      return 0;
    }

    return record.count;
  };

  return {
    shouldShowAd,
    recordImpression,
    getImpressionCount,
    isInitialized
  };
}
