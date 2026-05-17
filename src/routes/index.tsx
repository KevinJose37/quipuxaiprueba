import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { FileCheck2, FileX2, FileText, Timer, Bot, Building2, Calendar, ChevronDown } from "lucide-react";
import { PageShell } from "@/components/dashboard/PageShell";
import { KpiCard } from "@/components/dashboard/KpiCard";
import { FlowPipeline } from "@/components/dashboard/FlowPipeline";
import { DocTypePie, ErrorHeatmap, ProviderBars, TrendLine } from "@/components/dashboard/Charts";
import { InvoicesTable } from "@/components/dashboard/InvoicesTable";
import { ActivityPanel } from "@/components/dashboard/ActivityPanel";
import { AlertsPanel } from "@/components/dashboard/AlertsPanel";
import { useDashboard } from "@/hooks/use-dashboard";
import { KpiCardLoader, CardLoader, TableCardLoader } from "@/components/dashboard/CardLoader";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const Route = createFileRoute("/")(  {
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
  auto: Bot,
  providers: Building2,
} as const;

function Index() {
  const [period, setPeriod] = useState("Últimos 7 días");

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

  const kpis = data?.kpis ?? [];
  const flowStages = data?.flow_stages ?? [];
  const flowIndicators = data?.flow_indicators ?? { sla: "—", atascadas: "—", cola: "—" };
  const providerData = data?.provider_data ?? [];
  const docTypeData = data?.doc_type_data ?? [];
  const trendData = data?.trend_data ?? [];
  const heatmapData = data?.heatmap_data ?? [];
  const invoices = data?.invoices ?? [];
  const alertasDian = data?.alertas_dian ?? { fecha_ejecucion: "", alertas: {} };
  const eventsPerMin = data?.events_per_min ?? { events_per_min: 0, capacity_pct: 0 };
  const alerts = data?.alerts ?? [];

  const periods = [
    "Hoy",
    "Últimos 7 días",
    "Este mes",
    "Mes anterior",
    "Últimos 3 meses",
    "Año a la fecha"
  ];

  const dashboardActions = (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="inline-flex items-center gap-2 h-9 px-3 rounded-lg border border-border bg-card hover:bg-secondary/60 text-sm font-medium transition shadow-sm">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          {period}
          <ChevronDown className="h-3 w-3 opacity-50 ml-1" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48 bg-secondary border-border shadow-xl">
        {periods.map(p => (
          <DropdownMenuItem 
            key={p} 
            onClick={() => setPeriod(p)}
            className={`cursor-pointer ${period === p ? "bg-primary/10 text-primary font-medium" : ""}`}
          >
            {p}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );

  return (
    <PageShell
      title="Operaciones de facturación"
      subtitle={`Monitoreo del pipeline automatizado · QUIPUX AI · ${new Date().toLocaleDateString("es-CO", { day: "numeric", month: "long", year: "numeric" })}`}
      actions={dashboardActions}
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
          {isLoading ? <CardLoader className="h-[280px]" /> : <FlowPipeline stages={flowStages} indicators={flowIndicators} />}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {isLoading ? <CardLoader className="h-[300px]" /> : <ProviderBars data={providerData} />}
            {isLoading ? <CardLoader className="h-[300px]" /> : <DocTypePie data={docTypeData} />}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {isLoading ? <CardLoader className="h-[300px]" /> : <TrendLine data={trendData} />}
            {isLoading ? <CardLoader className="h-[300px]" /> : <ErrorHeatmap data={heatmapData} />}
          </div>

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
