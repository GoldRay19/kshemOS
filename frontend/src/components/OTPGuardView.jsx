import { useState } from 'react';
import CyberFeatureCard from './CyberFeatureCard';
import { analyzeOTPRequest } from '../cyberFeatures/otpGuard';

export default function OTPGuardView() {
  const [sender, setSender] = useState('Bank Support');
  const [message, setMessage] = useState('Share your OTP now to confirm the SIM swap and secure your account.');
  const [result, setResult] = useState(null);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="mb-6">
        <div className="text-xs font-mono uppercase tracking-[0.3em] text-[var(--saffron)]">OTP Guard</div>
        <h2 className="font-display text-3xl font-semibold text-[var(--ink)]">OTP scam and SIM-swap detector</h2>
        <p className="mt-2 max-w-2xl text-sm text-[var(--ink-text)]/70">Identify messages that try to harvest OTPs or pressure you into SIM-swap actions.</p>
      </div>
      <CyberFeatureCard eyebrow="OTP request review" title="Assess an OTP request" description="This flags OTP and SIM-swap requests that should never be shared.">
        <input value={sender} onChange={(e) => setSender(e.target.value)} className="w-full rounded-2xl border border-[var(--paper-line)] p-3 text-sm" placeholder="Sender" />
        <textarea value={message} onChange={(e) => setMessage(e.target.value)} className="min-h-28 w-full rounded-2xl border border-[var(--paper-line)] p-3 text-sm" />
        <button onClick={() => setResult(analyzeOTPRequest({ sender, message }))} className="rounded-full bg-[var(--ink)] px-4 py-2 text-sm font-semibold text-white">Analyze OTP request</button>
        {result && <div className="rounded-2xl border border-[var(--paper-line)] bg-[var(--paper)] p-4 text-sm"><div className="mb-2 inline-flex rounded-full border border-[var(--saffron)]/30 bg-[var(--saffron)]/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-[var(--saffron)]">{result.risk_band} risk</div><p className="font-semibold">{result.recommendation}</p><ul className="mt-3 space-y-1">{result.signals.map((signal) => <li key={signal.type}>• {signal.detail}</li>)}</ul></div>}
      </CyberFeatureCard>
    </div>
  );
}
