import { useState } from 'react';
import CyberFeatureCard from './CyberFeatureCard';
import { assessScamResilience } from '../cyberFeatures/scamResilienceAssessment';

export default function ScamResilienceAssessmentView() {
  const [recognizesPhishing, setRecognizesPhishing] = useState(true); const [neverSharesOTP, setNeverSharesOTP] = useState(true);
  const [verifiesCaller, setVerifiesCaller] = useState(false); const [usesMFA, setUsesMFA] = useState(false);
  const [hasStrongPasswords, setHasStrongPasswords] = useState(false); const [reportsSuspiciousActivity, setReportsSuspiciousActivity] = useState(false);
  const [staysInformed, setStaysInformed] = useState(false); const [pausesBeforeActing, setPausesBeforeActing] = useState(false);
  const [hasBeenScammedBefore, setHasBeenScammedBefore] = useState(false); const [result, setResult] = useState(null);

  const traits = [
    {label:'Recognizes phishing attempts', value:recognizesPhishing, setter:setRecognizesPhishing},
    {label:'Never shares OTP under pressure', value:neverSharesOTP, setter:setNeverSharesOTP},
    {label:'Verifies caller through official channel', value:verifiesCaller, setter:setVerifiesCaller},
    {label:'Uses MFA on accounts', value:usesMFA, setter:setUsesMFA},
    {label:'Has strong unique passwords', value:hasStrongPasswords, setter:setHasStrongPasswords},
    {label:'Reports suspicious activity', value:reportsSuspiciousActivity, setter:setReportsSuspiciousActivity},
    {label:'Stays informed about scams', value:staysInformed, setter:setStaysInformed},
    {label:'Pauses before acting on requests', value:pausesBeforeActing, setter:setPausesBeforeActing},
  ];

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="mb-6"><div className="text-xs font-mono uppercase tracking-[0.3em] text-[var(--saffron)]">Scam Resilience Assessment</div><h2 className="font-display text-3xl font-semibold text-[var(--ink)]">Assess your scam resilience</h2><p className="mt-2 max-w-2xl text-sm text-[var(--ink-text)]/70">Evaluate how resilient you are to common scam tactics and social engineering.</p></div>
      <CyberFeatureCard eyebrow="Resilience Check" title="Your scam resilience score" description="Mark the traits that apply to you.">
        <div className="space-y-1">{traits.map((t) => (<label key={t.label} className="flex items-center gap-2 text-sm"><input type="checkbox" checked={t.value} onChange={(e) => t.setter(e.target.checked)} className="accent-[var(--saffron)]" />{t.label}</label>))}</div>
        <label className="flex items-center gap-2 text-sm mt-2"><input type="checkbox" checked={hasBeenScammedBefore} onChange={(e) => setHasBeenScammedBefore(e.target.checked)} className="accent-[var(--saffron)]" /> Have been scammed before</label>
        <button onClick={() => setResult(assessScamResilience({ recognizesPhishing, neverSharesOTP, verifiesCaller, usesMFA, hasStrongPasswords, reportsSuspiciousActivity, staysInformed, pausesBeforeActing, hasBeenScammedBefore }))} className="rounded-full bg-[var(--ink)] px-4 py-2 text-sm font-semibold text-white">Assess resilience</button>
        {result && <div className="rounded-2xl border border-[var(--paper-line)] bg-[var(--paper)] p-4 text-sm"><div className="mb-2 inline-flex rounded-full border border-[var(--saffron)]/30 bg-[var(--saffron)]/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-[var(--saffron)]">{result.risk_band} risk</div><p className="font-semibold">{result.recommendation}</p><ul className="mt-3 space-y-1">{result.signals.map((s) => <li key={s.type}>• {s.detail}</li>)}</ul></div>}
      </CyberFeatureCard>
    </div>
  );
}

