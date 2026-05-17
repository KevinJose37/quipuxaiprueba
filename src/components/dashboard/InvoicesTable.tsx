import { Link } from "@tanstack/react-router";

const statusStyles: Record<string, string> = {
  validada: "bg-[oklch(0.81_0.09_207/15%)] text-brand-turquoise border-[oklch(0.81_0.09_207/30%)]",
  pendiente: "bg-[oklch(0.92_0.18_110/15%)] text-brand-lime border-[oklch(0.92_0.18_110/30%)]",
  rechazada: "bg-[oklch(0.74_0.17_55/15%)] text-brand-orange border-[oklch(0.74_0.17_55/30%)]",
  error: "bg-[oklch(0.68_0.21_25/15%)] text-brand-danger border-[oklch(0.68_0.21_25/30%)]",
};

const statusLabel: Record<string, string> = {
  validada: "Validada",
  pendiente: "Pendiente",
  rechazada: "Rechazada",
  error: "Error crítico",
};

interface Invoice {
  id: string;
  provider: string;
  type: string;
  status: string;
  date: string;
  time: string;
}

interface Props {
  data: Invoice[];
}

export function InvoicesTable({ data }: Props) {
  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden" style={{ boxShadow: "var(--shadow-card)" }}>
      <div className="flex items-center justify-between p-5 border-b border-border">
        <div>
          <h3 className="text-[15px] font-semibold tracking-tight">Últimas facturas procesadas</h3>
          <p className="text-xs text-muted-foreground mt-0.5">Pipeline en vivo · actualizado hace segundos</p>
        </div>
        <Link to="/facturas" className="text-xs text-primary font-medium hover:underline">Ver todas →</Link>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-[11px] uppercase tracking-wider text-muted-foreground bg-secondary/30">
              <th className="text-left font-medium px-5 py-3">Nº Factura</th>
              <th className="text-left font-medium px-3 py-3">Proveedor</th>
              <th className="text-left font-medium px-3 py-3">Tipo</th>
              <th className="text-left font-medium px-3 py-3">Estado</th>
              <th className="text-left font-medium px-3 py-3">Fecha</th>
              <th className="text-right font-medium px-5 py-3">Tiempo</th>
            </tr>
          </thead>
          <tbody>
            {data.map((inv, i) => (
              <tr key={inv.id} className="border-t border-border/60 hover:bg-secondary/30 transition animate-fade-in-up" style={{ animationDelay: `${i * 30}ms` }}>
                <td className="px-5 py-3.5 font-mono text-[12px] text-foreground">{inv.id}</td>
                <td className="px-3 py-3.5 text-foreground">{inv.provider}</td>
                <td className="px-3 py-3.5 text-muted-foreground">{inv.type}</td>
                <td className="px-3 py-3.5">
                  <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-medium border ${statusStyles[inv.status]}`}>
                    <span className="h-1.5 w-1.5 rounded-full bg-current" />
                    {statusLabel[inv.status]}
                  </span>
                </td>
                <td className="px-3 py-3.5 text-muted-foreground tabular-nums">{inv.date}</td>
                <td className="px-5 py-3.5 text-right tabular-nums text-foreground">{inv.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}