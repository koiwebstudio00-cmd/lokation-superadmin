"use client";
import { useState } from "react";
import Link from "next/link";
import { Search, ArrowUpRight, Building2 } from "lucide-react";
import type { Tenant } from "@/lib/api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
export function TenantList({ tenants }: { tenants: Tenant[]; publicSiteUrl?: string }) {
  const [search, setSearch] = useState(""), [status, setStatus] = useState("all");
  const filtered = tenants.filter(t => `${t.nombre} ${t.slug}`.toLocaleLowerCase().includes(search.toLocaleLowerCase()) && (status === "all" || status === "published" && t.sitePublished && t.estado === "activo" || status === t.estado));
  return <Card><CardContent className="space-y-5"><div className="flex flex-col gap-3 sm:flex-row"><div className="relative flex-1"><Search className="absolute left-3 top-3 size-4 text-muted-foreground" /><Input aria-label="Buscar inmobiliaria" placeholder="Buscar por nombre o identificador…" className="pl-9" value={search} onChange={e => setSearch(e.target.value)} /></div>
    <Select value={status} onValueChange={setStatus}><SelectTrigger className="w-full sm:w-48" aria-label="Filtrar inmobiliarias"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">Todos los estados</SelectItem><SelectItem value="activo">Activas</SelectItem><SelectItem value="suspendido">Suspendidas</SelectItem><SelectItem value="published">Sitios publicados</SelectItem></SelectContent></Select></div>
    <p className="text-xs text-muted-foreground">{filtered.length} de {tenants.length} inmobiliarias</p>
    <div className="hidden md:block"><Table><TableHeader><TableRow><TableHead>Inmobiliaria</TableHead><TableHead>Estado</TableHead><TableHead>Sitio web</TableHead><TableHead>Usuarios</TableHead><TableHead><span className="sr-only">Detalle</span></TableHead></TableRow></TableHeader><TableBody>
      {filtered.map(t => <TableRow key={t.id}><TableCell><Link className="font-medium hover:underline" href={`/inmobiliarias/${t.id}`}>{t.nombre}</Link><p className="mt-1 text-xs text-muted-foreground">/{t.slug}</p></TableCell><TableCell><Badge variant={t.estado === "activo" ? "secondary" : "destructive"}>{t.estado === "activo" ? "Activa" : "Suspendida"}</Badge></TableCell><TableCell>{t.sitePublished ? "Publicado" : "Borrador"}</TableCell><TableCell>{t._count.users}</TableCell><TableCell className="text-right"><Button asChild variant="ghost" size="sm"><Link href={`/inmobiliarias/${t.id}`}>Ver detalle<ArrowUpRight /></Link></Button></TableCell></TableRow>)}</TableBody></Table></div>
    <div className="space-y-3 md:hidden">{filtered.map(t => <Link key={t.id} href={`/inmobiliarias/${t.id}`} className="flex items-center gap-3 rounded-lg border p-4 hover:bg-muted"><Building2 className="size-5 shrink-0 text-primary" /><div className="min-w-0 flex-1"><p className="truncate font-medium">{t.nombre}</p><p className="mt-1 text-xs text-muted-foreground">{t._count.users} usuarios · {t.sitePublished ? "Publicado" : "Borrador"}</p><Badge className="mt-2" variant={t.estado === "activo" ? "secondary" : "destructive"}>{t.estado === "activo" ? "Activa" : "Suspendida"}</Badge></div><ArrowUpRight className="size-4 shrink-0" /></Link>)}</div>
    {!filtered.length && <p className="py-10 text-center text-sm text-muted-foreground">No hay inmobiliarias que coincidan con la búsqueda.</p>}
  </CardContent></Card>;
}
