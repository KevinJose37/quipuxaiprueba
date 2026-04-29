import { ArrowDownRight, ArrowUpRight, type LucideIcon } from "lucide-react";
import { Area, AreaChart, ResponsiveContainer } from "recharts";

const colorMap: Record<string, string> = {
  turquoise: "var(--brand-turquoise)",
  lime: "var(--brand-lime)",
  orange: "var(--brand-orange)",
  purple: "var(--brand-purple)",
};

interface Props {
  label: string;
  value: string | number;
  delta: number;
  spark: number[];
  Icon: LucideIcon;
  color?: string;
}

export function KpiCard({ label, value, delta, spark, Icon, color = "turquoise" }: Props) {
  const data = spark.map((v, i) => ({ i, v }));
  const positive = delta >= 0;
  const stroke = colorMap[color];
  return (
    <div className="group relative rounded-xl border border-border bg-card p-5 overflow-hidden transition-all hover:border-primary/30" style={{ boxShadow: "var(--shadow-card)" }}>
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2.5">
          <div className="h-9 w-9 rounded-lg flex items-center justify-center border border-border bg-secondary/60">
            <Icon className="h-4 w-4" style={{ color: stroke }} strokeWidth={2} />
          </div>
          <span className="text-[12px] text-muted-foreground font-medium">{label}</span>
        </div>
        <span className={`flex items-center gap-0.5 text-[11px] font-semibold px-1.5 py-0.5 rounded-md ${positive ? "text-brand-turquoise bg-[oklch(0.81_0.09_207/12%)]" : "text-brand-orange bg-[oklch(0.74_0.17_55/12%)]"}`}>
          {positive ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
          {Math.abs(delta).toFixed(1)}%
        </span>
      </div>
      <div className="mt-4 flex items-end justify-between gap-3">
        <div className="text-3xl font-semibold tracking-tight tabular-nums">{value}</div>
        <div className="h-12 w-24 -mr-1">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 4, right: 0, bottom: 0, left: 0 }}>
              <defs>
                <linearGradient id={`g-${label}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={stroke} stopOpacity={0.5} />
                  <stop offset="100%" stopColor={stroke} stopOpacity={0} />
                </linearGradient>
              </defs>
              <Area type="monotone" dataKey="v" stroke={stroke} strokeWidth={1.8} fill={`url(#g-${label})`} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}