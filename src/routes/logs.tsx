import { createFileRoute } from "@tanstack/react-router";
import { Search, Download } from "lucide-react";
import { PageShell } from "@/components/dashboard/PageShell";
import { useLogs } from "@/hooks/use-logs";

export const Route = createFileRoute("/logs")({
  component: LogsPage,
  head: () => ({
    meta: [
      { title: "Logs · QUIPUX" },
      { name: "description", content: "Registro técnico en tiempo real del pipeline de facturación QUIPUX." },
    ],
  }),
});

const levelStyle: Record<string, string> = {
  info: "bg-[oklch(0.81_0.09_207/15%)] text-brand-turquoise border-[oklch(0.81_0.09_207/30%)]",
  warn: "bg-[oklch(0.92_0.18_110/15%)] text-brand-lime border-[oklch(0.92_0.18_110/30%)]",
  error: "bg-[oklch(0.68_0.21_25/15%)] text-brand-danger border-[oklch(0.68_0.21_25/30%)]",
  debug: "bg-secondary/60 text-muted-foreground border-border",
};

function LogsPage() {
  const { data, isLoading } = useLogs();

  const logs = data?.logs ?? [];
  const st = data?.stats ?? { total_24h: 0, info: 0, warn: 0, error: 0 };

  return (
    <PageShell
      title="Logs del sistema"
      subtitle="Stream técnico · pipeline · ERP · IA"
      actions={
        <button className="h-9 px-3.5 text-xs rounded-lg border border-border bg-secondary/60 hover:bg-secondary transition flex items-center gap-1.5">
          <Download className="h-3.5 w-3.5" /> Exportar
        </button>
      }
    >
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Eventos (24h)", value: st.total_24h, accent: "text-foreground" },
          { label: "Info", value: st.info, accent: "text-brand-turquoise" },
          { label: "Warnings", value: st.warn, accent: "text-brand-lime" },
          { label: "Errores", value: st.error, accent: "text-brand-danger" },
        ].map((s) => (
          <div key={s.label} className="rounded-xl border border-border bg-card p-4" style={{ boxShadow: "var(--shadow-card)" }}>
            <div className="text-[11px] uppercase tracking-wider text-muted-foreground">{s.label}</div>
            <div className={`mt-1.5 text-2xl font-semibold tabular-nums ${s.accent}`}>{typeof s.value === "number" ? s.value.toLocaleString("es-CO") : s.value}</div>
          </div>
        ))}
      </section>

      <div className="rounded-xl border border-border bg-card overflow-hidden" style={{ boxShadow: "var(--shadow-card)" }}>
        <div className="flex flex-col md:flex-row md:items-center gap-3 p-4 border-b border-border">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              placeholder="Buscar en logs…"
              className="w-full h-9 pl-10 pr-3 rounded-lg bg-secondary/60 border border-border text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          {["Todos", "Info", "Warn", "Error", "Debug"].map((t, i) => (
            <button
              key={t}
              className={`h-9 px-3 text-xs rounded-lg border transition ${
                i === 0 ? "bg-primary/15 border-primary/30 text-primary" : "border-border bg-secondary/60 text-muted-foreground hover:text-foreground"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center h-40">
            <span className="h-6 w-6 rounded-full border-2 border-primary border-t-transparent animate-spin" />
          </div>
        ) : (
          <div className="font-mono text-[12.5px] divide-y divide-border/40">
            {logs.map((l, i) => (
              <div key={i} className="grid grid-cols-[110px_72px_110px_1fr] items-center gap-3 px-5 py-2.5 hover:bg-secondary/30 transition animate-fade-in-up" style={{ animationDelay: `${i * 20}ms` }}>
                <span className="text-muted-foreground tabular-nums">{l.ts}</span>
                <span className={`inline-flex justify-center px-1.5 py-0.5 rounded text-[10px] uppercase font-semibold border ${levelStyle[l.level] ?? levelStyle.debug}`}>
                  {l.level}
                </span>
                <span className="text-muted-foreground">[{l.source}]</span>
                <span className="text-foreground truncate">{l.msg}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </PageShell>
  );
}