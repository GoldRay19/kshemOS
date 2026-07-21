import { useState } from 'react';
import CyberFeatureCard from './CyberFeatureCard';
import { analyzeInvoiceFraud } from '../cyberFeatures/invoiceFraudDetector';

export default function InvoiceFraudDetectorView() {
  const [vendor, setVendor] = useState('QuickTech Solutions');
  const [amount, setAmount] = useState('₹12,500');
  const [dueDate, setDueDate] = useState('Today');
  const [message, setMessage] = useState('Pay immediately via UPI to avoid late fee and legal action.');
  const [result, setResult] = useState(null);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="mb-6">
        <div className="text-xs font-mono uppercase tracking-[0.3em] text-[var(--saffron)]">Invoice Fraud Detector</div>
        <h2 className="font-display text-3xl font-semibold text-[var(--ink)]">Spot fake invoices and payment traps</h2>
        <p className="mt-2 max-w-2xl text-sm text-[var(--ink-text)]/70">Check invoice details for urgency, non-standard payment methods, and missing amounts.</p>
      </div>
      <CyberFeatureCard eyebrow="Invoice Check" title="Analyze an invoice for fraud" description="Fill in the invoice details to detect scam patterns.">
        <input value={vendor} onChange={(e) => setVendor(e.target.value)} className="w-full rounded-2xl border border-[var(--paper-line)] p-3 text-sm" placeholder="Vendor name" />
        <input value={amount} onChange={(e) => setAmount(e.target.value)} className="w-full rounded-2xl border border-[var(--paper-line)] p-3 text-sm" placeholder="Amount" />
        <input value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="w-full rounded-2xl border border-[var(--paper-line)] p-3 text-sm" placeholder="Due date" />
        <textarea value={message} onChange={(e) => setMessage(e.target.value)} className="min-h-20 w-full rounded-2xl border border-[var(--paper-line)] p-3 text-sm" placeholder="Invoice message" />
        <button onClick={() => setResult(analyzeInvoiceFraud({ vendor, amount, dueDate, message }))} className="rounded-full bg-[var(--ink)] px-4 py-2 text-sm font-semibold text-white">Check invoice</button>
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

