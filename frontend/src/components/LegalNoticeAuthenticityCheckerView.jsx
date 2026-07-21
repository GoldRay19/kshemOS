import { useState } from 'react';
import CyberFeatureCard from './CyberFeatureCard';
import { analyzeLegalNotice } from '../cyberFeatures/legalNoticeAuthenticityChecker';

export default function LegalNoticeAuthenticityCheckerView() {
  const [senderName, setSenderName] = useState('Adv. Sharma'); const [firmName, setFirmName] = useState('Sharma & Associates');
  const [caseNumber, setCaseNumber] = useState(''); const [courtName, setCourtName] = useState('');
  const [recipientName, setRecipientName] = useState(''); const [hasCourtSeal, setHasCourtSeal] = useState(false);
  const [hasLawyerDetails, setHasLawyerDetails] = useState(false); const [asksForPayment, setAsksForPayment] = useState(true);
  const [asksForPersonalInfo, setAsksForPersonalInfo] = useState(false); const [message, setMessage] = useState('Settle the matter now by paying ₹50,000 or face arrest warrant.');
  const [result, setResult] = useState(null);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="mb-6"><div className="text-xs font-mono uppercase tracking-[0.3em] text-[var(--saffron)]">Legal Notice Authenticity Checker</div><h2 className="font-display text-3xl font-semibold text-[var(--ink)]">Verify legal notices and summons</h2><p className="mt-2 max-w-2xl text-sm text-[var(--ink-text)]/70">Check legal notices for intimidation, missing case numbers, and unofficial payment demands.</p></div>
      <CyberFeatureCard eyebrow="Legal Check" title="Legal notice authenticity analysis" description="Enter the legal notice details.">
        <input value={firmName} onChange={(e) => setFirmName(e.target.value)} className="w-full rounded-2xl border border-[var(--paper-line)] p-3 text-sm" placeholder="Law firm name" />
        <input value={caseNumber} onChange={(e) => setCaseNumber(e.target.value)} className="w-full rounded-2xl border border-[var(--paper-line)] p-3 text-sm" placeholder="Case number (if available)" />
        <input value={courtName} onChange={(e) => setCourtName(e.target.value)} className="w-full rounded-2xl border border-[var(--paper-line)] p-3 text-sm" placeholder="Court name" />
        <textarea value={message} onChange={(e) => setMessage(e.target.value)} className="min-h-16 w-full rounded-2xl border border-[var(--paper-line)] p-3 text-sm" placeholder="Notice text" />
        <div className="grid grid-cols-2 gap-2">
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={hasCourtSeal} onChange={(e) => setHasCourtSeal(e.target.checked)} className="accent-[var(--saffron)]" /> Has official court seal</label>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={hasLawyerDetails} onChange={(e) => setHasLawyerDetails(e.target.checked)} className="accent-[var(--saffron)]" /> Has verifiable lawyer details</label>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={asksForPayment} onChange={(e) => setAsksForPayment(e.target.checked)} className="accent-[var(--saffron)]" /> Demands payment to settle</label>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={asksForPersonalInfo} onChange={(e) => setAsksForPersonalInfo(e.target.checked)} className="accent-[var(--saffron)]" /> Asks for personal/bank details</label>
        </div>
        <button onClick={() => setResult(analyzeLegalNotice({ senderName, firmName, caseNumber, courtName, recipientName, hasCourtSeal, hasLawyerDetails, asksForPayment, asksForPersonalInfo, message }))} className="rounded-full bg-[var(--ink)] px-4 py-2 text-sm font-semibold text-white">Verify notice</button>
        {result && <div className="rounded-2xl border border-[var(--paper-line)] bg-[var(--paper)] p-4 text-sm"><div className="mb-2 inline-flex rounded-full border border-[var(--saffron)]/30 bg-[var(--saffron)]/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-[var(--saffron)]">{result.risk_band} risk</div><p className="font-semibold">{result.recommendation}</p><ul className="mt-3 space-y-1">{result.signals.map((s) => <li key={s.type}>• {s.detail}</li>)}</ul></div>}
      </CyberFeatureCard>
    </div>
  );
}

