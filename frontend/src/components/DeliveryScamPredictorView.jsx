import { useState } from 'react';
import CyberFeatureCard from './CyberFeatureCard';
import { analyzeDeliveryScam } from '../cyberFeatures/deliveryScamPredictor';

export default function DeliveryScamPredictorView() {
  const [trackingId, setTrackingId] = useState(''); const [courierName, setCourierName] = useState('FedEx International');
  const [deliveryAddress, setDeliveryAddress] = useState(''); const [amountDue, setAmountDue] = useState('₹2,500');
  const [message, setMessage] = useState('Your parcel has been seized by customs. Pay ₹2,500 to release it immediately.'); const [asksForPayment, setAsksForPayment] = useState(true);
  const [asksForOTP, setAsksForOTP] = useState(false); const [result, setResult] = useState(null);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="mb-6"><div className="text-xs font-mono uppercase tracking-[0.3em] text-[var(--saffron)]">Delivery Scam Predictor</div><h2 className="font-display text-3xl font-semibold text-[var(--ink)]">Predict delivery and parcel scams</h2><p className="mt-2 max-w-2xl text-sm text-[var(--ink-text)]/70">Analyze delivery notifications for customs threats, payment requests, and OTP phishing.</p></div>
      <CyberFeatureCard eyebrow="Delivery Check" title="Delivery scam analysis" description="Enter the delivery notification details.">
        <input value={trackingId} onChange={(e) => setTrackingId(e.target.value)} className="w-full rounded-2xl border border-[var(--paper-line)] p-3 text-sm" placeholder="Tracking ID" /><input value={courierName} onChange={(e) => setCourierName(e.target.value)} className="w-full rounded-2xl border border-[var(--paper-line)] p-3 text-sm" placeholder="Courier name" /><input value={amountDue} onChange={(e) => setAmountDue(e.target.value)} className="w-full rounded-2xl border border-[var(--paper-line)] p-3 text-sm" placeholder="Amount due" />
        <textarea value={message} onChange={(e) => setMessage(e.target.value)} className="min-h-16 w-full rounded-2xl border border-[var(--paper-line)] p-3 text-sm" placeholder="Message" />
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={asksForPayment} onChange={(e) => setAsksForPayment(e.target.checked)} className="accent-[var(--saffron)]" /> Asks for payment before delivery</label>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={asksForOTP} onChange={(e) => setAsksForOTP(e.target.checked)} className="accent-[var(--saffron)]" /> Asks for OTP or verification code</label>
        <button onClick={() => setResult(analyzeDeliveryScam({ trackingId, courierName, deliveryAddress, amountDue, message, asksForPayment, asksForOTP }))} className="rounded-full bg-[var(--ink)] px-4 py-2 text-sm font-semibold text-white">Predict scam risk</button>
        {result && <div className="rounded-2xl border border-[var(--paper-line)] bg-[var(--paper)] p-4 text-sm"><div className="mb-2 inline-flex rounded-full border border-[var(--saffron)]/30 bg-[var(--saffron)]/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-[var(--saffron)]">{result.risk_band} risk</div><p className="font-semibold">{result.recommendation}</p><ul className="mt-3 space-y-1">{result.signals.map((s) => <li key={s.type}>• {s.detail}</li>)}</ul></div>}
      </CyberFeatureCard>
    </div>
  );
}

