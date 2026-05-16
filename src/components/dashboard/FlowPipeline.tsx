import { Inbox, ShieldCheck, Cpu, Database, CheckCircle2, AlertTriangle } from "lucide-react";
import type { FlowIndicators } from "@/hooks/use-dashboard";

const iconFor: Record<string, typeof Inbox> = {
  intake: Inbox,
  validation: ShieldCheck,
  processing: Cpu,
  erp: Database,
  done: CheckCircle2,
};

interface FlowStage {
  id: string;
  label: string;
  count: number;
  status: string;
}

interface Props {
  stages: FlowStage[];
  indicators: FlowIndicators;
}

export function FlowPipeline({ stages, indicators }: Props) {
  const maxCount = stages.length > 0 ? stages[0].count : 1;

  return (
    <div className="rounded-xl border border-border bg-card p-6" style={{ boxShadow: "var(--shadow-card)" }}>
      <div className="flex items-start justify-between mb-6">
        <div>
          <h3 className="text-[15px] font-semibold tracking-tight">Flujo de facturación (Últimos 30 días)</h3>
          <p className="text-xs text-muted-foreground mt-0.5">Pipeline automatizado · datos de prueba</p>
        </div>
        <span className="text-[11px] text-primary font-medium flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse-dot" />
          DATOS HISTÓRICOS
        </span>
      </div>

      <div className="relative">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-2 relative z-10">
          {stages.map((stage, idx) => {
            const Icon = iconFor[stage.id] ?? CheckCircle2;
            const warn = stage.status === "warn";
            return (
              <div key={stage.id} className="relative">
                <div className={`rounded-lg border p-4 bg-secondary/40 transition-all hover:bg-secondary/70 ${warn ? "border-brand-orange/40" : "border-border"}`}>
                  <div className="flex items-center justify-between">
                    <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${warn ? "bg-[oklch(0.74_0.17_55/15%)]" : "bg-[oklch(0.81_0.09_207/12%)]"}`}>
                      <Icon className="h-4 w-4" style={{ color: warn ? "var(--brand-orange)" : "var(--brand-turquoise)" }} />
                    </div>
                    {warn && <AlertTriangle className="h-3.5 w-3.5 text-brand-orange" />}
                  </div>
                  <div className="mt-3 text-[11px] uppercase tracking-wider text-muted-foreground">{stage.label}</div>
                  <div className="mt-1 text-2xl font-semibold tabular-nums">{stage.count.toLocaleString()}</div>
                  <div className="mt-2 h-1 w-full rounded-full bg-secondary overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${(stage.count / maxCount) * 100}%`, background: warn ? "var(--brand-orange)" : "var(--gradient-primary)" }} />
                  </div>
                </div>
                {idx < stages.length - 1 && (
                  <svg className="hidden md:block absolute top-1/2 -right-2 -translate-y-1/2 h-4 w-4 z-20" viewBox="0 0 16 16" fill="none">
                    <path d="M2 8 L14 8 M10 4 L14 8 L10 12" stroke="var(--brand-turquoise)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="flow-line" />
                  </svg>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-5 grid grid-cols-2 md:grid-cols-3 gap-3 text-xs">
        <Indicator label="SLA cumplido" value={indicators.sla} tone="ok" />
        <Indicator label="Facturas atascadas" value={indicators.atascadas} tone="warn" />
        <Indicator label="Cola interna" value={indicators.cola} tone="info" />
      </div>
    </div>
  );
}

function Indicator({ label, value, tone }: { label: string; value: string; tone: "ok" | "warn" | "info" }) {
  const dot = tone === "ok" ? "bg-brand-turquoise" : tone === "warn" ? "bg-brand-orange" : "bg-brand-lime";
  return (
    <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg bg-secondary/40 border border-border">
      <span className={`h-2 w-2 rounded-full ${dot} animate-pulse-dot`} />
      <div className="flex flex-col">
        <span className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</span>
        <span className="text-[13px] font-medium">{value}</span>
      </div>
    </div>
  );
}