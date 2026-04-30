import { Bar, BarChart, CartesianGrid, Cell, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const tooltipStyle = {
  background: "oklch(0.2 0.035 295)",
  border: "1px solid oklch(1 0 0 / 10%)",
  borderRadius: 8,
  fontSize: 12,
  color: "white",
};

interface ProviderBarItem {
  name: string;
  facturas: number;
}

interface TrendItem {
  day: string;
  procesadas: number;
  validadas: number;
}

interface DocTypeItem {
  name: string;
  value: number;
}

interface HeatmapCell {
  day: string;
  hour: number;
  value: number;
}

export function ProviderBars({ data }: { data: ProviderBarItem[] }) {
  return (
    <ChartCard title="Facturas por proveedor" subtitle="Top 6 · últimos 7 días">
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid stroke="oklch(1 0 0 / 6%)" vertical={false} />
          <XAxis dataKey="name" tick={{ fill: "oklch(0.72 0.02 295)", fontSize: 11 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: "oklch(0.72 0.02 295)", fontSize: 11 }} axisLine={false} tickLine={false} />
          <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "oklch(1 0 0 / 4%)" }} />
          <Bar dataKey="facturas" radius={[6, 6, 0, 0]} fill="var(--brand-turquoise)" />
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

const PIE_COLORS = ["var(--brand-turquoise)", "var(--brand-purple)", "var(--brand-lime)", "var(--brand-orange)", "var(--brand-lavender)"];

export function DocTypePie({ data }: { data: DocTypeItem[] }) {
  const total = data.reduce((a, b) => a + b.value, 0);
  return (
    <ChartCard title="Por tipo de documento" subtitle={`${total.toLocaleString()} documentos`}>
      <div className="flex items-center gap-4">
        <ResponsiveContainer width="55%" height={200}>
          <PieChart>
            <Pie data={data} dataKey="value" innerRadius={48} outerRadius={75} paddingAngle={2} stroke="none">
              {data.map((_, i) => (
                <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
              ))}
            </Pie>
            <Tooltip contentStyle={tooltipStyle} />
          </PieChart>
        </ResponsiveContainer>
        <ul className="flex-1 space-y-2 text-xs">
          {data.map((d, i) => (
            <li key={d.name} className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-muted-foreground">
                <span className="h-2 w-2 rounded-full" style={{ background: PIE_COLORS[i] }} />
                {d.name}
              </span>
              <span className="font-medium text-foreground tabular-nums">{d.value}</span>
            </li>
          ))}
        </ul>
      </div>
    </ChartCard>
  );
}

export function TrendLine({ data }: { data: TrendItem[] }) {
  return (
    <ChartCard title="Tendencia · facturas procesadas" subtitle="Últimos 14 días">
      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid stroke="oklch(1 0 0 / 6%)" vertical={false} />
          <XAxis dataKey="day" tick={{ fill: "oklch(0.72 0.02 295)", fontSize: 11 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: "oklch(0.72 0.02 295)", fontSize: 11 }} axisLine={false} tickLine={false} />
          <Tooltip contentStyle={tooltipStyle} />
          <Line type="monotone" dataKey="procesadas" stroke="var(--brand-turquoise)" strokeWidth={2} dot={false} />
          <Line type="monotone" dataKey="validadas" stroke="var(--brand-purple)" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

export function ErrorHeatmap({ data }: { data: HeatmapCell[] }) {
  const hours = Array.from({ length: 24 }, (_, i) => i);
  const days = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];

  // Build a lookup map from the sparse data; missing cells default to 0
  const lookup = new Map<string, number>();
  for (const cell of data) {
    lookup.set(`${cell.day}-${cell.hour}`, cell.value);
  }
  const cellValue = (day: string, hour: number) => lookup.get(`${day}-${hour}`) ?? 0;

  // Find max value for opacity scaling
  const maxVal = data.length > 0 ? Math.max(...data.map((c) => c.value), 1) : 1;

  return (
    <ChartCard title="Errores por hora" subtitle="Heatmap semanal">
      <div className="overflow-x-auto">
        <div className="inline-block">
          <div className="flex gap-[3px] mb-1 ml-8">
            {hours.filter(h => h % 3 === 0).map(h => (
              <div key={h} className="text-[10px] text-muted-foreground" style={{ width: 33 }}>{h}h</div>
            ))}
          </div>
          {days.map((d) => (
            <div key={d} className="flex items-center gap-[3px] mb-[3px]">
              <div className="w-7 text-[10px] text-muted-foreground">{d}</div>
              {hours.map(h => {
                const v = cellValue(d, h);
                const opacity = Math.min(1, v / maxVal);
                return (
                  <div key={h} className="h-5 w-[10px] rounded-[2px]" style={{ background: `oklch(0.74 0.17 55 / ${0.08 + opacity * 0.7})` }} title={`${d} ${h}h · ${v} errores`} />
                );
              })}
            </div>
          ))}
          <div className="flex items-center gap-2 mt-3 ml-8 text-[10px] text-muted-foreground">
            <span>Menos</span>
            {[0.1, 0.25, 0.45, 0.65, 0.85].map(o => (
              <div key={o} className="h-2.5 w-4 rounded-sm" style={{ background: `oklch(0.74 0.17 55 / ${o})` }} />
            ))}
            <span>Más</span>
          </div>
        </div>
      </div>
    </ChartCard>
  );
}

function ChartCard({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-border bg-card p-5" style={{ boxShadow: "var(--shadow-card)" }}>
      <div className="mb-4">
        <h3 className="text-[14px] font-semibold tracking-tight">{title}</h3>
        {subtitle && <p className="text-[11px] text-muted-foreground mt-0.5">{subtitle}</p>}
      </div>
      {children}
    </div>
  );
}