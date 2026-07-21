import { useState } from 'react';
import CyberFeatureCard from './CyberFeatureCard';
import { analyzePaymentReceipt } from '../cyberFeatures/paymentReceiptAuthenticity';

export default function PaymentReceiptAuthenticityView() {
  const [merchantName, setMerchantName] = useState('QuickPay Services');
  const [amount, setAmount] = useState('₹12,500');
  const [transactionId, setTransactionId] = useState('');
  const [date, setDate] = useState('2024-01-15');
  const [paymentMethod, setPaymentMethod] = useState('UPI Personal');
  const [hasQRCode, setHasQRCode] = useState(true);
  const [hasBankDetails, setHasBankDetails] = useState(false);
  const [message, setMessage] = useState('Refund of ₹2,500 extra. Claim now by sharing your UPI ID.');
  const [result, setResult] = useState(null);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="mb-6"><div className="text-xs font-mono uppercase tracking-[0.3em] text-[var(--saffron)]">Payment Receipt Authenticity Analyzer</div><h2 className="font-display text-3xl font-semibold text-[var(--ink)]">Check if a payment receipt is real</h2><p className="mt-2 max-w-2xl text-sm text-[var(--ink-text)]/70">Analyze payment receipts for missing transaction IDs, refund bait, and unofficial payment methods.</p></div>
      <CyberFeatureCard eyebrow="Receipt Check" title="Payment receipt authenticity analysis" description="Enter the receipt details.">
        <input value={merchantName} onChange={(e) => setMerchantName(e.target.value)} className="w-full rounded-2xl border border-[var(--paper-line)] p-3 text-sm" placeholder="Merchant name" />
        <input value={amount} onChange={(e) => setAmount(e.target.value)} className="w-full rounded-2xl border border-[var(--paper-line)] p-3 text-sm" placeholder="Amount" />
        <input value={transactionId} onChange={(e) => setTransactionId(e.target.value)} className="w-full rounded-2xl border border-[var(--paper-line)] p-3 text-sm" placeholder="Transaction ID" />
        <input value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)} className="w-full rounded-2xl border border-[var(--paper-line)] p-3 text-sm" placeholder="Payment method" />
        <textarea value={message} onChange={(e) => setMessage(e.target.value)} className="min-h-16 w-full rounded-2xl border border-[var(--paper-line)] p-3 text-sm" placeholder="Receipt message" />
        <div className="grid grid-cols-2 gap-2">
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={hasQRCode} onChange={(e) => setHasQRCode(e.target.checked)} className="accent-[var(--saffron)]" /> Has QR code</label>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={hasBankDetails} onChange={(e) => setHasBankDetails(e.target.checked)} className="accent-[var(--saffron)]" /> Has bank details</label>
        </div>
        <button onClick={() => setResult(analyzePaymentReceipt({ merchantName, amount, transactionId, date, paymentMethod, hasQRCode, hasBankDetails, message }))} className="rounded-full bg-[var(--ink)] px-4 py-2 text-sm font-semibold text-white">Analyze receipt</button>
        {result && <div className="rounded-2xl border border-[var(--paper-line)] bg-[var(--paper)] p-4 text-sm"><div className="mb-2 inline-flex rounded-full border border-[var(--saffron)]/30 bg-[var(--saffron)]/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-[var(--saffron)]">{result.risk_band} risk</div><p className="font-semibold">{result.recommendation}</p><ul className="mt-3 space-y-1">{result.signals.map((s) => <li key={s.type}>• {s.detail}</li>)}</ul></div>}
      </CyberFeatureCard>
    </div>
  );
}

