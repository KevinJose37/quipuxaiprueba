import { useState, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { FileCheck2, FileX2, FileText, Timer, Building2, Coins } from "lucide-react";
import { PageShell } from "@/components/dashboard/PageShell";
import { KpiCard } from "@/components/dashboard/KpiCard";
import {
  ProviderBars,
  ValorProviderBars,
  TrendLine,
  FormaPagoPie,
  MedioPagoBars,
  EventosDianBars,
  ImpuestosBars,
} from "@/components/dashboard/Charts";
import { InvoicesTable } from "@/components/dashboard/InvoicesTable";
import { ActivityPanel } from "@/components/dashboard/ActivityPanel";
import { AlertsPanel } from "@/components/dashboard/AlertsPanel";
import { useDashboard } from "@/hooks/use-dashboard";
import { KpiCardLoader, CardLoader, TableCardLoader } from "@/components/dashboard/CardLoader";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "QUIPUX · AI Billing Dashboard" },
      { name: "description", content: "Plataforma de facturación automatizada empresarial — monitoreo en tiempo real del pipeline, validaciones, rechazos e integraciones ERP." },
    ],
  }),
});

const kpiIcons = {
  processed: FileText,
  validated: FileCheck2,
  rejected: FileX2,
  time: Timer,
  total_value: Coins,
  providers: Building2,
} as const;

function Index() {
  const [period, setPeriod] = useState("Últimos 7 días");
  const [lastUpdated, setLastUpdated] = useState<string>("");

  // Calcular fechas basadas en el periodo seleccionado
  const getDates = (p: string) => {
    const today = new Date();
    let start = new Date();
    let end = new Date();
    
    switch(p) {
      case "Hoy":
        // El default ya es hoy
        break;
      case "Últimos 7 días":
        start.setDate(today.getDate() - 7);
        break;
      case "Este mes":
        start.setDate(1);
        break;
      case "Mes anterior":
        start.setMonth(today.getMonth() - 1);
        start.setDate(1);
        end = new Date(today.getFullYear(), today.getMonth(), 0);
        break;
      case "Últimos 3 meses":
        start.setMonth(today.getMonth() - 3);
        break;
      case "Año a la fecha":
        start.setMonth(0, 1);
        break;
    }
    return {
      fechaInicio: start.toISOString().split('T')[0],
      fechaFin: end.toISOString().split('T')[0],
    };
  };

  const { fechaInicio, fechaFin } = getDates(period);
  const { data, isLoading } = useDashboard(fechaInicio, fechaFin);

  useEffect(() => {
    if (data) {
      setLastUpdated(new Date().toLocaleTimeString("es-CO", { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    }
  }, [data]);

  const kpis = data?.kpis ?? [];
  const providerData = data?.provider_data ?? [];
  const trendData = data?.trend_data ?? [];
  const invoices = data?.invoices ?? [];
  const alertasDian = data?.alertas_dian ?? { fecha_ejecucion: "", alertas: {} };
  const eventsPerMin = data?.events_per_min ?? { events_per_min: 0, capacity_pct: 0 };
  const alerts = data?.alerts ?? [];

  // New statistical stats
  const valorProveedorData = data?.valor_proveedor_data ?? [];
  const formaPagoData = data?.forma_pago_data ?? [];
  const medioPagoData = data?.medio_pago_data ?? [];
  const eventosDianData = data?.eventos_dian_data ?? [];
  const impuestosData = data?.impuestos_data ?? [];

  const periods = [
    "Hoy",
    "Últimos 7 días",
    "Este mes",
    "Mes anterior",
    "Últimos 3 meses",
    "Año a la fecha"
  ];

  const segmentedPeriodControl = (
    <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-xl bg-secondary/80 border border-border">
      {periods.map((p) => (
        <button
          key={p}
          onClick={() => setPeriod(p)}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
            period === p
              ? "bg-background text-primary shadow-[0_2px_8px_-2px_oklch(0_0_0/8%)]"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          {p}
        </button>
      ))}
    </div>
  );

  const updateLabel = lastUpdated ? ` · Actualizado a las ${lastUpdated}` : "";

  return (
    <PageShell
      title="Operaciones de facturación"
      subtitle={`Monitoreo del pipeline automatizado · QUIPUX AI · ${new Date().toLocaleDateString("es-CO", { day: "numeric", month: "long", year: "numeric" })}${updateLabel}`}
      actions={segmentedPeriodControl}
    >
      {/* KPI Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {isLoading
          ? Array.from({ length: 6 }, (_, i) => <KpiCardLoader key={i} />)
          : kpis.map((k) => (
              <KpiCard
                key={k.key}
                label={k.label}
                value={k.value}
                delta={k.delta}
                spark={[...k.spark]}
                Icon={kpiIcons[k.key as keyof typeof kpiIcons]}
                color={(k as { color?: string }).color ?? "turquoise"}
              />
            ))}
      </section>

      {/* Main content grid */}
      <section className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-6">
          {/* TrendLine comparative line chart */}
          <div className="grid grid-cols-1 gap-6">
            {isLoading ? <CardLoader className="h-[300px]" /> : <TrendLine data={trendData} />}
          </div>

          {/* Row 1: Provider counts and provider values */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {isLoading ? <CardLoader className="h-[300px]" /> : <ProviderBars data={providerData} />}
            {isLoading ? <CardLoader className="h-[300px]" /> : <ValorProviderBars data={valorProveedorData} />}
          </div>

          {/* Row 2: Formas de pago (Donut) and Medios de pago */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {isLoading ? <CardLoader className="h-[300px]" /> : <FormaPagoPie data={formaPagoData} />}
            {isLoading ? <CardLoader className="h-[300px]" /> : <MedioPagoBars data={medioPagoData} />}
          </div>

          {/* Row 3: Eventos DIAN and Impuestos */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {isLoading ? <CardLoader className="h-[300px]" /> : <EventosDianBars data={eventosDianData} />}
            {isLoading ? <CardLoader className="h-[300px]" /> : <ImpuestosBars data={impuestosData} />}
          </div>

          {/* Recent Invoices Table */}
          {isLoading ? <TableCardLoader className="h-[420px]" /> : <InvoicesTable data={invoices} />}
        </div>

        <div className="xl:col-span-1">
          <div className="xl:sticky xl:top-20 space-y-6">
            {isLoading ? <CardLoader className="h-[300px]" /> : <AlertsPanel alerts={alerts} />}
            {isLoading ? <CardLoader className="h-[520px]" /> : <ActivityPanel alertasDian={alertasDian} eventsPerMin={eventsPerMin} />}
          </div>
        </div>
      </section>
    </PageShell>
  );
}
