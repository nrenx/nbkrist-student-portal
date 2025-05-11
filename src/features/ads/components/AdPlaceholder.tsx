import React from 'react';

interface AdPlaceholderProps {
  width: string;
  height: string;
  label?: string;
  className?: string;
}

/**
 * AdPlaceholder component
 * 
 * This component maintains the same layout and styling as AdBanner
 * but doesn't load actual ads. Use this for development or when
 * you want to reserve space for ads without showing them.
 */
const AdPlaceholder = ({
  width,
  height,
  label = "Ad space reserved",
  className = ""
}: AdPlaceholderProps) => {
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
