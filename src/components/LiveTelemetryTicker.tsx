'use client';
import React, { useState, useEffect } from 'react';

export default function LiveTelemetryTicker() {
  const [packetCount, setPacketCount] = useState(42);

  useEffect(() => {
    const interval = setInterval(() => {
      setPacketCount((prev) => (prev > 95 ? 38 : prev + Math.floor(Math.random() * 3) - 1));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-[#050811]/92 backdrop-blur-md border-t border-slate-800/80 py-2 px-4 sm:px-6 flex items-center justify-between text-[11px] sm:text-xs font-mono select-none">
      {/* Left/Center: Dynamic Telemetry Feed */}
      <div className="flex items-center gap-3 sm:gap-5 overflow-x-auto no-scrollbar py-0.5">
        {/* Item 1 */}
        <div className="flex items-center gap-1.5 whitespace-nowrap">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
          </span>
          <span className="font-bold text-emerald-400">[LIVE]</span>
          <span className="text-slate-300">Flotilla Unit #4 dispatched to Gosaba Sector 3</span>
        </div>

        <span className="text-slate-600 hidden md:inline">|</span>

        {/* Item 2 */}
        <div className="flex items-center gap-1.5 whitespace-nowrap">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400"></span>
          </span>
          <span className="font-bold text-cyan-400">[LIVE]</span>
          <span className="text-slate-300">1938 IVRS Gateway: {packetCount} concurrent packets triaged</span>
        </div>

        <span className="text-slate-600 hidden lg:inline">|</span>

        {/* Item 3 */}
        <div className="hidden lg:flex items-center gap-1.5 whitespace-nowrap">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-400"></span>
          </span>
          <span className="font-bold text-amber-400">[LIVE]</span>
          <span className="text-slate-300">Zero-MDR Escrow verified.</span>
        </div>
      </div>

      {/* Right Tactical Node Status Indicator */}
      <div className="hidden sm:flex items-center gap-2 flex-shrink-0 pl-4 border-l border-slate-800 text-slate-400">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
        <span className="text-[10px] tracking-wider uppercase font-semibold text-slate-300">
          SYS_SYNC: 42ms // ALL ESCROW NODES OPERATIONAL
        </span>
      </div>
    </div>
  );
}
