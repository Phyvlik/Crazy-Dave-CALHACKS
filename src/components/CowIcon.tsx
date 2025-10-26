import React from 'react';

interface CowIconProps {
  size?: number;
  className?: string;
}

/**
 * Cute 3D-style cow icon component
 */
export const CowIcon: React.FC<CowIconProps> = ({ size = 64, className = '' }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      className={`inline-block ${className}`}
      style={{ imageRendering: 'auto' }}
    >
      {/* Head - Gray */}
      <circle cx="100" cy="85" r="55" fill="#9CA3AF" />

      {/* Snout - Pink */}
      <ellipse cx="100" cy="110" rx="28" ry="32" fill="#EC9CB5" />

      {/* Nostrils */}
      <circle cx="92" cy="115" r="5" fill="#E879A0" />
      <circle cx="108" cy="115" r="5" fill="#E879A0" />

      {/* Left Ear - Gray base */}
      <ellipse cx="60" cy="45" rx="18" ry="28" fill="#9CA3AF" transform="rotate(-25 60 45)" />
      
      {/* Left Ear - Pink inner */}
      <ellipse cx="60" cy="48" rx="10" ry="18" fill="#EC9CB5" transform="rotate(-25 60 48)" />

      {/* Right Ear - Gray base */}
      <ellipse cx="140" cy="45" rx="18" ry="28" fill="#9CA3AF" transform="rotate(25 140 45)" />
      
      {/* Right Ear - Pink inner */}
      <ellipse cx="140" cy="48" rx="10" ry="18" fill="#EC9CB5" transform="rotate(25 140 48)" />

      {/* Left Eye - White */}
      <circle cx="80" cy="75" r="9" fill="white" />
      
      {/* Left Eye - Black pupil */}
      <circle cx="81" cy="76" r="5" fill="#1F2937" />
      
      {/* Left Eye - Shine */}
      <circle cx="83" cy="74" r="2" fill="white" />

      {/* Right Eye - White */}
      <circle cx="120" cy="75" r="9" fill="white" />
      
      {/* Right Eye - Black pupil */}
      <circle cx="119" cy="76" r="5" fill="#1F2937" />
      
      {/* Right Eye - Shine */}
      <circle cx="117" cy="74" r="2" fill="white" />

      {/* Mouth - Simple curved line */}
      <path d="M 100 125 Q 95 130 100 132 Q 105 130 100 125" fill="none" stroke="#E879A0" strokeWidth="2" />

      {/* Spots on face - optional */}
      <circle cx="75" cy="90" r="4" fill="#7A8694" opacity="0.4" />
      <circle cx="125" cy="95" r="3.5" fill="#7A8694" opacity="0.4" />
    </svg>
  );
};

export default CowIcon;

