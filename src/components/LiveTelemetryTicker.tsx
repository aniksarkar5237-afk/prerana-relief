'use client';
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function LiveTelemetryTicker() {
  const [callsCount, setCallsCount] = useState(43);

  // Micro-simulation for the live telephony traffic
  useEffect(() => {
    const interval = setInterval(() => {
      setCallsCount((prev) => (prev >= 48 ? 41 : prev + 1));
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  const feedItems = [
    {
      id: 'flotilla',
      pingColor: 'bg-emerald-400',
      dotColor: 'bg-emerald-400',
      tagColor: 'text-emerald-400',
      text: 'FLOTILLA UNIT #4 DISPATCHED TO GOSABA SECTOR 3',
    },
    {
      id: 'gateway',
      pingColor: 'bg-cyan-400',
      dotColor: 'bg-cyan-400',
      tagColor: 'text-cyan-400',
      text: `1938 IVRS GATEWAY: ${callsCount} CONCURRENT CALLS TRIAGED`,
    },
    {
      id: 'escrow',
      pingColor: 'bg-amber-400',
      dotColor: 'bg-amber-400',
      tagColor: 'text-amber-400',
      text: 'ZERO-NDR ESCROW VERIFIED: 100% DISBURSEMENT INTEGRITY',
    },
  ];

  // Quadruple items to ensure wide displays have plenty of content before the 50% loop boundary
  const tickerSequence = [...feedItems, ...feedItems, ...feedItems, ...feedItems];

  return (
    <div className="relative w-full overflow-hidden backdrop-blur-md bg-black/60 border-y border-white/10 py-3 z-30 select-none">
      {/* Edge vignette gradients for tactical HUD mask */}
      <div className="absolute left-0 top-0 bottom-0 w-12 sm:w-24 bg-gradient-to-r from-black/80 via-black/40 to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-12 sm:w-24 bg-gradient-to-l from-black/80 via-black/40 to-transparent z-10 pointer-events-none" />

      {/* Static Left Tactical Badge on Desktop */}
      <div className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 z-20 hidden lg:flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900/90 border border-white/10 text-[10px] font-mono font-bold tracking-widest text-cyan-400 uppercase pointer-events-none shadow-sm">
        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
        <span>SYS_TELEMETRY</span>
      </div>

      {/* Marquee Track */}
      <div className="flex w-full overflow-hidden lg:pl-36">
        <motion.div
          className="flex items-center gap-8 sm:gap-14 whitespace-nowrap font-mono text-xs sm:text-[13px] tracking-wider uppercase text-slate-300 w-max"
          animate={{ x: ['0%', '-50%'] }}
          transition={{
            ease: 'linear',
            duration: 30,
            repeat: Infinity,
          }}
        >
          {tickerSequence.map((item, idx) => (
            <div key={idx} className="flex items-center gap-2.5">
              <span className="relative flex h-2 w-2 sm:h-2.5 sm:w-2.5 flex-shrink-0">
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${item.pingColor} opacity-75`} />
                <span className={`relative inline-flex rounded-full h-2 w-2 sm:h-2.5 sm:w-2.5 ${item.dotColor}`} />
              </span>
              <span className={`font-bold ${item.tagColor}`}>[● LIVE]</span>
              <span className="text-slate-100 font-medium tracking-wide">{item.text}</span>
              <span className="text-white/20 ml-6 select-none">•</span>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
