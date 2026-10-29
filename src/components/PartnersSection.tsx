'use client';
import React, { useState } from 'react';
import {
  ShieldCheck,
  Anchor,
  Building2,
  GraduationCap,
  ExternalLink,
  MapPin,
  CheckCircle2,
  Copy,
  Check,
  Search,
  Filter,
} from 'lucide-react';

export default function PartnersSection() {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const partners = [
    {
      id: 'p1',
      name: 'Sundarbans Riverine Flotilla Union',
      category: 'Ground Rescue Flotillas',
      sector: 'Gosaba & Basanti Delta, West Bengal',
      badge: 'DARPAN / FLOT-2026/09',
      vpa: 'gosabaflotilla@upi',
      ledgerHash: '0x9482f...a71c89e2',
      equipment: '18 Motorized Rescue Dinghies • 4 Evacuation Barges',
      verified: true,
      description: 'Indigenous delta boatmen network trained in nocturnal storm-surge navigation and mangrove creek rescue operations.',
    },
    {
      id: 'p2',
      name: 'Assam Valley Flood Relief Corps',
      category: 'Verified Non-Profits',
      sector: 'Silchar & Cachar District, Assam',
      badge: 'NITI Aayog / 80G Certified',
      vpa: 'assamrelief@upi',
      ledgerHash: '0x4f12a...7830bca1',
      equipment: 'Mobile Water Purification Units • 500 Emergency Shelter Kits',
      verified: true,
      description: 'Decentralized disaster response squad managing on-ground food triage, chlorine purification, and maternity kits.',
    },
    {
      id: 'p3',
      name: 'JIS College of Engineering (R&D Lab)',
      category: 'Academic & Technology Research',
      sector: 'Kalyani & Delta Sensor Testing Grid, WB',
      badge: 'Autonomous AI & Telemetry Partner',
      vpa: 'jislab@upi',
      ledgerHash: '0x17b3c...9825f0a4',
      equipment: 'LoRa River Stage Sensors • dHash Image Forensic Engine',
      verified: true,
      description: 'Pioneering offline USSD predictive natural language triage and edge-computing hydrological river sensor firmware.',
    },
    {
      id: 'p4',
      name: 'Coastal Odisha Disaster Response Taskforce',
      category: 'Verified Non-Profits',
      sector: 'Puri & Kendrapara Coastline, Odisha',
      badge: 'NITI Aayog / 80G Certified',
      vpa: 'coastalcare@upi',
      ledgerHash: '0x8820c...ef347b19',
      equipment: 'Amphibious All-Terrain Transporters • Satellite Terminals',
      verified: true,
      description: 'Specialized cyclone response corps coordinating zero-casualty village relocations to elevated multipurpose shelters.',
    },
    {
      id: 'p5',
      name: 'Barak Valley Marine Rescue Co-op',
      category: 'Ground Rescue Flotillas',
      sector: 'Hailakandi & Karimganj Embankments, Assam',
      badge: 'Marine Safety Certified',
      vpa: 'barakrescue@upi',
      ledgerHash: '0x32c81...a45e9981',
      equipment: 'High-Draft Inflatable Zodiacs • Medical Trauma Rafts',
      verified: true,
      description: 'Riverine volunteer unit operating 24/7 during flash inundations to extract elderly villagers and livestock.',
    },
    {
      id: 'p6',
      name: 'Wayanad Hill Community First Responders',
      category: 'Verified Non-Profits',
      sector: 'Meppadi & Chooralmala Hills, Kerala',
      badge: 'Disaster Management Board Reg.',
      vpa: 'keralacare@upi',
      ledgerHash: '0x55d14...99872e41',
      equipment: 'Debris Trench Extractors • Emergency Satellite Radios',
      verified: true,
      description: 'Rapid-deployment mountaineering search team specializing in cloudburst and landslide victim stabilization.',
    },
  ];

  const categories = ['All', 'Ground Rescue Flotillas', 'Verified Non-Profits', 'Academic & Technology Research'];

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredPartners = partners.filter((p) => {
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sector.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.equipment.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 sm:pt-36 pb-20">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0E1626]/80 border border-slate-700/60 backdrop-blur-xl text-xs font-mono font-bold text-cyan-300 uppercase tracking-wider mb-4">
          <Anchor className="w-3.5 h-3.5 text-cyan-400" /> Verified On-Ground Alliances & Research Nodes
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-4">
          Trusted Ground Partners & Escrow Nodes
        </h1>
        <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Every partner is cryptographically audited, NITI Aayog DARPAN-verified, and bonded through milestone escrow smart contracts for zero leakage.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-10 bg-[#0E1626]/75 backdrop-blur-xl border border-slate-700/60 p-3 rounded-2xl shadow-xl">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60 border border-transparent'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search Field */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search sector, team, or flotilla..."
            className="w-full pl-9 pr-3 py-1.5 bg-slate-900/90 border border-slate-700/80 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400"
          />
        </div>
      </div>

      {/* Partners Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPartners.map((partner) => (
          <div
            key={partner.id}
            className="group bg-[#0E1626]/75 hover:bg-[#0E1626]/90 backdrop-blur-xl border border-slate-700/60 hover:border-cyan-400/40 rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 shadow-[0_8px_30px_rgba(0,0,0,0.3)] flex flex-col justify-between"
          >
            <div>
              {/* Category Icon & Badge */}
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-mono uppercase tracking-wider px-2.5 py-1 rounded-md bg-slate-900 border border-slate-700/80 text-cyan-300 font-semibold">
                  {partner.category}
                </span>
                <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Verified
                </div>
              </div>

              {/* Title */}
              <h3 className="text-lg font-bold text-white mb-2 group-hover:text-cyan-300 transition-colors">
                {partner.name}
              </h3>

              {/* Sector */}
              <div className="flex items-center gap-1.5 text-xs text-slate-300 mb-3 font-medium">
                <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                <span>{partner.sector}</span>
              </div>

              {/* Description */}
              <p className="text-xs text-slate-400 leading-relaxed mb-4">
                {partner.description}
              </p>

              {/* Capabilities */}
              <div className="bg-slate-900/60 border border-slate-800 p-2.5 rounded-xl text-xs mb-4">
                <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block mb-0.5">
                  Assigned Hardware / Equipment
                </span>
                <span className="text-slate-200 font-medium">{partner.equipment}</span>
              </div>
            </div>

            {/* Public Escrow & VPA Footer */}
            <div className="pt-4 border-t border-slate-800/80 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-slate-400 font-mono">Escrow VPA:</span>
                <button
                  type="button"
                  onClick={() => copyToClipboard(partner.vpa, partner.id + '-vpa')}
                  className="font-mono text-cyan-300 hover:text-white flex items-center gap-1 transition-colors"
                >
                  <span>{partner.vpa}</span>
                  {copiedId === partner.id + '-vpa' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3 text-slate-500" />}
                </button>
              </div>

              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-500 font-mono">Public Ledger:</span>
                <span className="font-mono text-slate-400">{partner.ledgerHash}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
