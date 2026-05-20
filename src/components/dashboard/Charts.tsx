import { Bar, BarChart, CartesianGrid, Cell, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const tooltipStyle = {
  background: "oklch(0.2 0.035 295)",
  border: "1px solid oklch(1 0 0 / 10%)",
  borderRadius: 8,
  fontSize: 12,
  color: "white",
};

const PIE_COLORS = [
  "var(--brand-turquoise)",
  "var(--brand-purple)",
  "var(--brand-lime)",
  "var(--brand-orange)",
  "var(--brand-lavender)",
];

const formatCOP = (val: number) => {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0
  }).format(val);
};

const formatShortCOP = (val: number) => {
  if (val >= 1e9) return `$ ${(val / 1e9).toFixed(1)}B`;
  if (val >= 1e6) return `$ ${(val / 1e6).toFixed(1)}M`;
  if (val >= 1e3) return `$ ${(val / 1e3).toFixed(0)}k`;
  return `$ ${val}`;
};

interface ChartCardProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

function ChartCard({ title, subtitle, children }: ChartCardProps) {
  return (
    <div className="rounded-xl border border-border bg-card p-5 transition-all duration-300 hover:shadow-lg" style={{ boxShadow: "var(--shadow-card)" }}>
      <div className="mb-4">
        <h3 className="text-[14px] font-semibold tracking-tight">{title}</h3>
        {subtitle && <p className="text-[11px] text-muted-foreground mt-0.5">{subtitle}</p>}
      </div>
      {children}
    </div>
  );
}

/* 1. TrendLine - Linea de tiempo comparativa */
interface TrendItem {
  day: string;
  recibo: number;
  compra: number;
  procesamiento: number;
}

export function TrendLine({ data }: { data: TrendItem[] }) {
  return (
    <ChartCard title="Línea de tiempo de facturación" subtitle="Comparativo por fecha de recibo, compra y procesamiento">
      <ResponsiveContainer width="100%" height={260}>
        <LineChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
          <CartesianGrid stroke="oklch(1 0 0 / 6%)" vertical={false} />
          <XAxis dataKey="day" tick={{ fill: "oklch(0.72 0.02 295)", fontSize: 11 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: "oklch(0.72 0.02 295)", fontSize: 11 }} axisLine={false} tickLine={false} />
          <Tooltip contentStyle={tooltipStyle} />
          <Line name="Fecha de Recibo" type="monotone" dataKey="recibo" stroke="var(--brand-turquoise)" strokeWidth={2.5} dot={{ r: 2 }} activeDot={{ r: 4 }} />
          <Line name="Fecha de Compra" type="monotone" dataKey="compra" stroke="var(--brand-purple)" strokeWidth={2.5} dot={{ r: 2 }} activeDot={{ r: 4 }} />
          <Line name="Procesamiento" type="monotone" dataKey="procesamiento" stroke="var(--brand-lime)" strokeWidth={2.5} dot={{ r: 2 }} activeDot={{ r: 4 }} />
        </LineChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

/* 2. ProviderBars - Cantidad de facturas por proveedor (horizontal) */
interface ProviderBarItem {
  name: string;
  facturas: number;
}

export function ProviderBars({ data }: { data: ProviderBarItem[] }) {
  return (
    <ChartCard title="Facturas por proveedor" subtitle="Cantidad de facturas emitidas · Histórico completo">
      <ResponsiveContainer width="100%" height={240}>
        <BarChart layout="vertical" data={data} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
          <CartesianGrid stroke="oklch(1 0 0 / 6%)" horizontal={false} />
          <XAxis type="number" tick={{ fill: "oklch(0.72 0.02 295)", fontSize: 11 }} axisLine={false} tickLine={false} />
          <YAxis type="category" dataKey="name" tick={{ fill: "oklch(0.72 0.02 295)", fontSize: 10 }} width={120} axisLine={false} tickLine={false} />
          <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "oklch(1 0 0 / 4%)" }} />
          <Bar name="Facturas" dataKey="facturas" radius={[0, 6, 6, 0]} fill="var(--brand-turquoise)" />
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

/* 3. ValorProviderBars - Valor total por proveedor (horizontal) */
interface ValorProviderItem {
  name: string;
  value: number;
}

export function ValorProviderBars({ data }: { data: ValorProviderItem[] }) {
  return (
    <ChartCard title="Valor total por proveedor" subtitle="Monto total acumulado · Histórico completo">
      <ResponsiveContainer width="100%" height={240}>
        <BarChart layout="vertical" data={data} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
          <CartesianGrid stroke="oklch(1 0 0 / 6%)" horizontal={false} />
          <XAxis type="number" tickFormatter={formatShortCOP} tick={{ fill: "oklch(0.72 0.02 295)", fontSize: 11 }} axisLine={false} tickLine={false} />
          <YAxis type="category" dataKey="name" tick={{ fill: "oklch(0.72 0.02 295)", fontSize: 10 }} width={120} axisLine={false} tickLine={false} />
          <Tooltip
            contentStyle={tooltipStyle}
            cursor={{ fill: "oklch(1 0 0 / 4%)" }}
            formatter={(value: any) => [formatCOP(Number(value)), "Valor Total"]}
          />
          <Bar name="Valor Total" dataKey="value" radius={[0, 6, 6, 0]} fill="var(--brand-purple)" />
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

/* 4. FormaPagoPie - Facturas por forma de pago (Donut) */
interface FormaPagoItem {
  name: string;
  value: number;
}

export function FormaPagoPie({ data }: { data: FormaPagoItem[] }) {
  const total = data.reduce((a, b) => a + b.value, 0);
  return (
    <ChartCard title="Facturas por forma de pago" subtitle={`${total.toLocaleString()} facturas totales`}>
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <ResponsiveContainer width="100%" height={200} className="sm:max-w-[50%]">
          <PieChart>
            <Pie data={data} dataKey="value" innerRadius={48} outerRadius={75} paddingAngle={2} stroke="none">
              {data.map((_, i) => (
                <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
              ))}
            </Pie>
            <Tooltip contentStyle={tooltipStyle} />
          </PieChart>
        </ResponsiveContainer>
        <ul className="flex-1 space-y-2 text-xs w-full">
          {data.map((d, i) => (
            <li key={d.name} className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-muted-foreground">
                <span className="h-2.5 w-2.5 rounded-full shrink-0" style={{ background: PIE_COLORS[i % PIE_COLORS.length] }} />
                {d.name}
              </span>
              <span className="font-semibold text-foreground tabular-nums">
                {d.value} ({total > 0 ? ((d.value / total) * 100).toFixed(1) : 0}%)
              </span>
            </li>
          ))}
        </ul>
      </div>
    </ChartCard>
  );
}

/* 5. MedioPagoBars - Facturas por medio de pago (horizontal) */
interface MedioPagoItem {
  name: string;
  value: number;
}

export function MedioPagoBars({ data }: { data: MedioPagoItem[] }) {
  return (
    <ChartCard title="Facturas por medio de pago" subtitle="Cantidad por canal o medio de pago">
      <ResponsiveContainer width="100%" height={200}>
        <BarChart layout="vertical" data={data} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
          <CartesianGrid stroke="oklch(1 0 0 / 6%)" horizontal={false} />
          <XAxis type="number" tick={{ fill: "oklch(0.72 0.02 295)", fontSize: 11 }} axisLine={false} tickLine={false} />
          <YAxis type="category" dataKey="name" tick={{ fill: "oklch(0.72 0.02 295)", fontSize: 10 }} width={120} axisLine={false} tickLine={false} />
          <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "oklch(1 0 0 / 4%)" }} />
          <Bar name="Facturas" dataKey="value" radius={[0, 6, 6, 0]} fill="var(--brand-lime)" />
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

/* 6. EventosDianBars - Cantidad de eventos DIAN por tipo de evento (horizontal) */
interface EventosDianItem {
  name: string;
  value: number;
}

export function EventosDianBars({ data }: { data: EventosDianItem[] }) {
  return (
    <ChartCard title="Eventos DIAN por tipo" subtitle="Eventos de facturación electrónica reportados">
      <ResponsiveContainer width="100%" height={220}>
        <BarChart layout="vertical" data={data} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
          <CartesianGrid stroke="oklch(1 0 0 / 6%)" horizontal={false} />
          <XAxis type="number" tick={{ fill: "oklch(0.72 0.02 295)", fontSize: 11 }} axisLine={false} tickLine={false} />
          <YAxis type="category" dataKey="name" tick={{ fill: "oklch(0.72 0.02 295)", fontSize: 10 }} width={120} axisLine={false} tickLine={false} />
          <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "oklch(1 0 0 / 4%)" }} />
          <Bar name="Eventos" dataKey="value" radius={[0, 6, 6, 0]} fill="var(--brand-orange)" />
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

/* 7. ImpuestosBars - Valor por tipo de impuesto (vertical) */
interface ImpuestosItem {
  name: string;
  value: number;
}

export function ImpuestosBars({ data }: { data: ImpuestosItem[] }) {
  return (
    <ChartCard title="Valor por tipo de impuesto" subtitle="Total recaudado agrupado por tipo de tributo">
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
          <CartesianGrid stroke="oklch(1 0 0 / 6%)" vertical={false} />
          <XAxis dataKey="name" tick={{ fill: "oklch(0.72 0.02 295)", fontSize: 11 }} axisLine={false} tickLine={false} />
          <YAxis tickFormatter={formatShortCOP} tick={{ fill: "oklch(0.72 0.02 295)", fontSize: 11 }} axisLine={false} tickLine={false} />
          <Tooltip
            contentStyle={tooltipStyle}
            cursor={{ fill: "oklch(1 0 0 / 4%)" }}
            formatter={(value: any) => [formatCOP(Number(value)), "Valor"]}
          />
          <Bar name="Total Impuesto" dataKey="value" radius={[6, 6, 0, 0]} fill="var(--brand-turquoise)" />
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}