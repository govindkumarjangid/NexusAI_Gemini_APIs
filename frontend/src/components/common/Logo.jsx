import React from 'react';

const Logo = ({ size = 26, className = "" }) => {
  return (
    <div
      className={`relative flex items-center justify-center rounded-full ${className}`}
      style={{ width: size + 24, height: size + 24 }}
    >

      <svg
        width={size}
        height={size}
        viewBox="0 0 512 512"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="nexus_grad_dynamic" x1="0" y1="0" x2="512" y2="512" gradientUnits="userSpaceOnUse">
            <stop stopColor="currentColor" />
            <stop offset="1" stopColor="currentColor" stopOpacity="0.6" />
          </linearGradient>
          <filter id="glow_dynamic" x="-20%" y="-20%" width="140%" height="140%" filterUnits="userSpaceOnUse">
            <feGaussianBlur stdDeviation="15" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Central Core */}
        <circle cx="256" cy="256" r="60" fill="url(#nexus_grad_dynamic)" filter="url(#glow_dynamic)">
          <animate attributeName="r" values="55;65;55" dur="3s" repeatCount="indefinite" />
        </circle>

        {/* Connection Paths (Abstract N) */}
        <path d="M120 400L120 112L392 400L392 112" stroke="url(#nexus_grad_dynamic)" strokeWidth="40" strokeLinecap="round" strokeLinejoin="round" opacity="1">
          <animate attributeName="stroke-dasharray" from="0,1000" to="1000,0" dur="2s" fill="freeze" />
        </path>

        {/* Nodes */}
        <circle cx="120" cy="112" r="20" fill="white" />
        <circle cx="120" cy="400" r="20" fill="white" />
        <circle cx="392" cy="112" r="20" fill="white" />
        <circle cx="392" cy="400" r="20" fill="white" />

        {/* Orbital Rings */}
        <circle cx="256" cy="256" r="180" stroke="url(#nexus_grad_dynamic)" strokeWidth="2" strokeDasharray="10 20" opacity="0.3">
          <animateTransform attributeName="transform" type="rotate" from="0 256 256" to="360 256 256" dur="20s" repeatCount="indefinite" />
        </circle>
        <circle cx="256" cy="256" r="220" stroke="url(#nexus_grad_dynamic)" strokeWidth="1" strokeDasharray="5 15" opacity="0.2">
          <animateTransform attributeName="transform" type="rotate" from="360 256 256" to="0 256 256" dur="30s" repeatCount="indefinite" />
        </circle>
      </svg>
    </div>
  );
};

export default Logo;
