/**
 * Innti SVG icon — simplified version of the circular sun/burst logo.
 * Rendered as an inline SVG to respect the current color context.
 */
export function InntiIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      {/* outer ring of small circles + radial lines */}
      {Array.from({ length: 10 }, (_, i) => {
        const angle = (i * 36 - 90) * (Math.PI / 180);
        const cx = 20 + 14 * Math.cos(angle);
        const cy = 20 + 14 * Math.sin(angle);
        const lx1 = 20 + 8 * Math.cos(angle);
        const ly1 = 20 + 8 * Math.sin(angle);
        const lx2 = 20 + 11.5 * Math.cos(angle);
        const ly2 = 20 + 11.5 * Math.sin(angle);
        // Accent dots at 0° and 72° positions (indices 0, 2)
        const isAccent = i === 0 || i === 2;
        return (
          <g key={i}>
            <line x1={lx1} y1={ly1} x2={lx2} y2={ly2} stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            <circle cx={cx} cy={cy} r={isAccent ? 2 : 1.8} fill={isAccent ? "var(--brand-orange)" : "currentColor"} />
          </g>
        );
      })}
      {/* centre dot */}
      <circle cx="20" cy="20" r="2.2" fill="currentColor" />
    </svg>
  );
}
