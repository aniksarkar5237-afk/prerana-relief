'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { QRCodeSVG } from 'qrcode.react';
import {
  X,
  ShieldCheck,
  ShieldAlert,
  Building2,
  CheckCircle2,
  Clock,
  Lock,
  Copy,
  Check,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  HeartHandshake,
  FileCode,
  Droplets,
  Ship,
  Sparkles,
  MapPin,
  QrCode
} from 'lucide-react';

export interface ZoneData {
  id?: number | string;
  state: string;
  district: string;
  score: number;
  rainfallIndex?: string;
  riverDanger?: string;
  unaddressedCount?: number;
  severity?: string;
}

export interface OnGroundNeedsModalProps {
  zone: ZoneData | null;
  isOpen: boolean;
  onClose: () => void;
  onContribute?: (zone: ZoneData, amount?: number) => void;
}

interface LogisticsItem {
  name: string;
  quantity: string;
  status: string;
  verified: boolean;
  type: 'medical' | 'rescue' | 'supplies';
}

interface ZoneEscrowDetails {
  hospitalName: string;
  hospitalWard: string;
  nodalOfficer: string;
  nodalTokenHash: string;
  isSignedOff: boolean;
  targetBudget: number;
  raisedBudget: number;
  escrowVpa: string;
  escrowContract: string;
  requisitionHash: string;
  merkleRootHash: string;
  logistics: LogisticsItem[];
}

// Zone-specific anti-fraud verification & dual-key escrow data
const ZONE_ESCROW_DIRECTORY: Record<string, ZoneEscrowDetails> = {
  Silchar: {
    hospitalName: 'Silchar Medical College & Hospital (SMCH)',
    hospitalWard: 'Emergency Ward & Critical Disaster Unit',
    nodalOfficer: 'Dr. B. K. Sarma (Chief Medical Superintendent)',
    nodalTokenHash: '0x71a938c94e82df4b11e4028bc189c',
    isSignedOff: true,
    targetBudget: 600000,
    raisedBudget: 480000,
    escrowVpa: 'smch.disaster.escrow@sbi',
    escrowContract: '0x94F2B761b8493Ad7E79Dca38D56C697aF4A0b22A',
    requisitionHash: '4f8e21a8c9b33e70d41829e0a6d2f345891ac378be8c41f7e0298a69e7f84102',
    merkleRootHash: '9b1a03e2c77d48fa918ec330b621184a29d45e6f3b0e1a87c12560938db4811a',
    logistics: [
      {
        name: '120 Units Emergency O-Negative Blood & Plasma',
        quantity: '120 Units',
        status: 'Hospital Verified',
        verified: true,
        type: 'medical'
      },
      {
        name: '400 IV Saline & Anti-Venom Vials',
        quantity: '400 Vials',
        status: 'Hospital Stock Ingested',
        verified: true,
        type: 'medical'
      },
      {
        name: '3 Embankment Rescue Dinghies',
        quantity: '3 Dinghies',
        status: 'District Disaster Authority Assigned',
        verified: true,
        type: 'rescue'
      }
    ]
  },
  Patna: {
    hospitalName: 'Patna Medical College & Hospital (PMCH)',
    hospitalWard: 'Trauma Center & Acute Flood Emergency Wing',
    nodalOfficer: 'Dr. Rajeshwar Prasad (Nodal Relief Officer)',
    nodalTokenHash: '0x42f831e09bc47da19c0882e7311d4',
    isSignedOff: true,
    targetBudget: 500000,
    raisedBudget: 310000,
    escrowVpa: 'pmch.flood.escrow@pnb',
    escrowContract: '0x71C9410D69A3B57f8E41029aB98205C90A81fe63',
    requisitionHash: 'd8291f0a51c4a91e847c21098b671a4f00938b71d45920a1ce87491029cfa421',
    merkleRootHash: '29c817ea4920b74109fa67d812398510acb782910ea571982b61908239ac8129',
    logistics: [
      {
        name: '350 Waterborne Pathology & Electrolyte Infusions',
        quantity: '350 Kits',
        status: 'Hospital Verified',
        verified: true,
        type: 'medical'
      },
      {
        name: '250 Tetanus & Anti-Rabies Vials',
        quantity: '250 Vials',
        status: 'Hospital Stock Ingested',
        verified: true,
        type: 'medical'
      },
      {
        name: '2 Motorized Relief Flotillas',
        quantity: '2 Boats',
        status: 'District Disaster Authority Assigned',
        verified: true,
        type: 'rescue'
      }
    ]
  },
  Wayanad: {
    hospitalName: 'Mananthavady District Hospital & Wayanad Triage Unit',
    hospitalWard: 'Emergency Disaster Resuscitation Wing',
    nodalOfficer: 'Dr. K. M. Varghese (District Triage Superintendent)',
    nodalTokenHash: '0x89e210b41198c77aa092147ff0128',
    isSignedOff: false, // Pending Clearance demonstration
    targetBudget: 500000,
    raisedBudget: 190000,
    escrowVpa: 'wayanad.relief.escrow@canara',
    escrowContract: '0x38B920Ca91f82710Ec9aB40219c4021984210Ac4',
    requisitionHash: '1098cfa432098e71629810ab28394019ea8192038751920839ca871920839410',
    merkleRootHash: '8839210928371902830918239019283019283019283019283019283019283019',
    logistics: [
      {
        name: '80 Orthopedic Trauma & Splinting Kits',
        quantity: '80 Kits',
        status: 'Pending Clearance',
        verified: false,
        type: 'medical'
      },
      {
        name: '300 Emergency Pediatric Rehydration Packs',
        quantity: '300 Packs',
        status: 'Inventory Allocated',
        verified: false,
        type: 'supplies'
      },
      {
        name: '2 Mud-Terrain Evacuation Stretchers',
        quantity: '2 Units',
        status: 'District Disaster Authority Assigned',
        verified: true,
        type: 'rescue'
      }
    ]
  }
};

export default function OnGroundNeedsModal({
  zone,
  isOpen,
  onClose,
  onContribute
}: OnGroundNeedsModalProps) {
  const [mounted, setMounted] = useState(false);
  const [showAuditTrail, setShowAuditTrail] = useState(false);
  const [showUpiEscrow, setShowUpiEscrow] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [customAmount, setCustomAmount] = useState<number>(1000);

  useEffect(() => {
    setMounted(true);
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!mounted || !isOpen || !zone) return null;

  // Retrieve or fallback data for the active district
  const districtKey = zone.district in ZONE_ESCROW_DIRECTORY ? zone.district : 'Silchar';
  const details = ZONE_ESCROW_DIRECTORY[districtKey] || ZONE_ESCROW_DIRECTORY.Silchar;

  const percentRaised = Math.min(
    100,
    Math.round((details.raisedBudget / details.targetBudget) * 100)
  );

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const copyToClipboard = (text: string, keyName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(keyName);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const upiPayLink = `upi://pay?pa=${details.escrowVpa}&pn=${encodeURIComponent(
    details.hospitalName
  )}&am=${customAmount}&cu=INR&tn=${encodeURIComponent(
    `ReliefGrid Escrow Requisition ${zone.district} [${details.nodalTokenHash.slice(0, 8)}]`
  )}`;

  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-[99999] bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
          onClick={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="relative w-full max-w-2xl my-auto bg-black/85 backdrop-blur-2xl border border-white/10 rounded-2xl p-6 sm:p-8 shadow-[0_25px_60px_rgba(0,0,0,0.85)] max-h-[92vh] overflow-y-auto text-slate-100"
          >
            {/* Ambient Top Glow Line */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 via-emerald-400 to-amber-500 rounded-t-2xl" />

            {/* Close Button */}
            <button
              onClick={onClose}
              aria-label="Close modal"
              className="absolute top-5 right-5 text-zinc-400 hover:text-white transition-colors bg-white/5 hover:bg-white/10 rounded-full p-2 border border-white/10 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono font-bold tracking-wider uppercase">
                  <Lock className="w-3.5 h-3.5 text-cyan-400" /> Anti-Fraud Dual-Key Escrow
                </span>
                <span className="text-xs text-zinc-400 font-mono">
                  ZONE #{zone.id || '01'}
                </span>
              </div>

              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight flex items-center gap-2">
                    <MapPin className="w-6 h-6 text-emerald-400 shrink-0" />
                    <span>{zone.district}, {zone.state}</span>
                  </h2>
                  <p className="text-xs sm:text-sm text-zinc-400 mt-1">
                    Verified on-ground requisition matrix and medical logistics ledger.
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-black text-emerald-400">
                    {zone.score}/100
                  </div>
                  <div className="text-[10px] text-zinc-400 uppercase tracking-widest font-mono">
                    Urgency Metric
                  </div>
                </div>
              </div>
            </div>

            {/* ------------------------------------------------------------- */}
            {/* 2. HOSPITAL SIGN-OFF & ANTI-FRAUD VERIFICATION SECTION        */}
            {/* ------------------------------------------------------------- */}
            <div className="p-4 sm:p-5 rounded-xl bg-slate-900/70 border border-white/10 mb-6">
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center shrink-0">
                    <Building2 className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <div className="text-[10px] uppercase font-mono tracking-wider text-zinc-400">
                      Linked Medical Institution
                    </div>
                    <div className="text-sm font-bold text-white leading-tight">
                      {details.hospitalName}
                    </div>
                    <div className="text-xs text-zinc-400">
                      {details.hospitalWard}
                    </div>
                  </div>
                </div>
              </div>

              {/* Hospital Clearance Badge */}
              <div className="mt-3 pt-3 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                {details.isSignedOff ? (
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs font-semibold tracking-wide shadow-[0_0_15px_rgba(16,185,129,0.15)]">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>HOSPITAL MANAGEMENT SIGNED // REQUISITION VERIFIED</span>
                  </div>
                ) : (
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-500/15 border border-amber-500/40 text-amber-300 text-xs font-semibold tracking-wide animate-pulse">
                    <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>PENDING HOSPITAL CLEARANCE - ESCROW FUNDS RESERVED</span>
                  </div>
                )}

                <div className="flex items-center gap-1.5 font-mono text-[11px] text-zinc-400 bg-black/40 px-2.5 py-1 rounded border border-white/5">
                  <span>Token:</span>
                  <span className="text-cyan-400 font-bold">
                    {details.nodalTokenHash.slice(0, 6)}...{details.nodalTokenHash.slice(-4)}
                  </span>
                  <button
                    onClick={() => copyToClipboard(details.nodalTokenHash, 'nodalToken')}
                    title="Copy full nodal token hash"
                    className="hover:text-white transition-colors cursor-pointer ml-1"
                  >
                    {copiedKey === 'nodalToken' ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Text note: Strict Escrow Guard */}
              <div className="mt-3 flex items-start gap-2 text-xs text-zinc-300 bg-black/30 p-2.5 rounded-lg border border-white/5">
                <ShieldAlert className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <p className="leading-relaxed">
                  <strong className="text-zinc-100">Strict Escrow Guard:</strong> Funds cannot be cashed out directly by volunteers. Relief capital is released exclusively against hospital management invoice hashes.
                </p>
              </div>
            </div>

            {/* ------------------------------------------------------------- */}
            {/* 3. DIRECT TRANSPARENCY & ESCROW TRACKER                       */}
            {/* ------------------------------------------------------------- */}
            <div className="p-4 sm:p-5 rounded-xl bg-slate-900/70 border border-white/10 mb-6">
              <div className="flex items-center justify-between mb-2">
                <div className="text-xs font-mono uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Dual-Key Escrow Allocation
                </div>
                <div className="text-xs font-bold text-emerald-400 font-mono">
                  {percentRaised}% Funded
                </div>
              </div>

              {/* Progress Bar in glowing amber/emerald */}
              <div className="relative w-full h-3 bg-slate-950 rounded-full overflow-hidden border border-white/10 p-0.5 mb-2">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-amber-500 via-emerald-400 to-cyan-400 shadow-[0_0_12px_rgba(52,211,153,0.6)] transition-all duration-700 ease-out"
                  style={{ width: `${percentRaised}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-zinc-400">
                  Raised: <strong className="text-emerald-400">{formatCurrency(details.raisedBudget)}</strong>
                </span>
                <span className="text-zinc-400">
                  Target: <strong className="text-white">{formatCurrency(details.targetBudget)}</strong>
                </span>
              </div>
            </div>

            {/* ------------------------------------------------------------- */}
            {/* ITEMIZED LOGISTICS LIST                                       */}
            {/* ------------------------------------------------------------- */}
            <div className="mb-6">
              <h3 className="text-xs font-mono uppercase tracking-wider text-zinc-400 mb-3 flex items-center gap-2">
                <FileCode className="w-4 h-4 text-cyan-400" /> Itemized Ground Logistics Requisitions
              </h3>

              <div className="space-y-2.5">
                {details.logistics.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3.5 rounded-xl bg-slate-900/60 border border-white/10 hover:border-cyan-500/30 transition-all hover:bg-slate-900/80"
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 p-1.5 rounded-lg bg-slate-800 border border-white/10 shrink-0">
                        {item.type === 'medical' && <Droplets className="w-4 h-4 text-red-400" />}
                        {item.type === 'rescue' && <Ship className="w-4 h-4 text-cyan-400" />}
                        {item.type === 'supplies' && <HeartHandshake className="w-4 h-4 text-amber-400" />}
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-zinc-100">
                          {item.name}
                        </div>
                        <div className="text-xs text-zinc-400 flex items-center gap-2 mt-0.5">
                          <span className="font-mono text-zinc-300">{item.quantity}</span>
                          <span>•</span>
                          <span className={item.verified ? 'text-emerald-400' : 'text-amber-400'}>
                            {item.status}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="self-end sm:self-center">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold tracking-wide uppercase font-mono ${
                          item.verified
                            ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/30'
                            : 'bg-amber-500/10 text-amber-300 border border-amber-500/30'
                        }`}
                      >
                        {item.verified ? (
                          <Check className="w-3 h-3 text-emerald-400" />
                        ) : (
                          <Clock className="w-3 h-3 text-amber-400" />
                        )}
                        {item.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ------------------------------------------------------------- */}
            {/* COLLAPSIBLE AUDIT TRAIL & HASHES DRAWER                       */}
            {/* ------------------------------------------------------------- */}
            <div className="mb-6">
              <button
                type="button"
                onClick={() => setShowAuditTrail(!showAuditTrail)}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-900/50 hover:bg-slate-900 border border-white/10 hover:border-cyan-500/40 text-xs font-mono text-cyan-300 flex items-center justify-between transition-all cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-cyan-400" />
                  <span>Inspect Audit Trail & SHA-256 Hashes</span>
                </span>
                {showAuditTrail ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </button>

              <AnimatePresence>
                {showAuditTrail && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden mt-2 p-4 rounded-xl bg-slate-950/80 border border-white/10 space-y-3 font-mono text-xs"
                  >
                    <div>
                      <div className="text-[10px] text-zinc-400 uppercase tracking-wider mb-1 flex items-center justify-between">
                        <span>SHA-256 Requisition Hash</span>
                        <button
                          onClick={() => copyToClipboard(details.requisitionHash, 'reqHash')}
                          className="text-cyan-400 hover:text-white flex items-center gap-1 cursor-pointer"
                        >
                          {copiedKey === 'reqHash' ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-400" /> Copied
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" /> Copy
                            </>
                          )}
                        </button>
                      </div>
                      <div className="p-2 rounded bg-black/60 border border-white/5 text-[11px] text-zinc-300 break-all select-all">
                        {details.requisitionHash}
                      </div>
                    </div>

                    <div>
                      <div className="text-[10px] text-zinc-400 uppercase tracking-wider mb-1 flex items-center justify-between">
                        <span>SHA-256 Merkle Root Integrity</span>
                        <button
                          onClick={() => copyToClipboard(details.merkleRootHash, 'merkleHash')}
                          className="text-cyan-400 hover:text-white flex items-center gap-1 cursor-pointer"
                        >
                          {copiedKey === 'merkleHash' ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-400" /> Copied
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" /> Copy
                            </>
                          )}
                        </button>
                      </div>
                      <div className="p-2 rounded bg-black/60 border border-white/5 text-[11px] text-zinc-300 break-all select-all">
                        {details.merkleRootHash}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-white/5">
                      <div>
                        <div className="text-[10px] text-zinc-400 uppercase">Escrow Contract</div>
                        <div className="text-zinc-200 text-[11px] truncate">{details.escrowContract}</div>
                      </div>
                      <div>
                        <div className="text-[10px] text-zinc-400 uppercase">Dual-Key Nodal Status</div>
                        <div className="text-emerald-400 text-[11px] font-bold">
                          {details.isSignedOff ? '2/2 Multi-Sig Confirmed' : '1/2 Signatures (Hospital Pending)'}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* ------------------------------------------------------------- */}
            {/* COLLAPSIBLE ESCROW UPI CONTRIBUTION DRAWER                    */}
            {/* ------------------------------------------------------------- */}
            <AnimatePresence>
              {showUpiEscrow && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.25 }}
                  className="overflow-hidden mb-6 p-5 rounded-xl bg-slate-950/90 border border-emerald-500/30 text-center"
                >
                  <div className="flex items-center justify-center gap-2 text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider mb-3">
                    <QrCode className="w-4 h-4" /> Hospital Dual-Key Escrow UPI QR
                  </div>

                  {/* QR Code Container */}
                  <div className="inline-block p-3.5 bg-white rounded-2xl shadow-xl border-4 border-emerald-400/30 mb-4">
                    <QRCodeSVG
                      value={upiPayLink}
                      size={170}
                      level="H"
                      includeMargin={false}
                    />
                  </div>

                  <div className="text-xs font-mono text-zinc-300 mb-3">
                    VPA: <strong className="text-white select-all">{details.escrowVpa}</strong>
                  </div>

                  {/* Preset Amount Pills */}
                  <div className="flex items-center justify-center gap-2 mb-4">
                    {[500, 1000, 2500, 5000].map((amt) => (
                      <button
                        key={amt}
                        type="button"
                        onClick={() => setCustomAmount(amt)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                          customAmount === amt
                            ? 'bg-emerald-500 text-black shadow-[0_0_10px_rgba(16,185,129,0.5)]'
                            : 'bg-white/5 hover:bg-white/10 text-zinc-300 border border-white/10'
                        }`}
                      >
                        ₹{amt}
                      </button>
                    ))}
                  </div>

                  <a
                    href={upiPayLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs tracking-wider uppercase transition-colors shadow-lg cursor-pointer"
                  >
                    <span>Launch Mobile UPI App</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </motion.div>
              )}
            </AnimatePresence>

            {/* ------------------------------------------------------------- */}
            {/* ACTION BUTTONS                                                */}
            {/* ------------------------------------------------------------- */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  setShowUpiEscrow(!showUpiEscrow);
                  if (onContribute) {
                    onContribute(zone, customAmount);
                  }
                }}
                className="flex-1 py-3 px-5 rounded-xl bg-gradient-to-r from-amber-500 to-emerald-500 hover:from-amber-400 hover:to-emerald-400 text-black font-bold text-sm tracking-wide shadow-[0_0_20px_rgba(16,185,129,0.35)] transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
              >
                <HeartHandshake className="w-4 h-4 text-black" />
                <span>Contribute via Escrow UPI</span>
              </button>

              <button
                type="button"
                onClick={() => setShowAuditTrail(!showAuditTrail)}
                className="py-3 px-5 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white font-medium text-sm border border-white/10 hover:border-white/20 transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <FileCode className="w-4 h-4 text-cyan-400" />
                <span>{showAuditTrail ? 'Hide Hashes' : 'Inspect Audit Trail & Hashes'}</span>
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );

  return typeof document !== 'undefined'
    ? createPortal(modalContent, document.body)
    : null;
}

