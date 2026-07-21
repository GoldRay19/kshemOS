import { useState } from 'react';
import CyberFeatureCard from './CyberFeatureCard';
import { analyzeGovernmentNotice } from '../cyberFeatures/fakeGovernmentNoticeVerifier';

export default function FakeGovernmentNoticeVerifierView() {
  const [department, setDepartment] = useState('Income Tax Department'); const [noticeId, setNoticeId] = useState('IT-2024-789');
  const [recipientName, setRecipientName] = useState(''); const [amount, setAmount] = useState('₹45,000');
  const [dueDate, setDueDate] = useState('Today'); const [hasSeal, setHasSeal] = useState(false);
  const [hasSignature, setHasSignature] = useState(false); const [asksForPayment, setAsksForPayment] = useState(true);
  const [asksForOTP, setAsksForOTP] = useState(false); const [message, setMessage] = useState('Your tax return is flagged. Pay immediately to avoid legal action. Use this UPI ID.');
  const [result, setResult] = useState(null);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="mb-6"><div className="text-xs font-mono uppercase tracking-[0.3em] text-[var(--saffron)]">Fake Government Notice Verifier</div><h2 className="font-display text-3xl font-semibold text-[var(--ink)]">Spot fake government notices</h2><p className="mt-2 max-w-2xl text-sm text-[var(--ink-text)]/70">Verify notices from tax, customs, or regulatory bodies before acting.</p></div>
      <CyberFeatureCard eyebrow="Notice Check" title="Government notice authenticity" description="Enter the notice details.">
        <input value={department} onChange={(e) => setDepartment(e.target.value)} className="w-full rounded-2xl border border-[var(--paper-line)] p-3 text-sm" placeholder="Department" />
        <input value={noticeId} onChange={(e) => setNoticeId(e.target.value)} className="w-full rounded-2xl border border-[var(--paper-line)] p-3 text-sm" placeholder="Notice ID" />
        <input value={amount} onChange={(e) => setAmount(e.target.value)} className="w-full rounded-2xl border border-[var(--paper-line)] p-3 text-sm" placeholder="Amount demanded" />
        <textarea value={message} onChange={(e) => setMessage(e.target.value)} className="min-h-16 w-full rounded-2xl border border-[var(--paper-line)] p-3 text-sm" placeholder="Notice text" />
        <div className="grid grid-cols-2 gap-2">
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={hasSeal} onChange={(e) => setHasSeal(e.target.checked)} className="accent-[var(--saffron)]" /> Has official seal</label>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={hasSignature} onChange={(e) => setHasSignature(e.target.checked)} className="accent-[var(--saffron)]" /> Has authorized signature</label>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={asksForPayment} onChange={(e) => setAsksForPayment(e.target.checked)} className="accent-[var(--saffron)]" /> Asks for immediate payment</label>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={asksForOTP} onChange={(e) => setAsksForOTP(e.target.checked)} className="accent-[var(--saffron)]" /> Asks for OTP/bank details</label>
        </div>
        <button onClick={() => setResult(analyzeGovernmentNotice({ department, noticeId, recipientName, amount, dueDate, hasSeal, hasSignature, asksForPayment, asksForOTP, message }))} className="rounded-full bg-[var(--ink)] px-4 py-2 text-sm font-semibold text-white">Verify notice</button>
        {result && <div className="rounded-2xl border border-[var(--paper-line)] bg-[var(--paper)] p-4 text-sm"><div className="mb-2 inline-flex rounded-full border border-[var(--saffron)]/30 bg-[var(--saffron)]/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-[var(--saffron)]">{result.risk_band} risk</div><p className="font-semibold">{result.recommendation}</p><ul className="mt-3 space-y-1">{result.signals.map((s) => <li key={s.type}>• {s.detail}</li>)}</ul></div>}
      </CyberFeatureCard>
    </div>
  );
}

