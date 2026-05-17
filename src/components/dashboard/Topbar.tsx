import { useState } from "react";
import {
  LayoutDashboard,
  FileText,
  Users,
  ShieldCheck,
  XOctagon,
  ScrollText,
  Sparkles,
  ClipboardList,
  UserCog,
  Calendar,
  LogOut,
  Settings,
  Menu,
} from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useDashboard } from "@/hooks/use-dashboard";
import { useAuth } from "@/hooks/use-auth";
import { useHealth } from "@/hooks/use-health";
import { InntiIcon } from "./InntiIcon";
import { ChatPanel } from "./ChatPanel";
import { SelfUpdateModal } from "./SelfUpdateModal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

/* ------------------------------------------------------------------ */
/*  Nav items – same routes, icons, and labels as the old Sidebar      */
/* ------------------------------------------------------------------ */

const baseItems = [
  { icon: LayoutDashboard, label: "Dashboard", to: "/" as const },
  { icon: FileText, label: "Facturas", to: "/facturas" as const },
  { icon: Users, label: "Proveedores", to: "/proveedores" as const },
  { icon: ShieldCheck, label: "Validaciones", to: "/validaciones" as const },
  { icon: XOctagon, label: "Rechazos", to: "/rechazos" as const },
  { icon: ClipboardList, label: "Control", to: "/control" as const },
  { icon: ScrollText, label: "Logs", to: "/logs" as const },
];

/* ------------------------------------------------------------------ */
/*  Topbar                                                             */
/* ------------------------------------------------------------------ */

export function Topbar() {
  const [chatOpen, setChatOpen] = useState(false);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const { data } = useDashboard();
  const { user, logout } = useAuth();
  const { data: health, isError } = useHealth();

  const epm = data?.events_per_min;

  // Role-based nav: "Usuarios" only for admin
  const items =
    user?.rol === "admin"
      ? [...baseItems, { icon: UserCog, label: "Usuarios", to: "/usuarios" as const }]
      : baseItems;

  /* ---------- helpers (from old Header) ---------- */

  const getInitials = (name: string) => {
    if (!name) return "U";
    const parts = name.trim().split(" ");
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return name.substring(0, 2).toUpperCase();
  };

  const initials = user ? getInitials(user.nombre_completo) : "U";

  const getStatusColor = () => {
    if (isError || health?.status === "error") return "bg-brand-danger";
    if (health?.status === "degraded") return "bg-brand-orange";
    return "bg-brand-turquoise";
  };

  const getStatusTextColor = () => {
    if (isError || health?.status === "error") return "text-brand-danger";
    if (health?.status === "degraded") return "text-brand-orange";
    return "text-primary";
  };

  const getStatusText = () => {
    if (isError || health?.status === "error") return "Crítico";
    if (health?.status === "degraded") return "Parcial";
    return "Estable";
  };

  /* ---------- shared nav link renderer ---------- */

  const NavLink = ({
    item,
    onClick,
    vertical = false,
  }: {
    item: (typeof items)[number];
    onClick?: () => void;
    vertical?: boolean;
  }) => {
    const Icon = item.icon;

    if (vertical) {
      return (
        <Link
          key={item.label}
          to={item.to}
          activeOptions={{ exact: item.to === "/" }}
          onClick={onClick}
          className="w-full group flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all text-muted-foreground hover:bg-sidebar-accent/60 hover:text-foreground data-[status=active]:bg-sidebar-accent data-[status=active]:text-sidebar-accent-foreground data-[status=active]:shadow-[inset_0_1px_0_oklch(1_0_0/8%)]"
        >
          {({ isActive }) => (
            <>
              <Icon className={`h-4 w-4 ${isActive ? "text-primary" : ""}`} strokeWidth={2} />
              <span>{item.label}</span>
              {isActive && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-primary animate-pulse-dot" />}
            </>
          )}
        </Link>
      );
    }

    return (
      <Link
        key={item.label}
        to={item.to}
        activeOptions={{ exact: item.to === "/" }}
        className="group relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[13px] font-medium transition-all text-muted-foreground hover:bg-secondary/60 hover:text-foreground data-[status=active]:text-primary"
      >
        {({ isActive }) => (
          <>
            <Icon className={`h-3.5 w-3.5 ${isActive ? "text-primary" : ""}`} strokeWidth={2} />
            <span>{item.label}</span>
            {/* Active underline indicator */}
            {isActive && (
              <span className="absolute -bottom-[13px] left-1/2 -translate-x-1/2 w-3/4 h-[2px] rounded-full bg-primary" />
            )}
          </>
        )}
      </Link>
    );
  };

  return (
    <>
      <header className="sticky top-0 z-20 border-b border-border bg-background/80 backdrop-blur-xl">
        <div className="flex items-center h-14 px-4 lg:px-6 gap-1">
          {/* ── Left: Brand ── */}
          <Link to="/" className="flex items-center gap-2.5 shrink-0 mr-4 lg:mr-6">
            <div
              className="h-8 w-8 rounded-xl flex items-center justify-center"
              style={{ background: "var(--gradient-primary)" }}
            >
              <Sparkles className="h-4 w-4 text-[oklch(0.2_0.03_295)]" strokeWidth={2.5} />
            </div>
            <div className="hidden sm:block">
              <div className="text-[14px] font-semibold tracking-tight leading-tight">Director Apolo</div>
              <div className="text-[9px] uppercase tracking-[0.18em] text-muted-foreground leading-tight">Quipux</div>
            </div>
          </Link>

          {/* ── Center: Horizontal nav (desktop) ── */}
          <nav className="hidden lg:flex items-center gap-0.5 flex-1 min-w-0">
            {items.map((it) => (
              <NavLink key={it.label} item={it} />
            ))}
          </nav>

          {/* ── Spacer on mobile ── */}
          <div className="flex-1 lg:hidden" />

          {/* ── Right: Global controls ── */}
          <div className="flex items-center gap-2 shrink-0">
            {/* System status with activity tooltip */}
            <TooltipProvider delayDuration={200}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="hidden md:flex items-center gap-2 h-9 px-3 rounded-lg border border-border bg-secondary/60 text-sm cursor-default">
                    <span className="relative flex h-2 w-2">
                      <span className={`absolute inline-flex h-full w-full rounded-full opacity-60 animate-pulse-dot ${getStatusColor()}`} />
                      <span className={`relative inline-flex h-2 w-2 rounded-full ${getStatusColor()}`} />
                    </span>
                    <span className="text-foreground font-medium">Sistema</span>
                    <span className={getStatusTextColor()}>{getStatusText()}</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent
                  side="bottom"
                  className="bg-card border border-border px-3 py-2 shadow-xl text-foreground"
                >
                  <div className="flex items-center gap-2 text-xs font-medium">
                    <span className="h-2 w-2 rounded-full bg-brand-lime animate-pulse-dot" />
                    Actividad del sistema
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-1 leading-snug">
                    {epm
                      ? `${epm.events_per_min} eventos/min · capacidad al ${epm.capacity_pct}%`
                      : "Conectando…"}
                  </p>
                  {health && health.status !== "ok" && (
                    <div className="mt-2 pt-2 border-t border-border space-y-1.5">
                      {health.services.database === "down" && (
                        <p className="text-[11px] text-brand-danger flex items-center gap-1.5 leading-snug">
                          <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-brand-danger"></span>
                          La conexión a la base de datos ha fallado
                        </p>
                      )}
                      {health.services.llm_api === "down" && (
                        <p className="text-[11px] text-brand-orange flex items-center gap-1.5 leading-snug">
                          <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-brand-orange"></span>
                          El asistente de inteligencia artificial está fallando
                        </p>
                      )}
                      {(!health.services || (health.services.database !== "down" && health.services.llm_api !== "down")) && (
                        <p className="text-[11px] text-brand-danger flex items-center gap-1.5 leading-snug">
                          <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-brand-danger"></span>
                          No se puede conectar con el servidor
                        </p>
                      )}
                    </div>
                  )}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            {/* Innti Chat button */}
            <button
              onClick={() => setChatOpen(true)}
              className="group relative h-9 w-9 rounded-xl flex items-center justify-center border border-border bg-secondary/60 hover:border-primary/40 transition-all hover:shadow-[0_0_20px_-4px_oklch(0.81_0.09_207/30%)]"
              title="Abrir Innti Assistant"
            >
              <InntiIcon className="h-4.5 w-4.5 text-foreground group-hover:text-primary transition-colors" />
              <span className="absolute inset-0 rounded-xl border border-primary/0 group-hover:border-primary/20 transition-all" />
            </button>

            {/* Profile dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className="h-9 w-9 rounded-full flex items-center justify-center text-xs font-semibold text-[oklch(0.2_0.03_295)] focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background transition-transform hover:scale-105"
                  style={{ background: "var(--gradient-primary)" }}
                >
                  {initials}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-secondary border-border shadow-2xl">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none text-foreground">{user?.nombre_completo || "Usuario"}</p>
                    <p className="text-xs leading-none text-muted-foreground">{user?.correo || ""}</p>
                    <p className="text-[10px] uppercase font-bold text-primary mt-1">{user?.rol || ""}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-border" />
                <DropdownMenuItem className="cursor-pointer focus:bg-secondary/80" onClick={() => setUpdateModalOpen(true)}>
                  <Settings className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span>Actualizar datos</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-border" />
                <DropdownMenuItem className="cursor-pointer text-red-400 focus:text-red-300 focus:bg-red-400/10" onClick={logout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Cerrar sesión</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Mobile hamburger menu */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <button className="lg:hidden h-9 w-9 rounded-lg flex items-center justify-center border border-border bg-secondary/60 hover:bg-secondary transition">
                  <Menu className="h-4.5 w-4.5" />
                </button>
              </SheetTrigger>
              <SheetContent side="left" className="w-72 bg-sidebar border-sidebar-border p-0">
                <SheetHeader className="px-6 py-5 border-b border-sidebar-border">
                  <SheetTitle className="flex items-center gap-2.5 text-sidebar-foreground">
                    <div
                      className="h-8 w-8 rounded-xl flex items-center justify-center"
                      style={{ background: "var(--gradient-primary)" }}
                    >
                      <Sparkles className="h-4 w-4 text-[oklch(0.2_0.03_295)]" strokeWidth={2.5} />
                    </div>
                    <div>
                      <div className="text-[14px] font-semibold tracking-tight">Director Apolo</div>
                      <div className="text-[9px] uppercase tracking-[0.18em] text-muted-foreground">Quipux</div>
                    </div>
                  </SheetTitle>
                </SheetHeader>
                <nav className="p-3 space-y-1">
                  {items.map((it) => (
                    <NavLink key={it.label} item={it} onClick={() => setMobileMenuOpen(false)} vertical />
                  ))}
                </nav>

                {/* System activity widget (same as old sidebar bottom) */}
                <div className="p-4 m-3 rounded-xl border border-sidebar-border bg-sidebar-accent/40">
                  <div className="flex items-center gap-2 text-xs font-medium">
                    <span className="h-2 w-2 rounded-full bg-brand-lime animate-pulse-dot" />
                    Actividad del sistema
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-1.5 leading-snug">
                    {epm
                      ? `${epm.events_per_min} eventos/min · capacidad al ${epm.capacity_pct}%`
                      : "Conectando…"}
                  </p>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      <ChatPanel open={chatOpen} onClose={() => setChatOpen(false)} />
      <SelfUpdateModal isOpen={updateModalOpen} onClose={() => setUpdateModalOpen(false)} />
    </>
  );
}
