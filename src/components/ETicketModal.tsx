import React from 'react';
import {
  X,
  Printer,
  Navigation,
  Download,
  Share2,
  CheckCircle2,
  MapPin,
  Calendar,
  Clock,
  Phone,
  QrCode,
  Bus,
} from 'lucide-react';
import { BookingRecord } from '../types';

interface ETicketModalProps {
  booking: BookingRecord;
  onClose: () => void;
  onTrackTrip: (booking: BookingRecord) => void;
}

export const ETicketModal: React.FC<ETicketModalProps> = ({
  booking,
  onClose,
  onTrackTrip,
}) => {
  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(
      `redBus Confirmed Booking:\nPNR: ${booking.pnr}\nRoute: ${booking.from} -> ${booking.to}\nDate: ${booking.travelDate}\nSeats: ${booking.selectedSeats?.join(', ') || 'Confirmed'}`
    );
    alert('Ticket details copied to clipboard!');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/80 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[94vh] flex flex-col overflow-hidden border border-slate-200">
        {/* Modal Top Actions */}
        <div className="px-6 py-3.5 border-b border-slate-100 flex items-center justify-between bg-slate-50 no-print">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Electronic Ticket (m-Ticket)
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / PDF</span>
            </button>
            <button
              onClick={handleShare}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Share</span>
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition-colors cursor-pointer ml-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Ticket Pass Body */}
        <div id="printable-ticket" className="flex-1 overflow-y-auto p-5 sm:p-8 space-y-6 bg-slate-50">
          {/* Ticket Header */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs relative overflow-hidden">
            {/* Top red ribbon */}
            <div className="absolute top-0 left-0 right-0 h-2 bg-[#d84e55]" />

            <div className="flex items-start justify-between gap-4 pt-1 pb-4 border-b border-slate-100">
              <div>
                <span className="text-2xl font-black text-[#d84e55] tracking-tight">
                  red<span className="text-slate-900">Bus</span>
                </span>
                <span className="block text-[11px] font-bold text-emerald-600 flex items-center gap-1 mt-0.5">
                  <CheckCircle2 className="w-3.5 h-3.5" /> BOOKING CONFIRMED
                </span>
              </div>

              {/* QR Code Graphic */}
              <div className="flex flex-col items-center">
                <div className="w-18 h-18 bg-white p-1 rounded-lg border border-slate-200 flex items-center justify-center">
                  <svg viewBox="0 0 100 100" className="w-16 h-16 text-slate-900" fill="currentColor">
                    <rect x="5" y="5" width="28" height="28" rx="3" fill="none" stroke="currentColor" strokeWidth="6" />
                    <rect x="13" y="13" width="12" height="12" rx="2" fill="currentColor" />
                    <rect x="67" y="5" width="28" height="28" rx="3" fill="none" stroke="currentColor" strokeWidth="6" />
                    <rect x="75" y="13" width="12" height="12" rx="2" fill="currentColor" />
                    <rect x="5" y="67" width="28" height="28" rx="3" fill="none" stroke="currentColor" strokeWidth="6" />
                    <rect x="13" y="75" width="12" height="12" rx="2" fill="currentColor" />
                    <rect x="42" y="8" width="6" height="6" />
                    <rect x="52" y="18" width="8" height="6" />
                    <rect x="40" y="28" width="6" height="8" />
                    <rect x="12" y="44" width="8" height="6" />
                    <rect x="22" y="50" width="6" height="6" />
                    <rect x="44" y="44" width="14" height="14" rx="2" fill="#d84e55" />
                    <rect x="68" y="42" width="6" height="8" />
                    <rect x="80" y="48" width="8" height="6" />
                    <rect x="44" y="66" width="8" height="6" />
                    <rect x="58" y="72" width="6" height="8" />
                    <rect x="76" y="68" width="8" height="6" />
                    <rect x="84" y="82" width="6" height="8" />
                  </svg>
                </div>
                <span className="text-[10px] text-slate-500 mt-1 font-mono font-bold">Scan at Boarding</span>
              </div>
            </div>

            {/* PNR & Booking Numbers Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 py-4 border-b border-slate-100 text-xs">
              <div>
                <span className="text-slate-400 font-semibold block text-[10px] uppercase">Ticket / PNR No.</span>
                <span className="font-mono text-base font-black text-slate-900">{booking.pnr}</span>
              </div>
              <div>
                <span className="text-slate-400 font-semibold block text-[10px] uppercase">Booking Reference</span>
                <span className="font-mono text-base font-black text-slate-900">{booking.bookingId}</span>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <span className="text-slate-400 font-semibold block text-[10px] uppercase">Date of Journey</span>
                <span className="font-mono text-sm font-bold text-slate-900">{booking.travelDate}</span>
              </div>
            </div>

            {/* Journey Details */}
            <div className="py-4 border-b border-slate-100 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-base font-black text-slate-900">{booking.itemTitle}</h4>
                  <p className="text-xs text-slate-500">{booking.subTitle}</p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-slate-400 block uppercase">Seats</span>
                  <span className="font-bold text-sm bg-red-50 text-[#d84e55] px-2.5 py-1 rounded-md border border-red-100">
                    {booking.selectedSeats?.join(', ') || 'Confirmed'}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 bg-slate-50 p-3.5 rounded-xl border border-slate-100 text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px] font-bold uppercase">FROM / BOARDING</span>
                  <span className="font-black text-slate-900 text-sm block">{booking.from}</span>
                  <span className="text-slate-500 text-[11px] block mt-0.5">
                    {booking.boardingPoint?.name || 'Main City Departure Station'}
                  </span>
                  <span className="text-slate-400 text-[10px]">
                    {booking.boardingPoint?.landmark || 'Report 15 mins prior'}
                  </span>
                </div>

                <div>
                  <span className="text-slate-400 block text-[10px] font-bold uppercase">TO / DESTINATION</span>
                  <span className="font-black text-slate-900 text-sm block">{booking.to}</span>
                  <span className="text-slate-500 text-[11px] block mt-0.5">
                    {booking.droppingPoint?.name || 'City Central Terminal'}
                  </span>
                  <span className="text-slate-400 text-[10px]">
                    {booking.droppingPoint?.landmark || 'Arrival as per schedule'}
                  </span>
                </div>
              </div>
            </div>

            {/* Passenger & Driver Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-4 border-b border-slate-100 text-xs">
              <div>
                <span className="text-slate-400 block text-[10px] font-bold uppercase mb-1">
                  Passenger(s)
                </span>
                {booking.passengers.map((p, idx) => (
                  <div key={idx} className="font-semibold text-slate-800">
                    {p.name} ({p.age} yrs, {p.gender})
                  </div>
                ))}
              </div>

              <div>
                <span className="text-slate-400 block text-[10px] font-bold uppercase mb-1">
                  Vehicle & Contact
                </span>
                <div className="font-mono font-bold text-slate-800">
                  {booking.vehicleNumber || 'KA-01-MJ-8822'}
                </div>
                <div className="text-slate-500 text-[11px]">
                  Driver: {booking.driverContact?.name || 'Rameshwar Gowda'} (
                  {booking.driverContact?.phone || '+91 98450 12890'})
                </div>
              </div>
            </div>

            {/* Fare Breakdown */}
            <div className="pt-4 flex items-center justify-between text-xs">
              <div>
                <span className="text-slate-400 block text-[10px]">Payment Method</span>
                <span className="font-bold text-slate-800">{booking.paymentMethod} (PAID)</span>
              </div>
              <div className="text-right">
                <span className="text-slate-400 block text-[10px]">Total Paid Amount</span>
                <span className="font-mono text-xl font-black text-slate-900">
                  ₹{booking.fareBreakdown.totalAmount.toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Bottom CTA */}
        <div className="p-4 bg-white border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 no-print">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2.5 text-xs font-bold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl cursor-pointer"
          >
            Close Pass
          </button>

          <button
            onClick={() => onTrackTrip(booking)}
            className="w-full sm:w-auto px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 uppercase tracking-wider"
          >
            <Navigation className="w-4 h-4 animate-pulse" />
            <span>Track Trip Live on GPS ➔</span>
          </button>
        </div>
      </div>
    </div>
  );
};
