import { useState } from 'react';
import CyberFeatureCard from './CyberFeatureCard';
import { analyzeFinancialUrgency } from '../cyberFeatures/financialUrgencyDetector';

export default function FinancialUrgencyDetectorView() {
  const [amount, setAmount] = useState('₹25,000');
  const [deadline, setDeadline] = useState('Within 2 hours');
  const [paymentMethod, setPaymentMethod] = useState('UPI / Wallet');
  const [message, setMessage] = useState('Pay immediately or your account will be frozen forever.');
  const [result, setResult] = useState(null);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="mb-6">
        <div className="text-xs font-mono uppercase tracking-[0.3em] text-[var(--saffron)]">Financial Urgency Detector</div>
        <h2 className="font-display text-3xl font-semibold text-[var(--ink)]">Flag high-pressure financial demands</h2>
        <p className="mt-2 max-w-2xl text-sm text-[var(--ink-text)]/70">Scammers create fake deadlines. This tool analyzes the financial pressure in messages.</p>
      </div>
      <CyberFeatureCard eyebrow="Urgency Check" title="Financial pressure analysis" description="Enter the details of the financial request.">
        <input value={amount} onChange={(e) => setAmount(e.target.value)} className="w-full rounded-2xl border border-[var(--paper-line)] p-3 text-sm" placeholder="Amount requested" />
        <input value={deadline} onChange={(e) => setDeadline(e.target.value)} className="w-full rounded-2xl border border-[var(--paper-line)] p-3 text-sm" placeholder="Deadline given" />
        <input value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)} className="w-full rounded-2xl border border-[var(--paper-line)] p-3 text-sm" placeholder="Payment method" />
        <textarea value={message} onChange={(e) => setMessage(e.target.value)} className="min-h-20 w-full rounded-2xl border border-[var(--paper-line)] p-3 text-sm" placeholder="Message" />
        <button onClick={() => setResult(analyzeFinancialUrgency({ amount, deadline, paymentMethod, message }))} className="rounded-full bg-[var(--ink)] px-4 py-2 text-sm font-semibold text-white">Detect urgency</button>
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

