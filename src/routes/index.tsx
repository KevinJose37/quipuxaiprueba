import { createFileRoute } from "@tanstack/react-router";
import { FileCheck2, FileX2, FileText, Timer, Bot, Building2 } from "lucide-react";
import { PageShell } from "@/components/dashboard/PageShell";
import { KpiCard } from "@/components/dashboard/KpiCard";
import { FlowPipeline } from "@/components/dashboard/FlowPipeline";
import { DocTypePie, ErrorHeatmap, ProviderBars, TrendLine } from "@/components/dashboard/Charts";
import { InvoicesTable } from "@/components/dashboard/InvoicesTable";
import { ActivityPanel } from "@/components/dashboard/ActivityPanel";
import { AlertsPanel } from "@/components/dashboard/AlertsPanel";
import { useDashboard } from "@/hooks/use-dashboard";
import { KpiCardLoader, CardLoader, TableCardLoader } from "@/components/dashboard/CardLoader";

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
  const { data, isLoading } = useDashboard();

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

  return (
    <PageShell
      title="Operaciones de facturación"
      subtitle={`Monitoreo del pipeline automatizado · QUIPUX AI · ${new Date().toLocaleDateString("es-CO", { day: "numeric", month: "long", year: "numeric" })}`}
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
