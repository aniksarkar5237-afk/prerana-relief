import React from 'react';
import { ShieldCheck, Info } from 'lucide-react';

export default function TrustBadge({ score, darpanId, panNumber, verified }) {
  if (!verified) return null;

  return (
    <div className="relative group inline-flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/20 backdrop-blur-md px-2.5 py-1 rounded-full cursor-help">
      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
      <span className="text-[10px] font-bold text-emerald-300 uppercase tracking-wider">Verified NGO</span>
      
      <div className="w-4 h-4 rounded-full border-[1.5px] border-emerald-500/40 flex items-center justify-center relative">
        {/* Simple score ring abstraction */}
        <svg viewBox="0 0 36 36" className="w-full h-full absolute transform -rotate-90">
          <path
            className="text-slate-700/50"
            strokeWidth="3"
            stroke="currentColor"
            fill="none"
            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
          />
          <path
            className="text-emerald-400 drop-shadow-[0_0_2px_rgba(52,211,153,0.8)]"
            strokeWidth="3"
            strokeDasharray={`${score}, 100`}
            stroke="currentColor"
            fill="none"
            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
          />
        </svg>
      </div>

      {/* Tooltip */}
      <div className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 w-56 p-3 bg-slate-900/95 backdrop-blur-xl border border-slate-700 rounded-xl shadow-2xl opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-200 translate-y-2 group-hover:translate-y-0">
        <div className="flex items-center gap-2 mb-2 pb-2 border-b border-slate-800">
          <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
             <span className="text-emerald-400 font-bold text-xs">{score}</span>
          </div>
          <span className="text-slate-200 font-semibold text-xs">Trust Rating</span>
        </div>
        <ul className="space-y-1.5 text-[10px]">
          <li className="flex items-start gap-1.5 text-slate-300">
            <ShieldCheck className="w-3 h-3 text-emerald-400 shrink-0 mt-0.5" />
            <span>Govt Darpan Check: Validated ({darpanId || 'Verified'})</span>
          </li>
          <li className="flex items-start gap-1.5 text-slate-300">
            <ShieldCheck className="w-3 h-3 text-emerald-400 shrink-0 mt-0.5" />
            <span>Statutory PAN Format: Verified ({panNumber ? '***'+panNumber.slice(-4) : 'Verified'})</span>
          </li>
          <li className="flex items-start gap-1.5 text-slate-300">
            <ShieldCheck className="w-3 h-3 text-emerald-400 shrink-0 mt-0.5" />
            <span>OCR Document Sanity: Cleared by Sentinel Agent</span>
          </li>
        </ul>
        <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-slate-900 border-b border-r border-slate-700 rotate-45"></div>
      </div>
    </div>
  );
}
