'use client';
import React from 'react';

interface BrandLogoProps {
  className?: string;
  width?: number | string;
  height?: number | string;
  showText?: boolean;
  textClassName?: string;
}

export default function BrandLogo({
  className = 'h-9 w-auto',
  width,
  height,
  showText = true,
  textClassName,
}: BrandLogoProps) {
  return (
    <div className={`inline-flex items-center gap-2.5 sm:gap-3 select-none ${className}`}>
      {/* 
        PR Botanical Delta Monogram Vector Mark
        Interconnected 'PR' flowing seamlessly into mangrove foliage and delta river contours.
        Gradient: Gold/Amber (#F59E0B) -> Emerald Green (#10B981) -> Bright Cyan (#06B6D4)
      */}
      <div className="relative flex-shrink-0 flex items-center justify-center">
        <svg
          viewBox="0 0 390 166"
          width={width}
          height={height}
          className="h-full w-auto max-h-9 sm:max-h-10 overflow-visible drop-shadow-[0_2px_12px_rgba(16,185,129,0.35)]"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <defs>
            {/* Primary Dynamic Gradient Outline */}
            <linearGradient id="prDeltaGradient" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#10B981" />
              <stop offset="28%" stopColor="#06B6D4" />
              <stop offset="68%" stopColor="#F59E0B" />
              <stop offset="100%" stopColor="#FBBF24" />
            </linearGradient>

            {/* Foliage Complementary Gradient */}
            <linearGradient id="prLeafGradient" x1="10%" y1="90%" x2="90%" y2="10%">
              <stop offset="0%" stopColor="#10B981" />
              <stop offset="45%" stopColor="#06B6D4" />
              <stop offset="85%" stopColor="#F59E0B" />
              <stop offset="100%" stopColor="#FCD34D" />
            </linearGradient>

            {/* Ambient Vector Glow */}
            <filter id="prAuraGlow" x="-15%" y="-15%" width="130%" height="130%">
              <feGaussianBlur stdDeviation="3.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Interconnected Vector Contours */}
          <g
            stroke="url(#prDeltaGradient)"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter="url(#prAuraGlow)"
          >
            {/* P: Vertical spine with lower looped terminal */}
            <path
              d="M 26 124 C 26 142 38 152 50 152 C 64 152 72 140 72 124 L 72 38 C 72 22 62 16 48 16 C 34 16 26 26 26 42 L 26 124"
              strokeWidth="11"
            />

            {/* P: Outer upper loop bridging gracefully into R */}
            <path
              d="M 72 20 C 94 14 132 14 146 42 C 158 64 148 88 124 98 C 104 104 82 102 72 102"
              strokeWidth="11"
            />

            {/* Botanical Leaf Silhouette nestled inside P bowl */}
            <path
              d="M 78 80 C 70 70 72 48 90 34 C 106 50 104 70 94 80 C 88 86 82 86 78 80 Z"
              strokeWidth="7"
              fill="rgba(16, 185, 129, 0.12)"
            />

            {/* R: Upper Lobe Arch */}
            <path
              d="M 140 24 C 166 14 202 22 212 52 C 220 76 200 98 170 100 L 144 100"
              strokeWidth="11"
            />

            {/* R: Diagonal Leg extending into Delta Foliage */}
            <path
              d="M 152 98 L 216 160"
              strokeWidth="11"
            />

            {/* Mangrove Delta Foliage Cluster */}
            {/* 1. Center Upright Lanceolate Mangrove Leaf */}
            <path
              d="M 206 120 C 226 86 254 46 282 12 C 308 46 318 84 296 114 C 280 134 252 134 226 122"
              strokeWidth="10"
              stroke="url(#prLeafGradient)"
            />
            {/* Center leaf internal spine */}
            <path
              d="M 254 74 L 282 12"
              strokeWidth="7"
              stroke="url(#prLeafGradient)"
            />

            {/* 2. Lateral Leaf Swirl */}
            <path
              d="M 276 66 C 308 36 348 38 360 68 C 344 96 310 112 274 106"
              strokeWidth="9"
              stroke="url(#prLeafGradient)"
            />

            {/* 3. Lower Riverine Delta Swirling Root & Vine */}
            <path
              d="M 226 122 C 254 138 294 156 338 144 C 388 128 396 88 360 72 C 336 62 312 80 326 106 C 336 120 358 126 376 114 C 392 102 396 78 380 58"
              strokeWidth="10"
              stroke="url(#prLeafGradient)"
            />
          </g>
        </svg>
      </div>

      {/* 
        Companion Typography Label:
        "Prerana" in crisp bold white (#FFFFFF)
        "Aid" in an emerald-to-amber gradient accent
      */}
      {showText && (
        <div className={`flex items-baseline tracking-tight font-sans ${textClassName || ''}`}>
          <span className="text-white font-extrabold text-xl sm:text-2xl tracking-tight drop-shadow-[0_2px_8px_rgba(0,0,0,0.85)]">
            Prerana
          </span>
          <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-400 bg-clip-text text-transparent font-extrabold text-xl sm:text-2xl ml-0.5 drop-shadow-[0_0_14px_rgba(16,185,129,0.45)]">
            Aid
          </span>
        </div>
      )}
    </div>
  );
}

