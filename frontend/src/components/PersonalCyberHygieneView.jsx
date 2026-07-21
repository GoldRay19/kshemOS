import { useState } from 'react';
import CyberFeatureCard from './CyberFeatureCard';
import { analyzeCyberHygiene } from '../cyberFeatures/personalCyberHygiene';

export default function PersonalCyberHygieneView() {
  const [usesPasswordManager, setUsesPasswordManager] = useState(false); const [changesPasswordsRegularly, setChangesPasswordsRegularly] = useState(false);
  const [usesMFAOnAllAccounts, setUsesMFAOnAllAccounts] = useState(false); const [avoidsPublicWiFi, setAvoidsPublicWiFi] = useState(false);
  const [updatesSoftware, setUpdatesSoftware] = useState(false); const [reviewsPermissions, setReviewsPermissions] = useState(false);
  const [logsOutOfSessions, setLogsOutOfSessions] = useState(false); const [avoidsSharingOTP, setAvoidsSharingOTP] = useState(true);
  const [result, setResult] = useState(null);

  const habits = [
    {label:'Uses a password manager', value:usesPasswordManager, setter:setUsesPasswordManager},
    {label:'Changes passwords regularly', value:changesPasswordsRegularly, setter:setChangesPasswordsRegularly},
    {label:'MFA enabled on all accounts', value:usesMFAOnAllAccounts, setter:setUsesMFAOnAllAccounts},
    {label:'Avoids public WiFi for banking', value:avoidsPublicWiFi, setter:setAvoidsPublicWiFi},
    {label:'Regularly updates software', value:updatesSoftware, setter:setUpdatesSoftware},
    {label:'Reviews app permissions', value:reviewsPermissions, setter:setReviewsPermissions},
    {label:'Logs out of active sessions', value:logsOutOfSessions, setter:setLogsOutOfSessions},
    {label:'Never shares OTP with anyone', value:avoidsSharingOTP, setter:setAvoidsSharingOTP},
  ];

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="mb-6"><div className="text-xs font-mono uppercase tracking-[0.3em] text-[var(--saffron)]">Personal Cyber Hygiene Score</div><h2 className="font-display text-3xl font-semibold text-[var(--ink)]">Score your cyber hygiene</h2><p className="mt-2 max-w-2xl text-sm text-[var(--ink-text)]/70">Check how many essential cyber hygiene habits you're following.</p></div>
      <CyberFeatureCard eyebrow="Hygiene Check" title="Your cyber hygiene score" description="Mark which habits you follow.">
        <div className="space-y-1">{habits.map((h) => (<label key={h.label} className="flex items-center gap-2 text-sm"><input type="checkbox" checked={h.value} onChange={(e) => h.setter(e.target.checked)} className="accent-[var(--saffron)]" />{h.label}</label>))}</div>
        <button onClick={() => setResult(analyzeCyberHygiene({ usesPasswordManager, changesPasswordsRegularly, usesMFAOnAllAccounts, avoidsPublicWiFi, updatesSoftware, reviewsPermissions, logsOutOfSessions, avoidsSharingOTP }))} className="rounded-full bg-[var(--ink)] px-4 py-2 text-sm font-semibold text-white">Score my hygiene</button>
        {result && <div className="rounded-2xl border border-[var(--paper-line)] bg-[var(--paper)] p-4 text-sm"><div className="mb-2 inline-flex rounded-full border border-[var(--saffron)]/30 bg-[var(--saffron)]/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-[var(--saffron)]">{result.risk_band} risk</div><p className="font-semibold">{result.recommendation}</p><ul className="mt-3 space-y-1">{result.signals.map((s) => <li key={s.type}>• {s.detail}</li>)}</ul></div>}
      </CyberFeatureCard>
    </div>
  );
}

