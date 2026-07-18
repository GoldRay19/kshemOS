function ShieldMark({ size = 28 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <path
        d="M20 3 L34 9 V19 C34 28 28 34 20 37 C12 34 6 28 6 19 V9 Z"
        fill="var(--navy)"
      />
      <path d="M13 20 L18 25 L28 13" stroke="var(--saffron)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  );
}

export default function Shell({ portal, setPortal, children }) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-[var(--paper-line)] bg-white/80 backdrop-blur sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldMark />
            <div>
              <div className="font-display font-semibold leading-none tracking-tight">KSHEM<span className="text-[var(--saffron)]">OS</span></div>
              <div className="text-[10px] font-mono uppercase tracking-widest text-[var(--ink-text)]/50">
                Digital public safety
              </div>
            </div>
          </div>
          <div className="flex bg-[var(--paper)] border border-[var(--paper-line)] rounded-full p-1 text-sm">
            <button
              onClick={() => setPortal('citizen')}
              className={`px-3 py-1 rounded-full font-semibold transition-colors ${
                portal === 'citizen' ? 'bg-[var(--ink)] text-white' : 'text-[var(--ink-text)]/60'
              }`}
            >
              Citizen
            </button>
            <button
              onClick={() => setPortal('officer')}
              className={`px-3 py-1 rounded-full font-semibold transition-colors ${
                portal === 'officer' ? 'bg-[var(--ink)] text-white' : 'text-[var(--ink-text)]/60'
              }`}
            >
              Officer
            </button>
          </div>
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <footer className="text-center text-xs text-[var(--ink-text)]/40 py-6 font-mono">
        KshemOS — hackathon prototype · stopping fraud before the money moves
      </footer>
    </div>
  );
}
