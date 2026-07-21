import { useState } from 'react';
import CyberFeatureCard from './CyberFeatureCard';
import { analyzeCharityClaim } from '../cyberFeatures/charityFraudEvaluator';

export default function CharityFraudEvaluatorView() {
  const [charityName, setCharityName] = useState('Help The Children Foundation');
  const [cause, setCause] = useState('Emergency flood relief'); const [amount, setAmount] = useState('₹5,000');
  const [paymentMethod, setPaymentMethod] = useState('UPI to personal account'); const [registrationId, setRegistrationId] = useState('');
  const [urgency, setUrgency] = useState(true); const [pressureForImmediate, setPressureForImmediate] = useState(true);
  const [message, setMessage] = useState('Donate now! Every rupee doubled today. Send to this UPI ID immediately.'); const [result, setResult] = useState(null);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="mb-6"><div className="text-xs font-mono uppercase tracking-[0.3em] text-[var(--saffron)]">Charity Fraud Evaluator</div><h2 className="font-display text-3xl font-semibold text-[var(--ink)]">Evaluate charity claims for legitimacy</h2><p className="mt-2 max-w-2xl text-sm text-[var(--ink-text)]/70">Check charity registration, payment methods, and emotional pressure tactics.</p></div>
      <CyberFeatureCard eyebrow="Charity Check" title="Charity/ngo fraud analysis" description="Enter the charity appeal details.">
        <input value={charityName} onChange={(e) => setCharityName(e.target.value)} className="w-full rounded-2xl border border-[var(--paper-line)] p-3 text-sm" placeholder="Charity name" />
        <input value={cause} onChange={(e) => setCause(e.target.value)} className="w-full rounded-2xl border border-[var(--paper-line)] p-3 text-sm" placeholder="Cause" />
        <input value={amount} onChange={(e) => setAmount(e.target.value)} className="w-full rounded-2xl border border-[var(--paper-line)] p-3 text-sm" placeholder="Amount requested" />
        <input value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)} className="w-full rounded-2xl border border-[var(--paper-line)] p-3 text-sm" placeholder="Payment method" />
        <input value={registrationId} onChange={(e) => setRegistrationId(e.target.value)} className="w-full rounded-2xl border border-[var(--paper-line)] p-3 text-sm" placeholder="Registration ID (if provided)" />
        <textarea value={message} onChange={(e) => setMessage(e.target.value)} className="min-h-16 w-full rounded-2xl border border-[var(--paper-line)] p-3 text-sm" placeholder="Appeal message" />
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={urgency} onChange={(e) => setUrgency(e.target.checked)} className="accent-[var(--saffron)]" /> Uses urgency</label>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={pressureForImmediate} onChange={(e) => setPressureForImmediate(e.target.checked)} className="accent-[var(--saffron)]" /> Pressures for immediate donation</label>
        <button onClick={() => setResult(analyzeCharityClaim({ charityName, cause, amount, paymentMethod, registrationId, urgency, pressureForImmediate, message }))} className="rounded-full bg-[var(--ink)] px-4 py-2 text-sm font-semibold text-white">Evaluate charity</button>
        {result && <div className="rounded-2xl border border-[var(--paper-line)] bg-[var(--paper)] p-4 text-sm"><div className="mb-2 inline-flex rounded-full border border-[var(--saffron)]/30 bg-[var(--saffron)]/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-[var(--saffron)]">{result.risk_band} risk</div><p className="font-semibold">{result.recommendation}</p><ul className="mt-3 space-y-1">{result.signals.map((s) => <li key={s.type}>• {s.detail}</li>)}</ul></div>}
      </CyberFeatureCard>
    </div>
  );
}

