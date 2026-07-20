export default function SafetyTipsPage({ setActiveView }) {
  const tips = [
    'Pause for 5 minutes before acting on urgent requests.',
    'Do not share OTPs, passwords, Aadhaar details, or bank credentials.',
    'Verify the caller through an official phone number or trusted source.',
    'Tell a trusted family member or friend if something feels wrong.',
    'Keep screenshots and report the incident to the right authority early.',
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 space-y-6">
      <div className="rounded-[2rem] border border-[var(--paper-line)] bg-white p-8 shadow-sm">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--saffron)]">Safety tips</p>
        <h1 className="font-display text-3xl font-semibold mt-2">A few habits that reduce risk in real life.</h1>
        <p className="mt-3 text-[var(--ink-text)]/70 max-w-2xl">
          These tips are simple, practical, and designed to work even without any special technology.
        </p>
      </div>

      <div className="rounded-2xl border border-[var(--paper-line)] bg-[var(--paper)] p-6">
        <ul className="space-y-3">
          {tips.map((tip, index) => (
            <li key={tip} className="flex items-start gap-3 rounded-xl border border-[var(--paper-line)] bg-white p-3 text-sm text-[var(--ink-text)]/80">
              <span className="font-display text-lg text-[var(--saffron)]">0{index + 1}</span>
              <span>{tip}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="rounded-[2rem] border border-[var(--paper-line)] bg-[var(--navy)] p-8 text-white">
        <h2 className="font-display text-2xl font-semibold">Small habits create strong protection</h2>
        <p className="mt-2 text-[var(--mist)]">
          A calm, slower response is often the safest answer to a suspicious request.
        </p>
        <button
          onClick={() => setActiveView('portal')}
          className="mt-5 rounded-full bg-[var(--saffron)] px-5 py-2 text-sm font-semibold text-white"
        >
          Try the safety check
        </button>
      </div>
    </div>
  );
}
