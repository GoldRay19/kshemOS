import { useState } from 'react';
import CyberFeatureCard from './CyberFeatureCard';
import { calculateDigitalTrustScore } from '../cyberFeatures/digitalTrustScore';

export default function DigitalTrustScoreView() {
  const [hasSecurePassword, setHasSecurePassword] = useState(true); const [usesMFA, setUsesMFA] = useState(true);
  const [hasRecentBreach, setHasRecentBreach] = useState(true); const [hasSuspiciousActivity, setHasSuspiciousActivity] = useState(false);
  const [profileVerified, setProfileVerified] = useState(false); const [hasPositiveReviews, setHasPositiveReviews] = useState(false);
  const [accountAgeInMonths, setAccountAgeInMonths] = useState(3); const [hasCompletedProfile, setHasCompletedProfile] = useState(false);
  const [reportedByOthers, setReportedByOthers] = useState(false); const [result, setResult] = useState(null);

  const scoreColor = result?.trust_score >= 70 ? 'var(--safe)' : result?.trust_score >= 40 ? 'var(--caution)' : 'var(--alert)';

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="mb-6"><div className="text-xs font-mono uppercase tracking-[0.3em] text-[var(--saffron)]">Digital Trust Score</div><h2 className="font-display text-3xl font-semibold text-[var(--ink)]">Calculate your digital trust score</h2><p className="mt-2 max-w-2xl text-sm text-[var(--ink-text)]/70">Evaluate the trustworthiness of an online account or profile based on security and behavioral signals.</p></div>
      <CyberFeatureCard eyebrow="Trust Check" title="Digital trust score calculator" description="Toggle the account signals to calculate the trust score.">
        <div className="grid grid-cols-2 gap-2">
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={hasSecurePassword} onChange={(e) => setHasSecurePassword(e.target.checked)} className="accent-[var(--saffron)]" /> Secure password</label>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={usesMFA} onChange={(e) => setUsesMFA(e.target.checked)} className="accent-[var(--saffron)]" /> MFA enabled</label>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={hasRecentBreach} onChange={(e) => setHasRecentBreach(e.target.checked)} className="accent-[var(--saffron)]" /> In data breach</label>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={hasSuspiciousActivity} onChange={(e) => setHasSuspiciousActivity(e.target.checked)} className="accent-[var(--saffron)]" /> Suspicious activity</label>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={profileVerified} onChange={(e) => setProfileVerified(e.target.checked)} className="accent-[var(--saffron)]" /> Profile verified</label>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={hasPositiveReviews} onChange={(e) => setHasPositiveReviews(e.target.checked)} className="accent-[var(--saffron)]" /> Positive reviews</label>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={hasCompletedProfile} onChange={(e) => setHasCompletedProfile(e.target.checked)} className="accent-[var(--saffron)]" /> Completed profile</label>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={reportedByOthers} onChange={(e) => setReportedByOthers(e.target.checked)} className="accent-[var(--saffron)]" /> Reported by others</label>
        </div>
        <div className="flex items-center gap-3 text-sm"><span>Account age (months):</span><input type="number" min="0" value={accountAgeInMonths} onChange={(e) => setAccountAgeInMonths(parseInt(e.target.value) || 0)} className="w-20 rounded-xl border border-[var(--paper-line)] p-2 text-sm" /></div>
        <button onClick={() => setResult(calculateDigitalTrustScore({ hasSecurePassword, usesMFA, hasRecentBreach, hasSuspiciousActivity, profileVerified, hasPositiveReviews, accountAgeInMonths, hasCompletedProfile, reportedByOthers }))} className="rounded-full bg-[var(--ink)] px-4 py-2 text-sm font-semibold text-white">Calculate score</button>
        {result && (
          <div className="rounded-2xl border border-[var(--paper-line)] bg-[var(--paper)] p-4 text-sm">
            <div className="mb-2 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em]" style={{ borderColor: scoreColor, color: scoreColor, backgroundColor: `${scoreColor}15` }}>{result.trust_band} trust · {result.trust_score}/100</div>
            <p className="font-semibold">{result.recommendation}</p>
            <ul className="mt-3 space-y-1">{result.signals.map((s) => <li key={s.type} className={s.severity === 'negative' ? 'text-[var(--alert)]' : 'text-[var(--safe)]'}>• {s.detail}</li>)}</ul>
          </div>
        )}
      </CyberFeatureCard>
    </div>
  );
}

