import { useQuery } from "@tanstack/react-query";
import { fetchApi } from "@/lib/api";

interface DashboardData {
  kpis: Array<{ key: string; label: string; value: string; delta: number; spark: number[]; color: string }>;
  flow_stages: Array<{ id: string; label: string; count: number; status: string }>;
  provider_data: Array<{ name: string; facturas: number }>;
  doc_type_data: Array<{ name: string; value: number }>;
  trend_data: Array<{ day: string; procesadas: number; validadas: number }>;
  heatmap_data: Array<{ day: string; hour: number; value: number }>;
  invoices: Array<{ id: string; provider: string; type: string; status: string; date: string; time: string }>;
  activity: Array<{ type: string; text: string; time: string }>;
}

export function useDashboard() {
  return useQuery<DashboardData>({
    queryKey: ["dashboard"],
    queryFn: () => fetchApi<DashboardData>("/api/dashboard"),
    refetchInterval: 30_000,
  });
}
