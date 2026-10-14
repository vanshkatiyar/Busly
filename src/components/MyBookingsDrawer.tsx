import React from 'react';
import {
  X,
  Ticket,
  Bus,
  Train,
  Plane,
  Building2,
  Navigation,
  Printer,
  Trash2,
  Calendar,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { BookingRecord } from '../types';

interface MyBookingsDrawerProps {
  isOpen: boolean;
  bookings: BookingRecord[];
  onClose: () => void;
  onViewTicket: (booking: BookingRecord) => void;
  onTrackBooking: (booking: BookingRecord) => void;
  onCancelBooking: (bookingId: string) => void;
  onStartBooking: () => void;
}

export const MyBookingsDrawer: React.FC<MyBookingsDrawerProps> = ({
  isOpen,
  bookings,
  onClose,
  onViewTicket,
  onTrackBooking,
  onCancelBooking,
  onStartBooking,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
            <div className="flex items-center gap-2">
              <Ticket className="w-5 h-5 text-[#d84e55]" />
              <h2 className="text-base font-extrabold text-slate-900">
                My Bookings & Tickets ({bookings.length})
              </h2>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-200 hover:bg-slate-300 flex items-center justify-center text-slate-700 cursor-pointer transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Bookings List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {bookings.length === 0 ? (
              <div className="text-center py-12 px-4 space-y-3">
                <div className="w-16 h-16 rounded-full bg-red-50 text-[#d84e55] flex items-center justify-center mx-auto text-2xl font-bold">
                  🎫
                </div>
                <h3 className="font-extrabold text-slate-900 text-base">No active bookings yet</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Book buses, trains, flights, or hotels to access your tickets, invoices, and live vehicle GPS tracking here.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onStartBooking();
                  }}
                  className="mt-2 px-5 py-2.5 bg-[#d84e55] hover:bg-[#c23f46] text-white text-xs font-bold rounded-xl shadow-md cursor-pointer transition-colors"
                >
                  Book a Trip Now ➔
                </button>
              </div>
            ) : (
              bookings.map((booking) => (
                <div
                  key={booking.bookingId}
                  className="p-4 rounded-2xl border border-slate-200 bg-white shadow-xs space-y-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                        PNR: <span className="font-mono text-slate-900">{booking.pnr}</span>
                      </span>
                      <h4 className="font-black text-slate-900 text-sm mt-0.5">{booking.itemTitle}</h4>
                      <p className="text-xs text-slate-500">
                        {booking.from} ➔ {booking.to}
                      </p>
                    </div>

                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        booking.status === 'CONFIRMED'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {booking.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <div>
                      <span className="text-[10px] text-slate-400 block font-semibold">DATE</span>
                      <span className="font-bold text-slate-800">{booking.travelDate}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block font-semibold">TOTAL PAID</span>
                      <span className="font-mono font-bold text-slate-900">
                        ₹{booking.fareBreakdown.totalAmount.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>

                  {booking.selectedSeats && booking.selectedSeats.length > 0 && (
                    <div className="text-xs text-slate-600">
                      <span className="text-slate-400 text-[11px]">Seats: </span>
                      <span className="font-bold text-slate-800">{booking.selectedSeats.join(', ')}</span>
                    </div>
                  )}

                  {/* Booking Actions */}
                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 gap-2">
                    <button
                      type="button"
                      onClick={() => onViewTicket(booking)}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg transition-colors cursor-pointer flex items-center gap-1"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>View Pass</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        onTrackBooking(booking);
                      }}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer flex items-center gap-1 shadow-2xs"
                    >
                      <Navigation className="w-3.5 h-3.5" />
                      <span>Track Live</span>
                    </button>

                    {booking.status === 'CONFIRMED' && (
                      <button
                        type="button"
                        onClick={() => onCancelBooking(booking.bookingId)}
                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                        title="Cancel Booking & Refund"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
