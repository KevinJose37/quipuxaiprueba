import { LayoutDashboard, FileText, Users, ShieldCheck, XOctagon, Workflow, ScrollText, Settings, Sparkles } from "lucide-react";
import { useState } from "react";

const items = [
  { icon: LayoutDashboard, label: "Dashboard", active: true },
  { icon: FileText, label: "Facturas" },
  { icon: Users, label: "Proveedores" },
  { icon: ShieldCheck, label: "Validaciones" },
  { icon: XOctagon, label: "Rechazos" },
  { icon: Workflow, label: "Automatizaciones" },
  { icon: ScrollText, label: "Logs" },
  { icon: Settings, label: "Configuración" },
];

export function Sidebar() {
  const [active, setActive] = useState("Dashboard");
  return (
    <aside className="hidden lg:flex w-64 shrink-0 flex-col border-r border-border bg-sidebar text-sidebar-foreground">
      <div className="px-6 py-6 flex items-center gap-2.5 border-b border-sidebar-border">
        <div className="h-9 w-9 rounded-xl flex items-center justify-center" style={{ background: "var(--gradient-primary)" }}>
          <Sparkles className="h-4.5 w-4.5 text-[oklch(0.2_0.03_295)]" strokeWidth={2.5} />
        </div>
        <div>
          <div className="text-[15px] font-semibold tracking-tight">QUIPUX</div>
          <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">AI Billing</div>
        </div>
      </div>

      <nav className="flex-1 p-3 space-y-1">
        {items.map((it) => {
          const Icon = it.icon;
          const isActive = active === it.label;
          return (
            <button
              key={it.label}
              onClick={() => setActive(it.label)}
              className={`w-full group flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-[inset_0_1px_0_oklch(1_0_0/8%)]"
                  : "text-muted-foreground hover:bg-sidebar-accent/60 hover:text-foreground"
              }`}
            >
              <Icon className={`h-4 w-4 ${isActive ? "text-primary" : ""}`} strokeWidth={2} />
              <span>{it.label}</span>
              {isActive && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-primary animate-pulse-dot" />}
            </button>
          );
        })}
      </nav>

      <div className="p-4 m-3 rounded-xl border border-sidebar-border bg-sidebar-accent/40">
        <div className="flex items-center gap-2 text-xs font-medium">
          <span className="h-2 w-2 rounded-full bg-brand-lime animate-pulse-dot" />
          IA Engine activo
        </div>
        <p className="text-[11px] text-muted-foreground mt-1.5 leading-snug">
          Procesando 24 lotes en paralelo · throughput óptimo.
        </p>
      </div>
    </aside>
  );
}