import { createFileRoute } from "@tanstack/react-router";
import { FileCheck2, FileX2, FileText, Timer, Bot, Building2 } from "lucide-react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Header } from "@/components/dashboard/Header";
import { KpiCard } from "@/components/dashboard/KpiCard";
import { FlowPipeline } from "@/components/dashboard/FlowPipeline";
import { DocTypePie, ErrorHeatmap, ProviderBars, TrendLine } from "@/components/dashboard/Charts";
import { InvoicesTable } from "@/components/dashboard/InvoicesTable";
import { ActivityPanel } from "@/components/dashboard/ActivityPanel";
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
  const activity = data?.activity ?? [];
  const eventsPerMin = data?.events_per_min ?? { events_per_min: 0, capacity_pct: 0 };

  return (
    <div className="flex min-h-screen w-full bg-background text-foreground">
      <Sidebar />
      <div className="flex-1 min-w-0 flex flex-col">
        <Header />
        <main className="flex-1 p-6 lg:p-8 space-y-6 overflow-x-hidden">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
            <div>
              <h1 className="text-[26px] font-semibold tracking-tight">Operaciones de facturación</h1>
              <p className="text-sm text-muted-foreground mt-1">
                Monitoreo del pipeline automatizado · QUIPUX AI · {new Date().toLocaleDateString("es-CO", { day: "numeric", month: "long", year: "numeric" })}
              </p>
            </div>

          </div>

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
              <div className="xl:sticky xl:top-20">
                {isLoading ? <CardLoader className="h-[520px]" /> : <ActivityPanel data={activity} eventsPerMin={eventsPerMin} />}
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
