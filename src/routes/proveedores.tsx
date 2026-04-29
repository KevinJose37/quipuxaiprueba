import { createFileRoute } from "@tanstack/react-router";
import { Building2, Plus, Search } from "lucide-react";
import { PageShell } from "@/components/dashboard/PageShell";
import { providers } from "@/components/dashboard/data";

export const Route = createFileRoute("/proveedores")({
  component: ProveedoresPage,
  head: () => ({
    meta: [
      { title: "Proveedores · QUIPUX" },
      { name: "description", content: "Gestión de proveedores integrados al pipeline de facturación QUIPUX." },
    ],
  }),
});

const statusBadge: Record<string, string> = {
  active: "bg-[oklch(0.81_0.09_207/15%)] text-brand-turquoise border-[oklch(0.81_0.09_207/30%)]",
  review: "bg-[oklch(0.92_0.18_110/15%)] text-brand-lime border-[oklch(0.92_0.18_110/30%)]",
  blocked: "bg-[oklch(0.68_0.21_25/15%)] text-brand-danger border-[oklch(0.68_0.21_25/30%)]",
};

const statusLabel: Record<string, string> = {
  active: "Activo",
  review: "En revisión",
  blocked: "Bloqueado",
};

function ProveedoresPage() {
  const total = providers.length;
  const active = providers.filter((p) => p.status === "active").length;
  const avgRate = (providers.reduce((a, b) => a + b.validRate, 0) / providers.length).toFixed(1);

  return (
    <PageShell
      title="Proveedores"
      subtitle="Maestro de proveedores · integraciones ERP activas"
      actions={
        <button className="h-9 px-3.5 text-xs rounded-lg font-semibold text-[oklch(0.2_0.03_295)] hover:opacity-90 transition flex items-center gap-1.5" style={{ background: "var(--gradient-primary)", boxShadow: "var(--shadow-glow)" }}>
          <Plus className="h-3.5 w-3.5" /> Onboarding
        </button>
      }
    >
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total proveedores", value: total },
          { label: "Activos", value: active, accent: "text-brand-turquoise" },
          { label: "Tasa validación promedio", value: `${avgRate}%`, accent: "text-brand-lime" },
          { label: "Integraciones ERP", value: "3", accent: "text-foreground" },
        ].map((s) => (
          <div key={s.label} className="rounded-xl border border-border bg-card p-4" style={{ boxShadow: "var(--shadow-card)" }}>
            <div className="text-[11px] uppercase tracking-wider text-muted-foreground">{s.label}</div>
            <div className={`mt-1.5 text-2xl font-semibold tabular-nums ${s.accent ?? "text-foreground"}`}>{s.value}</div>
          </div>
        ))}
      </section>

      <div className="rounded-xl border border-border bg-card overflow-hidden" style={{ boxShadow: "var(--shadow-card)" }}>
        <div className="flex items-center gap-3 p-4 border-b border-border">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              placeholder="Buscar proveedor o CUIT…"
              className="w-full h-9 pl-10 pr-3 rounded-lg bg-secondary/60 border border-border text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-[11px] uppercase tracking-wider text-muted-foreground bg-secondary/30">
                <th className="text-left font-medium px-5 py-3">Proveedor</th>
                <th className="text-left font-medium px-3 py-3">CUIT</th>
                <th className="text-right font-medium px-3 py-3">Facturas</th>
                <th className="text-left font-medium px-3 py-3">Validación</th>
                <th className="text-left font-medium px-3 py-3">ERP</th>
                <th className="text-left font-medium px-3 py-3">Última sync</th>
                <th className="text-left font-medium px-5 py-3">Estado</th>
              </tr>
            </thead>
            <tbody>
              {providers.map((p, i) => (
                <tr key={p.cuit} className="border-t border-border/60 hover:bg-secondary/30 transition animate-fade-in-up" style={{ animationDelay: `${i * 30}ms` }}>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2.5">
                      <div className="h-8 w-8 rounded-lg bg-secondary/80 border border-border flex items-center justify-center">
                        <Building2 className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <span className="font-medium">{p.name}</span>
                    </div>
                  </td>
                  <td className="px-3 py-3.5 font-mono text-[12px] text-muted-foreground">{p.cuit}</td>
                  <td className="px-3 py-3.5 text-right tabular-nums">{p.invoices}</td>
                  <td className="px-3 py-3.5">
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-24 rounded-full bg-secondary overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${p.validRate}%`, background: p.validRate > 95 ? "var(--brand-turquoise)" : p.validRate > 90 ? "var(--brand-lime)" : "var(--brand-orange)" }} />
                      </div>
                      <span className="text-xs tabular-nums text-muted-foreground">{p.validRate}%</span>
                    </div>
                  </td>
                  <td className="px-3 py-3.5">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-mono bg-secondary/60 border border-border">{p.erp}</span>
                  </td>
                  <td className="px-3 py-3.5 text-muted-foreground text-xs">{p.lastSync}</td>
                  <td className="px-5 py-3.5">
                    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-medium border ${statusBadge[p.status]}`}>
                      <span className="h-1.5 w-1.5 rounded-full bg-current animate-pulse-dot" />
                      {statusLabel[p.status]}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </PageShell>
  );
}