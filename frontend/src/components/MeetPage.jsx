const TEAM = [
  {
    name: 'Esha Jha',
    role: 'Full Stack Developer & Cybersecurity Researcher',
    bio: 'Building end-to-end cyber safety tools with a focus on rule-based scam detection, threat intelligence, and user protection systems. Passionate about making digital safety accessible to everyone.',
    initials: 'EJ',
    color: 'var(--saffron)',
  },
  {
    name: 'Eshita Jha',
    role: 'ML Engineer & Cybersecurity Researcher',
    bio: 'Engineering intelligent rule-based systems for phishing, impersonation, and financial fraud detection. Focused on creating scalable, explainable, and privacy-first safety solutions.',
    initials: 'EJ',
    color: 'var(--safe)',
  },
];

function ShieldMark({ size = 28 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <path d="M20 3 L34 9 V19 C34 28 28 34 20 37 C12 34 6 28 6 19 V9 Z" fill="var(--navy)" />
      <path d="M13 20 L18 25 L28 13" stroke="var(--saffron)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  );
}

export default function MeetPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="flex justify-center mb-4">
          <ShieldMark size={48} />
        </div>
        <div className="text-xs font-mono uppercase tracking-[0.3em] text-[var(--saffron)] mb-2">Meet the Team</div>
        <h1 className="font-display text-4xl font-semibold text-[var(--ink)]">Built with purpose,<br/>powered by passion.</h1>
        <p className="mt-4 max-w-xl mx-auto text-sm text-[var(--ink-text)]/70">
          The minds behind KshemOS — a collective of developers, researchers, and engineers committed to stopping fraud before the money moves.
        </p>
      </div>

      {/* Team Cards */}
      <div className="grid gap-6 md:grid-cols-3">
        {TEAM.map((member, index) => (
          <div
            key={member.name}
            className="group rounded-3xl border border-[var(--paper-line)] bg-white p-6 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 animate-fade-up"
            style={{ animationDelay: `${index * 120}ms` }}
          >
            {/* Avatar */}
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center text-white font-display font-bold text-xl mb-4 transition-transform duration-300 group-hover:scale-110"
              style={{ backgroundColor: member.color }}
            >
              {member.initials}
            </div>

            {/* Name & Role */}
            <h3 className="font-display text-xl font-semibold text-[var(--ink)]">{member.name}</h3>
            <div
              className="mt-1 text-[11px] font-mono uppercase tracking-[0.2em]"
              style={{ color: member.color }}
            >
              {member.role}
            </div>

            {/* Bio */}
            <p className="mt-3 text-sm text-[var(--ink-text)]/70 leading-relaxed">
              {member.bio}
            </p>

            {/* Divider */}
            <div className="mt-5 pt-4 border-t border-[var(--paper-line)]">
              <div className="flex items-center gap-2 text-xs text-[var(--ink-text)]/40 font-mono">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
                KshemOS Core Team
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom CTA */}
      <div className="mt-12 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-[var(--paper-line)] bg-white px-5 py-2 text-sm text-[var(--ink-text)]/60 font-mono shadow-sm">
          <span className="inline-block h-2 w-2 rounded-full bg-[var(--safe)]" />
          Together for a safer digital India
        </div>
      </div>
    </div>
  );
}

