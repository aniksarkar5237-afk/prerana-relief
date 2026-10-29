'use client';
import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { X } from 'lucide-react';

const UpiDonationModal = ({ request, onClose }) => {
  const [amount, setAmount] = useState(500);
  const presetAmounts = [200, 500, 1000, 2000];

  const upiString = `upi://pay?pa=${request.ngo_vpa}&pn=${encodeURIComponent(request.charity_name)}&am=${amount}&cu=INR&tn=${encodeURIComponent('Disaster Relief: ' + request.title)}`;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9999] p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden relative animate-in fade-in zoom-in duration-200">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700">
          <X size={24} />
        </button>
        
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-1">Direct Donation</h2>
          <p className="text-sm text-gray-500 mb-6">{request.charity_name}</p>

          <div className="flex justify-center mb-6">
            <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 shadow-sm">
              <QRCodeSVG value={upiString} size={200} />
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Amount (₹)</label>
            <div className="grid grid-cols-4 gap-2 mb-3">
              {presetAmounts.map((amt) => (
                <button
                  key={amt}
                  onClick={() => setAmount(amt)}
                  className={`py-2 rounded-lg text-sm font-medium transition-all ${
                    amount === amt 
                      ? 'bg-blue-600 text-white shadow-md' 
                      : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 hover:border-blue-300'
                  }`}
                >
                  ₹{amt}
                </button>
              ))}
            </div>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium">₹</span>
              <input 
                type="number" 
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="w-full pl-8 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all"
                placeholder="Custom amount"
              />
            </div>
          </div>

          <a 
            href={upiString}
            className="w-full block text-center bg-blue-600 text-white font-semibold py-3 rounded-xl hover:bg-blue-700 active:scale-[0.98] transition-all shadow-md mb-4"
          >
            Open UPI App (GPay / PhonePe / Paytm)
          </a>

          <div className="bg-green-50 border border-green-100 rounded-xl p-3 text-center">
            <p className="text-sm text-green-800 font-semibold">
              100% Free & Direct — Zero Gateway MDR, Zero Platform Deductions
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpiDonationModal;
