'use client';
import dynamic from 'next/dynamic';
import React from 'react';

// Import the map dynamically with SSR disabled to prevent Leaflet 'window is not defined' error
const DisasterMapInner = dynamic(() => import('./DisasterMapInner'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[600px] bg-gray-100 rounded-2xl animate-pulse flex items-center justify-center shadow-xl border border-gray-200">
      <div className="text-gray-500 font-medium">Loading GIS Disaster Map...</div>
    </div>
  ),
});

export default function DisasterMap() {
  return <DisasterMapInner />;
}
