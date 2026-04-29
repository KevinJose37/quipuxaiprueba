import { createFileRoute } from "@tanstack/react-router";
import { Download, Filter, Plus, Search } from "lucide-react";
import { PageShell } from "@/components/dashboard/PageShell";
import { allInvoices } from "@/components/dashboard/data";

export const Route = createFileRoute("/facturas")({
  component: FacturasPage,
  head: () => ({
    meta: [
      { title: "Facturas · QUIPUX" },
      { name: "description", content: "Listado completo de facturas procesadas por la plataforma QUIPUX." },
    ],
  }),
});

const statusStyles: Record<string, string> = {
  validada: "bg-[oklch(0.81_0.09_207/15%)] text-brand-turquoise border-[oklch(0.81_0.09_207/30%)]",
  pendiente: "bg-[oklch(0.92_0.18_110/15%)] text-brand-lime border-[oklch(0.92_0.18_110/30%)]",
  rechazada: "bg-[oklch(0.74_0.17_55/15%)] text-brand-orange border-[oklch(0.74_0.17_55/30%)]",
  error: "bg-[oklch(0.68_0.21_25/15%)] text-brand-danger border-[oklch(0.68_0.21_25/30%)]",
};

function FacturasPage() {
  const total = allInvoices.length;
  const validated = allInvoices.filter((i) => i.status === "validada").length;
  const rejected = allInvoices.filter((i) => i.status === "rechazada" || i.status === "error").length;
  const pending = allInvoices.filter((i) => i.status === "pendiente").length;
  const sumAmount = allInvoices.reduce((a, b) => a + b.amount, 0);

  const stats = [
    { label: "Total", value: total, accent: "text-foreground" },
    { label: "Validadas", value: validated, accent: "text-brand-turquoise" },
    { label: "Pendientes", value: pending, accent: "text-brand-lime" },
    { label: "Rechazadas", value: rejected, accent: "text-brand-orange" },
    { label: "Monto total", value: `$${sumAmount.toLocaleString("es-AR")}`, accent: "text-foreground" },
  ];

  return (
    <PageShell
      title="Facturas"
      subtitle="Listado completo · pipeline en tiempo real"
      actions={
        <>
          <button className="h-9 px-3.5 text-xs rounded-lg border border-border bg-secondary/60 hover:bg-secondary transition flex items-center gap-1.5">
            <Download className="h-3.5 w-3.5" /> Exportar
          </button>
          <button className="h-9 px-3.5 text-xs rounded-lg font-semibold text-[oklch(0.2_0.03_295)] hover:opacity-90 transition flex items-center gap-1.5" style={{ background: "var(--gradient-primary)", boxShadow: "var(--shadow-glow)" }}>
            <Plus className="h-3.5 w-3.5" /> Nueva factura
          </button>
        </>
      }
    >
      <section className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-xl border border-border bg-card p-4" style={{ boxShadow: "var(--shadow-card)" }}>
            <div className="text-[11px] uppercase tracking-wider text-muted-foreground">{s.label}</div>
            <div className={`mt-1.5 text-2xl font-semibold tabular-nums ${s.accent}`}>{s.value}</div>
          </div>
        ))}
      </section>

      <div className="rounded-xl border border-border bg-card overflow-hidden" style={{ boxShadow: "var(--shadow-card)" }}>
        <div className="flex flex-col md:flex-row md:items-center gap-3 p-4 border-b border-border">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              placeholder="Buscar por número, proveedor o monto…"
              className="w-full h-9 pl-10 pr-3 rounded-lg bg-secondary/60 border border-border text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          {["Todas", "Validadas", "Pendientes", "Rechazadas"].map((t, i) => (
            <button
              key={t}
              className={`h-9 px-3 text-xs rounded-lg border transition ${
                i === 0 ? "bg-primary/15 border-primary/30 text-primary" : "border-border bg-secondary/60 text-muted-foreground hover:text-foreground"
              }`}
            >
              {t}
            </button>
          ))}
          <button className="h-9 px-3 text-xs rounded-lg border border-border bg-secondary/60 flex items-center gap-1.5">
            <Filter className="h-3.5 w-3.5" /> Filtros
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-[11px] uppercase tracking-wider text-muted-foreground bg-secondary/30">
                <th className="text-left font-medium px-5 py-3">Nº Factura</th>
                <th className="text-left font-medium px-3 py-3">Proveedor</th>
                <th className="text-left font-medium px-3 py-3">Tipo</th>
                <th className="text-left font-medium px-3 py-3">Estado</th>
                <th className="text-right font-medium px-3 py-3">Monto</th>
                <th className="text-left font-medium px-3 py-3">Fecha</th>
                <th className="text-right font-medium px-5 py-3">Tiempo</th>
              </tr>
            </thead>
            <tbody>
              {allInvoices.map((inv, i) => (
                <tr key={inv.id} className="border-t border-border/60 hover:bg-secondary/30 transition animate-fade-in-up" style={{ animationDelay: `${i * 15}ms` }}>
                  <td className="px-5 py-3 font-mono text-[12px]">{inv.id}</td>
                  <td className="px-3 py-3">{inv.provider}</td>
                  <td className="px-3 py-3 text-muted-foreground">{inv.type}</td>
                  <td className="px-3 py-3">
                    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-medium border ${statusStyles[inv.status]}`}>
                      <span className="h-1.5 w-1.5 rounded-full bg-current" />
                      {inv.status}
                    </span>
                  </td>
                  <td className="px-3 py-3 text-right tabular-nums">${inv.amount.toLocaleString("es-AR")}</td>
                  <td className="px-3 py-3 text-muted-foreground tabular-nums">{inv.date}</td>
                  <td className="px-5 py-3 text-right tabular-nums">{inv.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </PageShell>
  );
}