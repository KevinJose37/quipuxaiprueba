import { createFileRoute } from "@tanstack/react-router";
import { ShieldCheck, CheckCircle2, AlertTriangle } from "lucide-react";
import { PageShell } from "@/components/dashboard/PageShell";
import { useValidaciones } from "@/hooks/use-validaciones";

export const Route = createFileRoute("/validaciones")({
  component: ValidacionesPage,
  head: () => ({
    meta: [
      { title: "Validaciones · QUIPUX" },
      { name: "description", content: "Reglas de validación automática aplicadas al pipeline de facturación QUIPUX." },
    ],
  }),
});

const sevColor: Record<string, string> = {
  high: "text-brand-orange",
  medium: "text-brand-lime",
  low: "text-brand-turquoise",
};

function ValidacionesPage() {
  const { data, isLoading } = useValidaciones();

  const validationRules = data?.rules ?? [];
  const st = data?.stats ?? { reglas_activas: 0, total_passed: 0, total_failed: 0, tasa_exito: 0 };

  return (
    <PageShell title="Validaciones" subtitle="Motor de reglas · IA + verificación documental">
      <section className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: "Reglas activas", value: st.reglas_activas, icon: ShieldCheck, accent: "text-brand-turquoise" },
          { label: "Validaciones OK (24h)", value: st.total_passed.toLocaleString("es-CO"), icon: CheckCircle2, accent: "text-brand-lime" },
          { label: "Fallos detectados", value: st.total_failed, icon: AlertTriangle, accent: "text-brand-orange" },
          { label: "Tasa de éxito", value: `${st.tasa_exito}%`, icon: ShieldCheck, accent: "text-foreground" },
        ].map((s) => {
          const I = s.icon;
          return (
            <div key={s.label} className="rounded-xl border border-border bg-card p-4 flex items-center gap-3" style={{ boxShadow: "var(--shadow-card)" }}>
              <div className={`h-10 w-10 rounded-lg bg-secondary/60 border border-border flex items-center justify-center ${s.accent}`}>
                <I className="h-5 w-5" />
              </div>
              <div>
                <div className="text-[11px] uppercase tracking-wider text-muted-foreground">{s.label}</div>
                <div className={`text-xl font-semibold tabular-nums ${s.accent}`}>{s.value}</div>
              </div>
            </div>
          );
        })}
      </section>

      <div className="rounded-xl border border-border bg-card overflow-hidden" style={{ boxShadow: "var(--shadow-card)" }}>
        <div className="p-5 border-b border-border">
          <h3 className="text-[15px] font-semibold tracking-tight">Reglas de validación</h3>
          <p className="text-xs text-muted-foreground mt-0.5">Aplicadas automáticamente sobre cada documento ingresado</p>
        </div>
        {isLoading ? (
          <div className="flex items-center justify-center h-40">
            <span className="h-6 w-6 rounded-full border-2 border-primary border-t-transparent animate-spin" />
          </div>
        ) : (
          <div className="divide-y divide-border/60">
            {validationRules.map((r, i) => {
              const total = r.passed + r.failed;
              const rate = total > 0 ? (r.passed / total) * 100 : 0;
              return (
                <div key={r.code} className="p-5 flex flex-col md:flex-row md:items-center gap-4 hover:bg-secondary/20 transition animate-fade-in-up" style={{ animationDelay: `${i * 40}ms` }}>
                  <div className="flex items-center gap-3 md:w-80">
                    <span className="font-mono text-[11px] px-2 py-0.5 rounded-md bg-secondary/60 border border-border">{r.code}</span>
                    <span className="font-medium text-sm">{r.rule}</span>
                  </div>
                  <div className="flex-1">
                    <div className="h-2 rounded-full bg-secondary overflow-hidden">
                      <div className="h-full rounded-full transition-all" style={{ width: `${rate}%`, background: "var(--gradient-primary)" }} />
                    </div>
                  </div>
                  <div className="flex items-center gap-5 text-xs tabular-nums">
                    <span className="text-brand-turquoise">{r.passed} OK</span>
                    <span className="text-brand-orange">{r.failed} fallos</span>
                    <span className={`uppercase tracking-wider text-[10px] font-semibold ${sevColor[r.severity]}`}>{r.severity}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </PageShell>
  );
}