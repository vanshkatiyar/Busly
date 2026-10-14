import React, { useState } from 'react';
import {
  TrendingUp,
  Sparkles,
  Bell,
  CheckCircle2,
  AlertCircle,
  Clock,
  ArrowRight,
  ShieldAlert,
  X,
} from 'lucide-react';
import { FarePrediction } from '../types';
import { MOCK_FARE_PREDICTIONS } from '../data/mockData';

interface AIFarePredictorWidgetProps {
  fromCity: string;
  toCity: string;
}

export const AIFarePredictorWidget: React.FC<AIFarePredictorWidgetProps> = ({
  fromCity,
  toCity,
}) => {
  const routeKey = `${fromCity}-${toCity}`;
  const prediction: FarePrediction =
    MOCK_FARE_PREDICTIONS[routeKey] || {
      routeKey,
      currentAvg: 850,
      predictedPeak: 1150,
      predictedLow: 650,
      trend: 'rising',
      changePct: 18,
      recommendation: 'Book Now',
      forecastExplanation: `Historical trend: Fares for ${fromCity} to ${toCity} typically rise closer to departure due to high passenger occupancy. Early reservations are recommended.`,
      priceHistory: [
        { day: '6d ago', price: 720 },
        { day: '4d ago', price: 780 },
        { day: '2d ago', price: 820 },
        { day: 'Today', price: 850 },
        { day: 'Tom', price: 980, isPredicted: true },
        { day: '+2d', price: 1150, isPredicted: true },
      ],
    };

  const [showAlertModal, setShowAlertModal] = useState(false);
  const [alertEmail, setAlertEmail] = useState('navinchandra441@gmail.com');
  const [alertTargetPrice, setAlertTargetPrice] = useState('800');
  const [alertSetSuccess, setAlertSetSuccess] = useState(false);

  const handleSetAlert = (e: React.FormEvent) => {
    e.preventDefault();
    setAlertSetSuccess(true);
    setTimeout(() => {
      setAlertSetSuccess(false);
      setShowAlertModal(false);
    }, 2200);
  };

  const maxChartPrice = Math.max(...prediction.priceHistory.map((p) => p.price)) * 1.1;

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs mb-6">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Left: Trend Insight Badge & Explanation */}
        <div className="space-y-1.5 max-w-xl">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-rose-50 text-rose-700 border border-rose-200 flex items-center gap-1">
              <TrendingUp className="w-3 h-3 text-rose-600" /> Fare Trends & Demand
            </span>
            <span className="text-xs font-bold text-slate-700 flex items-center gap-1">
              Peak Travel Window (+{prediction.changePct}%)
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-black">
              Recommendation: {prediction.recommendation}
            </span>
          </div>

          <p className="text-xs text-slate-600 font-medium leading-relaxed">
            {prediction.forecastExplanation}
          </p>
        </div>

        {/* Right: Price Drop Alert Trigger */}
        <div className="flex items-center gap-3 self-start lg:self-auto">
          <button
            type="button"
            onClick={() => setShowAlertModal(true)}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer flex items-center gap-1.5 shadow-xs"
          >
            <Bell className="w-3.5 h-3.5 text-amber-400" />
            <span>Track Price Drop</span>
          </button>
        </div>
      </div>

      {/* Mini Visual Price Forecast Bar Chart */}
      <div className="mt-4 pt-4 border-t border-slate-100">
        <div className="flex items-center justify-between text-[11px] text-slate-400 mb-2">
          <span>7-Day Route Fare Movement & Demand Curve:</span>
          <span>
            Current Average: <strong className="text-slate-900">₹{prediction.currentAvg}</strong> · Estimated Weekend Peak:{' '}
            <strong className="text-rose-600">₹{prediction.predictedPeak}</strong>
          </span>
        </div>

        <div className="grid grid-cols-6 gap-2 items-end h-20 pt-2">
          {prediction.priceHistory.map((pt, idx) => {
            const heightPct = Math.round((pt.price / maxChartPrice) * 100);
            return (
              <div key={idx} className="flex flex-col items-center gap-1 h-full justify-end">
                <span className="font-mono text-[10px] font-bold text-slate-700">₹{pt.price}</span>
                <div
                  className={`w-full rounded-md transition-all duration-300 ${
                    pt.isPredicted
                      ? 'bg-gradient-to-t from-rose-400 to-rose-500 border border-rose-300 border-dashed'
                      : pt.day === 'Today'
                      ? 'bg-[#d84e55]'
                      : 'bg-slate-200'
                  }`}
                  style={{ height: `${heightPct}%` }}
                />
                <span className="text-[10px] text-slate-400 font-semibold">{pt.day}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Price Alert Subscription Modal */}
      {showAlertModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 border border-slate-200 space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                <Bell className="w-4 h-4 text-amber-500" />
                Set Free Price Drop Alert
              </h3>
              <button
                onClick={() => setShowAlertModal(false)}
                className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-500">
              We'll monitor fares across 40+ operators for <strong className="text-slate-800">{fromCity} ➔ {toCity}</strong> and notify you the moment fares drop below your target price.
            </p>

            <form onSubmit={handleSetAlert} className="space-y-3">
              <div>
                <label className="text-[11px] font-bold text-slate-600 block mb-1">
                  Notify Below Price (₹)
                </label>
                <input
                  type="number"
                  value={alertTargetPrice}
                  onChange={(e) => setAlertTargetPrice(e.target.value)}
                  className="w-full text-xs font-bold px-3 py-2 bg-slate-50 rounded-lg border border-slate-300"
                  required
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-600 block mb-1">
                  Email / WhatsApp ID
                </label>
                <input
                  type="text"
                  value={alertEmail}
                  onChange={(e) => setAlertEmail(e.target.value)}
                  className="w-full text-xs font-bold px-3 py-2 bg-slate-50 rounded-lg border border-slate-300"
                  required
                />
              </div>

              {alertSetSuccess ? (
                <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-xs text-emerald-800 font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Price Alert Activated! We'll notify you on WhatsApp & Email.</span>
                </div>
              ) : (
                <button
                  type="submit"
                  className="w-full py-2.5 bg-[#d84e55] hover:bg-[#c23f46] text-white text-xs font-black rounded-xl shadow-md cursor-pointer uppercase tracking-wider"
                >
                  Activate Price Tracker Alert ➔
                </button>
              )}
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
