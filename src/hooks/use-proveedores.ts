import { useQuery } from "@tanstack/react-query";
import { fetchApi } from "@/lib/api";

interface ProveedoresData {
  stats: { total: number; activos: number; tasa_promedio: number };
  providers: Array<{ name: string; cuit: string; invoices: number; validRate: number; status: string; erp: string; lastSync: string }>;
}

export function useProveedores() {
  return useQuery<ProveedoresData>({
    queryKey: ["proveedores"],
    queryFn: () => fetchApi<ProveedoresData>("/api/proveedores"),
  });
}
