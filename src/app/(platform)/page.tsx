import Link from "next/link";
import { ArrowRight, Plus, Building2, ShieldCheck } from "lucide-react";
import { callApi, type Stats } from "@/lib/api";
import { PageHeading } from "@/components/page-heading";
import { Metrics } from "@/components/metrics";
import { Activity } from "@/components/activity";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LiveRefresh } from "@/app/live-refresh";
export default async function Page() {
  const s = await callApi<Stats>("/v1/platform/stats");
  return <><PageHeading title="Tu plataforma, de un vistazo" description="Seguí el crecimiento de Ubikka y acompañá a cada inmobiliaria."><LiveRefresh /><Button asChild><Link href="/inmobiliarias/nueva"><Plus />Nueva inmobiliaria</Link></Button></PageHeading>
    <Metrics items={[{ label: "Inmobiliarias", value: s.totals.tenants, note: `${s.totals.active} activas` }, { label: "Sitios publicados", value: s.totals.published, note: "Disponibles en la web" }, { label: "Usuarios", value: s.totals.users, note: "En las inmobiliarias" }, { label: "Propiedades", value: s.totals.properties, note: "En toda la plataforma" }]} />
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]"><Card><CardHeader className="flex-row items-center justify-between gap-3"><div><CardTitle>Últimas inmobiliarias</CardTitle><CardDescription className="mt-2">Las cuentas incorporadas más recientemente.</CardDescription></div><Button asChild variant="ghost" size="sm"><Link href="/inmobiliarias">Ver todas<ArrowRight /></Link></Button></CardHeader><CardContent className="space-y-1">{s.tenants.slice(0, 5).map(t => <Link key={t.id} href={`/inmobiliarias/${t.id}`} className="flex items-center gap-3 rounded-lg px-2 py-4 hover:bg-muted"><span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-accent text-accent-foreground"><Building2 className="size-5" /></span><div className="min-w-0 flex-1"><p className="truncate text-sm font-medium">{t.nombre}</p><p className="mt-1 text-xs text-muted-foreground">{t._count.users} usuarios · {t._count.properties} propiedades</p></div><Badge variant="outline">{t.estado === "activo" ? "Activa" : "Suspendida"}</Badge></Link>)}{!s.tenants.length && <p className="py-8 text-sm text-muted-foreground">Registrá tu primera inmobiliaria para comenzar.</p>}</CardContent></Card>
    <Card className="bg-accent/40"><CardHeader><ShieldCheck className="mb-3 size-8 text-accent-foreground" /><CardTitle>Un acceso más seguro</CardTitle><CardDescription>Protegé tu cuenta de operador con un autenticador y una passkey.</CardDescription></CardHeader><CardContent className="space-y-5"><p className="text-sm leading-6 text-muted-foreground">Desde tu perfil podés cambiar la contraseña y administrar los métodos de acceso.</p><Button asChild variant="outline"><Link href="/perfil">Configurar mi seguridad<ArrowRight /></Link></Button></CardContent></Card></div><Activity activity={s.activity} /></>;
}
