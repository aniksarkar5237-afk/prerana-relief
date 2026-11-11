'use client';
import dynamic from 'next/dynamic';
import React from 'react';

// Import the map dynamically with SSR disabled to prevent Leaflet 'window is not defined' error
const DisasterMapInner = dynamic(() => import('./DisasterMapInner'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[620px] sm:h-[660px] bg-slate-950/80 backdrop-blur-xl rounded-2xl animate-pulse flex flex-col items-center justify-center gap-3 border border-white/10 shadow-2xl">
      <div className="flex items-center gap-2.5 text-cyan-400 font-mono text-sm">
        <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping"></span>
        <span>Initializing Tactical All-India Disaster Radar...</span>
      </div>
      <div className="text-zinc-500 text-xs font-mono">Loading Tactical Subcontinental GIS Radar Basemap</div>
    </div>
  ),
});

export default function DisasterMap() {
  return <DisasterMapInner />;
}
