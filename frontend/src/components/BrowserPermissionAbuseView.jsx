import { useState } from 'react';
import CyberFeatureCard from './CyberFeatureCard';
import { analyzeBrowserPermissions } from '../cyberFeatures/browserPermissionAbuse';

export default function BrowserPermissionAbuseView() {
  const [camera, setCamera] = useState(false);
  const [microphone, setMicrophone] = useState(false);
  const [location, setLocation] = useState(false);
  const [notifications, setNotifications] = useState(false);
  const [clipboard, setClipboard] = useState(false);
  const [screenShare, setScreenShare] = useState(false);
  const [result, setResult] = useState(null);

  const toggle = (setter) => () => setter((p) => !p);

  const permissionList = [
    { label: 'Camera', value: camera, setter: setCamera },
    { label: 'Microphone', value: microphone, setter: setMicrophone },
    { label: 'Location', value: location, setter: setLocation },
    { label: 'Notifications', value: notifications, setter: setNotifications },
    { label: 'Clipboard', value: clipboard, setter: setClipboard },
    { label: 'Screen Sharing', value: screenShare, setter: setScreenShare },
  ];

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="mb-6">
        <div className="text-xs font-mono uppercase tracking-[0.3em] text-[var(--saffron)]">Browser Permission Abuse Analyzer</div>
        <h2 className="font-display text-3xl font-semibold text-[var(--ink)]">Check which permissions a site has</h2>
        <p className="mt-2 max-w-2xl text-sm text-[var(--ink-text)]/70">Toggle which permissions are currently enabled to assess your browser exposure.</p>
      </div>
      <CyberFeatureCard eyebrow="Permission Audit" title="Audit browser permissions" description="Select the permissions currently granted to sites or extensions.">
        <div className="grid grid-cols-2 gap-3">
          {permissionList.map((p) => (
            <label key={p.label} className="flex items-center gap-3 rounded-xl border border-[var(--paper-line)] p-3 text-sm cursor-pointer hover:border-[var(--saffron)]">
              <input type="checkbox" checked={p.value} onChange={toggle(p.setter)} className="h-4 w-4 accent-[var(--saffron)]" />
              <span className="font-medium">{p.label}</span>
              <span className={`ml-auto text-xs font-mono ${p.value ? 'text-[var(--alert)]' : 'text-[var(--ink-text)]/40'}`}>{p.value ? 'ON' : 'OFF'}</span>
            </label>
          ))}
        </div>
        <button onClick={() => setResult(analyzeBrowserPermissions({ camera, microphone, location, notifications, clipboard, screenShare }))} className="rounded-full bg-[var(--ink)] px-4 py-2 text-sm font-semibold text-white">Analyze permissions</button>
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

