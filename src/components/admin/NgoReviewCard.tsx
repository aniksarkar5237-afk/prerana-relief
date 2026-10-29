'use client';
import React, { useState } from 'react';
import { CheckCircle, XCircle, FileText, Image as ImageIcon, Shield, AlertTriangle } from 'lucide-react';

interface PastWork {
  project_name: string;
  proof_url: string;
  description: string;
  created_at: string;
}

interface NGOProfile {
  id: number;
  org_name: string;
  user_name: string;
  email: string;
  darpan_id: string;
  doc_12a_url?: string;
  doc_80g_url?: string;
  past_work?: PastWork[];
  integrity_score: number;
}

interface Props {
  ngo: NGOProfile;
  onApprove: (id: number) => void;
  onReject: (id: number, reason: string) => void;
}

export default function NgoReviewCard({ ngo, onApprove, onReject }: Props) {
  const [rejectReason, setRejectReason] = useState('');
  const [showRejectInput, setShowRejectInput] = useState(false);

  const handleReject = () => {
    if (rejectReason.trim().length === 0) return;
    onReject(ngo.id, rejectReason);
  };

  return (
    <div className="glass-panel rounded-2xl p-6 border border-slate-700/50 hover:border-blue-500/30 transition-all shadow-[0_4px_30px_rgba(0,0,0,0.1)] relative overflow-hidden">
      {/* Integrity Badge */}
      <div className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-800/80 border border-slate-700">
        <Shield className={`w-4 h-4 ${ngo.integrity_score > 80 ? 'text-green-400' : 'text-amber-400'}`} />
        <span className="text-sm font-bold text-slate-200">Score: {ngo.integrity_score}</span>
      </div>

      <h3 className="text-2xl font-bold text-white mb-1">{ngo.org_name}</h3>
      <p className="text-slate-400 text-sm font-medium mb-6">
        Applicant: {ngo.user_name} &bull; {ngo.email}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Documents Column */}
        <div className="space-y-4">
          <h4 className="text-sm font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
            <FileText className="w-4 h-4 text-blue-400" />
            Statutory Documents
          </h4>
          <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-800 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-slate-400 text-sm">Darpan ID</span>
              <span className="text-white font-mono text-sm bg-slate-800 px-2 py-1 rounded">{ngo.darpan_id || 'N/A'}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400 text-sm">12A Certificate</span>
              {ngo.doc_12a_url ? (
                <a href={ngo.doc_12a_url} target="_blank" rel="noreferrer" className="text-blue-400 hover:text-blue-300 text-sm font-medium flex items-center gap-1">
                  View <FileText className="w-3 h-3" />
                </a>
              ) : (
                <span className="text-slate-600 text-sm">Missing</span>
              )}
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400 text-sm">80G Certificate</span>
              {ngo.doc_80g_url ? (
                <a href={ngo.doc_80g_url} target="_blank" rel="noreferrer" className="text-blue-400 hover:text-blue-300 text-sm font-medium flex items-center gap-1">
                  View <FileText className="w-3 h-3" />
                </a>
              ) : (
                <span className="text-slate-600 text-sm">Missing</span>
              )}
            </div>
          </div>
        </div>

        {/* Past Work Column */}
        <div className="space-y-4">
          <h4 className="text-sm font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
            <ImageIcon className="w-4 h-4 text-purple-400" />
            Field Proofs
          </h4>
          <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-800 h-full">
            {ngo.past_work && ngo.past_work.length > 0 ? (
              <div className="space-y-3">
                {ngo.past_work.map((work, idx) => (
                  <div key={idx} className="flex gap-3 items-start p-2 rounded-lg bg-slate-800/50">
                    <img src={work.proof_url} alt="Proof" className="w-12 h-12 rounded object-cover border border-slate-700" />
                    <div>
                      <p className="text-white text-sm font-medium line-clamp-1">{work.project_name}</p>
                      <p className="text-slate-400 text-xs line-clamp-2">{work.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-slate-500 gap-2">
                <AlertTriangle className="w-6 h-6 text-amber-500/50" />
                <span className="text-sm">No past work submitted</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Action Area */}
      {showRejectInput ? (
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 animate-in fade-in zoom-in duration-200">
          <label className="block text-red-400 text-sm font-medium mb-2">Reason for Rejection</label>
          <textarea 
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            className="w-full bg-slate-900/80 border border-slate-700 rounded-lg p-3 text-white placeholder-slate-500 focus:outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/50 mb-3"
            placeholder="E.g., Invalid 12A certificate, or duplicate proofs found..."
            rows={2}
          />
          <div className="flex justify-end gap-3">
            <button 
              onClick={() => setShowRejectInput(false)}
              className="px-4 py-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors text-sm font-medium"
            >
              Cancel
            </button>
            <button 
              onClick={handleReject}
              disabled={rejectReason.trim().length === 0}
              className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 disabled:opacity-50 transition-all font-semibold text-sm flex items-center gap-2 shadow-[0_0_15px_rgba(239,68,68,0.3)]"
            >
              <XCircle className="w-4 h-4" /> Confirm Reject
            </button>
          </div>
        </div>
      ) : (
        <div className="flex gap-4">
          <button 
            onClick={() => onApprove(ngo.id)}
            className="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-green-400 text-white hover:from-emerald-400 hover:to-green-300 transition-all font-bold shadow-[0_0_20px_rgba(16,185,129,0.3)] flex items-center justify-center gap-2"
          >
            <CheckCircle className="w-5 h-5" />
            Approve & Verify
          </button>
          <button 
            onClick={() => setShowRejectInput(true)}
            className="px-6 py-3 rounded-xl bg-slate-800 text-red-400 hover:bg-slate-700 hover:text-red-300 transition-colors font-bold border border-slate-700 hover:border-red-500/30 flex items-center gap-2"
          >
            <XCircle className="w-5 h-5" />
            Reject
          </button>
        </div>
      )}
    </div>
  );
}
