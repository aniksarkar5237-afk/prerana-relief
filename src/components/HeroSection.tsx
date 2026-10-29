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
    <section className="relative w-full h-[100dvh] max-h-[100dvh] flex flex-col justify-between overflow-hidden bg-[#dce3da] select-none">
      {/* Cinematic Delta Background Image - Cleaned Sky, Reconstructed Roots, No Ghost Text or Artifacts */}
      <div 
        className="absolute inset-0 bg-cover bg-[center_52%] bg-no-repeat pointer-events-none transition-transform duration-1000 scale-[1.01]"
        style={{ 
          backgroundImage: `url('/delta-hero-bg.jpg')`,
          filter: 'brightness(1.12) contrast(1.08) saturate(1.18)',
        }}
      />

      {/* Dynamic Volcanic Eruption Ember Sparks & Forest Firefly Particles */}
      <HeroEmberOverlay />

      {/* Top Natural Fog Layer - Light, clean daylight blend for crisp contrast without ghost lines */}
      <div 
        className="absolute inset-x-0 top-0 h-32 sm:h-44 pointer-events-none z-10"
        style={{
          background: 'linear-gradient(to bottom, rgba(238, 242, 237, 0.82) 0%, rgba(238, 242, 237, 0.45) 50%, transparent 100%)',
        }}
      />

      {/* Top Section: Header Spacer & Editorial Headline (Single-Screen Fitted) */}
      <div className="relative z-20 pt-20 sm:pt-24 md:pt-28 px-4 sm:px-6 text-center flex flex-col items-center">
        {/* Editorial Headline - Deep, Ultra-Crisp High-Contrast Serif */}
        <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-[62px] font-bold text-[#08100b] tracking-tight leading-[1.08] drop-shadow-[0_2px_4px_rgba(255,255,255,0.95)] select-none">
          Protecting Lives,<br />
          Restoring the Delta
        </h1>
      </div>

      {/* Center Chamber: Leaves the Volcanic Stump Eruption in full cinematic display */}
      <div className="flex-1 pointer-events-none" />

      {/* Bottom Action CTA Button Group - Matching Reference Picture 2 Aesthetic */}
      <div className="relative z-20 pb-8 sm:pb-10 md:pb-12 px-4 flex items-center justify-center gap-4 sm:gap-6 flex-wrap">
        
        {/* 1. "Start Button ↗" (Fiery Neon Gradient Glow Pill) */}
        <button
          type="button"
          onClick={onEmergencyClick}
          className="relative group p-[2px] rounded-full transition-all duration-300 transform hover:scale-105 active:scale-95 cursor-pointer focus:outline-none select-none"
          aria-label="Start Button"
        >
          {/* Ambient fiery bloom glow behind the button (diffuses across the misty water) */}
          <span 
            className="absolute -inset-1.5 rounded-full bg-gradient-to-r from-amber-400 via-orange-500 to-rose-600 opacity-65 blur-md group-hover:opacity-100 group-hover:blur-lg transition-all duration-300 pointer-events-none" 
            aria-hidden="true"
          />

          {/* Fiery neon border ring: golden-amber to crimson gradient */}
          <span 
            className="absolute inset-0 rounded-full bg-gradient-to-r from-amber-400 via-orange-500 to-rose-600 shadow-[0_0_25px_rgba(245,158,11,0.55)] group-hover:shadow-[0_0_35px_rgba(245,158,11,0.9),0_0_50px_rgba(244,63,94,0.45)] transition-shadow duration-300 pointer-events-none" 
            aria-hidden="true"
          />

          {/* Button inner dark pill body with subtle warm highlight & inset depth */}
          <span className="relative z-10 flex items-center gap-2 px-7 py-3 sm:px-8 sm:py-3.5 rounded-full bg-[#161a17]/94 backdrop-blur-md text-white text-sm sm:text-base font-semibold tracking-normal shadow-[inset_0_1px_2px_rgba(255,255,255,0.25),inset_0_-3px_10px_rgba(245,158,11,0.22)] transition-colors duration-200 group-hover:bg-[#111412]/90">
            <span className="text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">Start Button</span>
            <ArrowUpRight className="w-4 h-4 text-amber-200 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </span>
        </button>

        {/* 2. "Explore Map" (Frosted Glassmorphism Pill with Soft Cyan-to-Gold Aura Ring - Matching Picture 2) */}
        <button
          type="button"
          onClick={handleExploreMap}
          className="relative group p-[1.5px] rounded-full transition-all duration-300 transform hover:scale-105 active:scale-95 cursor-pointer focus:outline-none select-none"
          aria-label="Explore Map"
        >
          {/* Soft ambient cyan-to-gold aura bloom behind the pill */}
          <span 
            className="absolute -inset-1.5 rounded-full bg-gradient-to-r from-cyan-400/60 via-teal-300/30 to-amber-300/60 opacity-45 blur-md group-hover:opacity-85 group-hover:blur-lg transition-all duration-300 pointer-events-none" 
            aria-hidden="true"
          />

          {/* Aura ring around border with soft cyan-to-gold halo & border-cyan-400/50 */}
          <span 
            className="absolute inset-0 rounded-full border border-cyan-400/50 bg-gradient-to-r from-cyan-400/60 via-teal-300/30 to-amber-400/60 shadow-[0_0_20px_rgba(6,182,212,0.32)] group-hover:shadow-[0_0_30px_rgba(6,182,212,0.55),0_0_25px_rgba(245,158,11,0.35)] transition-shadow duration-300 pointer-events-none" 
            aria-hidden="true"
          />

          {/* Semi-transparent frosted glass body matching Picture 2 */}
          <span className="relative z-10 flex items-center justify-center px-7 py-3 sm:px-8 sm:py-3.5 rounded-full bg-[#5b9c9c]/35 backdrop-blur-xl text-[#0b140f] text-sm sm:text-base font-semibold tracking-normal shadow-[inset_0_1px_2px_rgba(255,255,255,0.7),inset_0_-1px_3px_rgba(0,0,0,0.05)] transition-all duration-200 group-hover:bg-[#5b9c9c]/50">
            <span className="text-[#09120d] drop-shadow-[0_1px_1px_rgba(255,255,255,0.7)] font-medium">
              Explore Map
            </span>
          </span>
        </button>

      </div>
    </section>
  );
}
