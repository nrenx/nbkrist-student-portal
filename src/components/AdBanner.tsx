
import React from 'react';

interface AdBannerProps {
  width: string;
  height: string;
}

const AdBanner = ({ width, height }: AdBannerProps) => {
  return (
    <div 
      className={`ad-container ${width} ${height}`}
      role="complementary"
      aria-label="Advertisement"
    >
      <span>Advertisement</span>
    </div>
  );
};

export default AdBanner;
