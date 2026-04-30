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
  auto: Bot,
  providers: Building2,
} as const;

function Index() {
  const { data, isLoading } = useDashboard();

  const kpis = data?.kpis ?? [];
  const flowStages = data?.flow_stages ?? [];
  const providerData = data?.provider_data ?? [];
  const trendData = data?.trend_data ?? [];
  const invoices = data?.invoices ?? [];
  const activity = data?.activity ?? [];

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
            <div className="flex items-center gap-2">
              <button className="h-9 px-3.5 text-xs rounded-lg border border-border bg-secondary/60 hover:bg-secondary transition">Exportar</button>
              <button className="h-9 px-3.5 text-xs rounded-lg font-semibold text-[oklch(0.2_0.03_295)] hover:opacity-90 transition" style={{ background: "var(--gradient-primary)", boxShadow: "var(--shadow-glow)" }}>
                Nuevo flujo
              </button>
            </div>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center h-40">
              <span className="h-6 w-6 rounded-full border-2 border-primary border-t-transparent animate-spin" />
            </div>
          ) : (
            <>
              <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
                {kpis.map((k) => (
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

              <section className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                <div className="xl:col-span-2 space-y-6">
                  <FlowPipeline stages={flowStages} />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <ProviderBars data={providerData} />
                    <DocTypePie />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <TrendLine data={trendData} />
                    <ErrorHeatmap />
                  </div>
                  <InvoicesTable data={invoices} />
                </div>
                <div className="xl:col-span-1">
                  <div className="xl:sticky xl:top-20">
                    <ActivityPanel data={activity} />
                  </div>
                </div>
              </section>
            </>
          )}
        </main>
      </div>
    </div>
  );
}
