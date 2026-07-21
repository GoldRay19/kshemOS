import { useState } from 'react';
import CyberFeatureCard from './CyberFeatureCard';
import { analyzeRentalListing } from '../cyberFeatures/rentalScamChecker';

export default function RentalScamCheckerView() {
  const [title, setTitle] = useState('Luxury 2BHK at ₹8,000 — Below Market!');
  const [price, setPrice] = useState('₹8,000'); const [deposit, setDeposit] = useState('₹50,000');
  const [location, setLocation] = useState('Mumbai'); const [landlordName, setLandlordName] = useState('Rajesh (overseas)');
  const [hasPhotos, setHasPhotos] = useState(false); const [asksForAdvance, setAsksForAdvance] = useState(true);
  const [urgency, setUrgency] = useState(true); const [message, setMessage] = useState('I am abroad. Pay the deposit now to block the flat. Many people are interested.');
  const [result, setResult] = useState(null);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="mb-6"><div className="text-xs font-mono uppercase tracking-[0.3em] text-[var(--saffron)]">Rental Scam Checker</div><h2 className="font-display text-3xl font-semibold text-[var(--ink)]">Check rental listings for scam red flags</h2><p className="mt-2 max-w-2xl text-sm text-[var(--ink-text)]/70">Spot rental scams that ask for advance payments, claim the landlord is abroad, or lack photos.</p></div>
      <CyberFeatureCard eyebrow="Rental Check" title="Rental listing fraud analysis" description="Enter the rental listing details.">
        <input value={title} onChange={(e) => setTitle(e.target.value)} className="w-full rounded-2xl border border-[var(--paper-line)] p-3 text-sm" placeholder="Listing title" />
        <input value={price} onChange={(e) => setPrice(e.target.value)} className="w-full rounded-2xl border border-[var(--paper-line)] p-3 text-sm" placeholder="Price" />
        <input value={deposit} onChange={(e) => setDeposit(e.target.value)} className="w-full rounded-2xl border border-[var(--paper-line)] p-3 text-sm" placeholder="Deposit amount" />
        <input value={location} onChange={(e) => setLocation(e.target.value)} className="w-full rounded-2xl border border-[var(--paper-line)] p-3 text-sm" placeholder="Location" />
        <textarea value={message} onChange={(e) => setMessage(e.target.value)} className="min-h-16 w-full rounded-2xl border border-[var(--paper-line)] p-3 text-sm" placeholder="Listing message" />
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={hasPhotos} onChange={(e) => setHasPhotos(e.target.checked)} className="accent-[var(--saffron)]" /> Has photos / virtual tour</label>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={asksForAdvance} onChange={(e) => setAsksForAdvance(e.target.checked)} className="accent-[var(--saffron)]" /> Asks for advance before viewing</label>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={urgency} onChange={(e) => setUrgency(e.target.checked)} className="accent-[var(--saffron)]" /> Uses urgency / limited availability</label>
        <button onClick={() => setResult(analyzeRentalListing({ title, price, deposit, location, landlordName, hasPhotos, asksForAdvance, urgency, message }))} className="rounded-full bg-[var(--ink)] px-4 py-2 text-sm font-semibold text-white">Check listing</button>
        {result && <div className="rounded-2xl border border-[var(--paper-line)] bg-[var(--paper)] p-4 text-sm"><div className="mb-2 inline-flex rounded-full border border-[var(--saffron)]/30 bg-[var(--saffron)]/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-[var(--saffron)]">{result.risk_band} risk</div><p className="font-semibold">{result.recommendation}</p><ul className="mt-3 space-y-1">{result.signals.map((s) => <li key={s.type}>• {s.detail}</li>)}</ul></div>}
      </CyberFeatureCard>
    </div>
  );
}

