import { useState } from 'react';
import CyberFeatureCard from './CyberFeatureCard';
import { analyzeCourier } from '../cyberFeatures/courierGuard';

export default function CourierGuardView() {
  const [courier, setCourier] = useState('Customs');
  const [trackingNumber, setTrackingNumber] = useState('123456789');
  const [message, setMessage] = useState('Your parcel is blocked. Pay a fee now to release it.');
  const [result, setResult] = useState(null);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="mb-6">
        <div className="text-xs font-mono uppercase tracking-[0.3em] text-[var(--saffron)]">CourierGuard</div>
        <h2 className="font-display text-3xl font-semibold text-[var(--ink)]">Fake courier and parcel scam detector</h2>
        <p className="mt-2 max-w-2xl text-sm text-[var(--ink-text)]/70">Check parcel alerts for customs or courier impersonation and payment demands.</p>
      </div>
      <CyberFeatureCard eyebrow="Parcel alert check" title="Assess a parcel notice" description="This flags package alerts that ask for money or personal data to release a parcel.">
        <input value={courier} onChange={(e) => setCourier(e.target.value)} className="w-full rounded-2xl border border-[var(--paper-line)] p-3 text-sm" placeholder="Courier or agency" />
        <input value={trackingNumber} onChange={(e) => setTrackingNumber(e.target.value)} className="w-full rounded-2xl border border-[var(--paper-line)] p-3 text-sm" placeholder="Tracking number" />
        <textarea value={message} onChange={(e) => setMessage(e.target.value)} className="min-h-28 w-full rounded-2xl border border-[var(--paper-line)] p-3 text-sm" />
        <button onClick={() => setResult(analyzeCourier({ courier, trackingNumber, message }))} className="rounded-full bg-[var(--ink)] px-4 py-2 text-sm font-semibold text-white">Analyze parcel notice</button>
        {result && <div className="rounded-2xl border border-[var(--paper-line)] bg-[var(--paper)] p-4 text-sm"><div className="mb-2 inline-flex rounded-full border border-[var(--saffron)]/30 bg-[var(--saffron)]/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-[var(--saffron)]">{result.risk_band} risk</div><p className="font-semibold">{result.recommendation}</p><ul className="mt-3 space-y-1">{result.signals.map((signal) => <li key={signal.type}>• {signal.detail}</li>)}</ul></div>}
      </CyberFeatureCard>
    </div>
  );
}
