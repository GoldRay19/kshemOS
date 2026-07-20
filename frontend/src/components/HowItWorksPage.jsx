export default function HowItWorksPage({ setActiveView }) {
  return (
    <div className="max-w-6xl mx-auto px-4 py-10 space-y-6">
      <div className="rounded-[2rem] border border-[var(--paper-line)] bg-white p-8 shadow-sm">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--saffron)]">How it works</p>
        <h1 className="font-display text-3xl font-semibold mt-2">A simple rule-based safety flow for everyday people.</h1>
        <p className="mt-3 text-[var(--ink-text)]/70 max-w-2xl">
          KshemOS looks for common scam patterns such as authority pressure, urgency, secrecy, and payment requests. It then turns those signals into a clear safety score.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-[var(--paper-line)] bg-[var(--paper)] p-5">
          <h2 className="font-display text-xl font-semibold">1. Observe</h2>
          <p className="mt-2 text-sm text-[var(--ink-text)]/80">The system scans the message or transcript for suspicious language and pressure tactics.</p>
        </div>
        <div className="rounded-2xl border border-[var(--paper-line)] bg-[var(--paper)] p-5">
          <h2 className="font-display text-xl font-semibold">2. Score</h2>
          <p className="mt-2 text-sm text-[var(--ink-text)]/80">Each signal adds weight, producing a clear low, medium, high, or critical result.</p>
        </div>
        <div className="rounded-2xl border border-[var(--paper-line)] bg-[var(--paper)] p-5">
          <h2 className="font-display text-xl font-semibold">3. Respond</h2>
          <p className="mt-2 text-sm text-[var(--ink-text)]/80">The page provides guidance so the person can verify, pause, and report instead of acting on impulse.</p>
        </div>
      </div>

      <div className="rounded-[2rem] border border-[var(--paper-line)] bg-[var(--navy)] p-8 text-white">
        <h2 className="font-display text-2xl font-semibold">Why this approach helps</h2>
        <p className="mt-2 text-[var(--mist)] max-w-2xl">
          Rule-based logic is transparent, easy to explain, and useful for public awareness campaigns and quick demos.
        </p>
        <button
          onClick={() => setActiveView('portal')}
          className="mt-5 rounded-full bg-[var(--saffron)] px-5 py-2 text-sm font-semibold text-white"
        >
          See the verification experience
        </button>
      </div>
    </div>
  );
}
