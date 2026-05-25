import React from 'react';

/**
 * @param {Object} props
 * @param {'hybrid'|'spark'|'loop'} [props.variant='hybrid'] - The active design variant.
 * @param {number|string} [props.size=32] - Visual dimensions of the SVG.
 * @param {string} [props.className="w-8 h-8"] - Custom Tailwind or CSS classes.
 */
const Logo = ({ variant = 'hybrid', size = 36, className = "w-9 h-9", ...props }) => {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`overflow-visible ${className}`}
        {...props}
      >
        <g opacity="0.85">
          {[0, 60, 120, 180, 240, 300].map((angle) => (
            <path
              key={angle}
              transform={`rotate(${angle} 50 50)`}
              d="M50 50 C66 28 82 38 78 54 C74 70 58 64 50 50"
              stroke="currentColor"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
              opacity="0.65"
            />
          ))}
        </g>
        <path
          d="M50 10 C50 40 40 50 10 50 C40 50 50 60 50 90 C50 60 60 50 90 50 C60 50 50 40 50 10 Z"
          fill="currentColor"
        />
        <path
          d="M50 30 C50 45 45 50 30 50 C45 50 50 55 50 70 C50 55 55 50 70 50 C55 50 50 45 50 30 Z"
          fill="var(--bg-panel, #ffffff)"
          opacity="0.95"
        />
      </svg>
    );
};

export default Logo;


