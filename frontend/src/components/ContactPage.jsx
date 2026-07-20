export default function ContactPage({ setActiveView }) {
  const helplines = [
    { name: 'Cybercrime Helpline', value: '1930' },
    { name: 'National Crime Reporting', value: '112' },
    { name: 'Police Emergency', value: '100' },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 space-y-6">
      <div className="rounded-[2rem] border border-[var(--paper-line)] bg-white p-8 shadow-sm">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--saffron)]">Contact & helpline</p>
        <h1 className="font-display text-3xl font-semibold mt-2">Need help fast? Reach out through trusted channels.</h1>
        <p className="mt-3 text-[var(--ink-text)]/70 max-w-2xl">
          If a call or message feels suspicious, do not respond in panic. Use the official helplines below and report the incident as soon as possible.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        {helplines.map((item) => (
          <div key={item.name} className="rounded-2xl border border-[var(--paper-line)] bg-[var(--paper)] p-5">
            <div className="text-xs uppercase tracking-[0.25em] text-[var(--ink-text)]/50">{item.name}</div>
            <div className="mt-3 font-display text-2xl font-semibold">{item.value}</div>
          </div>
        ))}
      </div>

      <div className="rounded-[2rem] border border-[var(--paper-line)] bg-[var(--navy)] p-8 text-white">
        <h2 className="font-display text-2xl font-semibold">Remember: pause, verify, report.</h2>
        <p className="mt-2 text-[var(--mist)] max-w-2xl">
          The fastest response is often a calm one. Verify the caller, preserve evidence, and reach out to the right authority.
        </p>
        <button
          onClick={() => setActiveView('portal')}
          className="mt-5 rounded-full bg-[var(--saffron)] px-5 py-2 text-sm font-semibold text-white"
        >
          Open the verification portal
        </button>
      </div>
    </div>
  );
}
