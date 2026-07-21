import { useState } from 'react';
import CyberFeatureCard from './CyberFeatureCard';
import { analyzeSubscriptionFraud } from '../cyberFeatures/subscriptionFraudChecker';

export default function SubscriptionFraudCheckerView() {
  const [plan, setPlan] = useState('Premium VIP Membership');
  const [amount, setAmount] = useState('₹9,999/year');
  const [autoRenew, setAutoRenew] = useState(true);
  const [freeTrial, setFreeTrial] = useState(true);
  const [urgency, setUrgency] = useState(true);
  const [result, setResult] = useState(null);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="mb-6">
        <div className="text-xs font-mono uppercase tracking-[0.3em] text-[var(--saffron)]">Subscription Fraud Checker</div>
        <h2 className="font-display text-3xl font-semibold text-[var(--ink)]">Check subscription plans for fraud signals</h2>
        <p className="mt-2 max-w-2xl text-sm text-[var(--ink-text)]/70">Scam subscriptions use auto-renewal tricks, free trial traps, and urgency to push sign-ups.</p>
      </div>
      <CyberFeatureCard eyebrow="Sub Check" title="Subscription fraud analysis" description="Enter the subscription plan details.">
        <input value={plan} onChange={(e) => setPlan(e.target.value)} className="w-full rounded-2xl border border-[var(--paper-line)] p-3 text-sm" placeholder="Plan name" />
        <input value={amount} onChange={(e) => setAmount(e.target.value)} className="w-full rounded-2xl border border-[var(--paper-line)] p-3 text-sm" placeholder="Amount" />
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={autoRenew} onChange={(e) => setAutoRenew(e.target.checked)} className="accent-[var(--saffron)]" /> Auto-renew without clear consent</label>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={freeTrial} onChange={(e) => setFreeTrial(e.target.checked)} className="accent-[var(--saffron)]" /> Free trial offered</label>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={urgency} onChange={(e) => setUrgency(e.target.checked)} className="accent-[var(--saffron)]" /> Urgency used to push sign-up</label>
        <button onClick={() => setResult(analyzeSubscriptionFraud({ plan, amount, autoRenew, freeTrial, urgency }))} className="rounded-full bg-[var(--ink)] px-4 py-2 text-sm font-semibold text-white">Check subscription</button>
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

