import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Download, Plus, Search } from "lucide-react";
import { PageShell } from "@/components/dashboard/PageShell";
import { useFacturas } from "@/hooks/use-facturas";
import { StatCardLoader, TableCardLoader } from "@/components/dashboard/CardLoader";

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
  const [busqueda, setBusqueda] = useState("");
  const [estado, setEstado] = useState("Todas");
  
  const estadoBackend = estado === "Todas" ? undefined : estado.toLowerCase().slice(0, -1);
  
  const { data, isLoading } = useFacturas(estadoBackend, busqueda);

  const allInvoices = data?.invoices ?? [];
  const s = data?.stats ?? { total: 0, validadas: 0, pendientes: 0, rechazadas: 0, monto_total: 0 };

  const stats = [
    { label: "Total", value: s.total, accent: "text-foreground" },
    { label: "Validadas", value: s.validadas, accent: "text-brand-turquoise" },
    { label: "Pendientes", value: s.pendientes, accent: "text-brand-lime" },
    { label: "Rechazadas", value: s.rechazadas, accent: "text-brand-orange" },
    { label: "Monto total", value: `$${s.monto_total.toLocaleString("es-CO")}`, accent: "text-foreground" },
  ];

  return (
    <PageShell
      title="Facturas"
      subtitle="Listado completo · pipeline en tiempo real"
    >

      {/* Stat cards */}
      <section className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {isLoading
          ? Array.from({ length: 5 }, (_, i) => <StatCardLoader key={i} />)
          : stats.map((st) => (
              <div key={st.label} className="rounded-xl border border-border bg-card p-4" style={{ boxShadow: "var(--shadow-card)" }}>
                <div className="text-[11px] uppercase tracking-wider text-muted-foreground">{st.label}</div>
                <div className={`mt-1.5 text-2xl font-semibold tabular-nums ${st.accent}`}>{st.value}</div>
              </div>
            ))}
      </section>

      {/* Table */}
      {isLoading ? (
        <TableCardLoader className="h-[500px]" />
      ) : (
        <div className="rounded-xl border border-border bg-card overflow-hidden" style={{ boxShadow: "var(--shadow-card)" }}>
          <div className="flex flex-col md:flex-row md:items-center gap-3 p-4 border-b border-border">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                placeholder="Buscar por número, proveedor o monto…"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="w-full h-9 pl-10 pr-3 rounded-lg bg-secondary/60 border border-border text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring text-foreground"
              />
            </div>
            {["Todas", "Validadas", "Pendientes", "Rechazadas"].map((t) => (
              <button
                key={t}
                onClick={() => setEstado(t)}
                className={`h-9 px-3 text-xs rounded-lg border transition ${
                  estado === t ? "bg-primary/15 border-primary/30 text-primary" : "border-border bg-secondary/60 text-muted-foreground hover:text-foreground"
                }`}
              >
                {t}
              </button>
            ))}
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
                    <td className="px-3 py-3 text-right tabular-nums">${inv.amount.toLocaleString("es-CO")}</td>
                    <td className="px-3 py-3 text-muted-foreground tabular-nums">{inv.date}</td>
                    <td className="px-5 py-3 text-right tabular-nums">{inv.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </PageShell>
  );
}