import { AlertTriangle, AlertCircle, Info, BellRing, Bell } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";

export interface AlertItem {
  id: number;
  type: string;
  priority: string;
  title: string;
  message: string;
  date: string;
}

const configFor = {
  CRITICA: { Icon: AlertTriangle, color: "var(--brand-danger)", bg: "oklch(0.68 0.21 25 / 15%)" },
  ALTA: { Icon: AlertCircle, color: "var(--brand-orange)", bg: "oklch(0.74 0.17 55 / 15%)" },
  MEDIA: { Icon: BellRing, color: "var(--brand-turquoise)", bg: "oklch(0.81 0.09 207 / 15%)" },
  BAJA: { Icon: Info, color: "oklch(0.6 0.01 295)", bg: "oklch(0.4 0.02 295 / 20%)" },
} as const;

interface Props {
  alerts: AlertItem[];
}

export function AlertsPanel({ alerts }: Props) {
  if (!alerts || alerts.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-card flex flex-col h-[200px] items-center justify-center text-muted-foreground">
        <Bell className="h-8 w-8 mb-2 opacity-20" />
        <p className="text-sm">No hay alertas activas</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden h-full flex flex-col" style={{ boxShadow: "var(--shadow-card)" }}>
      <div className="p-4 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-brand-orange" />
          <h3 className="text-[14px] font-semibold tracking-tight">Alertas Activas</h3>
        </div>
        <span className="text-[11px] font-medium bg-brand-danger/20 text-brand-danger px-2 py-0.5 rounded-full">
          {alerts.length} nuevas
        </span>
      </div>

      <ul className="flex-1 overflow-y-auto p-2 space-y-1">
        {alerts.map((alert, i) => {
          const cfg = configFor[alert.priority as keyof typeof configFor] ?? configFor.BAJA;
          const Icon = cfg.Icon;
          return (
            <li key={alert.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-secondary/40 transition animate-fade-in-up" style={{ animationDelay: `${i * 50}ms` }}>
              <div className="h-8 w-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5" style={{ background: cfg.bg }}>
                <Icon className="h-4 w-4" style={{ color: cfg.color }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-medium text-foreground leading-tight">{alert.title}</p>
                <p className="text-[12px] text-muted-foreground mt-1 line-clamp-2 leading-snug">{alert.message}</p>
                {alert.date && (
                  <p className="text-[10px] text-muted-foreground/60 mt-1.5 uppercase font-medium">
                    Hace {formatDistanceToNow(new Date(alert.date), { locale: es })}
                  </p>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
