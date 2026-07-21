import { useState } from 'react';
import CyberFeatureCard from './CyberFeatureCard';
import { analyzeLoanOffer } from '../cyberFeatures/loanTrapAlert';

export default function LoanTrapAlertView() {
  const [lender, setLender] = useState('FastCash');
  const [amount, setAmount] = useState('₹20,000');
  const [fee, setFee] = useState('Processing fee ₹500');
  const [message, setMessage] = useState('Instant approval. Pay the fee now to unlock your loan.');
  const [result, setResult] = useState(null);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="mb-6">
        <div className="text-xs font-mono uppercase tracking-[0.3em] text-[var(--saffron)]">LoanTrap Alert</div>
        <h2 className="font-display text-3xl font-semibold text-[var(--ink)]">Illegal loan app scam detector</h2>
        <p className="mt-2 max-w-2xl text-sm text-[var(--ink-text)]/70">Review suspicious loan offers for fake approvals, upfront fees, and money requests before you act.</p>
      </div>
      <CyberFeatureCard eyebrow="Loan offer check" title="Assess a loan message" description="This screens for pressure tactics and processing-fee requests used in scam loan apps.">
        <input value={lender} onChange={(e) => setLender(e.target.value)} className="w-full rounded-2xl border border-[var(--paper-line)] p-3 text-sm" placeholder="Lender" />
        <input value={amount} onChange={(e) => setAmount(e.target.value)} className="w-full rounded-2xl border border-[var(--paper-line)] p-3 text-sm" placeholder="Loan amount" />
        <input value={fee} onChange={(e) => setFee(e.target.value)} className="w-full rounded-2xl border border-[var(--paper-line)] p-3 text-sm" placeholder="Fee" />
        <textarea value={message} onChange={(e) => setMessage(e.target.value)} className="min-h-28 w-full rounded-2xl border border-[var(--paper-line)] p-3 text-sm" />
        <button onClick={() => setResult(analyzeLoanOffer({ lender, amount, fee, message }))} className="rounded-full bg-[var(--ink)] px-4 py-2 text-sm font-semibold text-white">Analyze loan offer</button>
        {result && <div className="rounded-2xl border border-[var(--paper-line)] bg-[var(--paper)] p-4 text-sm"><div className="mb-2 inline-flex rounded-full border border-[var(--saffron)]/30 bg-[var(--saffron)]/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-[var(--saffron)]">{result.risk_band} risk</div><p className="font-semibold">{result.recommendation}</p><ul className="mt-3 space-y-1">{result.signals.map((signal) => <li key={signal.type}>• {signal.detail}</li>)}</ul></div>}
      </CyberFeatureCard>
    </div>
  );
}
