import { useState } from "react";
import { Calendar, LogOut, User } from "lucide-react";
import { InntiIcon } from "./InntiIcon";
import { ChatPanel } from "./ChatPanel";
import { useAuth } from "@/hooks/use-auth";
import { useHealth } from "@/hooks/use-health";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

export function Header() {
  const [chatOpen, setChatOpen] = useState(false);
  const { user, logout } = useAuth();
  const { data: health, isError } = useHealth();

  // Obtener iniciales dinámicas
  const getInitials = (name: string) => {
    if (!name) return "U";
    const parts = name.trim().split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const initials = user ? getInitials(user.nombre_completo) : "U";

  return (
    <>
      <header className="sticky top-0 z-20 flex items-center justify-end gap-4 px-6 lg:px-8 h-16 border-b border-border bg-background/80 backdrop-blur-xl">
        <button className="hidden md:inline-flex items-center gap-2 h-10 px-3.5 rounded-lg border border-border bg-secondary/60 text-sm text-foreground hover:bg-secondary transition">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          Últimos 7 días
        </button>

        <div className="hidden md:flex items-center gap-2 h-10 px-3.5 rounded-lg border border-border bg-secondary/60 text-sm">
          <span className="relative flex h-2 w-2">
            <span className={`absolute inline-flex h-full w-full rounded-full opacity-60 animate-pulse-dot ${
              isError || health?.status === "error" ? "bg-brand-danger" : "bg-brand-turquoise"
            }`} />
            <span className={`relative inline-flex h-2 w-2 rounded-full ${
              isError || health?.status === "error" ? "bg-brand-danger" : "bg-brand-turquoise"
            }`} />
          </span>
          <span className="text-foreground font-medium">Sistema</span>
          <span className={isError || health?.status === "error" ? "text-brand-danger" : "text-primary"}>
            {isError || health?.status === "error" ? "Offline" : "Online"}
          </span>
        </div>

        {/* Innti Chat button */}
        <button
          onClick={() => setChatOpen(true)}
          className="group relative h-10 w-10 rounded-xl flex items-center justify-center border border-border bg-secondary/60 hover:border-primary/40 transition-all hover:shadow-[0_0_20px_-4px_oklch(0.81_0.09_207/30%)]"
          title="Abrir Innti Assistant"
        >
          <InntiIcon className="h-5 w-5 text-foreground group-hover:text-primary transition-colors" />
          {/* subtle glow ring on hover */}
          <span className="absolute inset-0 rounded-xl border border-primary/0 group-hover:border-primary/20 transition-all" />
        </button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="h-10 w-10 rounded-full flex items-center justify-center text-sm font-semibold text-[oklch(0.2_0.03_295)] focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background transition-transform hover:scale-105" style={{ background: "var(--gradient-primary)" }}>
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
            <DropdownMenuItem className="cursor-pointer text-red-400 focus:text-red-300 focus:bg-red-400/10" onClick={logout}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Cerrar sesión</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </header>

      <ChatPanel open={chatOpen} onClose={() => setChatOpen(false)} />
    </>
  );
}