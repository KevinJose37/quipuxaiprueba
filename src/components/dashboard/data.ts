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

export const allInvoices = Array.from({ length: 28 }, (_, i) => {
  const statuses = ["validada", "pendiente", "rechazada", "validada", "validada", "error"] as const;
  const types = ["Factura A", "Factura B", "Nota de crédito", "Nota de débito", "Recibo"];
  const provs = ["Acme Corp", "Globex", "Initech", "Umbrella", "Stark Ind.", "Wayne Ent.", "Soylent", "Tyrell"];
  const status = statuses[i % statuses.length];
  return {
    id: `FAC-2026-00${(200 - i).toString().padStart(3, "0")}`,
    provider: provs[i % provs.length],
    type: types[i % types.length],
    status,
    amount: Math.round(2000 + Math.random() * 48000),
    date: `29/04 ${String(10 - Math.floor(i / 4)).padStart(2, "0")}:${String((i * 7) % 60).padStart(2, "0")}`,
    time: status === "pendiente" ? "—" : `${(0.8 + Math.random() * 2).toFixed(1)}s`,
  };
});

export const providers = [
  { name: "Acme Corp", cuit: "30-71234567-8", invoices: 312, validRate: 98.4, status: "active", erp: "SAP", lastSync: "hace 2m" },
  { name: "Globex", cuit: "30-70987654-3", invoices: 264, validRate: 96.1, status: "active", erp: "SAP", lastSync: "hace 5m" },
  { name: "Initech", cuit: "30-71112223-4", invoices: 198, validRate: 92.8, status: "review", erp: "Oracle", lastSync: "hace 11m" },
  { name: "Umbrella", cuit: "30-72223334-5", invoices: 175, validRate: 99.1, status: "active", erp: "SAP", lastSync: "hace 1m" },
  { name: "Stark Ind.", cuit: "30-73334445-6", invoices: 142, validRate: 88.2, status: "review", erp: "Dynamics", lastSync: "hace 18m" },
  { name: "Wayne Ent.", cuit: "30-74445556-7", invoices: 118, validRate: 97.5, status: "active", erp: "SAP", lastSync: "hace 3m" },
  { name: "Soylent", cuit: "30-75556667-8", invoices: 96, validRate: 81.0, status: "blocked", erp: "Oracle", lastSync: "hace 4h" },
  { name: "Tyrell", cuit: "30-76667778-9", invoices: 84, validRate: 94.7, status: "active", erp: "Dynamics", lastSync: "hace 7m" },
];

export const validationRules = [
  { code: "VAL-001", rule: "CUIT válido y activo en AFIP", passed: 1248, failed: 12, severity: "high" },
  { code: "VAL-002", rule: "Coincidencia de orden de compra", passed: 1190, failed: 32, severity: "high" },
  { code: "VAL-003", rule: "IVA discriminado correctamente", passed: 1264, failed: 4, severity: "medium" },
  { code: "VAL-004", rule: "Fecha dentro del período fiscal", passed: 1278, failed: 2, severity: "medium" },
  { code: "VAL-005", rule: "Detección de duplicados (hash)", passed: 1281, failed: 3, severity: "high" },
  { code: "VAL-006", rule: "OCR confianza > 95%", passed: 1198, failed: 24, severity: "low" },
  { code: "VAL-007", rule: "Totales y subtotales coherentes", passed: 1272, failed: 6, severity: "high" },
];

export const rejections = [
  { id: "FAC-2026-00182", provider: "Initech", reason: "CUIT inválido en padrón AFIP", rule: "VAL-001", date: "29/04 10:36", severity: "high" },
  { id: "FAC-2026-00171", provider: "Stark Ind.", reason: "Sin OC asociada", rule: "VAL-002", date: "29/04 09:48", severity: "high" },
  { id: "FAC-2026-00164", provider: "Soylent", reason: "Documento duplicado (hash idéntico)", rule: "VAL-005", date: "29/04 09:21", severity: "high" },
  { id: "FAC-2026-00159", provider: "Globex", reason: "Total no coincide con suma de ítems", rule: "VAL-007", date: "29/04 08:55", severity: "high" },
  { id: "FAC-2026-00148", provider: "Initech", reason: "OCR confianza 78% — revisar manual", rule: "VAL-006", date: "29/04 08:14", severity: "medium" },
  { id: "FAC-2026-00139", provider: "Acme Corp", reason: "IVA mal discriminado", rule: "VAL-003", date: "29/04 07:42", severity: "medium" },
  { id: "FAC-2026-00128", provider: "Soylent", reason: "Fecha fuera del período fiscal", rule: "VAL-004", date: "28/04 23:18", severity: "low" },
];

export const logs = [
  { ts: "10:42:18", level: "info", source: "pipeline", msg: "FAC-2026-00184 ingresada por canal email" },
  { ts: "10:42:17", level: "info", source: "ocr", msg: "OCR completado · confianza 99.2%" },
  { ts: "10:42:16", level: "info", source: "validator", msg: "VAL-001..VAL-007 OK" },
  { ts: "10:42:15", level: "info", source: "erp", msg: "Sincronización SAP exitosa · doc #2848193" },
  { ts: "10:39:02", level: "warn", source: "queue", msg: "Cola validación al 78% (1190/1500)" },
  { ts: "10:36:44", level: "error", source: "validator", msg: "FAC-2026-00182 rechazada · VAL-001 CUIT inválido" },
  { ts: "10:31:09", level: "info", source: "pipeline", msg: "Lote L-2284 procesado · 48 documentos" },
  { ts: "10:28:33", level: "error", source: "erp", msg: "Timeout SAP (8s) · reintentando FAC-2026-00180" },
  { ts: "10:24:11", level: "info", source: "ai", msg: "Modelo de clasificación v3.2 inferido en 84ms" },
  { ts: "10:19:50", level: "info", source: "auth", msg: "Token ERP renovado · Oracle Fusion" },
  { ts: "10:15:07", level: "warn", source: "ai", msg: "Drift detectado en proveedor Soylent · revisar" },
  { ts: "10:11:22", level: "info", source: "pipeline", msg: "Webhook proveedor Wayne Ent. recibido" },
  { ts: "10:08:14", level: "info", source: "scheduler", msg: "Job nightly-recon programado para 02:00" },
  { ts: "10:02:55", level: "debug", source: "queue", msg: "Worker #4 idle · reasignando partición" },
] as const;