const REL_COLOR = {
  SHARED_DEVICE: '#ff7a1a',
  SAME_IP: '#f2a93b',
  TRANSACTED_WITH: '#5fb3d9',
};

export default function FraudGraphView({ centerId, neighbors = [], relationships = [], flagged }) {
  if (!centerId) {
    return (
      <div className="text-sm font-mono opacity-60 py-10 text-center">
        Look up an account to render its fraud-ring graph.
      </div>
    );
  }

  const cx = 160;
  const cy = 140;
  const r = 100;
  const points = neighbors.map((id, i) => {
    const angle = (i / Math.max(neighbors.length, 1)) * 2 * Math.PI - Math.PI / 2;
    return { id, x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) };
  });

  return (
    <svg viewBox="0 0 320 280" className="w-full">
      {points.map((p, i) => (
        <line
          key={`edge-${p.id}`}
          x1={cx}
          y1={cy}
          x2={p.x}
          y2={p.y}
          stroke={REL_COLOR[relationships[i % relationships.length]] || '#3d5a80'}
          strokeWidth="2"
          opacity="0.8"
        />
      ))}

      {/* center node */}
      <circle cx={cx} cy={cy} r="22" fill={flagged ? 'var(--alert)' : 'var(--saffron)'} />
      <text x={cx} y={cy + 4} textAnchor="middle" fontSize="9" className="font-mono" fill="white">
        {centerId.replace('ACC-', '')}
      </text>

      {points.map((p) => (
        <g key={p.id}>
          <circle cx={p.x} cy={p.y} r="16" fill="var(--navy)" stroke="var(--navy-line)" strokeWidth="1.5" />
          <text x={p.x} y={p.y + 3} textAnchor="middle" fontSize="8" className="font-mono" fill="var(--mist)">
            {p.id.replace('ACC-', '')}
          </text>
        </g>
      ))}
    </svg>
  );
}
