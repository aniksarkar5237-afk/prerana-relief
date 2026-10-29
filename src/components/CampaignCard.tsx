import React from 'react';
import { ShieldCheck, TrendingUp, AlertTriangle, AlertCircle, Activity, Camera } from 'lucide-react';
import TrustBadge from './TrustBadge';

export default function CampaignCard({ campaign, onDonateClick, onViewProofs }) {
  const percent = Math.min((campaign.raised / campaign.target) * 100, 100);

  const getPriorityStyle = (priority) => {
    switch(priority) {
      case 'P0': return 'bg-red-500/20 text-red-400 border-red-500/50';
      case 'P1': return 'bg-amber-500/20 text-amber-400 border-amber-500/50';
      case 'P2': return 'bg-cyan-500/20 text-cyan-400 border-cyan-500/50';
      default: return null;
    }
  };

  const getPriorityIcon = (priority) => {
    switch(priority) {
      case 'P0': return <AlertTriangle className="w-3 h-3" />;
      case 'P1': return <AlertCircle className="w-3 h-3" />;
      case 'P2': return <Activity className="w-3 h-3" />;
      default: return null;
    }
  };
  
  const getCategoryTheme = (cat: string) => {
    switch (cat?.toLowerCase()) {
      case 'education':
        return 'from-blue-900/60 via-indigo-900/40 to-slate-900';
      case 'healthcare':
        return 'from-emerald-900/60 via-teal-900/40 to-slate-900';
      case 'food kits':
        return 'from-amber-900/60 via-orange-900/40 to-slate-900';
      case 'flood relief':
      default:
        return 'from-cyan-900/60 via-blue-900/40 to-slate-900';
    }
  };

  return (
    <div className="glass-panel rounded-2xl overflow-hidden flex flex-col h-full border border-slate-800/80 hover:border-cyan-500/40 transition-all duration-300 hover:-translate-y-1 shadow-lg hover:shadow-[0_10px_30px_rgba(6,182,212,0.15)] group">
      <div className={`h-44 bg-gradient-to-br ${getCategoryTheme(campaign.category)} relative overflow-hidden flex items-center justify-center p-6 border-b border-slate-800/80`}>
        {/* Subtle decorative glow orb */}
        <div className="absolute -right-6 -bottom-6 w-32 h-32 rounded-full bg-white/5 blur-xl group-hover:scale-150 transition-transform duration-700 pointer-events-none" />
        
        <div className="absolute top-3 left-3 bg-slate-950/70 backdrop-blur-md px-2.5 py-1 rounded-lg text-xs font-bold text-white border border-white/10 shadow-sm">
          {campaign.category}
        </div>
        {campaign.taxExempt && (
          <div className="absolute top-3 right-3 flex items-center gap-1 bg-emerald-500/20 backdrop-blur-md px-2.5 py-1 rounded-lg text-xs font-bold text-emerald-300 border border-emerald-500/30">
            <ShieldCheck className="w-3.5 h-3.5" /> 80G Tax Benefit
          </div>
        )}
        {campaign.priority && (
          <div className={`absolute bottom-3 left-3 flex items-center gap-1.5 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${getPriorityStyle(campaign.priority)} shadow-md`}>
            {getPriorityIcon(campaign.priority)} {campaign.priority} Urgency
          </div>
        )}
      </div>
      
      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-lg font-bold text-white leading-tight group-hover:text-blue-400 transition-colors mr-2">{campaign.title}</h3>
          <TrustBadge 
            score={campaign.trustScore || 88} 
            darpanId={campaign.darpanId || 'DL/2026/019'}
            panNumber={campaign.panNumber || 'ABCDE1234F'}
            verified={campaign.verified !== false}
          />
        </div>
        <p className="text-sm text-slate-400 mb-4 line-clamp-2">{campaign.description}</p>
        
        <div className="mt-auto space-y-3 mb-5">
          <div className="flex justify-between text-xs font-medium">
            <span className="flex items-center gap-1 text-slate-300"><TrendingUp className="w-3 h-3 text-cyan-400"/> {percent.toFixed(0)}% Raised</span>
            <span className="text-slate-500">Goal: ₹{(campaign.target/100000).toFixed(1)}L</span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-500 to-cyan-400 h-full rounded-full relative">
               <div className="absolute top-0 right-0 bottom-0 w-10 bg-white/20 blur-[2px]"></div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <button 
            onClick={() => onViewProofs && onViewProofs(campaign)}
            className="w-full py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 font-semibold text-xs transition-colors border border-slate-700 hover:border-slate-500 flex flex-col items-center justify-center gap-0.5"
          >
            <span className="flex items-center gap-1"><Camera className="w-3.5 h-3.5" /> Proofs</span>
            <span className="text-[10px] font-normal opacity-70">{campaign.proofCount || 4} Verified</span>
          </button>
          
          <button 
            onClick={() => onDonateClick(campaign)}
            className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm transition-all border border-blue-500 hover:border-transparent hover:shadow-[0_0_15px_rgba(59,130,246,0.5)] flex items-center justify-center"
          >
            Support
          </button>
        </div>
      </div>
    </div>
  );
}
