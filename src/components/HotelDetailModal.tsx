import React, { useState } from 'react';
import { 
  X, Star, MapPin, Share2, Heart, ShieldCheck, CheckCircle2, 
  Wifi, Coffee, Car, Wind, Tv, Sparkles, ChevronRight, Check,
  Info, Bed, Building2, Eye, ShieldAlert, Award, ArrowRight
} from 'lucide-react';
import { HotelItem, HotelRoomCombo } from '../types';

interface HotelDetailModalProps {
  hotel: HotelItem;
  checkInDate: string;
  checkOutDate: string;
  guestsText: string;
  isWishlisted: boolean;
  onToggleWishlist: () => void;
  onClose: () => void;
  onSelectCombo: (hotel: HotelItem, combo: HotelRoomCombo) => void;
}

export const HotelDetailModal: React.FC<HotelDetailModalProps> = ({
  hotel,
  checkInDate,
  checkOutDate,
  guestsText,
  isWishlisted,
  onToggleWishlist,
  onClose,
  onSelectCombo,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'rooms' | 'location' | 'reviews' | 'facilities' | 'policies'>('overview');
  const [selectedPhotoIdx, setSelectedPhotoIdx] = useState(0);
  const [copiedShare, setCopiedShare] = useState(false);

  const images = hotel.images && hotel.images.length > 0 ? hotel.images : [
    'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format&fit=crop&q=80',
  ];

  const combos: HotelRoomCombo[] = hotel.roomCombos && hotel.roomCombos.length > 0 ? hotel.roomCombos : [
    {
      name: hotel.roomType || 'Standard Deluxe Room',
      mealPlan: hotel.freeBreakfast ? 'Free Breakfast Included' : 'No meals included',
      price: hotel.pricePerNight,
      taxesAndFees: hotel.taxAndFees || 44,
      isPopular: true,
    },
    {
      name: 'Executive King Suite with City View',
      mealPlan: 'Free Breakfast & Dinner Combo',
      price: Math.round(hotel.pricePerNight * 1.35),
      taxesAndFees: Math.round((hotel.taxAndFees || 44) * 1.3),
    },
  ];

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopiedShare(true);
    setTimeout(() => setCopiedShare(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto animate-fade-in">
      <div className="bg-white w-full max-w-5xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[94vh] border border-slate-200">
        
        {/* Top Header Bar & Steps */}
        <div className="bg-white border-b border-slate-200 px-4 sm:px-6 py-3 shrink-0">
          <div className="flex items-center justify-between gap-4">
            {/* Title & Dates */}
            <div className="flex items-center gap-2 overflow-hidden">
              <span className="font-black text-slate-900 text-sm sm:text-base truncate">
                {hotel.name}
              </span>
              <span className="hidden sm:inline-block text-xs text-slate-400 font-medium">
                • {checkInDate} - {checkOutDate} • {guestsText}
              </span>
            </div>

            {/* Stepper (Screenshot 5) */}
            <div className="hidden md:flex items-center gap-3 text-xs font-semibold shrink-0">
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 text-white font-bold">
                <span className="w-4 h-4 rounded-full bg-white text-slate-900 text-[10px] flex items-center justify-center font-black">1</span>
                <span>Details</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
              <div className="flex items-center gap-1.5 text-slate-400">
                <span className="w-4 h-4 rounded-full bg-slate-200 text-slate-600 text-[10px] flex items-center justify-center font-bold">2</span>
                <span>Traveller Info</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
              <div className="flex items-center gap-1.5 text-slate-400">
                <span className="w-4 h-4 rounded-full bg-slate-200 text-slate-600 text-[10px] flex items-center justify-center font-bold">3</span>
                <span>Pay</span>
              </div>
            </div>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer shrink-0"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation (Screenshot 5) */}
        <div className="border-b border-slate-200 bg-slate-50 px-4 sm:px-6 flex gap-6 overflow-x-auto text-xs font-bold text-slate-600 shrink-0">
          {(['overview', 'rooms', 'location', 'reviews', 'facilities', 'policies'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-3 uppercase tracking-wider transition-colors cursor-pointer border-b-2 whitespace-nowrap ${
                activeTab === tab
                  ? 'border-[#d84e55] text-[#d84e55]'
                  : 'border-transparent hover:text-slate-900'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          
          {/* Top Title & Actions Banner */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 leading-snug">
                {hotel.name}
              </h2>
              <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                <MapPin className="w-3.5 h-3.5 text-[#d84e55]" />
                {hotel.area}, {hotel.city} • <span className="text-slate-700 font-semibold">{hotel.distanceLandmark}</span>
              </p>
              {hotel.recentBookings && (
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-emerald-50 text-emerald-800 text-[11px] font-bold mt-2 border border-emerald-200">
                  <Sparkles className="w-3 h-3 text-emerald-600" />
                  <span>{hotel.recentBookings} bookings done in the last 30 days</span>
                </div>
              )}
            </div>

            {/* Action Buttons: Share & Wishlist */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={handleShare}
                className="flex items-center gap-1.5 px-3.5 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>{copiedShare ? 'Copied Link!' : 'Share'}</span>
              </button>
              <button
                onClick={onToggleWishlist}
                className={`flex items-center gap-1.5 px-3.5 py-2 border rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                  isWishlisted
                    ? 'border-rose-200 bg-rose-50 text-rose-600'
                    : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <Heart className={`w-3.5 h-3.5 ${isWishlisted ? 'fill-rose-600 text-rose-600' : ''}`} />
                <span>{isWishlisted ? 'Saved' : 'Wishlist'}</span>
              </button>
            </div>
          </div>

          {/* Photo Gallery Grid (Screenshot 5) */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
            {/* Main Feature Image */}
            <div className="md:col-span-8 h-72 sm:h-96 rounded-2xl overflow-hidden relative group">
              <img
                src={images[selectedPhotoIdx] || images[0]}
                alt={hotel.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-102"
              />
              {hotel.isFlashDeal && (
                <div className="absolute top-4 left-4 bg-gradient-to-r from-red-600 to-amber-600 text-white text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full shadow-lg">
                  ⚡ Flash Deal · {hotel.flashDiscountPercent || 35}% OFF
                </div>
              )}
            </div>

            {/* Side Secondary Thumbnails */}
            <div className="md:col-span-4 flex md:flex-col gap-3 h-24 md:h-96">
              {images.slice(1, 3).map((img, idx) => (
                <div
                  key={idx}
                  onClick={() => setSelectedPhotoIdx(idx + 1)}
                  className={`flex-1 rounded-xl overflow-hidden cursor-pointer border-2 transition-all relative ${
                    selectedPhotoIdx === idx + 1 ? 'border-[#d84e55]' : 'border-transparent opacity-85 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="Hotel view" className="w-full h-full object-cover" />
                </div>
              ))}
              <div 
                onClick={() => setSelectedPhotoIdx(0)}
                className="flex-1 rounded-xl overflow-hidden cursor-pointer relative bg-slate-900 group"
              >
                <img
                  src={images[images.length - 1] || images[0]}
                  alt="Gallery"
                  className="w-full h-full object-cover opacity-60 group-hover:opacity-40 transition-opacity"
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center p-2">
                  <span className="text-xs font-black">+66 Property &</span>
                  <span className="text-[11px] font-semibold text-slate-200">guest photos</span>
                </div>
              </div>
            </div>
          </div>

          {/* Rating & Guest Favourite Badge Bar (Screenshot 5) */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <div className="flex items-center gap-3">
              <div className="bg-emerald-600 text-white px-3 py-1 rounded-xl font-black text-base flex items-center gap-1 shadow-xs">
                <span>{hotel.rating}</span>
                <Star className="w-3.5 h-3.5 fill-white text-white" />
              </div>
              <div>
                <span className="font-extrabold text-sm text-slate-900">Very Good</span>
                <span className="text-xs text-slate-500 block">({hotel.totalRatings} Verified Ratings)</span>
              </div>
            </div>

            {hotel.isGuestFavourite && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-100/70 border border-emerald-300 text-emerald-800 font-black text-xs">
                <span>🌿 GUEST FAVOURITE 🌿</span>
              </div>
            )}

            <button
              onClick={() => setActiveTab('reviews')}
              className="text-xs font-bold text-[#d84e55] hover:underline cursor-pointer"
            >
              Read all verified reviews ➔
            </button>
          </div>

          {/* Main Grid: Combos & Booking on Right, Amenities on Left */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Left Column: Amenities, Location & Policies */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Amenities Section (Screenshot 5) */}
              <div>
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider mb-3">
                  Property Amenities & Highlights
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {hotel.amenities.map((am, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2 p-2.5 rounded-xl border border-slate-200/80 bg-white text-xs font-semibold text-slate-700 shadow-2xs"
                    >
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span className="truncate">{am}</span>
                    </div>
                  ))}
                  <div className="flex items-center gap-2 p-2.5 rounded-xl border border-slate-200/80 bg-white text-xs font-semibold text-slate-700 shadow-2xs">
                    <Wifi className="w-3.5 h-3.5 text-[#d84e55] shrink-0" />
                    <span>Free Fast Wi-Fi</span>
                  </div>
                  <div className="flex items-center gap-2 p-2.5 rounded-xl border border-slate-200/80 bg-white text-xs font-semibold text-slate-700 shadow-2xs">
                    <ShieldCheck className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                    <span>CCTV & 24x7 Security</span>
                  </div>
                </div>
              </div>

              {/* Location Highlights (Screenshot 5) */}
              <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200/80 space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                    <MapPin className="w-4 h-4 text-[#d84e55]" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">{hotel.distanceLandmark}</h4>
                    <span className="text-[11px] text-slate-500">Easily accessible by private taxi and public transit</span>
                  </div>
                </div>
                <ul className="text-xs text-slate-600 space-y-1 pl-9 list-disc">
                  <li>Direct road connectivity with 24x7 on-call cab desk</li>
                  <li>Within walking distance of ATMs, cafes and pharmacies</li>
                </ul>
              </div>

              {/* Verified Busly Stays Guarantee */}
              <div className="flex items-start gap-3 p-4 rounded-2xl bg-slate-900 text-white">
                <ShieldCheck className="w-6 h-6 text-emerald-400 shrink-0 mt-0.5" />
                <div className="text-xs space-y-1">
                  <span className="font-extrabold text-sm text-white block">
                    Busly Verified Stay Assurance
                  </span>
                  <p className="text-slate-300 leading-relaxed">
                    100% Guaranteed check-in with clean sanitized rooms, fresh linens, working AC & hot water. Instant refund if room is unavailable.
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column: Room Combos & Selection (Screenshot 5) */}
            <div className="lg:col-span-5 space-y-4">
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">
                Select Room & Meal Combo
              </h3>

              {combos.map((combo, idx) => (
                <div
                  key={idx}
                  className={`p-4 rounded-2xl border-2 transition-all relative ${
                    combo.isPopular
                      ? 'border-[#d84e55] bg-red-50/20 shadow-md'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  {combo.isPopular && (
                    <span className="absolute -top-2.5 right-4 bg-[#d84e55] text-white text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow-xs">
                      Best Value Combo
                    </span>
                  )}

                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div>
                      <h4 className="font-black text-slate-900 text-sm">{combo.name}</h4>
                      <span className="inline-block text-[11px] font-bold text-slate-600 mt-0.5">
                        • {combo.mealPlan}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-baseline gap-2 pt-2 border-t border-slate-100">
                    <span className="text-xs text-slate-400 line-through">
                      ₹{Math.round(combo.price * 1.35)}
                    </span>
                    <span className="font-mono text-2xl font-black text-slate-900">
                      ₹{combo.price}
                    </span>
                    <span className="text-[11px] text-slate-500">
                      + ₹{combo.taxesAndFees} taxes & fees
                    </span>
                  </div>

                  <button
                    onClick={() => onSelectCombo(hotel, combo)}
                    className="w-full mt-3 py-2.5 bg-[#d84e55] hover:bg-[#c23f46] text-white text-xs font-black rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 uppercase tracking-wider"
                  >
                    <span>Book {combo.isPopular ? 'Combo' : 'Room'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
