import { useQuery } from "@tanstack/react-query";
import { fetchApi } from "@/lib/api";

interface ValidacionesData {
  stats: { reglas_activas: number; total_passed: number; total_failed: number; tasa_exito: number };
  rules: Array<{ code: string; rule: string; passed: number; failed: number; severity: string }>;
}

export function useValidaciones() {
  return useQuery<ValidacionesData>({
    queryKey: ["validaciones"],
    queryFn: () => fetchApi<ValidacionesData>("/api/validaciones"),
  });
}
