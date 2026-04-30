import { useQuery } from "@tanstack/react-query";
import { fetchApi } from "@/lib/api";

interface LogsData {
  stats: { total_24h: number; info: number; warn: number; error: number };
  logs: Array<{ ts: string; level: string; source: string; msg: string }>;
}

export function useLogs(nivel?: string, busqueda?: string) {
  const params = new URLSearchParams();
  if (nivel) params.set("nivel", nivel);
  if (busqueda) params.set("busqueda", busqueda);

  return useQuery<LogsData>({
    queryKey: ["logs", nivel, busqueda],
    queryFn: () => fetchApi<LogsData>(`/api/logs?${params.toString()}`),
    refetchInterval: 15_000,
  });
}
