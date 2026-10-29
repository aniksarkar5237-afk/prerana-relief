'use client';
import React from 'react';
import { ArrowUpRight } from 'lucide-react';
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
      {/* Dynamic Volcanic Eruption Ember Sparks & Forest Firefly Particles */}
      <HeroEmberOverlay />

      {/* Top Natural Fog Layer - Subtle Dark Dusk Halo */}
      <div 
        className="absolute inset-x-0 top-0 h-40 sm:h-52 pointer-events-none z-10"
        style={{
          background: 'linear-gradient(to bottom, rgba(8, 13, 26, 0.75) 0%, rgba(8, 13, 26, 0.4) 45%, transparent 100%)',
        }}
      />

      {/* Top Section: Header Spacer, Editorial Headline & Subtitle */}
      <div className="relative z-20 pt-20 sm:pt-24 md:pt-28 px-4 sm:px-6 text-center flex flex-col items-center">
        {/* Editorial Headline - Deep, Ultra-Crisp High-Contrast Serif */}
        <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-[62px] font-bold text-white tracking-[-0.02em] leading-[1.08] drop-shadow-[0_4px_24px_rgba(0,0,0,0.95)] select-none">
          Protecting Lives,<br />
          Restoring the Delta
        </h1>

        {/* Subtitle - Readable Sans-Serif Typography */}
        <p className="mt-3 sm:mt-4 max-w-2xl text-xs sm:text-sm md:text-[15px] text-slate-200/95 font-sans leading-relaxed text-center drop-shadow-[0_2px_10px_rgba(0,0,0,0.95)] px-4">
          Protecting vulnerable communities is essential for creating a resilient and sustainable future. Dispatching emergency rescue, monitoring flood radar, and restoring the coastal ecosystem.
        </p>
      </div>

      {/* Center Chamber: Leaves the Volcanic Tree Canopy & Lava Eruption in full cinematic display */}
      <div className="flex-1 pointer-events-none" />

      {/* Bottom Action CTA Button Group - Matching Reference Aesthetic */}
      <div className="relative z-20 pb-16 sm:pb-20 px-4 flex items-center justify-center gap-4 sm:gap-6 flex-wrap">
        
        {/* 1. "Start Button ↗" (Deep obsidian core + fiery neon gradient glow) */}
        <button
          type="button"
          onClick={onEmergencyClick}
          className="relative group p-[2px] rounded-full transition-all duration-300 transform hover:scale-105 active:scale-95 cursor-pointer focus:outline-none select-none"
          aria-label="Start Button"
        >
          {/* Ambient fiery bloom glow behind the button */}
          <span 
            className="absolute -inset-1.5 rounded-full bg-gradient-to-r from-amber-400 via-orange-500 to-rose-600 opacity-70 blur-md group-hover:opacity-100 group-hover:blur-lg transition-all duration-300 pointer-events-none" 
            aria-hidden="true"
          />

          {/* Fiery neon border ring: golden-amber to crimson gradient */}
          <span 
            className="absolute inset-0 rounded-full bg-gradient-to-r from-amber-400 via-orange-500 to-rose-600 shadow-[0_0_25px_rgba(245,158,11,0.55)] group-hover:shadow-[0_0_35px_rgba(245,158,11,0.9),0_0_50px_rgba(244,63,94,0.45)] transition-shadow duration-300 pointer-events-none" 
            aria-hidden="true"
          />

          {/* Button inner dark pill body with subtle warm highlight & inset depth */}
          <span className="relative z-10 flex items-center gap-2 px-7 py-3 sm:px-8 sm:py-3.5 rounded-full bg-[#0A0E17]/95 backdrop-blur-md text-white text-sm sm:text-base font-semibold tracking-normal shadow-[inset_0_1px_2px_rgba(255,255,255,0.25),inset_0_-3px_10px_rgba(245,158,11,0.22)] transition-colors duration-200 group-hover:bg-[#070A10]/95">
            <span className="text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">Start Button</span>
            <ArrowUpRight className="w-4 h-4 text-amber-200 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </span>
        </button>

        {/* 2. "Explore Map" (Frosted Glassmorphism Pill with Soft Cyan-to-Amber Halo Aura) */}
        <button
          type="button"
          onClick={handleExploreMap}
          className="relative group p-[1.5px] rounded-full transition-all duration-300 transform hover:scale-105 active:scale-95 cursor-pointer focus:outline-none select-none"
          aria-label="Explore Map"
        >
          {/* Soft ambient cyan-to-gold aura bloom behind the pill */}
          <span 
            className="absolute -inset-1.5 rounded-full bg-gradient-to-r from-cyan-400/60 via-teal-300/30 to-amber-300/60 opacity-50 blur-md group-hover:opacity-85 group-hover:blur-lg transition-all duration-300 pointer-events-none" 
            aria-hidden="true"
          />

          {/* Aura ring around border with soft cyan-to-gold halo & border-cyan-400/50 */}
          <span 
            className="absolute inset-0 rounded-full border border-cyan-400/50 bg-gradient-to-r from-cyan-400/60 via-teal-300/30 to-amber-400/60 shadow-[0_0_20px_rgba(6,182,212,0.32)] group-hover:shadow-[0_0_30px_rgba(6,182,212,0.55),0_0_25px_rgba(245,158,11,0.35)] transition-shadow duration-300 pointer-events-none" 
            aria-hidden="true"
          />

          {/* Semi-transparent frosted glass body */}
          <span className="relative z-10 flex items-center justify-center px-7 py-3 sm:px-8 sm:py-3.5 rounded-full bg-[#12222E]/60 backdrop-blur-xl text-slate-100 text-sm sm:text-base font-semibold tracking-normal shadow-[inset_0_1px_2px_rgba(255,255,255,0.4),inset_0_-1px_3px_rgba(0,0,0,0.3)] transition-all duration-200 group-hover:bg-[#12222E]/80">
            <span className="text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] font-medium">
              Explore Map
            </span>
          </span>
        </button>

      </div>
    </section>
  );
}
  );
}
