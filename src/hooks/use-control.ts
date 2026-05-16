import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchApi, patchApi } from "@/lib/api";

export interface ControlItem {
  id_control: number;
  fecha_admision_proveedor: string;
  medio_recepcion: string;
  fecha_entrega_contabilidad: string;
  nombre_recibe_contabilidad: string;
  nit_proveedor: string;
  nombre_proveedor: string;
  numero_factura: string;
  forma_pago: string;
  acuso_recibido: boolean;
  recibido_bien_servicio: boolean;
  aceptacion_empresa: boolean;
  observaciones_entrega: string;
  eventos_dian_notif: string;
}

interface Pagination {
  page: number;
  size: number;
  total_records: number;
  total_pages: number;
}

interface ControlData {
  items: ControlItem[];
  pagination: Pagination;
}

interface ControlUpdateBody {
  fecha_entrega_contabilidad?: string | null;
  nombre_recibe_contabilidad?: string | null;
  forma_pago?: string | null;
  acuso_recibido?: boolean;
  recibido_bien_servicio?: boolean;
  aceptacion_empresa?: boolean;
  observaciones_entrega?: string | null;
  eventos_dian_notif?: string | null;
}

export function useControl(
  fechaInicio: string,
  fechaFin: string,
  page = 1,
  size = 20,
) {
  const params = new URLSearchParams();
  if (fechaInicio) params.set("fecha_inicio", fechaInicio);
  if (fechaFin) params.set("fecha_fin", fechaFin);
  params.set("page", String(page));
  params.set("size", String(size));

  return useQuery<ControlData>({
    queryKey: ["control", fechaInicio, fechaFin, page, size],
    queryFn: () => fetchApi<ControlData>(`/api/control?${params.toString()}`),
  });
}

export function useUpdateControl() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, body }: { id: number; body: ControlUpdateBody }) =>
      patchApi(`/api/control/${id}`, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["control"] });
    },
  });
}
