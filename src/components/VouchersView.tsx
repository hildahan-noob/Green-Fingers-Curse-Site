import React from 'react';
import { Ticket, CheckCircle, Tag } from 'lucide-react';
import { Voucher } from '../types';

interface VouchersViewProps {
  vouchers: Voucher[];
  onCollectVoucher: (id: string) => void;
  onCollectAll: () => void;
}

export const VouchersView: React.FC<VouchersViewProps> = ({ vouchers, onCollectVoucher, onCollectAll }) => {
  return (
    <main className="max-w-4xl mx-auto px-4 py-6 mb-28">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="font-extrabold text-2xl text-[#1a1c1c] flex items-center gap-2">
            <Ticket className="w-6 h-6 text-[#e91e63]" /> Savings & Vouchers Hub
          </h1>
          <p className="text-xs text-gray-500">Collect storewide & plant category discounts for your orders</p>
        </div>
        <button
          onClick={onCollectAll}
          className="px-4 py-2 bg-[#e91e63] hover:bg-[#b80049] text-white rounded-full text-xs font-bold transition-all shadow-sm cursor-pointer"
        >
          Collect All Vouchers
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {vouchers.map((v) => (
          <div
            key={v.id}
            className="bg-white rounded-2xl border border-[#e2e2e2] p-5 shadow-xs flex justify-between items-center relative overflow-hidden"
          >
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-pink-50 rounded-xl flex flex-col items-center justify-center border border-pink-100 text-[#e91e63]">
                <span className="font-extrabold text-2xl">${v.discount}</span>
                <span className="text-[9px] uppercase font-bold tracking-tight">OFF</span>
              </div>
              <div>
                <span className="inline-block px-2 py-0.5 bg-gray-100 text-gray-700 text-[10px] font-bold rounded mb-1">
                  {v.type}
                </span>
                <h3 className="font-bold text-sm text-[#1a1c1c]">Min Spend: ${v.minSpend}</h3>
                <p className="text-xs text-gray-400 font-mono mt-0.5">Code: {v.code}</p>
              </div>
            </div>

            <button
              onClick={() => onCollectVoucher(v.id)}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                v.isCollected
                  ? 'bg-emerald-600 text-white'
                  : 'bg-[#e91e63] text-white hover:bg-[#b80049]'
              }`}
            >
              {v.isCollected ? 'COLLECTED ✓' : 'COLLECT'}
            </button>
          </div>
        ))}
      </div>

      <div className="mt-8 bg-pink-50 p-6 rounded-2xl border border-pink-200">
        <h3 className="font-bold text-sm text-[#e91e63] mb-2 flex items-center gap-1.5">
          <Tag className="w-4 h-4" /> How to apply vouchers?
        </h3>
        <p className="text-xs text-gray-600 leading-relaxed">
          Collected vouchers will be automatically displayed during checkout in your shopping cart drawer. Simply select your preferred voucher before completing payment!
        </p>
      </div>
    </main>
  );
};
