import { Search, Calendar, Bell } from "lucide-react";

export function Header() {
  return (
    <header className="sticky top-0 z-20 flex items-center gap-4 px-6 lg:px-8 h-16 border-b border-border bg-background/80 backdrop-blur-xl">
      <div className="flex-1 max-w-md relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          placeholder="Buscar facturas, proveedores, lotes…"
          className="w-full h-10 pl-10 pr-4 rounded-lg bg-secondary/60 border border-border text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition"
        />
      </div>

      <button className="hidden md:inline-flex items-center gap-2 h-10 px-3.5 rounded-lg border border-border bg-secondary/60 text-sm text-foreground hover:bg-secondary transition">
        <Calendar className="h-4 w-4 text-muted-foreground" />
        Últimos 7 días
      </button>

      <div className="hidden md:flex items-center gap-2 h-10 px-3.5 rounded-lg border border-border bg-secondary/60 text-sm">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full rounded-full bg-brand-turquoise opacity-60 animate-pulse-dot" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-brand-turquoise" />
        </span>
        <span className="text-foreground font-medium">Sistema</span>
        <span className="text-primary">Online</span>
      </div>

      <button className="relative h-10 w-10 rounded-lg border border-border bg-secondary/60 flex items-center justify-center hover:bg-secondary transition">
        <Bell className="h-4 w-4" />
        <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-brand-orange" />
      </button>

      <div className="h-10 w-10 rounded-full flex items-center justify-center text-sm font-semibold text-[oklch(0.2_0.03_295)]" style={{ background: "var(--gradient-primary)" }}>
        MQ
      </div>
    </header>
  );
}