import Link from "next/link";
import { notFound } from "next/navigation";
import { ApiError, callApi, type TenantDetail } from "@/lib/api";
import { PageHeading } from "@/components/page-heading";
import { Metrics } from "@/components/metrics";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ConfirmAction } from "@/components/confirm-action";
import { ResendInvite } from "@/app/resend-invite";
import { Activity } from "@/components/activity";
export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params; if (!/^[a-f0-9-]{36}$/i.test(id)) notFound();
  let t: TenantDetail; try { t = (await callApi<{ tenant: TenantDetail }>(`/v1/platform/tenants/${id}`)).tenant; } catch (e) { if (e instanceof ApiError && e.status === 404) notFound(); throw e; }
  const active = t.estado === "activo";
  return <><Button asChild variant="ghost" size="sm"><Link href="/inmobiliarias">← Inmobiliarias</Link></Button><PageHeading title={t.nombre} description={`/${t.slug} · Registrada el ${new Date(t.createdAt).toLocaleDateString("es-AR", { timeZone: "America/Argentina/Tucuman" })}`}>
    <ConfirmAction label={active ? "Suspender" : "Reactivar"} destructive={active} description={active ? "Se cerrarán sus sesiones y el sitio dejará de estar disponible mientras dure la suspensión." : "La inmobiliaria podrá volver a ingresar a la plataforma."} path={`/v1/tenants/${id}`} body={{ estado: active ? "suspendido" : "activo" }} />
  </PageHeading><Metrics items={[{ label: "Usuarios", value: t._count.users }, { label: "Propiedades", value: t._count.properties }, { label: "Consultas", value: t._count.leads }, { label: "Conversaciones", value: t._count.conversations }]} />
    <div className="grid gap-6 lg:grid-cols-2"><Card><CardHeader><CardTitle>Estado de la cuenta</CardTitle></CardHeader><CardContent className="space-y-5"><div className="flex flex-wrap gap-2"><Badge variant={active ? "secondary" : "destructive"}>{active ? "Activa" : "Suspendida"}</Badge><Badge variant="outline">Sitio {t.sitePublished ? "publicado" : "en borrador"}</Badge><Badge variant="outline">Agente IA {t.agentEnabled ? "activo" : "desactivado"}</Badge></div>
    {t.sitePublished && active && <Button asChild variant="outline"><a href={`${process.env.PUBLIC_SITE_URL ?? "http://localhost:3002"}/s/${encodeURIComponent(t.slug)}`} target="_blank" rel="noreferrer">Visitar sitio ↗</a></Button>}
    {!t.users.length && active && <ResendInvite id={id} />}</CardContent></Card><Card><CardHeader><CardTitle>Usuarios de la inmobiliaria</CardTitle></CardHeader><CardContent className="space-y-4">{t.users.map(u => <div key={u.id} className="flex flex-wrap items-center justify-between gap-2 border-b pb-3 last:border-0"><div className="min-w-0"><p className="font-medium">{u.nombre}</p><p className="break-all text-sm text-muted-foreground">{u.email}</p></div><Badge variant="secondary">{u.rol} · {u.estado}</Badge></div>)}{!t.users.length && <p className="text-sm text-muted-foreground">Esperando que se acepte la invitación.</p>}</CardContent></Card></div><Activity activity={t.activity} /></>;
}
