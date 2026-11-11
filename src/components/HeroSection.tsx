'use client';
import React from 'react';
import { ArrowUpRight, Sparkles } from 'lucide-react';
import HeroEmberOverlay from './HeroEmberOverlay';

interface HeroSectionProps {
  onEmergencyClick?: () => void;
  onDonateClick?: () => void;
}

export default function HeroSection({ onEmergencyClick }: HeroSectionProps) {
  const handleExploreMap = () => {
    const el = document.getElementById('live-disaster-grid') || document.getElementById('active-relief');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative w-full h-[100dvh] max-h-[100dvh] flex flex-col justify-between overflow-hidden bg-transparent select-none">
      {/* Dynamic Volcanic Magma Sparks & Forest Firefly Particle Engine */}
      <div className="absolute inset-0 pointer-events-none z-[2]">
        <HeroEmberOverlay />
      </div>

      {/* Top Soft Dusk Vignette (Maintains HUD clarity) */}
      <div
        className="absolute inset-x-0 top-0 h-36 sm:h-44 pointer-events-none z-[3]"
        style={{
          background: 'linear-gradient(to bottom, rgba(8, 13, 26, 0.6) 0%, rgba(8, 13, 26, 0.2) 60%, transparent 100%)',
        }}
      />

      {/* 5. Top Section: Centered Editorial Headline & Subtitle */}
      <div className="relative z-10 pt-24 sm:pt-28 md:pt-32 px-4 sm:px-6 text-center flex flex-col items-center">
        {/* Editorial Heading: Stark White Bold Serif with -0.02em tracking */}
        <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-[62px] font-bold text-white tracking-[-0.02em] leading-[1.08] drop-shadow-[0_2px_14px_rgba(0,0,0,0.95)] select-none">
          Protecting Lives,<br />
          Restoring the Delta
        </h1>

        {/* Subtitle: Readable Slate-200 Sans-Serif Font */}
        <p className="text-slate-200/95 text-xs sm:text-sm md:text-[14.5px] max-w-xl mx-auto leading-relaxed mt-3 sm:mt-3.5 drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)] font-normal text-center">
          Protecting vulnerable communities is essential for creating a resilient and sustainable future. Dispatching emergency rescue, monitoring flood radar, and restoring the coastal ecosystem.
        </p>
      </div>

      {/* Center Chamber: Highlights the Volcanic Magma Fissure & Glowing Upper Canopy */}
      <div className="flex-1 pointer-events-none" />

      {/* 6. Dynamic Call-To-Action Button Group */}
      <div className="relative z-10 pb-14 sm:pb-16 px-4 flex items-center justify-center gap-4 sm:gap-6 flex-wrap">

        {/* Pill 1: "Start Button ↗" (Deep Obsidian Core with Animated Golden-Amber-to-Crimson Glow) */}
        <button
          type="button"
          onClick={onEmergencyClick}
          className="relative group p-[2px] rounded-full transition-all duration-300 transform hover:scale-105 active:scale-95 cursor-pointer focus:outline-none select-none"
          aria-label="Start Button"
        >
          {/* Animated golden-amber to crimson circular pulse glow */}
          <span
            className="absolute -inset-1.5 rounded-full bg-gradient-to-r from-amber-400 via-orange-500 to-rose-600 opacity-75 blur-md group-hover:opacity-100 group-hover:blur-lg transition-all duration-300 pointer-events-none animate-pulse"
            aria-hidden="true"
          />

          {/* Border ring with neon glow shadow */}
          <span
            className="absolute inset-0 rounded-full bg-gradient-to-r from-amber-400 via-orange-500 to-rose-600 shadow-[0_0_25px_rgba(245,158,11,0.6)] group-hover:shadow-[0_0_35px_rgba(245,158,11,0.95),0_0_50px_rgba(244,63,94,0.5)] transition-shadow duration-300 pointer-events-none"
            aria-hidden="true"
          />

          {/* Button inner dark obsidian body */}
          <span className="relative z-10 flex items-center gap-2 px-7 py-3 sm:px-8 sm:py-3.5 rounded-full bg-[#0E1310]/95 backdrop-blur-md text-white text-sm sm:text-base font-semibold tracking-normal shadow-[inset_0_1px_2px_rgba(255,255,255,0.3),inset_0_-3px_10px_rgba(245,158,11,0.25)] transition-colors duration-200 group-hover:bg-[#070A08]">
            <span className="text-white drop-shadow-[0_1px_4px_rgba(0,0,0,0.9)]">Start Button</span>
            <ArrowUpRight className="w-4 h-4 text-amber-300 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </span>
        </button>

        {/* Pill 2: "Explore Map" (Frosted Glassmorphism with Pulsing Bioluminescent Cyan-and-Amber Halo) */}
        <button
          type="button"
          onClick={handleExploreMap}
          className="relative group p-[1.5px] rounded-full transition-all duration-300 transform hover:scale-105 active:scale-95 cursor-pointer focus:outline-none select-none"
          aria-label="Explore Map"
        >
          {/* Bioluminescent cyan-and-amber halo glow */}
          <span
            className="absolute -inset-1.5 rounded-full bg-gradient-to-r from-cyan-400/60 via-teal-300/40 to-amber-300/60 opacity-60 blur-md group-hover:opacity-90 group-hover:blur-lg transition-all duration-300 pointer-events-none"
            aria-hidden="true"
          />

          {/* Cyan aura ring with soft border */}
          <span
            className="absolute inset-0 rounded-full border border-cyan-400/60 bg-gradient-to-r from-cyan-400/50 via-teal-300/30 to-amber-400/50 shadow-[0_0_20px_rgba(6,182,212,0.35)] group-hover:shadow-[0_0_30px_rgba(6,182,212,0.6),0_0_25px_rgba(245,158,11,0.4)] transition-shadow duration-300 pointer-events-none"
            aria-hidden="true"
          />

          {/* Semi-transparent frosted glass body */}
          <span className="relative z-10 flex items-center justify-center px-7 py-3 sm:px-8 sm:py-3.5 rounded-full bg-[#649ba3]/40 backdrop-blur-xl text-slate-900 text-sm sm:text-base font-semibold tracking-normal shadow-[inset_0_1px_2px_rgba(255,255,255,0.7),inset_0_-1px_3px_rgba(0,0,0,0.1)] transition-all duration-200 group-hover:bg-[#649ba3]/55">
            <span className="text-[#091512] drop-shadow-[0_1px_1px_rgba(255,255,255,0.8)] font-semibold">
              Explore Map
            </span>
          </span>
        </button>

      </div>

      {/* Subtle Diamond Star Sparkle Glyph (Matching Reference on the bottom-right river surface) */}
      <div className="hidden md:flex absolute right-10 sm:right-16 bottom-20 z-10 pointer-events-none items-center justify-center">
        <Sparkles className="w-5 h-5 text-cyan-200/50 drop-shadow-[0_0_8px_rgba(6,182,212,0.6)] animate-pulse" />
      </div>

    </section>
  );
}
