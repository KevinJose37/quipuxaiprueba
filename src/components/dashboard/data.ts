export const kpis = [
  { key: "processed", label: "Facturas procesadas hoy", value: 1284, delta: 12.4, spark: [40, 52, 49, 60, 70, 65, 82, 90, 88, 95, 110, 128] },
  { key: "validated", label: "Facturas validadas", value: 1102, delta: 8.7, spark: [30, 42, 50, 55, 60, 68, 72, 80, 84, 90, 96, 102], color: "turquoise" },
  { key: "rejected", label: "Facturas rechazadas", value: 47, delta: -3.2, spark: [12, 9, 14, 11, 10, 8, 9, 7, 6, 8, 7, 5], color: "orange" },
  { key: "time", label: "Tiempo promedio", value: "1.8s", delta: -14.1, spark: [3.2, 3.0, 2.8, 2.6, 2.4, 2.3, 2.1, 2.0, 1.9, 1.85, 1.82, 1.8], color: "purple" },
  { key: "auto", label: "% Automatización", value: "96.4%", delta: 2.1, spark: [88, 89, 90, 91, 92, 93, 94, 94.5, 95, 95.5, 96, 96.4], color: "lime" },
  { key: "providers", label: "Proveedores activos", value: 184, delta: 4.9, spark: [150, 155, 160, 162, 168, 170, 172, 175, 178, 180, 182, 184], color: "turquoise" },
] as const;

export const flowStages = [
  { id: "intake", label: "Entrada", count: 1320, status: "ok" as const },
  { id: "validation", label: "Validación", count: 1284, status: "ok" as const },
  { id: "processing", label: "Procesamiento", count: 1190, status: "warn" as const },
  { id: "erp", label: "ERP", count: 1148, status: "ok" as const },
  { id: "done", label: "Finalizado", count: 1102, status: "ok" as const },
];

export const providerData = [
  { name: "Acme Corp", facturas: 312 },
  { name: "Globex", facturas: 264 },
  { name: "Initech", facturas: 198 },
  { name: "Umbrella", facturas: 175 },
  { name: "Stark Ind.", facturas: 142 },
  { name: "Wayne Ent.", facturas: 118 },
];

export const docTypeData = [
  { name: "Factura A", value: 542 },
  { name: "Factura B", value: 318 },
  { name: "Nota de crédito", value: 184 },
  { name: "Nota de débito", value: 96 },
  { name: "Recibo", value: 144 },
];

export const trendData = Array.from({ length: 14 }, (_, i) => ({
  day: `D${i + 1}`,
  procesadas: 800 + Math.round(Math.sin(i / 2) * 120 + i * 25 + Math.random() * 60),
  validadas: 720 + Math.round(Math.sin(i / 2) * 110 + i * 22 + Math.random() * 50),
}));

export const heatmapData = (() => {
  const days = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];
  const out: { day: string; hour: number; value: number }[] = [];
  for (const d of days) for (let h = 0; h < 24; h++) {
    const base = h >= 9 && h <= 18 ? 6 : 1;
    out.push({ day: d, hour: h, value: Math.max(0, Math.round(Math.random() * base + (h === 14 ? 4 : 0))) });
  }
  return out;
})();

export const invoices = [
  { id: "FAC-2026-00184", provider: "Acme Corp", type: "Factura A", status: "validada", date: "29/04 10:42", time: "1.2s" },
  { id: "FAC-2026-00183", provider: "Globex", type: "Nota de crédito", status: "pendiente", date: "29/04 10:39", time: "—" },
  { id: "FAC-2026-00182", provider: "Initech", type: "Factura B", status: "rechazada", date: "29/04 10:36", time: "0.9s" },
  { id: "FAC-2026-00181", provider: "Umbrella", type: "Factura A", status: "validada", date: "29/04 10:31", time: "1.5s" },
  { id: "FAC-2026-00180", provider: "Stark Ind.", type: "Recibo", status: "error", date: "29/04 10:28", time: "2.4s" },
  { id: "FAC-2026-00179", provider: "Wayne Ent.", type: "Factura A", status: "validada", date: "29/04 10:24", time: "1.1s" },
  { id: "FAC-2026-00178", provider: "Acme Corp", type: "Nota de débito", status: "validada", date: "29/04 10:19", time: "1.7s" },
  { id: "FAC-2026-00177", provider: "Globex", type: "Factura B", status: "pendiente", date: "29/04 10:15", time: "—" },
] as const;

export const activity = [
  { type: "auto", text: "Pipeline #AUT-22 ejecutado correctamente", time: "hace 12s" },
  { type: "log", text: "ERP SAP sincronizado · 142 documentos", time: "hace 48s" },
  { type: "alert", text: "Cola de validación al 78% de capacidad", time: "hace 2m" },
  { type: "error", text: "FAC-2026-00182 · CUIT inválido", time: "hace 4m" },
  { type: "auto", text: "OCR completado · lote L-2284", time: "hace 6m" },
  { type: "log", text: "Nuevo proveedor onboarded: Wayne Ent.", time: "hace 11m" },
  { type: "alert", text: "SLA al 92% · revisar cola Procesamiento", time: "hace 18m" },
  { type: "auto", text: "Reconciliación nocturna programada", time: "hace 24m" },
] as const;