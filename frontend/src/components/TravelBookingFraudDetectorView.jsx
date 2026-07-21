import { useState } from 'react';
import CyberFeatureCard from './CyberFeatureCard';
import { analyzeTravelBooking } from '../cyberFeatures/travelBookingFraudDetector';

export default function TravelBookingFraudDetectorView() {
  const [bookingId, setBookingId] = useState('TKT789012'); const [airline, setAirline] = useState('IndiGo Airlines');
  const [hotel, setHotel] = useState('Grand Hyatt'); const [amount, setAmount] = useState('₹24,999');
  const [paymentMethod, setPaymentMethod] = useState('UPI direct transfer'); const [message, setMessage] = useState('Limited seats available! Book now and pay directly to avoid 18% GST.');
  const [urgency, setUrgency] = useState(true); const [askForOTP, setAskForOTP] = useState(false); const [result, setResult] = useState(null);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="mb-6"><div className="text-xs font-mono uppercase tracking-[0.3em] text-[var(--saffron)]">Travel Booking Fraud Detector</div><h2 className="font-display text-3xl font-semibold text-[var(--ink)]">Detect fraudulent travel bookings</h2><p className="mt-2 max-w-2xl text-sm text-[var(--ink-text)]/70">Check booking emails and messages for payment red flags, urgency, and OTP requests.</p></div>
      <CyberFeatureCard eyebrow="Booking Check" title="Travel booking fraud analysis" description="Enter the booking details.">
        <input value={bookingId} onChange={(e) => setBookingId(e.target.value)} className="w-full rounded-2xl border border-[var(--paper-line)] p-3 text-sm" placeholder="Booking ID" />
        <input value={airline} onChange={(e) => setAirline(e.target.value)} className="w-full rounded-2xl border border-[var(--paper-line)] p-3 text-sm" placeholder="Airline" />
        <input value={hotel} onChange={(e) => setHotel(e.target.value)} className="w-full rounded-2xl border border-[var(--paper-line)] p-3 text-sm" placeholder="Hotel" />
        <input value={amount} onChange={(e) => setAmount(e.target.value)} className="w-full rounded-2xl border border-[var(--paper-line)] p-3 text-sm" placeholder="Amount" />
        <input value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)} className="w-full rounded-2xl border border-[var(--paper-line)] p-3 text-sm" placeholder="Payment method requested" />
        <textarea value={message} onChange={(e) => setMessage(e.target.value)} className="min-h-16 w-full rounded-2xl border border-[var(--paper-line)] p-3 text-sm" placeholder="Message" />
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={urgency} onChange={(e) => setUrgency(e.target.checked)} className="accent-[var(--saffron)]" /> Uses urgency or limited-time pressure</label>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={askForOTP} onChange={(e) => setAskForOTP(e.target.checked)} className="accent-[var(--saffron)]" /> Asks for OTP or CVV</label>
        <button onClick={() => setResult(analyzeTravelBooking({ bookingId, airline, hotel, amount, paymentMethod, message, urgency, askForOTP }))} className="rounded-full bg-[var(--ink)] px-4 py-2 text-sm font-semibold text-white">Detect fraud</button>
        {result && <div className="rounded-2xl border border-[var(--paper-line)] bg-[var(--paper)] p-4 text-sm"><div className="mb-2 inline-flex rounded-full border border-[var(--saffron)]/30 bg-[var(--saffron)]/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-[var(--saffron)]">{result.risk_band} risk</div><p className="font-semibold">{result.recommendation}</p><ul className="mt-3 space-y-1">{result.signals.map((s) => <li key={s.type}>• {s.detail}</li>)}</ul></div>}
      </CyberFeatureCard>
    </div>
  );
}

