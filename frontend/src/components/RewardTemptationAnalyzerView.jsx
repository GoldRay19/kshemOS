import { useState } from 'react';
import CyberFeatureCard from './CyberFeatureCard';
import { analyzeRewardTemptation } from '../cyberFeatures/rewardTemptationAnalyzer';

export default function RewardTemptationAnalyzerView() {
  const [message, setMessage] = useState('Congratulations! You won ₹50,000 in our lucky draw. Click here to claim your cash prize now!');
  const [prize, setPrize] = useState(true);
  const [cashback, setCashback] = useState(false);
  const [bonus, setBonus] = useState(true);
  const [limited, setLimited] = useState(true);
  const [result, setResult] = useState(null);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="mb-6">
        <div className="text-xs font-mono uppercase tracking-[0.3em] text-[var(--saffron)]">Reward Temptation Analyzer</div>
        <h2 className="font-display text-3xl font-semibold text-[var(--ink)]">Spot reward-based scam bait</h2>
        <p className="mt-2 max-w-2xl text-sm text-[var(--ink-text)]/70">Scammers lure victims with prizes, cashback, bonuses, and limited-time offers.</p>
      </div>
      <CyberFeatureCard eyebrow="Reward Check" title="Reward temptation analysis" description="Toggle the reward tactics used.">
        <textarea value={message} onChange={(e) => setMessage(e.target.value)} className="min-h-20 w-full rounded-2xl border border-[var(--paper-line)] p-3 text-sm" />
        <div className="grid grid-cols-2 gap-2">
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={prize} onChange={(e) => setPrize(e.target.checked)} className="accent-[var(--saffron)]" /> Prize offer</label>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={cashback} onChange={(e) => setCashback(e.target.checked)} className="accent-[var(--saffron)]" /> Cashback</label>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={bonus} onChange={(e) => setBonus(e.target.checked)} className="accent-[var(--saffron)]" /> Bonus</label>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={limited} onChange={(e) => setLimited(e.target.checked)} className="accent-[var(--saffron)]" /> Limited offer</label>
        </div>
        <button onClick={() => setResult(analyzeRewardTemptation({ message, prize, cashback, bonus, limited }))} className="rounded-full bg-[var(--ink)] px-4 py-2 text-sm font-semibold text-white">Analyze</button>
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

