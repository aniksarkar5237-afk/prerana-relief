'use client';
import React, { useState } from 'react';
import CampaignCard from './CampaignCard';

const MOCK_CAMPAIGNS = [
  {
    id: 1,
    title: "Provide Education for 500 Orphaned Children",
    description: "Help us build a new school wing and provide study materials for the upcoming academic year.",
    category: "Education",
    taxExempt: true,
    target: 1200000,
    raised: 850000,
    ngo_vpa: "edu@upi",
    orgName: "Child First Foundation",
    priority: "P1",
    proofCount: 8
  },
  {
    id: 2,
    title: "Emergency Medical Kits for Rural Clinics",
    description: "Supplying vital medicines and first-aid kits to 15 remote villages lacking healthcare access.",
    category: "Healthcare",
    taxExempt: true,
    target: 500000,
    raised: 120000,
    ngo_vpa: "health@upi",
    orgName: "Rural MedCorps",
    priority: "P0",
    proofCount: 15
  },
  {
    id: 3,
    title: "Monthly Food Rations for Elderly Widows",
    description: "Ensuring 200 elderly women receive nutritious food kits every month.",
    category: "Food Kits",
    taxExempt: false,
    target: 300000,
    raised: 280000,
    ngo_vpa: "food@upi",
    orgName: "Care & Share"
  }
];

const FILTERS = ["All", "Flood Relief", "Healthcare", "Food Kits", "Education"];

export default function CampaignFeed({ onDonateClick, onViewProofs }) {
  const [activeFilter, setActiveFilter] = useState("All");

  const filtered = activeFilter === "All" ? MOCK_CAMPAIGNS : MOCK_CAMPAIGNS.filter(c => c.category === activeFilter);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-slate-800/50">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">Verified Campaigns</h2>
        <p className="text-slate-400 font-medium mb-6">Support ongoing community initiatives with zero platform fees.</p>
        
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {FILTERS.map(f => (
            <button 
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all border ${
                activeFilter === f 
                  ? 'bg-blue-600/20 text-blue-400 border-blue-500/30' 
                  : 'bg-slate-800/50 text-slate-400 border-slate-700 hover:bg-slate-800 hover:text-slate-300'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map(campaign => (
          <CampaignCard key={campaign.id} campaign={campaign} onDonateClick={onDonateClick} onViewProofs={onViewProofs} />
        ))}
      </div>
    </div>
  );
}
