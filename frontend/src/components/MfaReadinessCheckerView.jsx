import { useState } from 'react';
import CyberFeatureCard from './CyberFeatureCard';
import { analyzeMFAReadiness } from '../cyberFeatures/mfaReadinessChecker';

export default function MfaReadinessCheckerView() {
  const [hasMFA, setHasMFA] = useState(false); const [mfaType, setMfaType] = useState('SMS');
  const [usesAuthenticatorApp, setUsesAuthenticatorApp] = useState(false); const [usesSMS, setUsesSMS] = useState(true);
  const [usesBiometrics, setUsesBiometrics] = useState(false); const [hasBackupCodes, setHasBackupCodes] = useState(false);
  const [hasMultipleMFA, setHasMultipleMFA] = useState(false); const [accountsWithoutMFA, setAccountsWithoutMFA] = useState(5);
  const [result, setResult] = useState(null);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="mb-6"><div className="text-xs font-mono uppercase tracking-[0.3em] text-[var(--saffron)]">MFA Readiness Checker</div><h2 className="font-display text-3xl font-semibold text-[var(--ink)]">Check if you're MFA-ready</h2><p className="mt-2 max-w-2xl text-sm text-[var(--ink-text)]/70">Evaluate your multi-factor authentication setup across all accounts.</p></div>
      <CyberFeatureCard eyebrow="MFA Check" title="Multi-factor authentication readiness" description="Check your MFA configuration.">
        <div className="grid grid-cols-2 gap-2">
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={hasMFA} onChange={(e) => setHasMFA(e.target.checked)} className="accent-[var(--saffron)]" /> MFA is enabled</label>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={usesAuthenticatorApp} onChange={(e) => setUsesAuthenticatorApp(e.target.checked)} className="accent-[var(--saffron)]" /> Uses authenticator app</label>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={usesSMS} onChange={(e) => setUsesSMS(e.target.checked)} className="accent-[var(--saffron)]" /> Uses SMS for MFA</label>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={usesBiometrics} onChange={(e) => setUsesBiometrics(e.target.checked)} className="accent-[var(--saffron)]" /> Uses biometrics</label>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={hasBackupCodes} onChange={(e) => setHasBackupCodes(e.target.checked)} className="accent-[var(--saffron)]" /> Has backup codes stored</label>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={hasMultipleMFA} onChange={(e) => setHasMultipleMFA(e.target.checked)} className="accent-[var(--saffron)]" /> Multiple MFA methods</label>
        </div>
        <div className="flex items-center gap-3 text-sm"><span>Accounts without MFA:</span><input type="number" min="0" value={accountsWithoutMFA} onChange={(e) => setAccountsWithoutMFA(parseInt(e.target.value) || 0)} className="w-20 rounded-xl border border-[var(--paper-line)] p-2 text-sm" /></div>
        <button onClick={() => setResult(analyzeMFAReadiness({ hasMFA, mfaType, usesAuthenticatorApp, usesSMS, usesBiometrics, hasBackupCodes, hasMultipleMFA, accountsWithoutMFA }))} className="rounded-full bg-[var(--ink)] px-4 py-2 text-sm font-semibold text-white">Check readiness</button>
        {result && <div className="rounded-2xl border border-[var(--paper-line)] bg-[var(--paper)] p-4 text-sm"><div className="mb-2 inline-flex rounded-full border border-[var(--saffron)]/30 bg-[var(--saffron)]/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-[var(--saffron)]">{result.risk_band} risk</div><p className="font-semibold">{result.recommendation}</p><ul className="mt-3 space-y-1">{result.signals.map((s) => <li key={s.type}>• {s.detail}</li>)}</ul></div>}
      </CyberFeatureCard>
    </div>
  );
}

