import { useQuery } from "@tanstack/react-query";
import { fetchApi } from "@/lib/api";

interface HealthData {
  status: "ok" | "error" | "degraded";
  services: {
    database: "up" | "down";
    llm_api?: "up" | "down";
  };
  timestamp: string;
}

export function useHealth() {
  return useQuery<HealthData>({
    queryKey: ["health"],
    queryFn: () => fetchApi<HealthData>("/api/health"),
    refetchInterval: 15_000, // Cada 15 segundos
    retry: false, // No reintentar silenciosamente si se cae
  });
}
