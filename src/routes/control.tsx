import { useState, useCallback } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Download, ChevronLeft, ChevronRight, Search, Loader2, AlertTriangle, Check } from "lucide-react";
import { PageShell } from "@/components/dashboard/PageShell";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { useControl, useUpdateControl } from "@/hooks/use-control";
import { useUsuariosBasico } from "@/hooks/use-usuarios";
import { StatCardLoader, TableCardLoader } from "@/components/dashboard/CardLoader";
import { API_BASE } from "@/lib/api";
import type { ControlItem } from "@/hooks/use-control";

export const Route = createFileRoute("/control")({
  component: ControlPage,
  head: () => ({
    meta: [
      { title: "Control · QUIPUX" },
      { name: "description", content: "Trazabilidad y control de facturas en el proceso de facturación QUIPUX." },
    ],
  }),
});

/** Devuelve las fechas por defecto: primer y último día del mes actual. */
function defaultDates() {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const lastDay = new Date(y, now.getMonth() + 1, 0).getDate();
  return {
    start: `${y}-${m}-01`,
    end: `${y}-${m}-${String(lastDay).padStart(2, "0")}`,
  };
}

function ControlPage() {
  const defaults = defaultDates();
  const [fechaInicio, setFechaInicio] = useState(defaults.start);
  const [fechaFin, setFechaFin] = useState(defaults.end);
  const [appliedInicio, setAppliedInicio] = useState(defaults.start);
  const [appliedFin, setAppliedFin] = useState(defaults.end);
  const [page, setPage] = useState(1);
  const [downloading, setDownloading] = useState<Record<number, boolean>>({});
  const [downloaded, setDownloaded] = useState<Record<number, boolean>>({});
  const [errorModalOpen, setErrorModalOpen] = useState(false);
  const [errorInvoice, setErrorInvoice] = useState<string | null>(null);

  const { data, isLoading } = useControl(appliedInicio, appliedFin, page, 20);
  const mutation = useUpdateControl();
  const usuariosQuery = useUsuariosBasico();

  const items = data?.items ?? [];
  const pag = data?.pagination ?? { page: 1, size: 20, total_records: 0, total_pages: 0 };

  const handleConsultar = () => {
    setAppliedInicio(fechaInicio);
    setAppliedFin(fechaFin);
    setPage(1);
  };

  const handleExport = () => {
    const params = new URLSearchParams();
    if (appliedInicio) params.set("fecha_inicio", appliedInicio);
    if (appliedFin) params.set("fecha_fin", appliedFin);
    const url = `${API_BASE}/api/exports/excel?${params.toString()}`;
    const a = document.createElement("a");
    a.href = url;
    a.download = "control_facturas.xlsx";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleDownloadPaquete = async (id_factura: number, numero_factura: string) => {
    setDownloading((prev) => ({ ...prev, [id_factura]: true }));
    try {
      const token = localStorage.getItem("token");
      const headers: HeadersInit = {};
      if (token) headers["Authorization"] = `Bearer ${token}`;

      const res = await fetch(`${API_BASE}/api/control/descargar-paquete?id_factura=${id_factura}`, {
        headers,
      });

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${numero_factura}.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      setDownloaded((prev) => ({ ...prev, [id_factura]: true }));
    } catch (error) {
      console.error("Error downloading package:", error);
      setErrorInvoice(numero_factura);
      setErrorModalOpen(true);
    } finally {
      setDownloading((prev) => ({ ...prev, [id_factura]: false }));
    }
  };

  /** Actualiza un campo inline y persiste inmediatamente. */
  const updateField = useCallback(
    (item: ControlItem, field: keyof ControlItem, value: string | boolean) => {
      mutation.mutate({
        id: item.id_control,
        body: {
          fecha_entrega_contabilidad: item.fecha_entrega_contabilidad || null,
          nombre_recibe_contabilidad: item.nombre_recibe_contabilidad || null,
          forma_pago: item.forma_pago || null,
          acuso_recibido: item.acuso_recibido,
          recibido_bien_servicio: item.recibido_bien_servicio,
          aceptacion_empresa: item.aceptacion_empresa,
          observaciones_entrega: item.observaciones_entrega || null,
          eventos_dian_notif: item.eventos_dian_notif || null,
          [field]: value,
        },
      });
    },
    [mutation],
  );

  const filterActions = (
    <>
      <div className="flex items-center gap-2 flex-wrap">
        <label className="text-xs text-muted-foreground">Desde</label>
        <input
          id="control-fecha-inicio"
          type="date"
          value={fechaInicio}
          onChange={(e) => setFechaInicio(e.target.value)}
          className="h-9 px-3 rounded-lg bg-secondary/60 border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        />
        <label className="text-xs text-muted-foreground">Hasta</label>
        <input
          id="control-fecha-fin"
          type="date"
          value={fechaFin}
          onChange={(e) => setFechaFin(e.target.value)}
          className="h-9 px-3 rounded-lg bg-secondary/60 border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        />
        <button
          id="control-consultar"
          onClick={handleConsultar}
          className="h-9 px-4 rounded-lg text-sm font-medium text-[oklch(0.2_0.03_295)] transition hover:opacity-90"
          style={{ background: "var(--gradient-primary)" }}
        >
          <Search className="h-3.5 w-3.5 inline mr-1.5" />
          Consultar
        </button>
      </div>
      <button
        id="control-exportar-excel"
        onClick={handleExport}
        className="h-9 px-4 rounded-lg border border-border bg-secondary/60 text-sm font-medium flex items-center gap-1.5 hover:bg-secondary transition"
      >
        <Download className="h-3.5 w-3.5" />
        Exportar a Excel
      </button>
    </>
  );

  return (
    <PageShell
      title="Control"
      subtitle="Trazabilidad y control de facturas · hoja de control de facturación"
      actions={filterActions}
    >
      {/* Stats summary */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {isLoading
          ? Array.from({ length: 4 }, (_, i) => <StatCardLoader key={i} />)
          : [
              { label: "Total registros", value: pag.total_records, accent: "text-foreground" },
              { label: "Página actual", value: `${pag.page} / ${pag.total_pages || 1}`, accent: "text-brand-turquoise" },
              { label: "Registros en página", value: items.length, accent: "text-brand-lime" },
              { label: "Rango", value: `${appliedInicio} — ${appliedFin}`, accent: "text-muted-foreground" },
            ].map((s) => (
              <div key={s.label} className="rounded-xl border border-border bg-card p-4" style={{ boxShadow: "var(--shadow-card)" }}>
                <div className="text-[11px] uppercase tracking-wider text-muted-foreground">{s.label}</div>
                <div className={`mt-1.5 text-2xl font-semibold tabular-nums ${s.accent}`}>{s.value}</div>
              </div>
            ))}
      </section>

      {/* Table */}
      {isLoading ? (
        <TableCardLoader className="h-[500px]" />
      ) : (
        <div className="rounded-xl border border-border bg-card overflow-hidden" style={{ boxShadow: "var(--shadow-card)" }}>
          <div className="p-4 border-b border-border flex items-center justify-between">
            <div>
              <h3 className="text-[15px] font-semibold tracking-tight">Registros de control</h3>
              <p className="text-xs text-muted-foreground mt-0.5">{pag.total_records} registros encontrados</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm" style={{ minWidth: "1000px" }}>
              <thead>
                <tr className="text-[11px] uppercase tracking-wider text-muted-foreground bg-secondary/30">
                  <th className="text-left font-medium px-4 py-3 whitespace-nowrap">Fecha emisión</th>
                  <th className="text-left font-medium px-3 py-3 whitespace-nowrap">Medio recepción</th>
                  <th className="text-left font-medium px-3 py-3 whitespace-nowrap">Fecha entrega contab.</th>
                  <th className="text-left font-medium px-3 py-3 whitespace-nowrap">Recibe en contab.</th>
                  <th className="text-left font-medium px-3 py-3 whitespace-nowrap">NIT</th>
                  <th className="text-left font-medium px-3 py-3 whitespace-nowrap">Descripción</th>
                  <th className="text-left font-medium px-3 py-3 whitespace-nowrap">No. Factura</th>
                  <th className="text-left font-medium px-3 py-3 whitespace-nowrap">Forma pago</th>
                  <th className="text-center font-medium px-3 py-3 whitespace-nowrap">Acuse recibido (030)</th>
                  <th className="text-center font-medium px-3 py-3 whitespace-nowrap">Recibo bien/serv. (032)</th>
                  <th className="text-center font-medium px-3 py-3 whitespace-nowrap">Aceptación expresa (033)</th>
                  <th className="text-left font-medium px-3 py-3 whitespace-nowrap">Observaciones</th>
                  <th className="text-center font-medium px-3 py-3 whitespace-nowrap">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, i) => (
                  <tr
                    key={item.id_control}
                    className="border-t border-border/60 hover:bg-secondary/30 transition animate-fade-in-up"
                    style={{ animationDelay: `${i * 15}ms` }}
                  >
                    {/* Fecha emisión — solo lectura */}
                    <td className="px-4 py-2.5 tabular-nums text-muted-foreground whitespace-nowrap">{item.fecha_admision_proveedor}</td>

                    {/* Medio recepción — solo lectura */}
                    <td className="px-3 py-2.5 whitespace-nowrap">{item.medio_recepcion}</td>

                    {/* Fecha entrega contabilidad — editable */}
                    <td className="px-3 py-1.5">
                      <input
                        type="date"
                        defaultValue={item.fecha_entrega_contabilidad ? item.fecha_entrega_contabilidad.slice(0, 10) : ""}
                        onBlur={(e) => {
                          if (e.target.value !== item.fecha_entrega_contabilidad?.slice(0, 10)) {
                            updateField(item, "fecha_entrega_contabilidad", e.target.value);
                          }
                        }}
                        className="w-full h-8 px-2 rounded-md bg-secondary/40 border border-transparent text-sm focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-ring transition"
                      />
                    </td>

                    {/* Nombre recibe contabilidad — editable */}
                    <td className="px-3 py-1.5">
                      <select
                        defaultValue={item.nombre_recibe_contabilidad || ""}
                        onChange={(e) => {
                          if (e.target.value !== item.nombre_recibe_contabilidad) {
                            updateField(item, "nombre_recibe_contabilidad", e.target.value);
                          }
                        }}
                        className="w-full h-8 px-2 rounded-md bg-secondary/40 border border-transparent text-sm focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-ring transition text-foreground"
                      >
                        <option value="">— Seleccionar —</option>
                        {usuariosQuery.data?.map(u => (
                          <option key={u.id_usuario} value={u.nombre_completo}>
                            {u.nombre_completo}
                          </option>
                        ))}
                      </select>
                    </td>

                    {/* NIT — solo lectura */}
                    <td className="px-3 py-2.5 font-mono text-[12px] tabular-nums">{item.nit_proveedor}</td>

                    {/* Descripción — solo lectura */}
                    <td className="px-3 py-2.5 max-w-[200px] truncate" title={item.nombre_proveedor}>{item.nombre_proveedor}</td>

                    {/* No. Factura — solo lectura */}
                    <td className="px-3 py-2.5 font-mono text-[12px]">{item.numero_factura}</td>

                    {/* Forma de pago — solo lectura */}
                    <td className="px-3 py-1.5">
                      <div className="w-full h-8 px-2 flex items-center rounded-md bg-secondary/20 border border-transparent text-sm text-muted-foreground cursor-not-allowed truncate" title={item.forma_pago}>
                        {item.forma_pago || "—"}
                      </div>
                    </td>

                    {/* Acuse de recibido — boolean toggle */}
                    <td className="px-3 py-2.5 text-center">
                      <button
                        disabled={item.forma_pago === 'CONTADO'}
                        onClick={() => updateField(item, "acuso_recibido", !item.acuso_recibido)}
                        className={`inline-flex h-5 w-9 shrink-0 items-center rounded-full border-2 border-transparent transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background ${
                          item.forma_pago === 'CONTADO' ? "opacity-40 cursor-not-allowed" : "cursor-pointer"
                        } ${
                          item.acuso_recibido ? "bg-brand-turquoise" : "bg-secondary"
                        }`}
                      >
                        <span
                          className={`pointer-events-none block h-4 w-4 rounded-full bg-white shadow-lg ring-0 transition-transform ${
                            item.acuso_recibido ? "translate-x-4" : "translate-x-0"
                          }`}
                        />
                      </button>
                    </td>

                    {/* Recibo de bien y/o servicio — boolean toggle */}
                    <td className="px-3 py-2.5 text-center">
                      <button
                        disabled={item.forma_pago === 'CONTADO'}
                        onClick={() => updateField(item, "recibido_bien_servicio", !item.recibido_bien_servicio)}
                        className={`inline-flex h-5 w-9 shrink-0 items-center rounded-full border-2 border-transparent transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background ${
                          item.forma_pago === 'CONTADO' ? "opacity-40 cursor-not-allowed" : "cursor-pointer"
                        } ${
                          item.recibido_bien_servicio ? "bg-brand-turquoise" : "bg-secondary"
                        }`}
                      >
                        <span
                          className={`pointer-events-none block h-4 w-4 rounded-full bg-white shadow-lg ring-0 transition-transform ${
                            item.recibido_bien_servicio ? "translate-x-4" : "translate-x-0"
                          }`}
                        />
                      </button>
                    </td>

                    {/* Aceptación expresa — boolean toggle */}
                    <td className="px-3 py-2.5 text-center">
                      <button
                        disabled={item.forma_pago === 'CONTADO'}
                        onClick={() => updateField(item, "aceptacion_empresa", !item.aceptacion_empresa)}
                        className={`inline-flex h-5 w-9 shrink-0 items-center rounded-full border-2 border-transparent transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background ${
                          item.forma_pago === 'CONTADO' ? "opacity-40 cursor-not-allowed" : "cursor-pointer"
                        } ${
                          item.aceptacion_empresa ? "bg-brand-turquoise" : "bg-secondary"
                        }`}
                      >
                        <span
                          className={`pointer-events-none block h-4 w-4 rounded-full bg-white shadow-lg ring-0 transition-transform ${
                            item.aceptacion_empresa ? "translate-x-4" : "translate-x-0"
                          }`}
                        />
                      </button>
                    </td>

                    {/* Observaciones — editable */}
                    <td className="px-3 py-1.5">
                      <input
                        type="text"
                        defaultValue={item.observaciones_entrega}
                        onBlur={(e) => {
                          if (e.target.value !== item.observaciones_entrega) {
                            updateField(item, "observaciones_entrega", e.target.value);
                          }
                        }}
                        className="w-full h-8 px-2 rounded-md bg-secondary/40 border border-transparent text-sm focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-ring transition min-w-[140px]"
                        placeholder="—"
                      />
                    </td>

                    {/* Acciones */}
                    <td className="px-3 py-1.5 text-center">
                      <button
                        onClick={() => handleDownloadPaquete(item.id_factura, item.numero_factura)}
                        disabled={downloading[item.id_factura]}
                        title="Descargar paquete (XML/PDF)"
                        className={`h-8 w-8 inline-flex items-center justify-center rounded-md border border-border transition disabled:opacity-50 ${
                          downloaded[item.id_factura]
                            ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/30 hover:bg-emerald-500/20"
                            : "bg-secondary/40 hover:bg-emerald-500/10 hover:text-emerald-500 hover:border-emerald-500/30"
                        }`}
                      >
                        {downloading[item.id_factura] ? (
                          <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                        ) : downloaded[item.id_factura] ? (
                          <Check className="h-4 w-4" />
                        ) : (
                          <Download className="h-4 w-4 text-muted-foreground hover:text-emerald-500" />
                        )}
                      </button>
                    </td>
                  </tr>
                ))}

                {items.length === 0 && (
                  <tr>
                    <td colSpan={12} className="px-4 py-12 text-center text-muted-foreground">
                      No se encontraron registros para el rango de fechas seleccionado.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Paginación */}
          {pag.total_pages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-border">
              <div className="text-xs text-muted-foreground tabular-nums">
                Mostrando {(pag.page - 1) * pag.size + 1}–{Math.min(pag.page * pag.size, pag.total_records)} de {pag.total_records}
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  id="control-prev-page"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="h-8 w-8 rounded-lg border border-border bg-secondary/60 flex items-center justify-center disabled:opacity-40 hover:bg-secondary transition"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <span className="text-sm tabular-nums font-medium px-2">{pag.page}</span>
                <button
                  id="control-next-page"
                  disabled={page >= pag.total_pages}
                  onClick={() => setPage((p) => p + 1)}
                  className="h-8 w-8 rounded-lg border border-border bg-secondary/60 flex items-center justify-center disabled:opacity-40 hover:bg-secondary transition"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Error Modal */}
      <Dialog open={errorModalOpen} onOpenChange={setErrorModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex items-center gap-2 text-destructive mb-2">
              <AlertTriangle className="h-5 w-5" />
              <DialogTitle>Paquete no disponible</DialogTitle>
            </div>
            <DialogDescription className="text-sm leading-relaxed">
              No se pudo descargar el paquete de la factura <strong>{errorInvoice}</strong>. 
              <br /><br />
              Esto generalmente ocurre cuando el archivo ZIP aún no ha sido generado o el archivo original no fue almacenado correctamente en el repositorio S3 durante el proceso de ingesta.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4">
            <button
              onClick={() => setErrorModalOpen(false)}
              className="h-9 px-4 rounded-lg bg-secondary text-foreground text-sm font-medium hover:bg-secondary/80 transition"
            >
              Entendido
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageShell>
  );
}
