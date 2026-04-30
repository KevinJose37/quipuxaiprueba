import { useQuery } from "@tanstack/react-query";
import { fetchApi } from "@/lib/api";

interface RechazosData {
  stats: { rechazos_hoy: number; severidad_alta: number; reintentos: number; tasa_rechazo: number };
  rejections: Array<{ id: string; provider: string; reason: string; rule: string; date: string; severity: string }>;
  causes: Array<{ rule: string; count: number }>;
}

export function useRechazos() {
  return useQuery<RechazosData>({
    queryKey: ["rechazos"],
    queryFn: () => fetchApi<RechazosData>("/api/rechazos"),
  });
}
