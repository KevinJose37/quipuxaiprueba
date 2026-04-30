import { useQuery } from "@tanstack/react-query";
import { fetchApi } from "@/lib/api";

interface FacturasData {
  stats: { total: number; validadas: number; pendientes: number; rechazadas: number; monto_total: number };
  invoices: Array<{ id: string; provider: string; type: string; status: string; amount: number; date: string; time: string }>;
}

export function useFacturas(estado?: string, busqueda?: string, pagina = 1) {
  const params = new URLSearchParams();
  if (estado) params.set("estado", estado);
  if (busqueda) params.set("busqueda", busqueda);
  params.set("pagina", String(pagina));

  return useQuery<FacturasData>({
    queryKey: ["facturas", estado, busqueda, pagina],
    queryFn: () => fetchApi<FacturasData>(`/api/facturas?${params.toString()}`),
  });
}
