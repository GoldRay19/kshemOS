import { useState } from 'react';
import CyberFeatureCard from './CyberFeatureCard';
import { analyzeMarketplaceListing } from '../cyberFeatures/marketplaceFraudEvaluator';

export default function MarketplaceFraudEvaluatorView() {
  const [title, setTitle] = useState('iPhone 15 for just ₹15,000!');
  const [price, setPrice] = useState('₹15,000');
  const [sellerRating, setSellerRating] = useState(2);
  const [hasHistory, setHasHistory] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('UPI advance');
  const [urgency, setUrgency] = useState(true);
  const [message, setMessage] = useState('Only 2 left! Pay advance to block. Must sell today!');
  const [result, setResult] = useState(null);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="mb-6">
        <div className="text-xs font-mono uppercase tracking-[0.3em] text-[var(--saffron)]">Marketplace Fraud Evaluator</div>
        <h2 className="font-display text-3xl font-semibold text-[var(--ink)]">Evaluate online marketplace listings</h2>
        <p className="mt-2 max-w-2xl text-sm text-[var(--ink-text)]/70">Spot fake listings, low-rated sellers, and pressure tactics on marketplaces.</p>
      </div>
      <CyberFeatureCard eyebrow="Market Check" title="Listing fraud analysis" description="Enter the marketplace listing details.">
        <input value={title} onChange={(e) => setTitle(e.target.value)} className="w-full rounded-2xl border border-[var(--paper-line)] p-3 text-sm" placeholder="Listing title" />
        <input value={price} onChange={(e) => setPrice(e.target.value)} className="w-full rounded-2xl border border-[var(--paper-line)] p-3 text-sm" placeholder="Price" />
        <div className="flex items-center gap-3 text-sm"><span>Seller rating:</span><input type="number" min="0" max="5" step="0.1" value={sellerRating} onChange={(e) => setSellerRating(parseFloat(e.target.value))} className="w-20 rounded-xl border border-[var(--paper-line)] p-2 text-sm" /></div>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={hasHistory} onChange={(e) => setHasHistory(e.target.checked)} className="accent-[var(--saffron)]" /> Seller has transaction history</label>
        <input value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)} className="w-full rounded-2xl border border-[var(--paper-line)] p-3 text-sm" placeholder="Payment method requested" />
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={urgency} onChange={(e) => setUrgency(e.target.checked)} className="accent-[var(--saffron)]" /> Listing uses urgency/pressure</label>
        <textarea value={message} onChange={(e) => setMessage(e.target.value)} className="min-h-16 w-full rounded-2xl border border-[var(--paper-line)] p-3 text-sm" placeholder="Listing message" />
        <button onClick={() => setResult(analyzeMarketplaceListing({ title, price, sellerRating, hasHistory, paymentMethod, urgency, message }))} className="rounded-full bg-[var(--ink)] px-4 py-2 text-sm font-semibold text-white">Evaluate listing</button>
        {result && <div className="rounded-2xl border border-[var(--paper-line)] bg-[var(--paper)] p-4 text-sm"><div className="mb-2 inline-flex rounded-full border border-[var(--saffron)]/30 bg-[var(--saffron)]/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-[var(--saffron)]">{result.risk_band} risk</div><p className="font-semibold">{result.recommendation}</p><ul className="mt-3 space-y-1">{result.signals.map((s) => <li key={s.type}>• {s.detail}</li>)}</ul></div>}
      </CyberFeatureCard>
    </div>
  );
}

