'use client';
import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { QRCodeSVG } from 'qrcode.react';
import { X, ShieldCheck, HeartHandshake, CheckCircle2 } from 'lucide-react';

interface QuickDonationModalProps {
  cause: any;
  onClose: () => void;
}

export default function QuickDonationModal({ cause, onClose }: QuickDonationModalProps) {
  const [mounted, setMounted] = useState(false);
  const [amount, setAmount] = useState(1000);
  const presetAmounts = [200, 500, 1000, 2500];

  useEffect(() => {
    setMounted(true);
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!mounted || !cause) return null;

  const orgName = cause.ngo || cause.orgName || cause.charity_name || 'Verified Ground Team';
  const vpa = cause.ngo_vpa || 'donate@upi';
  const upiString = `upi://pay?pa=${vpa}&pn=${encodeURIComponent(orgName)}&am=${amount}&cu=INR&tn=${encodeURIComponent('Relief: ' + (cause.title || 'Emergency Aid'))}`;

  const modal = (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[99999] bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-md my-auto bg-[#0F172A] border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="h-1.5 w-full bg-gradient-to-r from-blue-500 via-cyan-400 to-emerald-400" />

        <button
          onClick={onClose}
          aria-label="Close modal"
          className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors bg-slate-800/80 hover:bg-slate-700 rounded-full p-2 z-10 border border-slate-700"
        >
          <X size={18} />
        </button>

        <div className="p-6 sm:p-8 max-h-[85vh] overflow-y-auto">
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-2">
            <HeartHandshake className="w-4 h-4" /> Direct Impact Donation
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-1.5 leading-tight">{cause.title}</h2>
          <p className="text-xs sm:text-sm text-slate-400 mb-5 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Verified Recipient: <strong className="text-slate-200">{orgName}</strong></span>
          </p>

          <div className="flex justify-center mb-6">
            <div className="p-3 bg-white rounded-2xl shadow-[0_0_30px_rgba(59,130,246,0.25)] border border-slate-200">
              <QRCodeSVG value={upiString} size={180} />
            </div>
          </div>

          <div className="mb-5">
            <label className="block text-xs font-semibold text-slate-300 mb-2">Select Contribution (₹)</label>
            <div className="grid grid-cols-4 gap-2 mb-3">
              {presetAmounts.map((amt) => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => setAmount(amt)}
                  className={`py-2 rounded-xl text-xs sm:text-sm font-bold transition-all border ${
                    amount === amt
                      ? 'bg-blue-600 text-white border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.4)]'
                      : 'bg-slate-800/70 text-slate-300 border-slate-700 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  ₹{amt}
                </button>
              ))}
            </div>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">₹</span>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="w-full pl-9 pr-4 py-2.5 bg-slate-900 border border-slate-700 text-white rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder:text-slate-600 text-sm font-semibold"
                placeholder="Custom amount"
              />
            </div>
          </div>

          <a
            href={upiString}
            className="w-full block text-center bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold py-3.5 rounded-xl active:scale-[0.98] transition-all shadow-[0_0_20px_rgba(6,182,212,0.3)] mb-4 text-sm"
          >
            Open UPI App (GPay / PhonePe / Paytm)
          </a>

          <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3 text-center">
            <p className="text-xs text-emerald-300 font-medium leading-relaxed">
              <span className="flex items-center justify-center gap-1 font-bold text-emerald-400 mb-0.5">
                <CheckCircle2 className="w-3.5 h-3.5" /> 100% Direct Field Settlement
              </span>
              ₹{amount.toLocaleString()} goes to {vpa}. Zero MDR, zero platform deductions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  return typeof document !== 'undefined' ? createPortal(modal, document.body) : null;
}
