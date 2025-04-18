import { useState, useEffect } from 'react';

interface AdPerformanceMetrics {
  impressions: number;
  clicks: number;
  viewTime: number; // in seconds
  viewability: number; // percentage of ad that was viewable
  lastUpdated: number; // timestamp
}

interface AdPerformanceData {
  [adId: string]: AdPerformanceMetrics;
}

export function useAdPerformance() {
  const [metrics, setMetrics] = useState<AdPerformanceData>({});
  const [isInitialized, setIsInitialized] = useState(false);

  // Load metrics from localStorage on mount
  useEffect(() => {
    try {
      const storedMetrics = localStorage.getItem('ad_performance_metrics');
      if (storedMetrics) {
        setMetrics(JSON.parse(storedMetrics));
      }
      setIsInitialized(true);
    } catch (error) {
      console.error('Error loading ad performance metrics:', error);
      setIsInitialized(true);
    }
  }, []);

  // Save metrics to localStorage whenever they change
  useEffect(() => {
    if (isInitialized && Object.keys(metrics).length > 0) {
      try {
        localStorage.setItem('ad_performance_metrics', JSON.stringify(metrics));
      } catch (error) {
        console.error('Error saving ad performance metrics:', error);
      }
    }
  }, [metrics, isInitialized]);

  // Record an impression for an ad
  const recordImpression = (adId: string, network: string): void => {
    if (!isInitialized) return;
    
    const key = `${network}_${adId}`;
    const now = Date.now();
    const adMetrics = metrics[key] || {
      impressions: 0,
      clicks: 0,
      viewTime: 0,
      viewability: 0,
      lastUpdated: now
    };
    
    setMetrics(prev => ({
      ...prev,
      [key]: {
        ...adMetrics,
        impressions: adMetrics.impressions + 1,
        lastUpdated: now
      }
    }));
    
    // Optional: Send analytics event
    try {
      if (window.gtag) {
        window.gtag('event', 'ad_impression', {
          ad_id: adId,
          ad_network: network,
          timestamp: now
        });
      }
    } catch (e) {
      console.error('Error sending analytics event:', e);
    }
  };

  // Record a click for an ad
  const recordClick = (adId: string, network: string): void => {
    if (!isInitialized) return;
    
    const key = `${network}_${adId}`;
    const now = Date.now();
    const adMetrics = metrics[key] || {
      impressions: 0,
      clicks: 0,
      viewTime: 0,
      viewability: 0,
      lastUpdated: now
    };
    
    setMetrics(prev => ({
      ...prev,
      [key]: {
        ...adMetrics,
        clicks: adMetrics.clicks + 1,
        lastUpdated: now
      }
    }));
    
    // Optional: Send analytics event
    try {
      if (window.gtag) {
        window.gtag('event', 'ad_click', {
          ad_id: adId,
          ad_network: network,
          timestamp: now
        });
      }
    } catch (e) {
      console.error('Error sending analytics event:', e);
    }
  };

  // Update view time for an ad
  const updateViewTime = (adId: string, network: string, seconds: number): void => {
    if (!isInitialized) return;
    
    const key = `${network}_${adId}`;
    const now = Date.now();
    const adMetrics = metrics[key] || {
      impressions: 0,
      clicks: 0,
      viewTime: 0,
      viewability: 0,
      lastUpdated: now
    };
    
    setMetrics(prev => ({
      ...prev,
      [key]: {
        ...adMetrics,
        viewTime: adMetrics.viewTime + seconds,
        lastUpdated: now
      }
    }));
  };

  // Update viewability percentage for an ad
  const updateViewability = (adId: string, network: string, percentage: number): void => {
    if (!isInitialized || percentage < 0 || percentage > 100) return;
    
    const key = `${network}_${adId}`;
    const now = Date.now();
    const adMetrics = metrics[key] || {
      impressions: 0,
      clicks: 0,
      viewTime: 0,
      viewability: 0,
      lastUpdated: now
    };
    
    // Average the viewability with previous measurements
    const newViewability = adMetrics.viewability === 0 
      ? percentage 
      : (adMetrics.viewability + percentage) / 2;
    
    setMetrics(prev => ({
      ...prev,
      [key]: {
        ...adMetrics,
        viewability: newViewability,
        lastUpdated: now
      }
    }));
  };

  // Get metrics for a specific ad
  const getAdMetrics = (adId: string, network: string): AdPerformanceMetrics | null => {
    if (!isInitialized) return null;
    
    const key = `${network}_${adId}`;
    return metrics[key] || null;
  };

  // Get all metrics
  const getAllMetrics = (): AdPerformanceData => {
    return metrics;
  };

  return {
    recordImpression,
    recordClick,
    updateViewTime,
    updateViewability,
    getAdMetrics,
    getAllMetrics,
    isInitialized
  };
}
