import { useState } from 'react';
import CyberFeatureCard from './CyberFeatureCard';
import { analyzeSeniorRisk } from '../cyberFeatures/seniorProtectionMode';

export default function SeniorProtectionModeView() {
  const [message, setMessage] = useState('This is your grandson. I had an accident. Send money to this account immediately.');
  const [callerClaim, setCallerClaim] = useState('Grandson in emergency');
  const [asksForOTP, setAsksForOTP] = useState(false);
  const [asksForMoney, setAsksForMoney] = useState(true);
  const [asksForPersonalInfo, setAsksForPersonalInfo] = useState(false);
  const [asksForRemoteAccess, setAsksForRemoteAccess] = useState(false);
  const [result, setResult] = useState(null);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="mb-6">
        <div className="text-xs font-mono uppercase tracking-[0.3em] text-[var(--saffron)]">Senior Protection Mode</div>
        <h2 className="font-display text-3xl font-semibold text-[var(--ink)]">Protect seniors from targeted scams</h2>
        <p className="mt-2 max-w-2xl text-sm text-[var(--ink-text)]/70">Analyze calls and messages targeting seniors with family emergency scams, authority impersonation, and OTP theft.</p>
      </div>
      <CyberFeatureCard eyebrow="Senior Check" title="Senior scam risk analysis" description="Enter the details of the suspicious interaction.">
        <textarea value={message} onChange={(e) => setMessage(e.target.value)} className="min-h-20 w-full rounded-2xl border border-[var(--paper-line)] p-3 text-sm" placeholder="Message or call description" />
        <input value={callerClaim} onChange={(e) => setCallerClaim(e.target.value)} className="w-full rounded-2xl border border-[var(--paper-line)] p-3 text-sm" placeholder="Who does the caller claim to be?" />
        <div className="grid grid-cols-2 gap-2">
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={asksForOTP} onChange={(e) => setAsksForOTP(e.target.checked)} className="accent-[var(--saffron)]" /> Asks for OTP</label>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={asksForMoney} onChange={(e) => setAsksForMoney(e.target.checked)} className="accent-[var(--saffron)]" /> Asks for money</label>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={asksForPersonalInfo} onChange={(e) => setAsksForPersonalInfo(e.target.checked)} className="accent-[var(--saffron)]" /> Asks for personal info</label>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={asksForRemoteAccess} onChange={(e) => setAsksForRemoteAccess(e.target.checked)} className="accent-[var(--saffron)]" /> Asks for remote access</label>
        </div>
        <button onClick={() => setResult(analyzeSeniorRisk({ message, callerClaim, asksForOTP, asksForMoney, asksForPersonalInfo, asksForRemoteAccess }))} className="rounded-full bg-[var(--ink)] px-4 py-2 text-sm font-semibold text-white">Assess risk</button>
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

