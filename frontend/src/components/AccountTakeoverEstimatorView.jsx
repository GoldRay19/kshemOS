import { useState } from 'react';
import CyberFeatureCard from './CyberFeatureCard';
import { analyzeAccountTakeoverRisk } from '../cyberFeatures/accountTakeoverEstimator';

export default function AccountTakeoverEstimatorView() {
  const [hasMFA, setHasMFA] = useState(false); const [hasStrongPassword, setHasStrongPassword] = useState(false);
  const [hasRecentBreach, setHasRecentBreach] = useState(true); const [hasSuspiciousLogin, setHasSuspiciousLogin] = useState(false);
  const [sharedPasswordElsewhere, setSharedPasswordElsewhere] = useState(true); const [accountAge, setAccountAge] = useState(24);
  const [hasRecoveryEmail, setHasRecoveryEmail] = useState(false); const [message, setMessage] = useState('');
  const [result, setResult] = useState(null);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="mb-6"><div className="text-xs font-mono uppercase tracking-[0.3em] text-[var(--saffron)]">Account Takeover Estimator</div><h2 className="font-display text-3xl font-semibold text-[var(--ink)]">Estimate account takeover risk</h2><p className="mt-2 max-w-2xl text-sm text-[var(--ink-text)]/70">Check how vulnerable your account is to takeover based on MFA, password strength, and breach history.</p></div>
      <CyberFeatureCard eyebrow="ATO Check" title="Account takeover risk assessment" description="Check the security factors for your account.">
        <div className="grid grid-cols-2 gap-2">
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={hasMFA} onChange={(e) => setHasMFA(e.target.checked)} className="accent-[var(--saffron)]" /> MFA enabled</label>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={hasStrongPassword} onChange={(e) => setHasStrongPassword(e.target.checked)} className="accent-[var(--saffron)]" /> Strong unique password</label>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={hasRecentBreach} onChange={(e) => setHasRecentBreach(e.target.checked)} className="accent-[var(--saffron)]" /> In recent data breach</label>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={hasSuspiciousLogin} onChange={(e) => setHasSuspiciousLogin(e.target.checked)} className="accent-[var(--saffron)]" /> Suspicious login detected</label>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={sharedPasswordElsewhere} onChange={(e) => setSharedPasswordElsewhere(e.target.checked)} className="accent-[var(--saffron)]" /> Password reused elsewhere</label>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={hasRecoveryEmail} onChange={(e) => setHasRecoveryEmail(e.target.checked)} className="accent-[var(--saffron)]" /> Has recovery email/phone</label>
        </div>
        <button onClick={() => setResult(analyzeAccountTakeoverRisk({ hasMFA, hasStrongPassword, hasRecentBreach, hasSuspiciousLogin, sharedPasswordElsewhere, accountAge, hasRecoveryEmail, message }))} className="rounded-full bg-[var(--ink)] px-4 py-2 text-sm font-semibold text-white">Estimate risk</button>
        {result && <div className="rounded-2xl border border-[var(--paper-line)] bg-[var(--paper)] p-4 text-sm"><div className="mb-2 inline-flex rounded-full border border-[var(--saffron)]/30 bg-[var(--saffron)]/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-[var(--saffron)]">{result.risk_band} risk</div><p className="font-semibold">{result.recommendation}</p><ul className="mt-3 space-y-1">{result.signals.map((s) => <li key={s.type}>• {s.detail}</li>)}</ul></div>}
      </CyberFeatureCard>
    </div>
  );
}

