"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Pencil, RefreshCw } from "lucide-react";
import type { Operator } from "@/lib/api";
import { platformMutation } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { ConfirmAction } from "./confirm-action";
import { Feedback } from "./feedback";
import { generatePassword } from "@/lib/password";
function Editor({ user }: { user?: Operator }) {
  const [open, setOpen] = useState(false), [pending, setPending] = useState(false), [error, setError] = useState<string>(), [password, setPassword] = useState(""); const router = useRouter();
  return <Dialog open={open} onOpenChange={setOpen}><DialogTrigger asChild><Button variant={user ? "outline" : "default"} size={user ? "sm" : "default"}>{user ? <Pencil /> : <Plus />}{user ? "Editar" : "Nuevo superadministrador"}</Button></DialogTrigger><DialogContent><DialogHeader><DialogTitle>{user ? "Editar superadministrador" : "Nuevo superadministrador"}</DialogTitle><DialogDescription>{user ? "Actualizá los datos del operador." : "Esta cuenta tendrá acceso a la administración de toda la plataforma."}</DialogDescription></DialogHeader>
    <form className="space-y-5" onSubmit={async e => { e.preventDefault(); setPending(true); setError(undefined); const data = new FormData(e.currentTarget);
      const result = await platformMutation(`/v1/platform/operators${user ? `/${user.id}` : ""}`, user ? "PATCH" : "POST", { nombre: data.get("nombre"), email: data.get("email"), ...(!user ? { password } : {}) }); setPending(false);
      if (result.error) setError(result.error); else { setOpen(false); setPassword(""); router.refresh(); }
    }}><Label className="grid gap-2">Nombre<Input name="nombre" defaultValue={user?.nombre} required minLength={2} maxLength={120} /></Label><Label className="grid gap-2">Email<Input name="email" type="email" defaultValue={user?.email} required /></Label>
      {!user && <div className="space-y-2"><Label htmlFor="operator-password">Contraseña inicial</Label><Input id="operator-password" type="text" autoComplete="new-password" value={password} onChange={e => setPassword(e.target.value)} required minLength={12} maxLength={72} /><Button type="button" variant="outline" size="sm" onClick={() => setPassword(generatePassword())}><RefreshCw />Generar contraseña</Button><p className="text-xs text-muted-foreground">Compartila por un canal privado. El operador podrá cambiarla desde su perfil.</p></div>}
      <Feedback error={error} /><Button disabled={pending} className="w-full">{pending ? "Guardando…" : "Guardar"}</Button>
    </form></DialogContent></Dialog>;
}
export function OperatorManager({ users, currentId }: { users: Operator[]; currentId: string }) {
  const [search, setSearch] = useState(""); const filtered = users.filter(u => `${u.nombre} ${u.email}`.toLowerCase().includes(search.toLowerCase()));
  return <div className="space-y-5"><div className="flex flex-col gap-3 sm:flex-row"><Input aria-label="Buscar superadministrador" placeholder="Buscar nombre o email…" value={search} onChange={e => setSearch(e.target.value)} className="sm:max-w-sm" /><div className="sm:ml-auto"><Editor /></div></div>
    <div className="grid gap-4 xl:grid-cols-2">{filtered.map(user => <Card key={user.id}><CardContent className="space-y-5"><div className="flex items-start justify-between gap-3"><div className="min-w-0"><p className="font-medium">{user.nombre}{user.id === currentId && " (vos)"}</p><p className="mt-1 break-all text-sm text-muted-foreground">{user.email}</p></div><Badge variant={user.estado === "activo" ? "secondary" : "destructive"}>{user.estado === "activo" ? "Activo" : "Suspendido"}</Badge></div>
      <div className="flex flex-wrap gap-2"><Editor user={user} /><ConfirmAction label={user.estado === "activo" ? "Suspender" : "Reactivar"} disabled={user.id === currentId} description="Cambiará el acceso de este operador a la plataforma y se cerrarán sus sesiones." path={`/v1/platform/operators/${user.id}`} body={{ estado: user.estado === "activo" ? "inactivo" : "activo" }} /><ConfirmAction label="Eliminar" disabled={user.id === currentId} destructive method="DELETE" path={`/v1/platform/operators/${user.id}`} description="La cuenta perderá el acceso y dejará de aparecer en el listado. Su historial administrativo se conservará." /></div>
    </CardContent></Card>)}</div>{!filtered.length && <p className="py-8 text-center text-sm text-muted-foreground">No se encontraron superadministradores.</p>}</div>;
}
