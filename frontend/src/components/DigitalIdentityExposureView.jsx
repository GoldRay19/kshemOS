import { useState } from 'react';
import CyberFeatureCard from './CyberFeatureCard';
import { analyzeIdentityExposure } from '../cyberFeatures/digitalIdentityExposure';

export default function DigitalIdentityExposureView() {
  const [leaks, setLeaks] = useState('HaveIBeenPwned, data broker site, dark web mention');
  const [publicProfiles, setPublicProfiles] = useState('LinkedIn, Facebook, Twitter');
  const [socialAccounts, setSocialAccounts] = useState('Instagram, Snapchat, Reddit, TikTok, Discord');
  const [phoneNumber, setPhoneNumber] = useState('Yes');
  const [result, setResult] = useState(null);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="mb-6">
        <div className="text-xs font-mono uppercase tracking-[0.3em] text-[var(--saffron)]">Digital Identity Exposure</div>
        <h2 className="font-display text-3xl font-semibold text-[var(--ink)]">See how exposed your identity is online</h2>
        <p className="mt-2 max-w-2xl text-sm text-[var(--ink-text)]/70">List known leaks, public profiles, and social accounts to assess your digital footprint.</p>
      </div>
      <CyberFeatureCard eyebrow="Exposure Scan" title="Identity exposure dashboard" description="Enter details about your digital presence to evaluate exposure risk.">
        <input value={leaks} onChange={(e) => setLeaks(e.target.value)} className="w-full rounded-2xl border border-[var(--paper-line)] p-3 text-sm" placeholder="Known leaks (comma separated)" />
        <input value={publicProfiles} onChange={(e) => setPublicProfiles(e.target.value)} className="w-full rounded-2xl border border-[var(--paper-line)] p-3 text-sm" placeholder="Public profiles (comma separated)" />
        <input value={socialAccounts} onChange={(e) => setSocialAccounts(e.target.value)} className="w-full rounded-2xl border border-[var(--paper-line)] p-3 text-sm" placeholder="Social accounts (comma separated)" />
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={phoneNumber === 'Yes'} onChange={(e) => setPhoneNumber(e.target.checked ? 'Yes' : 'No')} className="accent-[var(--saffron)]" /> Phone number is publicly exposed</label>
        <button onClick={() => setResult(analyzeIdentityExposure({ leaks: leaks.split(',').map((s) => s.trim()), publicProfiles: publicProfiles.split(',').map((s) => s.trim()), socialAccounts: socialAccounts.split(',').map((s) => s.trim()), phoneNumber }))} className="rounded-full bg-[var(--ink)] px-4 py-2 text-sm font-semibold text-white">Assess exposure</button>
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

