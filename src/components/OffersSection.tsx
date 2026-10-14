import React, { useState } from 'react';
import { Tag, Copy, Check, Sparkles, Percent } from 'lucide-react';
import { COUPONS } from '../data/mockData';

export const OffersSection: React.FC = () => {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleCopy = (code: string) => {
    navigator.clipboard?.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center justify-between mb-6">
        <div>
          <span className="text-xs font-bold text-[#d84e55] uppercase tracking-wider block mb-1">
            Exclusive Deals & Discounts
          </span>
          <h2 className="text-2xl font-black text-slate-900">Trending redBus Travel Offers</h2>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {COUPONS.map((coupon) => (
          <div
            key={coupon.code}
            className="bg-white rounded-2xl p-5 border border-slate-200 hover:border-red-200 shadow-xs hover:shadow-md transition-all flex flex-col justify-between relative overflow-hidden"
          >
            {/* Corner Tag */}
            <div className="absolute top-0 right-0 bg-[#d84e55] text-white text-[9px] font-black uppercase tracking-wider px-3 py-1 rounded-bl-xl shadow-xs">
              Special Offer
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-xl bg-red-50 text-[#d84e55] flex items-center justify-center font-bold">
                  <Percent className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-mono text-base font-black text-slate-900">{coupon.code}</span>
                  <span className="text-[11px] text-emerald-600 font-bold block">Verified Active</span>
                </div>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                {coupon.description}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] text-slate-400">Min booking: ₹{coupon.minAmount}</span>
              <button
                type="button"
                onClick={() => handleCopy(coupon.code)}
                className="px-3 py-1.5 bg-slate-100 hover:bg-[#d84e55] hover:text-white text-slate-700 text-xs font-bold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
              >
                {copiedCode === coupon.code ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Code</span>
                  </>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
