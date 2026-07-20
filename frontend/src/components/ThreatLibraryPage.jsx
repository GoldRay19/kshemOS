import { useEffect, useState } from 'react';
import { getRuleLibrarySamples } from '../api';

export default function ThreatLibraryPage({ setActiveView }) {
  const [library, setLibrary] = useState(null);

  useEffect(() => {
    let mounted = true;
    getRuleLibrarySamples(16).then((data) => {
      if (mounted) setLibrary(data);
    });
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 space-y-6">
      <div className="rounded-[2rem] border border-[var(--paper-line)] bg-white p-8 shadow-sm">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--saffron)]">Rule library</p>
        <h1 className="font-display text-3xl font-semibold mt-2">Explore the rule-based scam patterns behind the demo.</h1>
        <p className="mt-3 text-[var(--ink-text)]/70 max-w-2xl">
          KshemOS generates and evaluates hundreds of suspicious patterns using authority, urgency, secrecy, and payment signals. The rule library shows how these cases are built and detected.
        </p>
      </div>

      {library ? (
        <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-4">
            <div className="rounded-3xl border border-[var(--paper-line)] bg-[var(--paper)] p-6">
              <div className="text-[var(--mist)] uppercase tracking-[0.24em] text-xs font-mono mb-3">Summary</div>
              <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-2xl bg-white p-4 shadow-sm">
                  <div className="text-4xl font-display font-semibold text-[var(--ink)]">{library.total_examples}</div>
                  <div className="text-sm text-[var(--ink-text)]/70 mt-1">Generated scam phrases</div>
                </div>
                <div className="rounded-2xl bg-white p-4 shadow-sm">
                  <div className="text-4xl font-display font-semibold text-[var(--ink)]">{library.total_authority_patterns}</div>
                  <div className="text-sm text-[var(--ink-text)]/70 mt-1">Authority templates</div>
                </div>
                <div className="rounded-2xl bg-white p-4 shadow-sm">
                  <div className="text-4xl font-display font-semibold text-[var(--ink)]">{library.total_target_patterns}</div>
                  <div className="text-sm text-[var(--ink-text)]/70 mt-1">Target categories</div>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-[var(--paper-line)] bg-[var(--navy)] p-6 text-white">
              <h2 className="font-display text-2xl font-semibold">Why this matters</h2>
              <p className="mt-3 text-[var(--mist)]">
                Seeing the patterns helps people understand that scams are not random. They follow rules, and the same signals repeat in different forms.
              </p>
              <button
                onClick={() => setActiveView('portal')}
                className="mt-5 rounded-full bg-[var(--saffron)] px-5 py-2 text-sm font-semibold"
              >
                Try the scam detector
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-3xl border border-[var(--paper-line)] bg-white p-6">
              <div className="text-[var(--mist)] uppercase tracking-[0.24em] text-xs font-mono mb-3">Sample cases</div>
              <div className="space-y-3">
                {library.sample_cases.map((sample) => (
                  <div key={sample.phrase} className="rounded-2xl border border-[var(--paper-line)] bg-[var(--paper)] p-4">
                    <div className="text-sm font-semibold text-[var(--ink)]">{sample.authority} • {sample.medium}</div>
                    <div className="mt-1 text-xs uppercase tracking-[0.25em] text-[var(--ink-text)]/50">Target: {sample.target} • Issue: {sample.issue}</div>
                    <p className="text-sm text-[var(--ink-text)]/75 mt-2">{sample.phrase}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-[var(--paper-line)] bg-[var(--paper)] p-6">
              <div className="text-[var(--mist)] uppercase tracking-[0.24em] text-xs font-mono mb-3">Library note</div>
              <p className="text-sm text-[var(--ink-text)]/80">These examples are generated from a broad library of rule-based inputs. They show how the same warning signs repeat across different scam scripts.</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="rounded-3xl border border-[var(--paper-line)] bg-[var(--paper)] p-6 shadow-sm">Loading library samples…</div>
      )}
    </div>
  );
}
