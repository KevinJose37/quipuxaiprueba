/**
 * Reusable loading placeholder — renders a card shell with a centered spinner.
 * Used across all pages so the layout never collapses while data is in-flight.
 */
export function CardLoader({ className = "h-[120px]" }: { className?: string }) {
  return (
    <div
      className={`rounded-xl border border-border bg-card flex items-center justify-center ${className}`}
      style={{ boxShadow: "var(--shadow-card)" }}
    >
      <span className="h-5 w-5 rounded-full border-2 border-primary/40 border-t-primary animate-spin" />
    </div>
  );
}

/** Stat card skeleton — matches the small stat cards used in sub-pages. */
export function StatCardLoader() {
  return (
    <div
      className="rounded-xl border border-border bg-card p-4 flex items-center justify-center h-[88px]"
      style={{ boxShadow: "var(--shadow-card)" }}
    >
      <span className="h-4 w-4 rounded-full border-2 border-primary/40 border-t-primary animate-spin" />
    </div>
  );
}

/** KPI card skeleton — matches the exact dimensions of KpiCard. */
export function KpiCardLoader() {
  return (
    <div
      className="rounded-xl border border-border bg-card p-5 h-[130px] flex items-center justify-center"
      style={{ boxShadow: "var(--shadow-card)" }}
    >
      <span className="h-5 w-5 rounded-full border-2 border-primary/40 border-t-primary animate-spin" />
    </div>
  );
}

/** Table skeleton — card with header bar + spinner body area. */
export function TableCardLoader({ className = "h-[400px]" }: { className?: string }) {
  return (
    <div
      className={`rounded-xl border border-border bg-card overflow-hidden flex flex-col ${className}`}
      style={{ boxShadow: "var(--shadow-card)" }}
    >
      <div className="h-14 border-b border-border bg-secondary/10" />
      <div className="flex-1 flex items-center justify-center">
        <span className="h-5 w-5 rounded-full border-2 border-primary/40 border-t-primary animate-spin" />
      </div>
    </div>
  );
}
