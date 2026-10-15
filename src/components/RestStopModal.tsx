import React, { useState } from 'react';
import {
  X,
  Coffee,
  ShieldCheck,
  Clock,
  Sparkles,
  MapPin,
  Utensils,
  CheckCircle2,
  Heart,
  ShoppingBag,
  Star,
} from 'lucide-react';
import { RestStop, RestStopMenuItem } from '../types';

interface RestStopModalProps {
  restStop: RestStop;
  busOperator: string;
  onClose: () => void;
}

export const RestStopModal: React.FC<RestStopModalProps> = ({
  restStop,
  busOperator,
  onClose,
}) => {
  const [activeCategory, setActiveCategory] = useState<'all' | 'meals' | 'beverages' | 'snacks'>('all');
  const [cartItems, setCartItems] = useState<{ item: RestStopMenuItem; qty: number }[]>([]);
  const [orderConfirmed, setOrderConfirmed] = useState(false);

  const handleAddToCart = (item: RestStopMenuItem) => {
    const existing = cartItems.find((ci) => ci.item.id === item.id);
    if (existing) {
      setCartItems(
        cartItems.map((ci) => (ci.item.id === item.id ? { ...ci, qty: ci.qty + 1 } : ci))
      );
    } else {
      setCartItems([...cartItems, { item, qty: 1 }]);
    }
  };

  const handleRemoveFromCart = (itemId: string) => {
    const existing = cartItems.find((ci) => ci.item.id === itemId);
    if (existing && existing.qty > 1) {
      setCartItems(
        cartItems.map((ci) => (ci.item.id === itemId ? { ...ci, qty: ci.qty - 1 } : ci))
      );
    } else {
      setCartItems(cartItems.filter((ci) => ci.item.id !== itemId));
    }
  };

  const cartTotal = cartItems.reduce((acc, ci) => acc + ci.item.price * ci.qty, 0);

  const filteredMenuItems =
    activeCategory === 'all'
      ? restStop.menuItems
      : restStop.menuItems.filter((m) => m.category === activeCategory);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/75 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[92vh] flex flex-col overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold shadow-xs">
              <Utensils className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-extrabold text-slate-900">{restStop.name}</h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> Sanitized Restrooms
                </span>
              </div>
              <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                <MapPin className="w-3 h-3 text-[#d84e55]" /> {restStop.location} · {restStop.highway}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Hygiene & Timing Stats Strip */}
        <div className="bg-slate-900 text-white p-4 grid grid-cols-2 sm:grid-cols-4 gap-3 text-center border-y border-slate-800">
          <div className="bg-slate-800/80 p-2.5 rounded-xl border border-slate-700">
            <span className="text-[10px] text-slate-400 block uppercase font-bold">Hygiene Score</span>
            <div className="flex items-center justify-center gap-1 mt-0.5">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span className="font-mono font-black text-sm text-white">{restStop.hygieneScore} / 5.0</span>
            </div>
          </div>

          <div className="bg-slate-800/80 p-2.5 rounded-xl border border-slate-700">
            <span className="text-[10px] text-slate-400 block uppercase font-bold">Washroom Cleanliness</span>
            <span className="font-mono font-black text-sm text-emerald-400 block mt-0.5">
              {restStop.restroomCleanliness} / 5.0 ★
            </span>
          </div>

          <div className="bg-slate-800/80 p-2.5 rounded-xl border border-slate-700">
            <span className="text-[10px] text-slate-400 block uppercase font-bold">Dinner Halt Time</span>
            <span className="font-mono font-black text-sm text-amber-400 block mt-0.5">
              {restStop.expectedHaltTime}
            </span>
          </div>

          <div className="bg-slate-800/80 p-2.5 rounded-xl border border-slate-700">
            <span className="text-[10px] text-slate-400 block uppercase font-bold">Halt Duration</span>
            <span className="font-mono font-black text-sm text-white block mt-0.5">
              {restStop.durationMins} Minutes
            </span>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6 bg-slate-50">
          {/* Female Traveler Safety & Hygiene certification */}
          <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-2xl p-3.5 text-xs text-emerald-900 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block text-emerald-950">
                Busly Certified Female-Friendly & Hygienic Rest Stop
              </span>
              <p className="text-emerald-700 mt-0.5 leading-relaxed">
                Separated clean female restrooms, bright LED outdoor illumination, 24x7 security, and hot sanitized dining counters.
              </p>
            </div>
          </div>

          {/* Menu Category Filter */}
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <Utensils className="w-4 h-4 text-[#d84e55]" />
              Highway Plaza Food & Beverage Menu
            </h3>

            <div className="flex gap-1 bg-white p-1 rounded-xl border border-slate-200 text-xs">
              {(['all', 'meals', 'beverages', 'snacks'] as const).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3 py-1 rounded-lg font-bold capitalize transition-colors cursor-pointer ${
                    activeCategory === cat
                      ? 'bg-[#d84e55] text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Menu Items List */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {filteredMenuItems.map((item) => {
              const inCart = cartItems.find((ci) => ci.item.id === item.id);

              return (
                <div
                  key={item.id}
                  className="bg-white p-3.5 rounded-2xl border border-slate-200 hover:border-slate-300 shadow-2xs flex items-center justify-between gap-3"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1.5">
                      <span className="w-3 h-3 rounded-xs border border-emerald-600 flex items-center justify-center">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                      </span>
                      <span className="font-bold text-xs text-slate-900">{item.name}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-black text-slate-900">₹{item.price}</span>
                      {item.isBestseller && (
                        <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.2 rounded-xs bg-amber-100 text-amber-800">
                          Bestseller
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Quantity Stepper */}
                  <div>
                    {inCart ? (
                      <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-lg px-2 py-1">
                        <button
                          onClick={() => handleRemoveFromCart(item.id)}
                          className="text-xs font-black text-[#d84e55] px-1 hover:scale-110"
                        >
                          -
                        </button>
                        <span className="font-mono text-xs font-bold text-slate-900">{inCart.qty}</span>
                        <button
                          onClick={() => handleAddToCart(item)}
                          className="text-xs font-black text-[#d84e55] px-1 hover:scale-110"
                        >
                          +
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleAddToCart(item)}
                        className="px-3 py-1.5 bg-slate-100 hover:bg-[#d84e55] hover:text-white text-slate-800 text-xs font-bold rounded-lg transition-colors cursor-pointer"
                      >
                        Add +
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pre-order Confirmation Notification */}
          {orderConfirmed && (
            <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-2xl text-xs text-emerald-900 flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <div>
                <span className="font-bold block">Pre-Order Transmitted to {restStop.name}!</span>
                <p className="text-emerald-700 mt-0.5">
                  Your fresh hot meal will be packed and handed to you directly at the counter when {busOperator} halts at {restStop.expectedHaltTime}.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer with Pre-Order Total */}
        <div className="p-4 bg-white border-t border-slate-200 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-400 block font-medium">Pre-Order Highway Food Total:</span>
            <span className="font-mono text-lg font-black text-slate-900">
              ₹{cartTotal.toLocaleString('en-IN')}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
            >
              Close
            </button>

            <button
              disabled={cartItems.length === 0}
              onClick={() => {
                setOrderConfirmed(true);
                setTimeout(() => setOrderConfirmed(false), 5000);
              }}
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white text-xs font-black rounded-xl shadow-md cursor-pointer transition-colors flex items-center gap-1.5 uppercase tracking-wider"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Pre-Order for Halt ({cartItems.reduce((a, b) => a + b.qty, 0)})</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
