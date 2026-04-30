import { LayoutDashboard, FileText, Users, ShieldCheck, XOctagon, ScrollText, Sparkles } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useDashboard } from "@/hooks/use-dashboard";

const items = [
  { icon: LayoutDashboard, label: "Dashboard", to: "/" as const },
  { icon: FileText, label: "Facturas", to: "/facturas" as const },
  { icon: Users, label: "Proveedores", to: "/proveedores" as const },
  { icon: ShieldCheck, label: "Validaciones", to: "/validaciones" as const },
  { icon: XOctagon, label: "Rechazos", to: "/rechazos" as const },
  { icon: ScrollText, label: "Logs", to: "/logs" as const },
];

export function Sidebar() {
  const { data } = useDashboard();
  const epm = data?.events_per_min;

  return (
    <aside className="hidden lg:flex w-64 shrink-0 flex-col border-r border-border bg-sidebar text-sidebar-foreground sticky top-0 h-screen overflow-y-auto">
      <div className="px-6 py-6 flex items-center gap-2.5 border-b border-sidebar-border">
        <div className="h-9 w-9 rounded-xl flex items-center justify-center" style={{ background: "var(--gradient-primary)" }}>
          <Sparkles className="h-4.5 w-4.5 text-[oklch(0.2_0.03_295)]" strokeWidth={2.5} />
        </div>
        <div>
          <div className="text-[15px] font-semibold tracking-tight">Director Apolo</div>
          <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Quipux</div>
        </div>
      </div>

      <nav className="flex-1 p-3 space-y-1">
        {items.map((it) => {
          const Icon = it.icon;
          return (
            <Link
              key={it.label}
              to={it.to}
              activeOptions={{ exact: it.to === "/" }}
              className="w-full group flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all text-muted-foreground hover:bg-sidebar-accent/60 hover:text-foreground data-[status=active]:bg-sidebar-accent data-[status=active]:text-sidebar-accent-foreground data-[status=active]:shadow-[inset_0_1px_0_oklch(1_0_0/8%)]"
            >
              {({ isActive }) => (
                <>
                  <Icon className={`h-4 w-4 ${isActive ? "text-primary" : ""}`} strokeWidth={2} />
                  <span>{it.label}</span>
                  {isActive && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-primary animate-pulse-dot" />}
                </>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 m-3 rounded-xl border border-sidebar-border bg-sidebar-accent/40">
        <div className="flex items-center gap-2 text-xs font-medium">
          <span className="h-2 w-2 rounded-full bg-brand-lime animate-pulse-dot" />
          Actividad del sistema
        </div>
        <p className="text-[11px] text-muted-foreground mt-1.5 leading-snug">
          {epm ? `${epm.events_per_min} eventos/min · capacidad al ${epm.capacity_pct}%` : "Conectando…"}
        </p>
      </div>
    </aside>
  );
}