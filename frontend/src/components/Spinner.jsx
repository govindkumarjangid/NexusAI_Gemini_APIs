import React from 'react';

const Spinner = ({ size = 36, color = '#6366f1', className = '' }) => {
    return (
        <div
            className={`relative flex items-center justify-center ${className}`}
            style={{ width: size, height: size }}
        >
            <svg
                className="absolute animate-spin"
                width="100%"
                height="100%"
                viewBox="0 0 50 50"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <circle
                    cx="25"
                    cy="25"
                    r="20"
                    stroke="url(#gradient)"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeDasharray="90 150"
                />
                {/* Gradient definition */}
                <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor={color} stopOpacity="1" />
                        <stop offset="100%" stopColor="#c084fc" stopOpacity="0.1" />
                    </linearGradient>
                </defs>
            </svg>

            <div
                className="absolute flex items-center justify-center rounded-full bg-[#1e1e1e]"
                style={{
                    width: size * 0.6,
                    height: size * 0.6
                }}
            >
                <svg
                    width="100%"
                    height="100%"
                    viewBox="0 0 24 24"
                    fill={color}
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path d="M12 2L14.8 9.2L22 12L14.8 14.8L12 22L9.2 14.8L2 12L9.2 9.2L12 2Z" />
                </svg>
            </div>
        </div>
    );
};

export default Spinner;