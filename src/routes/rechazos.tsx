import { createFileRoute } from "@tanstack/react-router";
import { XOctagon, RotateCcw } from "lucide-react";
import { PageShell } from "@/components/dashboard/PageShell";
import { useRechazos } from "@/hooks/use-rechazos";
import { StatCardLoader, CardLoader } from "@/components/dashboard/CardLoader";

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
  const { data, isLoading } = useRechazos();

  const rejections = data?.rejections ?? [];
  const causes = data?.causes ?? [];
  const st = data?.stats ?? { rechazos_hoy: 0, severidad_alta: 0, reintentos: 0, tasa_rechazo: 0 };

  const maxCause = causes.length > 0 ? causes[0].count : 1;

  return (
    <PageShell title="Rechazos" subtitle="Documentos no aceptados · análisis de causas raíz">
      {/* Stat cards */}
      <section className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {isLoading
          ? Array.from({ length: 4 }, (_, i) => <StatCardLoader key={i} />)
          : [
              { label: "Rechazos hoy", value: st.rechazos_hoy, accent: "text-brand-orange" },
              { label: "Severidad alta", value: st.severidad_alta, accent: "text-brand-danger" },
              { label: "Reintentos automáticos", value: st.reintentos, accent: "text-brand-turquoise" },
              { label: "Tasa de rechazo", value: `${st.tasa_rechazo}%`, accent: "text-foreground" },
            ].map((s) => (
              <div key={s.label} className="rounded-xl border border-border bg-card p-4" style={{ boxShadow: "var(--shadow-card)" }}>
                <div className="text-[11px] uppercase tracking-wider text-muted-foreground">{s.label}</div>
                <div className={`mt-1.5 text-2xl font-semibold tabular-nums ${s.accent}`}>{s.value}</div>
              </div>
            ))}
      </section>

      {/* Content panels */}
      {isLoading ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <CardLoader className="lg:col-span-2 h-[450px]" />
          <CardLoader className="h-[450px]" />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 rounded-xl border border-border bg-card overflow-hidden" style={{ boxShadow: "var(--shadow-card)" }}>
            <div className="p-5 border-b border-border">
              <h3 className="text-[15px] font-semibold tracking-tight">Documentos rechazados</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Últimas 24 horas</p>
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
              {causes.map((c) => (
                <div key={c.rule}>
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="font-mono text-muted-foreground">{c.rule}</span>
                    <span className="tabular-nums font-semibold">{c.count}</span>
                  </div>
                  <div className="h-2 rounded-full bg-secondary overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${(c.count / maxCause) * 100}%`, background: "var(--gradient-primary)" }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </PageShell>
  );
}