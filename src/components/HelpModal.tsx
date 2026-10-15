import React, { useState } from 'react';
import { X, LifeBuoy, Phone, Mail, HelpCircle, ChevronDown, ChevronUp, ShieldCheck } from 'lucide-react';

interface HelpModalProps {
  onClose: () => void;
}

const FAQS = [
  {
    q: 'How does Real-Time Live Bus Tracking work on Busly?',
    a: 'Every Primo and GPS-enabled bus has an onboard satellite telematics unit that transmits live coordinates, vehicle speed, and estimated arrival times (ETA). You can view the live bus movement on the interactive highway map or click "Live Track" on any booking pass.',
  },
  {
    q: 'Is the Payment Gateway demo 100% secure?',
    a: 'Yes! All transactions feature 256-bit SSL encryption. We simulate authentic Indian payment options including UPI (QR code scan & VPA), Credit/Debit Cards with 3D Secure OTP verification, NetBanking across major Indian banks, and Busly Wallet cash.',
  },
  {
    q: 'How do I cancel a ticket and receive a refund?',
    a: 'Open "My Bookings" from the top navigation bar, locate your confirmed journey, and tap the trash/cancel icon. Refunds are calculated according to the operator cancellation window and credited back instantly to your original payment method or Busly Wallet.',
  },
  {
    q: 'Can I choose my preferred boarding and dropping points?',
    a: 'Yes, when selecting seats for any bus, tap "Boarding & Dropping Points" to choose the most convenient pickup landmark near your location with exact reporting timestamps.',
  },
  {
    q: 'Are Train tickets IRCTC authorized?',
    a: 'Yes, redRail by Busly is an official IRCTC partner. You can search trains, check confirmation probabilities, and query any 10-digit PNR status in real time.',
  },
];

export const HelpModal: React.FC<HelpModalProps> = ({ onClose }) => {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/75 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl max-w-xl w-full max-h-[90vh] flex flex-col overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#d84e55] text-white flex items-center justify-center">
              <LifeBuoy className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-slate-900">Busly 24x7 Customer Care</h2>
              <p className="text-xs text-slate-500">Fast assistance for bookings, refunds & tracking</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-200 hover:bg-slate-300 flex items-center justify-center text-slate-600 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Quick Contact Cards */}
          <div className="grid grid-cols-2 gap-3">
            <a
              href="tel:18002009999"
              className="p-3 bg-red-50 hover:bg-red-100 text-slate-900 rounded-2xl border border-red-200 transition-colors flex items-center gap-3 cursor-pointer"
            >
              <div className="w-9 h-9 rounded-xl bg-[#d84e55] text-white flex items-center justify-center shrink-0">
                <Phone className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] text-slate-500 font-bold uppercase block">Toll-Free Helpline</span>
                <span className="text-xs font-black text-slate-900">1800-Busly</span>
              </div>
            </a>

            <a
              href="mailto:support@Busly.in"
              className="p-3 bg-slate-50 hover:bg-slate-100 text-slate-900 rounded-2xl border border-slate-200 transition-colors flex items-center gap-3 cursor-pointer"
            >
              <div className="w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center shrink-0">
                <Mail className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] text-slate-500 font-bold uppercase block">Email Support</span>
                <span className="text-xs font-black text-slate-900">support@Busly.in</span>
              </div>
            </a>
          </div>

          {/* FAQs */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Frequently Asked Questions
            </h3>

            <div className="space-y-2">
              {FAQS.map((faq, idx) => (
                <div key={idx} className="border border-slate-200 rounded-xl overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setOpenFaqIndex(openFaqIndex === idx ? null : idx)}
                    className="w-full p-3.5 text-left text-xs font-bold text-slate-900 bg-white hover:bg-slate-50 flex items-center justify-between cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    {openFaqIndex === idx ? (
                      <ChevronUp className="w-4 h-4 text-slate-500 shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-500 shrink-0" />
                    )}
                  </button>

                  {openFaqIndex === idx && (
                    <div className="px-3.5 pb-3.5 text-xs text-slate-600 bg-slate-50/50 leading-relaxed border-t border-slate-100">
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 text-center text-xs text-slate-400">
          Available 24 hours a day, 7 days a week across all Indian routes.
        </div>
      </div>
    </div>
  );
};
