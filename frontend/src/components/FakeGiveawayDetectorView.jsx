import { useState } from 'react';
import CyberFeatureCard from './CyberFeatureCard';
import { analyzeGiveaway } from '../cyberFeatures/fakeGiveawayDetector';

export default function FakeGiveawayDetectorView() {
  const [message, setMessage] = useState('You are today\'s lucky winner of an iPhone 15! Pay ₹99 shipping to claim your prize now!');
  const [prize, setPrize] = useState(true);
  const [followRequired, setFollowRequired] = useState(false);
  const [paymentRequired, setPaymentRequired] = useState(true);
  const [result, setResult] = useState(null);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="mb-6">
        <div className="text-xs font-mono uppercase tracking-[0.3em] text-[var(--saffron)]">Fake Giveaway Detector</div>
        <h2 className="font-display text-3xl font-semibold text-[var(--ink)]">Spot fake giveaways and prize scams</h2>
        <p className="mt-2 max-w-2xl text-sm text-[var(--ink-text)]/70">Scammers use fake giveaways to collect payments or engagement. This tool detects red flags.</p>
      </div>
      <CyberFeatureCard eyebrow="Giveaway Check" title="Fake giveaway analysis" description="Toggle the characteristics of the giveaway.">
        <textarea value={message} onChange={(e) => setMessage(e.target.value)} className="min-h-20 w-full rounded-2xl border border-[var(--paper-line)] p-3 text-sm" />
        <div className="grid grid-cols-2 gap-2">
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={prize} onChange={(e) => setPrize(e.target.checked)} className="accent-[var(--saffron)]" /> Prize offered</label>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={followRequired} onChange={(e) => setFollowRequired(e.target.checked)} className="accent-[var(--saffron)]" /> Follow/share required</label>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={paymentRequired} onChange={(e) => setPaymentRequired(e.target.checked)} className="accent-[var(--saffron)]" /> Payment required</label>
        </div>
        <button onClick={() => setResult(analyzeGiveaway({ message, prize, followRequired, paymentRequired }))} className="rounded-full bg-[var(--ink)] px-4 py-2 text-sm font-semibold text-white">Detect fake giveaway</button>
        {result && (
          <div className="rounded-2xl border border-[var(--paper-line)] bg-[var(--paper)] p-4 text-sm">
            <div className="mb-2 inline-flex rounded-full border border-[var(--saffron)]/30 bg-[var(--saffron)]/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-[var(--saffron)]">{result.risk_band} risk</div>
            <p className="font-semibold">{result.recommendation}</p>
            <ul className="mt-3 space-y-1">{result.signals.map((s) => <li key={s.type}>• {s.detail}</li>)}</ul>
          </div>
        )}
      </CyberFeatureCard>
    </div>
  );
}

