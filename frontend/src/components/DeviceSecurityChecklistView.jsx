import { useState } from 'react';
import CyberFeatureCard from './CyberFeatureCard';
import { analyzeDeviceChecklist } from '../cyberFeatures/deviceSecurityChecklist';

export default function DeviceSecurityChecklistView() {
  const [screenLock, setScreenLock] = useState(false);
  const [updates, setUpdates] = useState(false);
  const [antivirus, setAntivirus] = useState(false);
  const [backup, setBackup] = useState(true);
  const [vpn, setVpn] = useState(false);
  const [mfa, setMfa] = useState(false);
  const [result, setResult] = useState(null);

  const items = [
    { label: 'Screen lock enabled', value: screenLock, setter: setScreenLock },
    { label: 'System updates enabled', value: updates, setter: setUpdates },
    { label: 'Antivirus / security tool', value: antivirus, setter: setAntivirus },
    { label: 'Regular data backup', value: backup, setter: setBackup },
    { label: 'VPN when on public WiFi', value: vpn, setter: setVpn },
    { label: 'Multi-factor authentication', value: mfa, setter: setMfa },
  ];

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="mb-6">
        <div className="text-xs font-mono uppercase tracking-[0.3em] text-[var(--saffron)]">Device Security Checklist</div>
        <h2 className="font-display text-3xl font-semibold text-[var(--ink)]">Check your device security posture</h2>
        <p className="mt-2 max-w-2xl text-sm text-[var(--ink-text)]/70">Run through fundamental device security checks to see how well protected you are.</p>
      </div>
      <CyberFeatureCard eyebrow="Device Check" title="Security checklist" description="Mark which protections are currently enabled on your device.">
        <div className="space-y-2">
          {items.map((item) => (
            <label key={item.label} className="flex items-center gap-3 rounded-xl border border-[var(--paper-line)] p-3 text-sm cursor-pointer hover:border-[var(--saffron)]">
              <input type="checkbox" checked={item.value} onChange={() => item.setter((p) => !p)} className="h-4 w-4 accent-[var(--saffron)]" />
              <span className="font-medium">{item.label}</span>
              <span className={`ml-auto text-xs font-mono ${item.value ? 'text-[var(--safe)]' : 'text-[var(--alert)]'}`}>{item.value ? '✓ ON' : '✗ OFF'}</span>
            </label>
          ))}
        </div>
        <button onClick={() => setResult(analyzeDeviceChecklist({ screenLock, updates, antivirus, backup, vpn, mfa }))} className="rounded-full bg-[var(--ink)] px-4 py-2 text-sm font-semibold text-white">Check security</button>
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

