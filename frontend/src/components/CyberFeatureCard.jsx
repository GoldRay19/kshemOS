import { useState } from 'react';

export default function CyberFeatureCard({ eyebrow, title, description, children, accent = 'var(--saffron)' }) {
  return (
    <section className="rounded-3xl border border-[var(--paper-line)] bg-white p-6 shadow-sm">
      <div className="mb-3 text-[11px] font-mono uppercase tracking-[0.3em]" style={{ color: accent }}>{eyebrow}</div>
      <h3 className="font-display text-xl font-semibold text-[var(--ink)]">{title}</h3>
      <p className="mt-2 text-sm text-[var(--ink-text)]/70">{description}</p>
      <div className="mt-5 space-y-3">{children}</div>
    </section>
  );
}
