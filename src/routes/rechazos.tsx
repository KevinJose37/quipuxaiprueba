import { createFileRoute } from "@tanstack/react-router";
import { XOctagon, RotateCcw } from "lucide-react";
import { PageShell } from "@/components/dashboard/PageShell";
import { rejections } from "@/components/dashboard/data";

export const Route = createFileRoute("/rechazos")({
  component: RechazosPage,
  head: () => ({
    meta: [
      { title: "Rechazos · QUIPUX" },
      { name: "description", content: "Documentos rechazados por el motor de validación QUIPUX y motivos detallados." },
    ],
  }),
});

const sevStyle: Record<string, string> = {
  high: "bg-[oklch(0.68_0.21_25/15%)] text-brand-danger border-[oklch(0.68_0.21_25/30%)]",
  medium: "bg-[oklch(0.74_0.17_55/15%)] text-brand-orange border-[oklch(0.74_0.17_55/30%)]",
  low: "bg-[oklch(0.92_0.18_110/15%)] text-brand-lime border-[oklch(0.92_0.18_110/30%)]",
};

function RechazosPage() {
  const high = rejections.filter((r) => r.severity === "high").length;

  // Group by rule for breakdown
  const byRule = Object.entries(
    rejections.reduce<Record<string, number>>((acc, r) => {
      acc[r.rule] = (acc[r.rule] ?? 0) + 1;
      return acc;
    }, {}),
  ).sort((a, b) => b[1] - a[1]);

  return (
    <PageShell title="Rechazos" subtitle="Documentos no aceptados · análisis de causas raíz">
      <section className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: "Rechazos hoy", value: rejections.length, accent: "text-brand-orange" },
          { label: "Severidad alta", value: high, accent: "text-brand-danger" },
          { label: "Reintentos automáticos", value: 18, accent: "text-brand-turquoise" },
          { label: "Tasa de rechazo", value: "3.6%", accent: "text-foreground" },
        ].map((s) => (
          <div key={s.label} className="rounded-xl border border-border bg-card p-4" style={{ boxShadow: "var(--shadow-card)" }}>
            <div className="text-[11px] uppercase tracking-wider text-muted-foreground">{s.label}</div>
            <div className={`mt-1.5 text-2xl font-semibold tabular-nums ${s.accent}`}>{s.value}</div>
          </div>
        ))}
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 rounded-xl border border-border bg-card overflow-hidden" style={{ boxShadow: "var(--shadow-card)" }}>
          <div className="p-5 border-b border-border flex items-center justify-between">
            <div>
              <h3 className="text-[15px] font-semibold tracking-tight">Documentos rechazados</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Últimas 24 horas</p>
            </div>
            <button className="h-8 px-3 text-xs rounded-lg border border-border bg-secondary/60 hover:bg-secondary transition flex items-center gap-1.5">
              <RotateCcw className="h-3.5 w-3.5" /> Reintentar todo
            </button>
          </div>
          <div className="divide-y divide-border/60">
            {rejections.map((r, i) => (
              <div key={r.id} className="p-4 flex items-start gap-4 hover:bg-secondary/20 transition animate-fade-in-up" style={{ animationDelay: `${i * 30}ms` }}>
                <div className={`h-9 w-9 rounded-lg border flex items-center justify-center shrink-0 ${sevStyle[r.severity]}`}>
                  <XOctagon className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-[12px]">{r.id}</span>
                    <span className="text-xs text-muted-foreground">·</span>
                    <span className="text-sm font-medium">{r.provider}</span>
                    <span className={`ml-auto px-2 py-0.5 rounded-md text-[10px] font-mono border ${sevStyle[r.severity]}`}>{r.rule}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{r.reason}</p>
                  <div className="text-[11px] text-muted-foreground mt-1.5 tabular-nums">{r.date}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-5" style={{ boxShadow: "var(--shadow-card)" }}>
          <h3 className="text-[15px] font-semibold tracking-tight">Causas más frecuentes</h3>
          <p className="text-xs text-muted-foreground mt-0.5">Por regla aplicada</p>
          <div className="mt-4 space-y-3">
            {byRule.map(([rule, count]) => {
              const max = byRule[0][1];
              return (
                <div key={rule}>
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="font-mono text-muted-foreground">{rule}</span>
                    <span className="tabular-nums font-semibold">{count}</span>
                  </div>
                  <div className="h-2 rounded-full bg-secondary overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${(count / max) * 100}%`, background: "var(--gradient-primary)" }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </PageShell>
  );
}