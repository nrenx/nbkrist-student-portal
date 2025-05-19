import React from 'react';
import { useAdVisibility } from '../hooks/useAdVisibility';

interface AdPlaceholderProps {
  width: string;
  height: string;
  label?: string;
  className?: string;
  forceShow?: boolean; // Optional prop to force showing the placeholder regardless of visibility settings
}

/**
 * AdPlaceholder component
 *
 * This component maintains the same layout and styling as AdBanner
 * but doesn't load actual ads. Use this for development or when
 * you want to reserve space for ads without showing them.
 *
 * The visibility of placeholders can be controlled through the useAdVisibility hook.
 */
const AdPlaceholder = ({
  width,
  height,
  label = "Ad space reserved",
  className = "",
  forceShow = false
}: AdPlaceholderProps) => {
  // Use the ad visibility hook to determine if this placeholder should be shown
  const { isAdSpaceVisible, isInitialized } = useAdVisibility();

  // Check if this specific ad space should be visible
  const shouldShow = forceShow || (isInitialized && isAdSpaceVisible(label));

  // If the ad space should be hidden, return null
  if (!shouldShow) {
    return null;
  }

  return (
    <div
      className={`ad-container ${width} ${height} relative overflow-hidden ${className}`}
      role="complementary"
      aria-label="Advertisement placeholder"
    >
      <div className="absolute top-1 left-1 bg-black/10 text-xs px-1 rounded">
        {label}
      </div>
      <div className="w-full h-full bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-400">
        <span className="text-sm text-gray-400">Ad space reserved for future use</span>
      </div>
    </div>
  );
};

export default AdPlaceholder;
