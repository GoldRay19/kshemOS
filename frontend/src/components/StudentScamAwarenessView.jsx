import { useState } from 'react';
import CyberFeatureCard from './CyberFeatureCard';
import { analyzeStudentScamRisk } from '../cyberFeatures/studentScamAwareness';

export default function StudentScamAwarenessView() {
  const [message, setMessage] = useState('Earn ₹50,000/month from home! Data entry job. Pay ₹2,000 registration fee to start.'); const [offerType, setOfferType] = useState('Work from home job');
  const [asksForFee, setAsksForFee] = useState(true); const [asksForPersonalInfo, setAsksForPersonalInfo] = useState(false);
  const [asksForOTP, setAsksForOTP] = useState(false); const [urgency, setUrgency] = useState(true);
  const [platform, setPlatform] = useState('WhatsApp'); const [result, setResult] = useState(null);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="mb-6"><div className="text-xs font-mono uppercase tracking-[0.3em] text-[var(--saffron)]">Student Scam Awareness</div><h2 className="font-display text-3xl font-semibold text-[var(--ink)]">Protect students from scams</h2><p className="mt-2 max-w-2xl text-sm text-[var(--ink-text)]/70">Check job offers, scholarships, and internships targeting students for fraud signals.</p></div>
      <CyberFeatureCard eyebrow="Student Check" title="Student scam risk analysis" description="Enter the details of the offer or message.">
        <textarea value={message} onChange={(e) => setMessage(e.target.value)} className="min-h-16 w-full rounded-2xl border border-[var(--paper-line)] p-3 text-sm" placeholder="Message" />
        <input value={offerType} onChange={(e) => setOfferType(e.target.value)} className="w-full rounded-2xl border border-[var(--paper-line)] p-3 text-sm" placeholder="Type of offer" />
        <input value={platform} onChange={(e) => setPlatform(e.target.value)} className="w-full rounded-2xl border border-[var(--paper-line)] p-3 text-sm" placeholder="Platform" />
        <div className="grid grid-cols-2 gap-2">
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={asksForFee} onChange={(e) => setAsksForFee(e.target.checked)} className="accent-[var(--saffron)]" /> Asks for upfront fee</label>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={asksForOTP} onChange={(e) => setAsksForOTP(e.target.checked)} className="accent-[var(--saffron)]" /> Asks for OTP</label>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={asksForPersonalInfo} onChange={(e) => setAsksForPersonalInfo(e.target.checked)} className="accent-[var(--saffron)]" /> Asks for personal docs</label>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={urgency} onChange={(e) => setUrgency(e.target.checked)} className="accent-[var(--saffron)]" /> Uses urgency pressure</label>
        </div>
        <button onClick={() => setResult(analyzeStudentScamRisk({ message, offerType, asksForFee, asksForPersonalInfo, asksForOTP, urgency, platform }))} className="rounded-full bg-[var(--ink)] px-4 py-2 text-sm font-semibold text-white">Check for scams</button>
        {result && <div className="rounded-2xl border border-[var(--paper-line)] bg-[var(--paper)] p-4 text-sm"><div className="mb-2 inline-flex rounded-full border border-[var(--saffron)]/30 bg-[var(--saffron)]/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-[var(--saffron)]">{result.risk_band} risk</div><p className="font-semibold">{result.recommendation}</p><ul className="mt-3 space-y-1">{result.signals.map((s) => <li key={s.type}>• {s.detail}</li>)}</ul></div>}
      </CyberFeatureCard>
    </div>
  );
}

