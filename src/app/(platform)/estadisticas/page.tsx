import { callApi, type Stats } from "@/lib/api";
import { PageHeading } from "@/components/page-heading";
import { Metrics } from "@/components/metrics";
import { LiveRefresh } from "@/app/live-refresh";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import Link from "next/link";
function Distribution({ title, rows }: { title: string; rows: { estado: string; _count: number }[] }) {
  const total = rows.reduce((sum, r) => sum + r._count, 0);
  return <Card><CardHeader><CardTitle>{title}</CardTitle></CardHeader><CardContent className="space-y-4">{rows.map(r => <div key={r.estado}><div className="mb-2 flex justify-between text-sm"><span className="capitalize">{r.estado.replaceAll("_", " ")}</span><span className="font-mono">{r._count}</span></div><div className="h-2 rounded-full bg-muted"><div className="h-2 rounded-full bg-primary" style={{ width: `${total ? r._count / total * 100 : 0}%` }} /></div></div>)}{!rows.length && <p className="text-sm text-muted-foreground">Todavía no hay datos.</p>}</CardContent></Card>;
}
export default async function Page() {
  const s = await callApi<Stats>("/v1/platform/stats");
  const now = new Date(s.generatedAt); const months = Array.from({ length: 12 }, (_, i) => { const d = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - 11 + i, 1)); const key = d.toISOString().slice(0, 7); return { key, label: d.toLocaleDateString("es-AR", { month: "short", year: "2-digit", timeZone: "UTC" }), count: s.growth.find(g => g.month === key)?.tenants ?? 0 }; });
  const max = Math.max(1, ...months.map(m => m.count));
  return <><PageHeading title="Estadísticas" description="Actividad agregada de toda la plataforma, actualizada desde los datos reales."><LiveRefresh /></PageHeading><Metrics items={[{ label: "Inmobiliarias activas", value: s.totals.active }, { label: "Sitios publicados", value: s.totals.published }, { label: "Consultas", value: s.totals.leads }, { label: "Conversaciones", value: s.totals.conversations }]} />
    <Card><CardHeader><CardTitle>Registro de inmobiliarias</CardTitle><CardDescription>Altas por mes durante los últimos 12 meses.</CardDescription></CardHeader><CardContent><div className="overflow-x-auto"><div className="flex min-w-[540px] items-end gap-3" role="img" aria-label={months.map(m => `${m.label}: ${m.count} altas`).join(", ")}>{months.map(m => <div key={m.key} className="flex flex-1 flex-col items-center gap-2"><span className="font-mono text-xs">{m.count}</span><div className="flex h-36 w-full items-end"><div className="w-full rounded-t bg-primary" style={{ height: `${Math.max(2, m.count / max * 100)}%` }} /></div><span className="whitespace-nowrap text-[10px] text-muted-foreground">{m.label}</span></div>)}</div></div></CardContent></Card>
    <div className="grid gap-6 lg:grid-cols-2"><Distribution title="Propiedades por estado" rows={s.propertyStates} /><Distribution title="Consultas por estado" rows={s.leadStates} /></div>
    <Card><CardHeader><CardTitle>Actividad por inmobiliaria</CardTitle><CardDescription>Totales acumulados de propiedades y consultas.</CardDescription></CardHeader><CardContent className="divide-y">{s.tenants.map(t => <div key={t.id} className="flex flex-col justify-between gap-2 py-3 text-sm sm:flex-row"><Link className="font-medium hover:underline" href={`/inmobiliarias/${t.id}`}>{t.nombre}</Link><span className="text-muted-foreground">{t._count.properties} propiedades · {t._count.leads} consultas · {t._count.conversations} conversaciones</span></div>)}</CardContent></Card></>;
}
