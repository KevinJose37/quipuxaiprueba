import { useState } from "react";
import { Calendar } from "lucide-react";
import { InntiIcon } from "./InntiIcon";
import { ChatPanel } from "./ChatPanel";

export function Header() {
  const [chatOpen, setChatOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-20 flex items-center justify-end gap-4 px-6 lg:px-8 h-16 border-b border-border bg-background/80 backdrop-blur-xl">
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

        <div className="h-10 w-10 rounded-full flex items-center justify-center text-sm font-semibold text-[oklch(0.2_0.03_295)]" style={{ background: "var(--gradient-primary)" }}>
          MQ
        </div>
      </header>

      <ChatPanel open={chatOpen} onClose={() => setChatOpen(false)} />
    </>
  );
}