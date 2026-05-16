import { AlertTriangle, Bell } from "lucide-react";
import type { EventsPerMin, AlertasDianData } from "@/hooks/use-dashboard";

interface Props {
  alertasDian: AlertasDianData;
  eventsPerMin: EventsPerMin;
}

export function ActivityPanel({ alertasDian, eventsPerMin }: Props) {
  const alertas = Object.entries(alertasDian?.alertas || {}).map(([key, value]) => ({ key, ...value }));

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden h-full flex flex-col" style={{ boxShadow: "var(--shadow-card)" }}>
      <div className="p-5 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bell className="h-4 w-4 text-primary" />
          <h3 className="text-[14px] font-semibold tracking-tight">Alertas DIAN</h3>
        </div>
        <span className="text-[10px] uppercase tracking-wider text-primary flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse-dot" />
          EN VIVO
        </span>
      </div>

      <ul className="flex-1 overflow-y-auto p-3 space-y-2">
        {alertas.length === 0 ? (
          <li className="text-center text-xs text-muted-foreground mt-4">Sin datos de alertas</li>
        ) : (
          alertas.map((a, i) => {
            return (
              <li key={i} className="flex flex-col gap-1.5 p-3 rounded-lg bg-secondary/20 border border-border/50 hover:bg-secondary/40 transition animate-fade-in-up" style={{ animationDelay: `${i * 40}ms` }}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-6 w-6 rounded-md flex items-center justify-center shrink-0 bg-brand-orange/10 text-brand-orange">
                      <AlertTriangle className="h-3.5 w-3.5" />
                    </div>
                    <span className="text-[13px] font-medium text-foreground">{a.label}</span>
                  </div>
                  <span className="font-semibold text-[14px] tabular-nums text-primary">
                    {a.total}
                  </span>
                </div>
                
                {/* Opcional: Mostrar desglose si hay detalle */}
                {Object.keys(a.detalle || {}).length > 0 && (
                  <div className="mt-2 pl-8 pr-2 space-y-1 text-[11px] text-muted-foreground">
                    {Object.entries(a.detalle).map(([anio, meses]) => (
                      <div key={anio} className="flex justify-between items-start">
                        <span className="font-medium text-foreground/70">{anio}</span>
                        <div className="flex flex-col items-end">
                          {Object.entries(meses as Record<string, number>).map(([mes, total]) => (
                            <span key={mes}>{mes}: {total}</span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </li>
            );
          })
        )}
      </ul>

      <div className="p-4 border-t border-border bg-secondary/20">
        <div className="flex items-center justify-between text-[11px]">
          <span className="text-muted-foreground">Última ejecución</span>
          <span className="font-semibold tabular-nums text-foreground">
            {alertasDian?.fecha_ejecucion 
              ? new Date(alertasDian.fecha_ejecucion).toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' }) 
              : "—"}
          </span>
        </div>
      </div>
    </div>
  );
}