import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const size = {
  width: 32,
  height: 32,
};
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#080D1A',
          borderRadius: '24%',
          border: '1px solid rgba(16, 185, 129, 0.45)',
        }}
      >
        <svg
          width="26"
          height="14"
          viewBox="0 0 390 166"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="iconGradient" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#10B981" />
              <stop offset="35%" stopColor="#06B6D4" />
              <stop offset="70%" stopColor="#F59E0B" />
              <stop offset="100%" stopColor="#FBBF24" />
            </linearGradient>
          </defs>
          <g stroke="url(#iconGradient)" strokeWidth="22" strokeLinecap="round" strokeLinejoin="round">
            <path d="M 28 126 C 28 142 38 152 50 152 C 64 152 72 140 72 124 L 72 38 C 72 22 62 16 48 16 C 34 16 28 26 28 42 L 28 126" />
            <path d="M 72 20 C 94 14 132 14 146 42 C 158 64 148 88 124 98 L 72 102" />
            <path d="M 140 24 C 166 14 202 22 212 52 C 220 76 200 98 170 100 L 144 100" />
            <path d="M 152 98 L 216 160" />
            <path d="M 206 120 C 226 86 254 46 282 12 C 308 46 318 84 296 114 Z" />
            <path d="M 276 66 C 308 36 348 38 360 68" />
            <path d="M 226 122 C 254 138 294 156 338 144 C 388 128 396 88 360 72" />
          </g>
        </svg>
      </div>
    ),
    {
      ...size,
    }
  );
}

