import React, { useState } from 'react';
import { X, Check, Disc, Shield, MapPin, AlertCircle, Info } from 'lucide-react';
import { BusTrip, BusSeat, RouteStop } from '../types';
import { generateBusSeats } from '../utils/seatGenerator';

interface SeatLayoutModalProps {
  bus: BusTrip;
  travelDate: string;
  onClose: () => void;
  onProceedToPayment: (selectedSeats: string[], boardingPoint: RouteStop, droppingPoint: RouteStop, totalFare: number) => void;
}

export const SeatLayoutModal: React.FC<SeatLayoutModalProps> = ({
  bus,
  travelDate,
  onClose,
  onProceedToPayment,
}) => {
  const [seatData] = useState(() => generateBusSeats(bus.price));
  const [selectedSeatIds, setSelectedSeatIds] = useState<string[]>([]);
  const [activeDeck, setActiveDeck] = useState<'both' | 'lower' | 'upper'>('both');
  const [selectedBoardingPoint, setSelectedBoardingPoint] = useState<RouteStop>(bus.boardingPoints[0]);
  const [selectedDroppingPoint, setSelectedDroppingPoint] = useState<RouteStop>(bus.droppingPoints[0]);
  const [activeStepTab, setActiveStepTab] = useState<'seats' | 'points'>('seats');

  const handleSeatClick = (seat: BusSeat) => {
    if (seat.status === 'booked') return;

    if (selectedSeatIds.includes(seat.id)) {
      setSelectedSeatIds(selectedSeatIds.filter((id) => id !== seat.id));
    } else {
      if (selectedSeatIds.length >= 6) {
        alert('You can select a maximum of 6 seats per booking.');
        return;
      }
      setSelectedSeatIds([...selectedSeatIds, seat.id]);
    }
  };

  // Calculate fare
  const allSeats = [...seatData.lowerDeck, ...seatData.upperDeck];
  const selectedSeatsObj = allSeats.filter((s) => selectedSeatIds.includes(s.id));
  const totalBaseFare = selectedSeatsObj.reduce((acc, s) => acc + s.price, 0);
  const gst = Math.round(totalBaseFare * 0.05);
  const totalFare = totalBaseFare + gst;

  const renderSeatIcon = (seat: BusSeat) => {
    const isSelected = selectedSeatIds.includes(seat.id);
    const isBooked = seat.status === 'booked';
    const isLadies = seat.status === 'ladies';

    let bgStyle = 'bg-white border-slate-300 hover:border-[#d84e55] text-slate-700';
    if (isSelected) {
      bgStyle = 'bg-emerald-600 border-emerald-600 text-white shadow-md shadow-emerald-600/30 font-bold';
    } else if (isBooked) {
      bgStyle = 'bg-slate-200 border-slate-200 text-slate-400 cursor-not-allowed';
    } else if (isLadies) {
      bgStyle = 'bg-pink-50 border-pink-300 hover:border-pink-500 text-pink-700';
    }

    return (
      <button
        key={seat.id}
        type="button"
        disabled={isBooked}
        onClick={() => handleSeatClick(seat)}
        className={`relative flex flex-col items-center justify-between p-1.5 rounded-md border text-[11px] transition-all cursor-pointer select-none ${
          seat.type === 'sleeper' ? 'h-18 w-11' : 'h-11 w-11'
        } ${bgStyle}`}
        title={`Seat ${seat.number} - ₹${seat.price} ${isLadies ? '(Reserved for Ladies)' : ''}`}
      >
        <span className="text-[9px] font-bold tracking-tight">{seat.number}</span>
        {/* Sleeper pillow cushion visual */}
        <div className={`w-full h-1.5 rounded-full ${isSelected ? 'bg-white/70' : isBooked ? 'bg-slate-300' : 'bg-slate-200'}`} />
        <span className="text-[9px] tabular-nums font-semibold">₹{seat.price}</span>
      </button>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-slate-900 text-lg">{bus.operator}</span>
              <span className="text-xs px-2 py-0.5 rounded-sm bg-amber-100 text-amber-800 font-bold">
                {bus.rating} ★
              </span>
              <span className="text-xs text-slate-500">· {bus.busType}</span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              {bus.from} ➔ {bus.to} · {travelDate} · Departs {bus.departureTime}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Tabs: Select Seats vs Boarding/Dropping */}
        <div className="flex border-b border-slate-200 bg-white text-xs font-bold text-slate-600">
          <button
            onClick={() => setActiveStepTab('seats')}
            className={`flex-1 py-3 text-center border-b-2 cursor-pointer transition-colors ${
              activeStepTab === 'seats'
                ? 'border-[#d84e55] text-[#d84e55]'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            1. Select Seats ({selectedSeatIds.length} chosen)
          </button>
          <button
            onClick={() => setActiveStepTab('points')}
            className={`flex-1 py-3 text-center border-b-2 cursor-pointer transition-colors ${
              activeStepTab === 'points'
                ? 'border-[#d84e55] text-[#d84e55]'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            2. Boarding & Dropping Points ({selectedBoardingPoint.name} ➔ {selectedDroppingPoint.name})
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-50">
          {activeStepTab === 'seats' ? (
            <div className="space-y-6">
              {/* Legend Strip */}
              <div className="bg-white p-3 rounded-xl border border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-sm border border-slate-300 bg-white" />
                  <span>Available</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-sm bg-emerald-600 text-white flex items-center justify-center font-bold text-[10px]">
                    ✓
                  </div>
                  <span>Selected</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-sm bg-slate-200 border border-slate-200" />
                  <span>Booked</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-sm bg-pink-50 border border-pink-400" />
                  <span>Ladies Berth</span>
                </div>
              </div>

              {/* Deck Layout Presentation */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Lower Deck */}
                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
                  <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
                    <span className="font-bold text-xs uppercase tracking-wider text-slate-700">
                      Lower Deck
                    </span>
                    <span className="text-[11px] text-slate-400 font-medium">Front ➔ Back</span>
                  </div>

                  {/* Bus Front with Steering Wheel */}
                  <div className="flex justify-end pr-2 mb-4">
                    <div className="w-8 h-8 rounded-full border border-slate-300 bg-slate-100 flex items-center justify-center text-slate-500" title="Driver Cabin">
                      <Disc className="w-5 h-5 animate-spin-slow" />
                    </div>
                  </div>

                  {/* Seat Grid Lower Deck */}
                  <div className="space-y-3">
                    {[0, 1, 2, 3, 4].map((rowIndex) => {
                      const rowSeats = seatData.lowerDeck.filter((s) => s.row === rowIndex);
                      const leftSeat = rowSeats.find((s) => s.col === 0);
                      const rightSeat1 = rowSeats.find((s) => s.col === 2);
                      const rightSeat2 = rowSeats.find((s) => s.col === 3);

                      return (
                        <div key={`lower-row-${rowIndex}`} className="flex items-center justify-between gap-4">
                          {/* Left Column (Single Sleeper) */}
                          <div className="w-12">{leftSeat && renderSeatIcon(leftSeat)}</div>

                          {/* Gangway / Aisle */}
                          <div className="flex-1 text-center text-[10px] text-slate-300 select-none">
                            · aisle ·
                          </div>

                          {/* Right Column (Double Sleeper) */}
                          <div className="flex items-center gap-2">
                            {rightSeat1 && renderSeatIcon(rightSeat1)}
                            {rightSeat2 && renderSeatIcon(rightSeat2)}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Upper Deck */}
                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
                  <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
                    <span className="font-bold text-xs uppercase tracking-wider text-slate-700">
                      Upper Deck (Sleepers)
                    </span>
                    <span className="text-[11px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-sm">
                      Extra Legroom
                    </span>
                  </div>

                  <div className="h-8 mb-4 flex items-center justify-end text-[11px] text-slate-400 pr-2">
                    Panoramic Window Deck
                  </div>

                  {/* Seat Grid Upper Deck */}
                  <div className="space-y-3">
                    {[0, 1, 2, 3, 4].map((rowIndex) => {
                      const rowSeats = seatData.upperDeck.filter((s) => s.row === rowIndex);
                      const leftSeat = rowSeats.find((s) => s.col === 0);
                      const rightSeat1 = rowSeats.find((s) => s.col === 2);
                      const rightSeat2 = rowSeats.find((s) => s.col === 3);

                      return (
                        <div key={`upper-row-${rowIndex}`} className="flex items-center justify-between gap-4">
                          <div className="w-12">{leftSeat && renderSeatIcon(leftSeat)}</div>
                          <div className="flex-1 text-center text-[10px] text-slate-300 select-none">
                            · aisle ·
                          </div>
                          <div className="flex items-center gap-2">
                            {rightSeat1 && renderSeatIcon(rightSeat1)}
                            {rightSeat2 && renderSeatIcon(rightSeat2)}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Seat Comfort & Legroom Ergonomic Inspector */}
              {selectedSeatsObj.length > 0 && (
                <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                        <Info className="w-4 h-4 text-[#d84e55]" />
                        Seat Comfort & Legroom Analysis (Seat {selectedSeatsObj[selectedSeatsObj.length - 1].number})
                      </span>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                      Verified Traveler Comfort 4.8 ★
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                    <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                      <span className="text-[10px] text-slate-400 block font-bold">LEGROOM STRETCH</span>
                      <span className="font-mono font-black text-slate-900 text-sm">
                        {selectedSeatsObj[selectedSeatsObj.length - 1].number.startsWith('U') ? '40 Inches' : '37 Inches'}
                      </span>
                      <span className="text-[10px] text-emerald-600 font-bold block mt-0.5">Spacious Ergonomics</span>
                    </div>

                    <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                      <span className="text-[10px] text-slate-400 block font-bold">FLAT RECLINE</span>
                      <span className="font-mono font-black text-slate-900 text-sm">180° Full Flat</span>
                      <span className="text-[10px] text-slate-500 font-medium block mt-0.5">Sleeper Berth</span>
                    </div>

                    <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                      <span className="text-[10px] text-slate-400 block font-bold">USB CHARGING</span>
                      <span className="font-mono font-black text-emerald-600 text-sm">98% Verified</span>
                      <span className="text-[10px] text-slate-500 font-medium block mt-0.5">High Speed 20W</span>
                    </div>

                    <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                      <span className="text-[10px] text-slate-400 block font-bold">CABIN VIBRATION</span>
                      <span className="font-mono font-black text-slate-900 text-sm">Ultra Low (12%)</span>
                      <span className="text-[10px] text-emerald-600 font-bold block mt-0.5">Air Suspension</span>
                    </div>
                  </div>

                  <div className="p-3 bg-amber-50/60 rounded-xl border border-amber-200/60 text-xs text-amber-900 flex items-start gap-2">
                    <span className="text-amber-600 font-bold text-sm">“</span>
                    <p className="italic text-[11px] leading-relaxed">
                      {selectedSeatsObj[selectedSeatsObj.length - 1].number.startsWith('U')
                        ? 'Upper sleeper berth provides great privacy, very clean bedsheet, and wide window view for night travel.'
                        : 'Lower berth has effortless entry, minimal swaying on turns, and easy access to luggage.'}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Boarding & Dropping Point Picker */
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Boarding Points */}
              <div className="bg-white p-4 rounded-2xl border border-slate-200">
                <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#d84e55]" />
                  Select Boarding Point ({bus.from})
                </h3>
                <div className="space-y-2">
                  {bus.boardingPoints.map((bp) => (
                    <label
                      key={bp.id}
                      className={`flex items-start gap-3 p-3 rounded-xl border transition-all cursor-pointer ${
                        selectedBoardingPoint.id === bp.id
                          ? 'border-[#d84e55] bg-red-50/40 text-slate-900 shadow-xs'
                          : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <input
                        type="radio"
                        name="boardingPoint"
                        checked={selectedBoardingPoint.id === bp.id}
                        onChange={() => setSelectedBoardingPoint(bp)}
                        className="mt-1 text-[#d84e55] focus:ring-[#d84e55]"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-sm text-slate-900">{bp.name}</span>
                          <span className="font-mono text-xs font-bold text-[#d84e55] bg-red-50 px-2 py-0.5 rounded-sm">
                            {bp.time}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">{bp.landmark}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Dropping Points */}
              <div className="bg-white p-4 rounded-2xl border border-slate-200">
                <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-emerald-600" />
                  Select Dropping Point ({bus.to})
                </h3>
                <div className="space-y-2">
                  {bus.droppingPoints.map((dp) => (
                    <label
                      key={dp.id}
                      className={`flex items-start gap-3 p-3 rounded-xl border transition-all cursor-pointer ${
                        selectedDroppingPoint.id === dp.id
                          ? 'border-emerald-600 bg-emerald-50/40 text-slate-900 shadow-xs'
                          : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <input
                        type="radio"
                        name="droppingPoint"
                        checked={selectedDroppingPoint.id === dp.id}
                        onChange={() => setSelectedDroppingPoint(dp)}
                        className="mt-1 text-emerald-600 focus:ring-emerald-600"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-sm text-slate-900">{dp.name}</span>
                          <span className="font-mono text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-sm">
                            {dp.time}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">{dp.landmark}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Bar with Price & Checkout CTA */}
        <div className="px-5 py-4 bg-white border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 text-sm w-full sm:w-auto justify-between sm:justify-start">
            <div>
              <span className="text-xs text-slate-400 block font-medium">Selected Seats:</span>
              <span className="font-bold text-slate-900">
                {selectedSeatsObj.length > 0 ? (
                  selectedSeatsObj.map((s) => s.number).join(', ')
                ) : (
                  <span className="text-slate-400 italic">No seats selected</span>
                )}
              </span>
            </div>
            <div className="h-8 w-px bg-slate-200" />
            <div>
              <span className="text-xs text-slate-400 block font-medium">Total (inc. GST):</span>
              <span className="font-mono text-xl font-black text-slate-900">
                ₹{totalFare.toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            {activeStepTab === 'seats' ? (
              <button
                type="button"
                disabled={selectedSeatIds.length === 0}
                onClick={() => setActiveStepTab('points')}
                className="w-full sm:w-auto px-6 py-3 bg-[#d84e55] hover:bg-[#c23f46] disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-bold text-sm rounded-xl shadow-md transition-all cursor-pointer"
              >
                Next: Select Boarding Point ➔
              </button>
            ) : (
              <button
                type="button"
                disabled={selectedSeatIds.length === 0}
                onClick={() =>
                  onProceedToPayment(
                    selectedSeatsObj.map((s) => s.number),
                    selectedBoardingPoint,
                    selectedDroppingPoint,
                    totalFare
                  )
                }
                className="w-full sm:w-auto px-8 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white font-extrabold text-sm rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <Shield className="w-4 h-4" />
                <span>Continue to Secure Payment ➔</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
