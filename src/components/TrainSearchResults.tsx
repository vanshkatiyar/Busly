import React, { useState } from 'react';
import {
  Train,
  Clock,
  Navigation,
  CheckCircle2,
  Search,
  Sparkles,
  ShieldCheck,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';
import { TrainTrip } from '../types';
import { MOCK_TRAIN_TRIPS, SAMPLE_PNRS } from '../data/mockData';

interface TrainSearchResultsProps {
  fromCity: string;
  toCity: string;
  travelDate: string;
  onBookTrainClass: (train: TrainTrip, selectedClass: TrainTrip['classes'][0]) => void;
  onTrackTrain: (train: TrainTrip) => void;
}

export const TrainSearchResults: React.FC<TrainSearchResultsProps> = ({
  fromCity,
  toCity,
  travelDate,
  onBookTrainClass,
  onTrackTrain,
}) => {
  const [trains] = useState<TrainTrip[]>(MOCK_TRAIN_TRIPS);
  const [pnrInput, setPnrInput] = useState('');
  const [searchedPnrResult, setSearchedPnrResult] = useState<typeof SAMPLE_PNRS[0] | null>(null);

  const handlePnrSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pnrInput.trim()) return;
    const found = SAMPLE_PNRS.find((p) => p.pnr === pnrInput.trim());
    if (found) {
      setSearchedPnrResult(found);
    } else {
      setSearchedPnrResult({
        pnr: pnrInput.trim(),
        train: '20608 MAS VANDE BHARAT',
        status: 'CONFIRMED / COACH C3 / BERTH 32 (Aisle)',
      });
    }
  };

  const handleSamplePnrClick = (sample: typeof SAMPLE_PNRS[0]) => {
    setPnrInput(sample.pnr);
    setSearchedPnrResult(sample);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* redRail IRCTC Partner Banner & PNR Tool */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white rounded-3xl p-6 shadow-xl border border-blue-800/50">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                <Train className="w-5 h-5 text-amber-400" />
              </div>
              <span className="text-xl font-black tracking-tight text-white">
                redRail <span className="text-xs font-semibold text-blue-200">by redBus</span>
              </span>
              <span className="text-[10px] bg-amber-400/20 text-amber-300 font-bold px-2 py-0.5 rounded-full border border-amber-400/30">
                OFFICIAL IRCTC AUTHORIZED PARTNER
              </span>
            </div>
            <p className="text-xs text-blue-200">
              Zero payment gateway fees on UPI, instant refunds, and live satellite RTIS train tracking.
            </p>
          </div>

          {/* Quick PNR Search Box */}
          <div className="bg-white/10 p-3.5 rounded-2xl backdrop-blur-md border border-white/20 max-w-md w-full">
            <span className="text-[11px] font-bold text-blue-100 block mb-2 flex items-center gap-1.5">
              <Search className="w-3.5 h-3.5 text-amber-400" /> Check 10-Digit IRCTC PNR Status
            </span>
            <form onSubmit={handlePnrSearch} className="flex gap-2">
              <input
                type="text"
                value={pnrInput}
                onChange={(e) => setPnrInput(e.target.value)}
                maxLength={10}
                placeholder="Enter 10-digit PNR"
                className="flex-1 font-mono text-xs font-bold px-3 py-2 bg-white text-slate-900 rounded-lg focus:outline-hidden"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-900 text-xs font-black rounded-lg cursor-pointer transition-colors"
              >
                CHECK
              </button>
            </form>

            {/* Quick Sample PNR Chips */}
            <div className="mt-2 flex items-center gap-2 text-[10px] text-blue-200 flex-wrap">
              <span>Try PNR:</span>
              {SAMPLE_PNRS.map((sp) => (
                <button
                  key={sp.pnr}
                  type="button"
                  onClick={() => handleSamplePnrClick(sp)}
                  className="bg-white/15 hover:bg-white/25 px-2 py-0.5 rounded-sm font-mono cursor-pointer"
                >
                  {sp.pnr}
                </button>
              ))}
            </div>

            {/* PNR Search Output */}
            {searchedPnrResult && (
              <div className="mt-3 p-3 bg-emerald-500/20 border border-emerald-400/40 rounded-xl text-xs space-y-1">
                <div className="flex justify-between items-center text-emerald-300 font-bold">
                  <span>PNR: {searchedPnrResult.pnr}</span>
                  <span className="text-[10px] bg-emerald-400 text-slate-950 px-1.5 py-0.5 rounded-xs font-mono">
                    CHART PREPARED
                  </span>
                </div>
                <div className="text-white font-medium">{searchedPnrResult.train}</div>
                <div className="text-emerald-300 font-mono font-bold">{searchedPnrResult.status}</div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Train List Header */}
      <div className="flex items-center justify-between pb-2">
        <div>
          <h2 className="text-lg font-black text-slate-900">
            Available Trains ({trains.length} Trains on Route)
          </h2>
          <p className="text-xs text-slate-500">
            {fromCity} ➔ {toCity} · {travelDate}
          </p>
        </div>
      </div>

      {/* Train Cards */}
      <div className="space-y-4">
        {trains.map((train) => (
          <div
            key={train.id}
            className="bg-white rounded-2xl p-5 border border-slate-200 hover:border-slate-300 shadow-xs space-y-4"
          >
            {/* Top row: Train name & running days */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold">
                  <Train className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-base text-slate-900">
                    {train.trainName} ({train.trainNumber})
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <span>Runs on:</span>
                    <div className="flex gap-1">
                      {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, idx) => (
                        <span
                          key={idx}
                          className={`w-4 h-4 rounded-xs text-[9px] font-bold flex items-center justify-center ${
                            train.runsOn.includes(day)
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-slate-100 text-slate-400'
                          }`}
                        >
                          {day}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Live Running Status Button */}
              <button
                onClick={() => onTrackTrain(train)}
                className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer self-start sm:self-auto border border-blue-200"
              >
                <Navigation className="w-3.5 h-3.5 text-blue-600 animate-pulse" />
                <span>Live Train Running Status</span>
              </button>
            </div>

            {/* Middle row: Schedule */}
            <div className="grid grid-cols-3 gap-4 items-center text-center">
              <div className="text-left">
                <span className="font-mono text-xl font-black text-slate-900 block">
                  {train.departureTime}
                </span>
                <span className="text-xs font-bold text-slate-700">{train.fromStation}</span>
              </div>

              <div className="flex flex-col items-center">
                <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {train.duration}
                </span>
                <div className="w-24 h-0.5 bg-slate-200 my-1 relative">
                  <div className="w-2 h-2 rounded-full bg-blue-600 absolute -top-[3px] left-1/2 -translate-x-1/2" />
                </div>
                <span className="text-[9px] text-slate-400">Daily Express</span>
              </div>

              <div className="text-right">
                <span className="font-mono text-xl font-black text-slate-900 block">
                  {train.arrivalTime}
                </span>
                <span className="text-xs font-bold text-slate-700">{train.toStation}</span>
              </div>
            </div>

            {/* Bottom row: Classes (1A, 2A, 3A, CC, SL) */}
            <div className="pt-2 border-t border-slate-100">
              <span className="text-xs font-bold text-slate-500 block mb-2">Available Quota & Classes:</span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {train.classes.map((cls) => (
                  <div
                    key={cls.code}
                    className="p-3 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-white hover:border-blue-400 transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-black text-xs text-slate-900">{cls.code}</span>
                        <span className="font-mono font-black text-sm text-slate-900">₹{cls.price}</span>
                      </div>
                      <span className="text-[10px] text-slate-500 block">{cls.name}</span>
                      <span className="text-xs font-bold text-emerald-700 block mt-1">
                        {cls.availability}
                      </span>
                      {cls.confirmProbability && (
                        <span className="text-[10px] text-blue-600 font-semibold block">
                          {cls.confirmProbability}% Confirm Chance
                        </span>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => onBookTrainClass(train, cls)}
                      className="mt-3 w-full py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-black rounded-lg cursor-pointer transition-colors uppercase tracking-wider"
                    >
                      Book Now
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
