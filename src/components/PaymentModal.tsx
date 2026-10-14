import React, { useState, useEffect } from 'react';
import {
  X,
  ShieldCheck,
  CreditCard,
  QrCode,
  Building,
  Wallet,
  Clock,
  Tag,
  Check,
  AlertCircle,
  Lock,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { BookingRecord, TravelMode } from '../types';
import { COUPONS } from '../data/mockData';

interface PaymentModalProps {
  amount: number;
  itemTitle: string;
  subTitle: string;
  from: string;
  to: string;
  travelDate: string;
  mode: TravelMode;
  selectedSeats?: string[];
  boardingPointName?: string;
  droppingPointName?: string;
  onClose: () => void;
  onPaymentSuccess: (booking: BookingRecord) => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  amount,
  itemTitle,
  subTitle,
  from,
  to,
  travelDate,
  mode,
  selectedSeats = [],
  boardingPointName,
  droppingPointName,
  onClose,
  onPaymentSuccess,
}) => {
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'netbanking' | 'wallet'>('upi');
  const [couponInput, setCouponInput] = useState('REDBUS50');
  const [appliedCoupon, setAppliedCoupon] = useState<typeof COUPONS[0] | null>(COUPONS[0]);
  const [couponError, setCouponError] = useState<string | null>(null);

  // Form inputs
  const [passengerName, setPassengerName] = useState('Navin Chandra');
  const [passengerAge, setPassengerAge] = useState('28');
  const [passengerGender, setPassengerGender] = useState<'male' | 'female' | 'other'>('male');
  const [passengerPhone, setPassengerPhone] = useState('9876543210');
  const [passengerEmail, setPassengerEmail] = useState('navinchandra441@gmail.com');

  // Payment field inputs
  const [upiId, setUpiId] = useState('navin@okhdfcbank');
  const [cardNumber, setCardNumber] = useState('4532 8901 2345 6789');
  const [cardExpiry, setCardExpiry] = useState('08/29');
  const [cardCvv, setCardCvv] = useState('884');
  const [cardName, setCardName] = useState('NAVIN CHANDRA');
  const [selectedBank, setSelectedBank] = useState('HDFC Bank');
  const [useWalletBalance, setUseWalletBalance] = useState(false);

  // Step state: 'checkout' | 'otp_verification' | 'processing'
  const [paymentStep, setPaymentStep] = useState<'checkout' | 'otp_verification' | 'processing'>('checkout');
  const [otpValue, setOtpValue] = useState('123456');
  const [otpTimer, setOtpTimer] = useState(25);
  const [checkoutTimerSec, setCheckoutTimerSec] = useState(600); // 10 minutes

  // 10 min session countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setCheckoutTimerSec((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // OTP countdown
  useEffect(() => {
    if (paymentStep === 'otp_verification' && otpTimer > 0) {
      const timer = setInterval(() => setOtpTimer((t) => t - 1), 1000);
      return () => clearInterval(timer);
    }
  }, [paymentStep, otpTimer]);

  // Discount calculation
  let discountAmount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.flatAmount > 0) {
      discountAmount = appliedCoupon.flatAmount;
    } else if (appliedCoupon.discountPct > 0) {
      discountAmount = Math.round((amount * appliedCoupon.discountPct) / 100);
      if (appliedCoupon.maxDiscount) {
        discountAmount = Math.min(discountAmount, appliedCoupon.maxDiscount);
      }
    }
  }

  const walletDeduction = useWalletBalance ? Math.min(500, amount - discountAmount) : 0;
  const finalPayable = Math.max(0, amount - discountAmount - walletDeduction);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    const found = COUPONS.find((c) => c.code.toUpperCase() === couponInput.trim().toUpperCase());
    if (found) {
      setAppliedCoupon(found);
      setCouponError(null);
    } else {
      setCouponError('Invalid coupon code. Try REDBUS50 or FIRSTBUS');
    }
  };

  const handleProceedToOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setPaymentStep('processing');
    setTimeout(() => {
      setPaymentStep('otp_verification');
    }, 900);
  };

  const handleConfirmOtp = () => {
    setPaymentStep('processing');

    setTimeout(() => {
      // Fire confetti celebration
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#d84e55', '#10b981', '#3b82f6', '#f59e0b'],
        });
      } catch (err) {
        // Fallback silently if canvas-confetti issues
      }

      // Generate random PNR and Booking ID
      const randomPnr = Math.floor(1000000000 + Math.random() * 9000000000).toString();
      const randomBookingId = `RB${Math.floor(100000 + Math.random() * 900000)}`;

      const newBooking: BookingRecord = {
        bookingId: randomBookingId,
        pnr: randomPnr,
        mode,
        itemTitle,
        subTitle,
        from,
        to,
        travelDate,
        passengers: [
          {
            name: passengerName,
            age: parseInt(passengerAge) || 28,
            gender: passengerGender,
            seatNumber: selectedSeats.length > 0 ? selectedSeats.join(', ') : 'Confirmed',
          },
        ],
        selectedSeats,
        fareBreakdown: {
          baseFare: amount,
          taxes: Math.round(amount * 0.05),
          discount: discountAmount + walletDeduction,
          totalAmount: finalPayable,
        },
        couponCode: appliedCoupon?.code,
        paymentMethod: paymentMethod.toUpperCase(),
        bookedAt: new Date().toLocaleDateString('en-IN', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }),
        status: 'CONFIRMED',
        vehicleNumber: 'KA-01-MJ-8822',
        driverContact: {
          name: 'Rameshwar Gowda',
          phone: '+91 98450 12890',
        },
      };

      onPaymentSuccess(newBooking);
    }, 1200);
  };

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/75 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full max-h-[92vh] flex flex-col overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
                redBus Pay 100% Secure Checkout
                <span className="text-[10px] font-mono bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full border border-emerald-200">
                  256-BIT SSL ENCRYPTED
                </span>
              </h2>
              <p className="text-xs text-slate-500">
                Holding your reservation seats. Session expires in{' '}
                <span className="font-mono font-bold text-[#d84e55]">{formatTimer(checkoutTimerSec)}</span>
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

        {/* STEP 1: CHECKOUT VIEW */}
        {paymentStep === 'checkout' && (
          <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
            {/* Trip Summary Card */}
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 flex flex-wrap items-center justify-between gap-3">
              <div>
                <span className="text-xs font-bold text-[#d84e55] uppercase tracking-wider block">
                  {mode.toUpperCase()} RESERVATION
                </span>
                <h3 className="font-extrabold text-slate-900 text-base">{itemTitle}</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {from} ➔ {to} · {travelDate}
                  {selectedSeats.length > 0 && ` · Seats: ${selectedSeats.join(', ')}`}
                </p>
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-400 block font-medium">Payable Amount</span>
                <span className="font-mono text-2xl font-black text-slate-900">
                  ₹{finalPayable.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            {/* Passenger Information Form */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Primary Passenger & Contact Details
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="text-[11px] font-semibold text-slate-500 block mb-1">Full Name</label>
                  <input
                    type="text"
                    value={passengerName}
                    onChange={(e) => setPassengerName(e.target.value)}
                    className="w-full text-xs font-bold px-3 py-2 bg-slate-50 rounded-lg border border-slate-200 focus:outline-hidden"
                    required
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-500 block mb-1">Age & Gender</label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={passengerAge}
                      onChange={(e) => setPassengerAge(e.target.value)}
                      className="w-16 text-xs font-bold px-2 py-2 bg-slate-50 rounded-lg border border-slate-200 focus:outline-hidden"
                      required
                    />
                    <select
                      value={passengerGender}
                      onChange={(e) => setPassengerGender(e.target.value as any)}
                      className="flex-1 text-xs font-bold px-2 py-2 bg-slate-50 rounded-lg border border-slate-200 focus:outline-hidden"
                    >
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="text-[11px] font-semibold text-slate-500 block mb-1">Mobile Number (SMS updates)</label>
                  <div className="flex items-center">
                    <span className="bg-slate-200 px-2 py-2 text-xs font-bold text-slate-600 rounded-l-lg border border-r-0 border-slate-200">
                      +91
                    </span>
                    <input
                      type="tel"
                      value={passengerPhone}
                      onChange={(e) => setPassengerPhone(e.target.value)}
                      className="w-full text-xs font-bold px-3 py-2 bg-slate-50 rounded-r-lg border border-slate-200 focus:outline-hidden"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-500 block mb-1">Email ID (e-Ticket PDF)</label>
                  <input
                    type="email"
                    value={passengerEmail}
                    onChange={(e) => setPassengerEmail(e.target.value)}
                    className="w-full text-xs font-bold px-3 py-2 bg-slate-50 rounded-lg border border-slate-200 focus:outline-hidden"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Coupons & Discounts */}
            <div className="bg-amber-50/60 p-4 rounded-2xl border border-amber-200/80">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-amber-600" /> Have a Coupon or Voucher Code?
                </span>
                {appliedCoupon && (
                  <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-sm">
                    {appliedCoupon.code} Applied (-₹{discountAmount})
                  </span>
                )}
              </div>

              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <input
                  type="text"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value)}
                  placeholder="Enter REDBUS50 or FIRSTBUS"
                  className="flex-1 uppercase font-mono text-xs font-bold px-3 py-2 bg-white rounded-lg border border-amber-300 focus:outline-hidden"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-lg cursor-pointer"
                >
                  Apply
                </button>
              </form>
              {couponError && <p className="text-[11px] text-red-600 mt-1 font-semibold">{couponError}</p>}
            </div>

            {/* Payment Method Selector */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Select Payment Mode
              </h4>

              <div className="grid grid-cols-4 gap-2 text-xs font-bold text-slate-700">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('upi')}
                  className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 cursor-pointer transition-all ${
                    paymentMethod === 'upi'
                      ? 'border-[#d84e55] bg-red-50 text-[#d84e55] shadow-xs'
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <QrCode className="w-5 h-5" />
                  <span>UPI / QR</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 cursor-pointer transition-all ${
                    paymentMethod === 'card'
                      ? 'border-[#d84e55] bg-red-50 text-[#d84e55] shadow-xs'
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <CreditCard className="w-5 h-5" />
                  <span>Cards</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('netbanking')}
                  className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 cursor-pointer transition-all ${
                    paymentMethod === 'netbanking'
                      ? 'border-[#d84e55] bg-red-50 text-[#d84e55] shadow-xs'
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <Building className="w-5 h-5" />
                  <span>NetBanking</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('wallet')}
                  className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 cursor-pointer transition-all ${
                    paymentMethod === 'wallet'
                      ? 'border-[#d84e55] bg-red-50 text-[#d84e55] shadow-xs'
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <Wallet className="w-5 h-5" />
                  <span>Wallets</span>
                </button>
              </div>

              {/* UPI Tab */}
              {paymentMethod === 'upi' && (
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-4">
                  <div className="flex flex-col sm:flex-row items-center gap-6">
                    {/* Dynamic UPI QR Code */}
                    <div className="w-36 h-36 bg-white p-2.5 rounded-xl border border-slate-200 shadow-sm flex flex-col items-center justify-center shrink-0 text-center">
                      <svg viewBox="0 0 100 100" className="w-24 h-24 text-slate-900" fill="currentColor">
                        {/* Finder pattern Top-Left */}
                        <rect x="5" y="5" width="28" height="28" rx="4" fill="none" stroke="currentColor" strokeWidth="6" />
                        <rect x="13" y="13" width="12" height="12" rx="2" fill="currentColor" />
                        {/* Finder pattern Top-Right */}
                        <rect x="67" y="5" width="28" height="28" rx="4" fill="none" stroke="currentColor" strokeWidth="6" />
                        <rect x="75" y="13" width="12" height="12" rx="2" fill="currentColor" />
                        {/* Finder pattern Bottom-Left */}
                        <rect x="5" y="67" width="28" height="28" rx="4" fill="none" stroke="currentColor" strokeWidth="6" />
                        <rect x="13" y="75" width="12" height="12" rx="2" fill="currentColor" />
                        {/* Internal QR Data Matrix Dots */}
                        <rect x="42" y="8" width="6" height="6" />
                        <rect x="52" y="16" width="6" height="6" />
                        <rect x="40" y="24" width="8" height="6" />
                        <rect x="8" y="44" width="6" height="6" />
                        <rect x="18" y="50" width="8" height="6" />
                        <rect x="40" y="40" width="20" height="20" rx="4" fill="#d84e55" />
                        <text x="50" y="54" fill="white" fontSize="9" fontWeight="bold" textAnchor="middle">₹</text>
                        <rect x="68" y="44" width="8" height="6" />
                        <rect x="82" y="52" width="6" height="8" />
                        <rect x="44" y="68" width="6" height="6" />
                        <rect x="56" y="74" width="8" height="6" />
                        <rect x="74" y="70" width="6" height="8" />
                        <rect x="86" y="84" width="8" height="8" />
                      </svg>
                      <span className="text-[10px] text-slate-500 font-semibold mt-1">Scan with any UPI app</span>
                    </div>

                    <div className="flex-1 space-y-3">
                      <div>
                        <label className="text-xs font-bold text-slate-700 block mb-1">
                          Or Enter UPI ID / VPA
                        </label>
                        <input
                          type="text"
                          value={upiId}
                          onChange={(e) => setUpiId(e.target.value)}
                          placeholder="yourname@okhdfcbank"
                          className="w-full text-xs font-bold px-3 py-2 bg-white rounded-lg border border-slate-300 focus:outline-hidden"
                        />
                        <span className="text-[11px] text-slate-400">Supported: Google Pay, PhonePe, Paytm, CRED</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Card Tab */}
              {paymentMethod === 'card' && (
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                  <div>
                    <label className="text-[11px] font-semibold text-slate-600 block mb-1">Card Number</label>
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      placeholder="4532 8901 2345 6789"
                      className="w-full font-mono text-xs font-bold px-3 py-2 bg-white rounded-lg border border-slate-300 focus:outline-hidden"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-semibold text-slate-600 block mb-1">Valid Thru (MM/YY)</label>
                      <input
                        type="text"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        placeholder="08/29"
                        className="w-full font-mono text-xs font-bold px-3 py-2 bg-white rounded-lg border border-slate-300 focus:outline-hidden"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-slate-600 block mb-1">CVV / CVC</label>
                      <input
                        type="password"
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value)}
                        maxLength={4}
                        placeholder="884"
                        className="w-full font-mono text-xs font-bold px-3 py-2 bg-white rounded-lg border border-slate-300 focus:outline-hidden"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-slate-600 block mb-1">Cardholder Name</label>
                    <input
                      type="text"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                      className="w-full text-xs font-bold px-3 py-2 bg-white rounded-lg border border-slate-300 focus:outline-hidden uppercase"
                    />
                  </div>
                </div>
              )}

              {/* NetBanking Tab */}
              {paymentMethod === 'netbanking' && (
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                  <span className="text-xs font-bold text-slate-700 block">Popular Indian Banks</span>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {['HDFC Bank', 'State Bank of India', 'ICICI Bank', 'Axis Bank', 'Kotak Mahindra', 'Punjab National'].map(
                      (bank) => (
                        <button
                          key={bank}
                          type="button"
                          onClick={() => setSelectedBank(bank)}
                          className={`p-2.5 rounded-lg border text-xs font-bold text-left cursor-pointer transition-colors ${
                            selectedBank === bank
                              ? 'border-[#d84e55] bg-red-50 text-[#d84e55]'
                              : 'border-slate-200 bg-white hover:bg-slate-100 text-slate-700'
                          }`}
                        >
                          {bank}
                        </button>
                      )
                    )}
                  </div>
                </div>
              )}

              {/* Wallet Tab */}
              {paymentMethod === 'wallet' && (
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                  <label className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-200 cursor-pointer">
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={useWalletBalance}
                        onChange={(e) => setUseWalletBalance(e.target.checked)}
                        className="text-[#d84e55] focus:ring-[#d84e55] rounded-sm"
                      />
                      <div>
                        <span className="text-xs font-bold text-slate-900 block">redBus Wallet Cash</span>
                        <span className="text-[11px] text-slate-400">Available Balance: ₹500.00</span>
                      </div>
                    </div>
                    <span className="font-mono text-xs font-bold text-emerald-600">-₹500</span>
                  </label>
                </div>
              )}
            </div>

            {/* Price Breakdown Footer Bar */}
            <div className="pt-4 border-t border-slate-100 space-y-1.5 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Base Fare ({selectedSeats.length || 1} Pax):</span>
                <span className="font-mono text-slate-900">₹{amount}</span>
              </div>
              <div className="flex justify-between text-emerald-700 font-semibold">
                <span>Discount Promo Savings:</span>
                <span className="font-mono">-₹{discountAmount}</span>
              </div>
              {useWalletBalance && (
                <div className="flex justify-between text-emerald-700 font-semibold">
                  <span>redBus Wallet Deduction:</span>
                  <span className="font-mono">-₹{walletDeduction}</span>
                </div>
              )}
              <div className="flex justify-between text-base font-black text-slate-900 pt-2 border-t border-slate-200">
                <span>Net Total Payable:</span>
                <span className="font-mono text-xl text-[#d84e55]">₹{finalPayable.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="button"
              onClick={handleProceedToOtp}
              className="w-full py-4 bg-[#d84e55] hover:bg-[#c23f46] text-white text-sm font-black rounded-xl shadow-lg shadow-[#d84e55]/30 flex items-center justify-center gap-2 cursor-pointer transition-all duration-150 uppercase tracking-wider"
            >
              <Lock className="w-4 h-4" />
              <span>PAY ₹{finalPayable.toLocaleString('en-IN')} NOW ➔</span>
            </button>
          </div>
        )}

        {/* STEP 2: PROCESSING STATE */}
        {paymentStep === 'processing' && (
          <div className="p-12 text-center space-y-4">
            <div className="w-14 h-14 mx-auto rounded-full border-4 border-[#d84e55] border-t-transparent animate-spin" />
            <h3 className="text-lg font-bold text-slate-900">Connecting to Secure Banking Gateway...</h3>
            <p className="text-xs text-slate-500">Please do not refresh or hit back button.</p>
          </div>
        )}

        {/* STEP 3: 3D SECURE OTP SIMULATION */}
        {paymentStep === 'otp_verification' && (
          <div className="p-6 sm:p-8 space-y-6">
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  Merchant: REDBUS INDIA PVT LTD
                </span>
                <span className="font-black text-slate-900 text-lg">Amount: ₹{finalPayable}</span>
              </div>
              <div className="text-right">
                <span className="text-[11px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-sm">
                  3D Secure Verified
                </span>
              </div>
            </div>

            <div className="text-center space-y-2">
              <h3 className="text-base font-bold text-slate-900">Enter One Time Password (OTP)</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                An authentication OTP has been sent to your registered mobile ending in{' '}
                <span className="font-mono font-bold text-slate-800">
                  ******{passengerPhone.slice(-4) || '3210'}
                </span>
              </p>
            </div>

            {/* OTP Input */}
            <div className="max-w-xs mx-auto space-y-3">
              <input
                type="text"
                value={otpValue}
                onChange={(e) => setOtpValue(e.target.value)}
                maxLength={6}
                className="w-full text-center font-mono text-2xl font-black tracking-widest py-3 bg-slate-50 rounded-xl border-2 border-slate-300 focus:border-[#d84e55] focus:outline-hidden"
              />
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>Resend OTP in 00:{otpTimer.toString().padStart(2, '0')}</span>
                <button
                  type="button"
                  onClick={() => setOtpTimer(30)}
                  disabled={otpTimer > 0}
                  className="text-[#d84e55] disabled:text-slate-400 font-bold hover:underline cursor-pointer"
                >
                  Resend Code
                </button>
              </div>
              <span className="text-[10px] text-slate-400 block text-center">
                OTP has been dispatched to your mobile via SMS.
              </span>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setPaymentStep('checkout')}
                className="flex-1 py-3 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmOtp}
                className="flex-2 py-3 text-xs font-black text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-md cursor-pointer uppercase tracking-wider flex items-center justify-center gap-1.5"
              >
                <Check className="w-4 h-4" />
                <span>Confirm & Authorize Payment</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
