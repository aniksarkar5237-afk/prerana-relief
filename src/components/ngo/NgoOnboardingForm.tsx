'use client';
import React, { useState } from 'react';
import { Upload, FileText, CheckCircle, ChevronRight, ChevronLeft, Building, CreditCard, Camera } from 'lucide-react';

export default function NgoOnboardingForm() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    org_name: '',
    description: '',
    website_url: '',
    pan_number: '',
    bank_account_name: '',
    bank_account_number: '',
    bank_ifsc: '',
    project_name_0: '',
    project_desc_0: '',
    project_name_1: '',
    project_desc_1: ''
  });
  const [files, setFiles] = useState<{ [key: string]: File | null }>({
    twelve_a: null,
    eighty_g: null,
    audit_report: null,
    project_proofs_0: null,
    project_proofs_1: null
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, name: string) => {
    if (e.target.files && e.target.files[0]) {
      setFiles({ ...files, [name]: e.target.files[0] });
    }
  };

  const submitForm = async () => {
    setIsSubmitting(true);
    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => data.append(key, value));
    Object.entries(files).forEach(([key, file]) => {
      if (file) data.append(key, file);
    });

    try {
      const token = localStorage.getItem('token'); // assuming standard auth flow
      const res = await fetch('/api/charities/apply', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: data
      });
      const result = await res.json();
      if (res.ok) {
        setSuccess(true);
      } else {
        alert(result.message || 'Submission failed');
      }
    } catch (err) {
      alert('Network error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="glass-panel p-8 rounded-3xl text-center flex flex-col items-center justify-center max-w-2xl mx-auto min-h-[400px]">
        <CheckCircle className="w-20 h-20 text-emerald-500 mb-6" />
        <h2 className="text-3xl font-bold text-white mb-4">Application Submitted!</h2>
        <p className="text-slate-400 mb-8 text-lg">Your NGO profile is now under review. You will receive an email once our AI verification and manual review are complete.</p>
        <button onClick={() => window.location.href = '/'} className="px-6 py-3 bg-blue-600 hover:bg-blue-500 rounded-xl text-white font-bold transition-all">
          Return to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto glass-panel rounded-3xl p-6 sm:p-10 shadow-2xl">
      {/* Steps Header */}
      <div className="flex items-center justify-between mb-12 relative">
        <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-800 -z-10 -translate-y-1/2 rounded-full"></div>
        <div className="absolute top-1/2 left-0 h-1 bg-blue-500 -z-10 -translate-y-1/2 rounded-full transition-all duration-500" style={{ width: `${((step - 1) / 3) * 100}%` }}></div>
        
        {[
          { num: 1, label: 'Profile', icon: <Building className="w-5 h-5" /> },
          { num: 2, label: 'Banking', icon: <CreditCard className="w-5 h-5" /> },
          { num: 3, label: 'Statutory', icon: <FileText className="w-5 h-5" /> },
          { num: 4, label: 'Proofs', icon: <Camera className="w-5 h-5" /> }
        ].map((s) => (
          <div key={s.num} className="flex flex-col items-center gap-2">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center border-4 transition-all duration-300 ${step >= s.num ? 'bg-blue-600 border-slate-900 text-white' : 'bg-slate-800 border-slate-900 text-slate-500'}`}>
              {step > s.num ? <CheckCircle className="w-6 h-6" /> : s.icon}
            </div>
            <span className={`text-sm font-bold hidden sm:block ${step >= s.num ? 'text-blue-400' : 'text-slate-500'}`}>{s.label}</span>
          </div>
        ))}
      </div>

      <div className="min-h-[400px]">
        {/* Step 1: Basic Profile */}
        {step === 1 && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-500 space-y-6">
            <h2 className="text-3xl font-bold text-white mb-6">Basic NGO Profile</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Organization Name</label>
                <input name="org_name" value={formData.org_name} onChange={handleInputChange} className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all" placeholder="Enter official registered name" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Description / Mission</label>
                <textarea name="description" value={formData.description} onChange={handleInputChange} rows={4} className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all" placeholder="Describe your primary focus and mission..." />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Website URL</label>
                  <input name="website_url" value={formData.website_url} onChange={handleInputChange} className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-blue-500 outline-none" placeholder="https://..." />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">PAN Number</label>
                  <input name="pan_number" value={formData.pan_number} onChange={handleInputChange} className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-blue-500 outline-none uppercase" placeholder="ABCDE1234F" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Bank Details */}
        {step === 2 && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-500 space-y-6">
            <h2 className="text-3xl font-bold text-white mb-6">Bank Details</h2>
            <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 mb-6">
              <p className="text-sm text-blue-400">These details will be used to route direct donations to your organization's bank account.</p>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Account Name</label>
                <input name="bank_account_name" value={formData.bank_account_name} onChange={handleInputChange} className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-blue-500 outline-none" placeholder="Exactly as it appears on bank statement" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Account Number</label>
                  <input type="password" name="bank_account_number" value={formData.bank_account_number} onChange={handleInputChange} className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-blue-500 outline-none font-mono tracking-widest" placeholder="••••••••••••" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">IFSC Code</label>
                  <input name="bank_ifsc" value={formData.bank_ifsc} onChange={handleInputChange} className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-blue-500 outline-none uppercase" placeholder="SBIN0001234" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Statutory Docs */}
        {step === 3 && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-500 space-y-6">
            <h2 className="text-3xl font-bold text-white mb-6">Statutory Documents</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { name: 'twelve_a', label: '12A Certificate', req: true },
                { name: 'eighty_g', label: '80G Certificate', req: true },
                { name: 'audit_report', label: 'Latest Audit Report', req: false }
              ].map(doc => (
                <div key={doc.name} className={`border-2 border-dashed ${files[doc.name] ? 'border-emerald-500/50 bg-emerald-500/5' : 'border-slate-700 bg-slate-900/50'} rounded-2xl p-6 flex flex-col items-center justify-center text-center transition-colors relative hover:bg-slate-800/50`}>
                  <input type="file" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" onChange={(e) => handleFileChange(e, doc.name)} accept=".pdf,.jpg,.jpeg,.png" />
                  {files[doc.name] ? (
                    <>
                      <CheckCircle className="w-8 h-8 text-emerald-500 mb-3" />
                      <span className="text-sm font-medium text-emerald-400">{files[doc.name]?.name}</span>
                    </>
                  ) : (
                    <>
                      <Upload className="w-8 h-8 text-slate-500 mb-3" />
                      <span className="text-sm font-medium text-slate-300 mb-1">{doc.label}</span>
                      <span className="text-xs text-slate-500">{doc.req ? 'Required' : 'Optional'}</span>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 4: Project Proofs */}
        {step === 4 && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-500 space-y-6">
            <h2 className="text-3xl font-bold text-white mb-2">Field Work Proofs</h2>
            <p className="text-slate-400 mb-6">Upload photos of your recent on-ground relief operations. These are scanned for duplication against existing records.</p>
            
            <div className="space-y-8">
              {[0, 1].map(i => (
                <div key={i} className="bg-slate-900/50 border border-slate-700 rounded-2xl p-6 flex flex-col md:flex-row gap-6">
                  <div className={`w-full md:w-1/3 h-40 border-2 border-dashed ${files[`project_proofs_${i}`] ? 'border-purple-500/50 bg-purple-500/5' : 'border-slate-700 bg-slate-800'} rounded-xl flex items-center justify-center relative`}>
                    <input type="file" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" onChange={(e) => handleFileChange(e, `project_proofs_${i}`)} accept="image/*" />
                    {files[`project_proofs_${i}`] ? (
                      <span className="text-sm text-purple-400 font-medium px-4 text-center break-words">{files[`project_proofs_${i}`]?.name}</span>
                    ) : (
                      <span className="text-sm text-slate-500 font-medium flex flex-col items-center gap-2"><Camera className="w-6 h-6" /> Upload Photo</span>
                    )}
                  </div>
                  <div className="flex-1 space-y-4">
                    <input name={`project_name_${i}`} value={formData[`project_name_${i}` as keyof typeof formData]} onChange={handleInputChange} className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-2 text-white focus:border-blue-500 outline-none" placeholder="Project / Campaign Title" />
                    <textarea name={`project_desc_${i}`} value={formData[`project_desc_${i}` as keyof typeof formData]} onChange={handleInputChange} rows={2} className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-2 text-white focus:border-blue-500 outline-none" placeholder="Brief description of the impact..." />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="mt-12 flex justify-between pt-6 border-t border-slate-800">
        <button 
          onClick={() => setStep(step - 1)} 
          disabled={step === 1 || isSubmitting}
          className={`px-6 py-3 rounded-xl flex items-center gap-2 font-bold transition-all ${step === 1 ? 'opacity-0 cursor-default' : 'bg-slate-800 text-white hover:bg-slate-700'}`}
        >
          <ChevronLeft className="w-5 h-5" /> Back
        </button>
        
        {step < 4 ? (
          <button 
            onClick={() => setStep(step + 1)} 
            className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold flex items-center gap-2 shadow-[0_0_15px_rgba(37,99,235,0.4)] transition-all"
          >
            Next Step <ChevronRight className="w-5 h-5" />
          </button>
        ) : (
          <button 
            onClick={submitForm} 
            disabled={isSubmitting}
            className="px-8 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-green-400 hover:from-emerald-400 hover:to-green-300 text-white font-bold flex items-center gap-2 shadow-[0_0_20px_rgba(16,185,129,0.4)] transition-all disabled:opacity-50"
          >
            {isSubmitting ? 'Submitting...' : 'Complete Application'} <CheckCircle className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
}
