'use client';
import React, { useState } from 'react';
import { Menu, X, ArrowUpRight } from 'lucide-react';
import QuickDistressReporter from './QuickDistressReporter';

interface NavbarProps {
  onOpenReporter?: () => void;
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

export default function Navbar({ onOpenReporter, activeTab = 'Home', onTabChange }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [localReporterOpen, setLocalReporterOpen] = useState(false);

  const handleOpenReporter = () => {
    if (onOpenReporter) {
      onOpenReporter();
    } else {
      setLocalReporterOpen(true);
    }
  };

  const navTabs = [
    { name: 'Home', hasDot: false },
    { name: 'About us', hasDot: false },
    { name: 'Live Radar Map', hasDot: true },
    { name: 'Disaster Dashboard', hasDot: true },
    { name: 'Partners', hasDot: true },
    { name: 'Contact us', hasDot: false },
  ];

  const handleTabClick = (tabName: string) => {
    if (onTabChange) {
      onTabChange(tabName);
    }
  };

  const isHome = activeTab === 'Home';

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-4 sm:px-8 lg:px-12 pt-4 sm:pt-6">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Brand Logo - PRERANAAID // RELIEFGRID matching image_16.png */}
        <button
          type="button"
          onClick={() => handleTabClick('Home')}
          className="flex items-center gap-2 group select-none text-left cursor-pointer"
        >
          <span
            className={`text-sm sm:text-base font-mono font-extrabold tracking-wider transition-colors ${
              isHome
                ? 'text-[#1a1f1b] drop-shadow-sm'
                : 'text-white drop-shadow-[0_0_12px_rgba(255,255,255,0.4)]'
            }`}
          >
            PRERANAAID // RELIEFGRID
          </span>
        </button>

        {/* Floating Enclosed Pill-Shaped Navigation Bar (Center Tube) */}
        <div
          className={`hidden lg:flex items-center rounded-full px-2 py-1.5 transition-all duration-300 ${
            isHome
              ? 'bg-white/80 hover:bg-white/90 backdrop-blur-xl border border-white/80 shadow-[0_4px_24px_rgba(0,0,0,0.06)]'
              : 'bg-[#0E1626]/80 hover:bg-[#0E1626]/90 backdrop-blur-2xl border border-slate-700/60 shadow-[0_4px_30px_rgba(0,0,0,0.5)]'
          }`}
        >
          {navTabs.map((tab) => {
            const isActive = activeTab === tab.name;
            return (
              <button
                key={tab.name}
                type="button"
                onClick={() => handleTabClick(tab.name)}
                className={`transition-all duration-200 text-xs xl:text-sm cursor-pointer flex items-center gap-1 ${
                  isActive
                    ? isHome
                      ? 'bg-[#1e231f] text-white shadow-sm font-semibold rounded-full px-4 py-1.5'
                      : 'bg-[#1e293b]/95 text-white shadow-sm font-semibold rounded-full px-4 py-1.5 border border-slate-600/60'
                    : isHome
                    ? 'text-[#444c45] hover:text-[#181c19] px-3.5 py-1.5 rounded-full hover:bg-black/5 font-medium'
                    : 'text-slate-300 hover:text-white px-3.5 py-1.5 rounded-full hover:bg-white/5 font-medium'
                }`}
              >
                <span>{tab.name}</span>
                {tab.hasDot && (
                  <span className={`font-bold text-xs ${isHome ? 'text-cyan-600' : 'text-cyan-400'}`}>
                    •
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Top Right Action Buttons */}
        <div className="hidden sm:flex items-center gap-2.5">
          {/* Rounded Pill-Shaped "Launch Grid" Button */}
          <button
            type="button"
            onClick={handleOpenReporter}
            className={`px-4 sm:px-5 py-2 rounded-full text-xs sm:text-sm font-semibold tracking-tight transition-all duration-200 backdrop-blur-md shadow-md cursor-pointer flex items-center gap-1.5 ${
              isHome
                ? 'border border-[#2b332c]/50 bg-white/50 hover:bg-white/85 text-[#1b211c]'
                : 'border border-slate-700/70 bg-[#0E1626]/80 hover:bg-[#1E293B] text-slate-100 hover:border-cyan-400/50 shadow-[0_0_15px_rgba(6,182,212,0.15)]'
            }`}
          >
            <span>Launch Grid</span>
          </button>

          {/* Small Circular Toggle Icon */}
          <button
            type="button"
            onClick={handleOpenReporter}
            title="Toggle Emergency Command Console"
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#1e231f] hover:bg-[#121613] text-white flex items-center justify-center transition-transform hover:scale-105 active:scale-95 shadow-md border border-slate-700/50 cursor-pointer"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
              <path d="M12 3 A9 9 0 0 1 12 21 Z" fill="currentColor" />
            </svg>
          </button>
        </div>

        {/* Mobile Menu Button */}
        <div className="lg:hidden flex items-center gap-2">
          <button
            type="button"
            onClick={handleOpenReporter}
            className={`sm:hidden px-3 py-1.5 rounded-full text-xs font-semibold ${
              isHome
                ? 'border border-slate-700/40 bg-white/60 text-slate-900'
                : 'border border-slate-700/60 bg-[#0E1626]/80 text-white'
            }`}
          >
            Launch Grid
          </button>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`w-9 h-9 rounded-full flex items-center justify-center shadow-sm cursor-pointer ${
              isHome
                ? 'bg-white/80 border border-white/80 text-[#1e231f]'
                : 'bg-[#0E1626]/80 border border-slate-700/60 text-white'
            }`}
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isOpen && (
        <div
          className={`lg:hidden mt-3 max-w-md mx-auto backdrop-blur-2xl rounded-3xl p-5 shadow-2xl animate-in fade-in zoom-in-95 duration-200 ${
            isHome
              ? 'bg-white/95 border border-white/80 text-slate-900'
              : 'bg-[#0E1626]/95 border border-slate-700/80 text-white'
          }`}
        >
          <div className="flex flex-col space-y-2">
            {navTabs.map((tab) => (
              <button
                key={tab.name}
                type="button"
                onClick={() => {
                  handleTabClick(tab.name);
                  setIsOpen(false);
                }}
                className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors text-left w-full cursor-pointer flex items-center justify-between ${
                  activeTab === tab.name
                    ? isHome
                      ? 'bg-[#1e231f] text-white'
                      : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    : isHome
                    ? 'text-[#444c45] hover:bg-slate-100 hover:text-black'
                    : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                }`}
              >
                <span>{tab.name}</span>
                {tab.hasDot && <span className="text-cyan-400 font-bold">•</span>}
              </button>
            ))}
            <div className={`h-px my-2 ${isHome ? 'bg-slate-200' : 'bg-slate-800'}`} />
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                handleOpenReporter();
              }}
              className="w-full py-3 rounded-full bg-[#1e231f] hover:bg-[#121613] text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-md cursor-pointer border border-slate-700/50"
            >
              <span>Launch Emergency Grid</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {!onOpenReporter && localReporterOpen && <QuickDistressReporter onClose={() => setLocalReporterOpen(false)} />}
    </nav>
  );
}
