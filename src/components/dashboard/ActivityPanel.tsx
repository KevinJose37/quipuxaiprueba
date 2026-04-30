import { Bot, FileText, AlertTriangle, XCircle, Activity } from "lucide-react";

const iconFor = {
  auto: { Icon: Bot, color: "var(--brand-turquoise)", bg: "oklch(0.81 0.09 207 / 12%)" },
  log: { Icon: FileText, color: "var(--brand-purple)", bg: "oklch(0.42 0.16 285 / 18%)" },
  alert: { Icon: AlertTriangle, color: "var(--brand-lime)", bg: "oklch(0.92 0.18 110 / 12%)" },
  error: { Icon: XCircle, color: "var(--brand-orange)", bg: "oklch(0.74 0.17 55 / 14%)" },
} as const;

interface ActivityItem {
  type: string;
  text: string;
  time: string;
}

interface Props {
  data: ActivityItem[];
}

export function ActivityPanel({ data }: Props) {
  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden h-full flex flex-col" style={{ boxShadow: "var(--shadow-card)" }}>
      <div className="p-5 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Activity className="h-4 w-4 text-primary" />
          <h3 className="text-[14px] font-semibold tracking-tight">Actividad en vivo</h3>
        </div>
        <span className="text-[10px] uppercase tracking-wider text-primary flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse-dot" />
          Live
        </span>
      </div>

      <ul className="flex-1 overflow-y-auto p-3 space-y-1">
        {data.map((a, i) => {
          const cfg = iconFor[a.type as keyof typeof iconFor] ?? iconFor.auto;
          const Icon = cfg.Icon;
          return (
            <li key={i} className="flex items-start gap-3 p-2.5 rounded-lg hover:bg-secondary/40 transition animate-fade-in-up" style={{ animationDelay: `${i * 40}ms` }}>
              <div className="h-7 w-7 rounded-lg flex items-center justify-center shrink-0" style={{ background: cfg.bg }}>
                <Icon className="h-3.5 w-3.5" style={{ color: cfg.color }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[12.5px] text-foreground leading-snug">{a.text}</p>
                <p className="text-[10.5px] text-muted-foreground mt-0.5">{a.time}</p>
              </div>
            </li>
          );
        })}
      </ul>

      <div className="p-4 border-t border-border bg-secondary/20">
        <div className="flex items-center justify-between text-[11px]">
          <span className="text-muted-foreground">Eventos / min</span>
          <span className="font-semibold tabular-nums text-foreground">142</span>
        </div>
        <div className="mt-2 h-1 rounded-full bg-secondary overflow-hidden">
          <div className="h-full rounded-full" style={{ width: "72%", background: "var(--gradient-primary)" }} />
        </div>
      </div>
    </div>
  );
}