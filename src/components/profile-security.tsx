"use client";
import { PasswordInput } from "@/components/ui/password-input";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { startRegistration, type PublicKeyCredentialCreationOptionsJSON } from "@simplewebauthn/browser";
import { QRCodeSVG } from "qrcode.react";
import { Fingerprint, KeyRound, ShieldCheck, RefreshCw } from "lucide-react";
import { platformMutation, signOut } from "@/app/actions";
import type { Me, Security } from "@/lib/api";
import { generatePassword } from "@/lib/password";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel } from "@/components/ui/alert-dialog";
import { Feedback } from "./feedback";
type Mode = "password" | "2fa" | "disable" | "passkey" | "remove" | null;
export function ProfileSecurity({ me, security }: { me: Me; security: Security }) {
  const router = useRouter(); const [mode, setMode] = useState<Mode>(null), [pending, setPending] = useState(false), [error, setError] = useState<string>(), [success, setSuccess] = useState<string>();
  const [newPassword, setNewPassword] = useState(""), [setup, setSetup] = useState<{ secret: string; uri: string }>(), [recovery, setRecovery] = useState<string[]>(), [removeId, setRemoveId] = useState("");
  const [reauthenticate, setReauthenticate] = useState(false);
  const open = (value: Mode) => { setMode(value); setError(undefined); setSuccess(undefined); setSetup(undefined); setNewPassword(""); };
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); setPending(true); setError(undefined); const f = new FormData(e.currentTarget);
    const proof = { password: String(f.get("password") ?? ""), otp: String(f.get("otp") ?? "") || undefined };
    try {
      let path = "", body: unknown = proof;
      if (mode === "password") { path = "password"; body = { ...proof, newPassword }; }
      if (mode === "2fa") { path = setup ? "2fa/enable" : "2fa/setup"; body = setup ? { code: f.get("code") } : proof; }
      if (mode === "disable") path = "2fa/disable";
      if (mode === "remove") { path = "passkeys/remove"; body = { ...proof, id: removeId }; }
      if (mode === "passkey") {
        const optionsResult = await platformMutation("/v1/platform/security/passkeys/options", "POST", proof);
        if (optionsResult.error) throw new Error(optionsResult.error);
        const options = optionsResult.data as { options: PublicKeyCredentialCreationOptionsJSON; challengeId: string };
        const response = await startRegistration({ optionsJSON: options.options });
        path = "passkeys/verify"; body = { response, challengeId: options.challengeId, nombre: f.get("nombre") };
      }
      const result = await platformMutation(`/v1/platform/security/${path}`, "POST", body);
      if (result.error) throw new Error(result.error);
      if (path === "2fa/setup") setSetup(result.data as { secret: string; uri: string });
      else if (path === "2fa/enable") { setRecovery((result.data as { recoveryCodes: string[] }).recoveryCodes); setMode(null); }
      else if (["password", "2fa/disable", "passkeys/remove"].includes(path)) { setMode(null); setReauthenticate(true); }
      else { setMode(null); setSuccess("Passkey registrada correctamente."); router.refresh(); }
    } catch (e) { setError(e instanceof Error ? e.message : "No pudimos completar la operación."); }
    finally { setPending(false); }
  }
  const title = mode === "password" ? "Cambiar contraseña" : mode === "2fa" ? "Activar autenticación en dos pasos" : mode === "disable" ? "Desactivar 2FA" : mode === "remove" ? "Eliminar passkey" : "Registrar passkey";
  return <div className="space-y-6"><Card><CardHeader><CardTitle>Datos personales</CardTitle><CardDescription>Tu identidad como operador de Ubikka.</CardDescription></CardHeader><CardContent><form className="grid items-end gap-4 sm:grid-cols-[1fr_1fr_auto]" onSubmit={async e => { e.preventDefault(); setPending(true); const f = new FormData(e.currentTarget); const result = await platformMutation("/v1/users/me", "PATCH", { nombre: f.get("nombre") }); setPending(false); setError(result.error); setSuccess(result.error ? undefined : "Perfil actualizado."); router.refresh(); }}><Label className="grid gap-2">Nombre<Input name="nombre" defaultValue={me.nombre} required minLength={2} maxLength={120} /></Label><Label className="grid gap-2">Email<Input value={me.email} readOnly /></Label><Button disabled={pending}>Guardar perfil</Button></form></CardContent></Card>
    <Feedback error={!mode ? error : undefined} success={success} />
    <div className="grid gap-6 lg:grid-cols-2"><Card><CardHeader><KeyRound className="mb-2 size-6 text-primary" /><CardTitle>Contraseña</CardTitle><CardDescription>Usá una contraseña única de al menos 12 caracteres.</CardDescription></CardHeader><CardContent><Button variant="outline" onClick={() => open("password")}>Cambiar contraseña</Button></CardContent></Card>
      <Card><CardHeader><ShieldCheck className="mb-2 size-6 text-primary" /><CardTitle>Autenticación en dos pasos</CardTitle><CardDescription>Un código temporal de tu app autenticadora protege el ingreso con contraseña.</CardDescription></CardHeader><CardContent className="space-y-4"><Badge variant={security.twoFactorEnabled ? "default" : "secondary"}>{security.twoFactorEnabled ? "Activada" : "Sin configurar"}</Badge>{security.twoFactorEnabled && <p className="text-sm text-muted-foreground">{security.recoveryCodesRemaining} códigos de recuperación disponibles.</p>}<div><Button variant="outline" onClick={() => open(security.twoFactorEnabled ? "disable" : "2fa")}>{security.twoFactorEnabled ? "Desactivar 2FA" : "Configurar 2FA"}</Button></div></CardContent></Card></div>
    <Card><CardHeader><Fingerprint className="mb-2 size-6 text-primary" /><CardTitle>Passkeys</CardTitle><CardDescription>Ingresá con la biometría o el PIN de tu dispositivo.</CardDescription></CardHeader><CardContent className="space-y-5">{security.passkeys.map(key => <div key={key.id} className="flex flex-wrap items-center justify-between gap-3 border-b pb-3"><div><p className="font-medium">{key.nombre}</p><p className="text-xs text-muted-foreground">Registrada el {new Date(key.createdAt).toLocaleDateString("es-AR")}</p></div><Button variant="outline" size="sm" onClick={() => { setRemoveId(key.id); open("remove"); }}>Eliminar</Button></div>)}{!security.passkeys.length && <p className="text-sm text-muted-foreground">Todavía no registraste una passkey.</p>}<Button variant="outline" onClick={() => open("passkey")}><Fingerprint />Agregar passkey</Button></CardContent></Card>
    <Dialog open={mode !== null && mode !== "disable" && mode !== "remove"} onOpenChange={value => { if (!value && !pending) setMode(null); }}><DialogContent className="max-h-[90dvh] overflow-y-auto"><DialogHeader><DialogTitle>{title}</DialogTitle><DialogDescription>{setup ? "Escaneá el QR con tu autenticador y confirmá el código." : "Confirmá tu identidad para continuar."}</DialogDescription></DialogHeader><form onSubmit={submit} className="space-y-4">
      {setup ? <><div className="mx-auto w-fit rounded-lg bg-white p-3"><QRCodeSVG value={setup.uri} size={180} /></div><p className="text-xs text-muted-foreground">También podés ingresar esta clave manualmente:</p><code className="block break-all rounded bg-muted p-3 text-xs">{setup.secret}</code><Label className="grid gap-2">Código de 6 dígitos<Input name="code" inputMode="numeric" autoComplete="one-time-code" pattern="[0-9]{6}" maxLength={6} required /></Label></> : <><div className="space-y-2"><Label htmlFor="security-password">Contraseña actual</Label><PasswordInput id="security-password" name="password" required autoComplete="current-password" /></div>{security.twoFactorEnabled && <Label className="grid gap-2">Código de autenticación o recuperación<Input name="otp" required autoComplete="one-time-code" /></Label>}</>}
      {mode === "password" && <div className="space-y-2"><Label htmlFor="new-password">Nueva contraseña</Label><PasswordInput id="new-password" autoComplete="new-password" value={newPassword} onChange={e => setNewPassword(e.target.value)} required minLength={12} maxLength={72} /><Button type="button" variant="outline" size="sm" onClick={() => setNewPassword(generatePassword())}><RefreshCw />Generar nueva</Button><p className="text-xs text-muted-foreground">Al guardarla se cerrarán todas tus sesiones.</p></div>}
      {mode === "passkey" && <Label className="grid gap-2">Nombre del dispositivo<Input name="nombre" placeholder="Mi MacBook" required maxLength={100} /></Label>}
      <Feedback error={error} /><Button disabled={pending} className="w-full">{pending ? "Procesando…" : setup ? "Confirmar activación" : "Continuar"}</Button></form></DialogContent></Dialog>
    <AlertDialog open={mode === "disable" || mode === "remove"} onOpenChange={value => { if (!value && !pending) setMode(null); }}><AlertDialogContent><AlertDialogHeader><AlertDialogTitle>{title}</AlertDialogTitle><AlertDialogDescription>Se eliminará este método de seguridad y se cerrarán tus sesiones. Confirmá tu identidad.</AlertDialogDescription></AlertDialogHeader><form onSubmit={submit} className="space-y-4"><div className="space-y-2"><Label htmlFor="security-password">Contraseña actual</Label><PasswordInput id="security-password" name="password" required autoComplete="current-password" /></div>{security.twoFactorEnabled && <Label className="grid gap-2">Código de autenticación o recuperación<Input name="otp" required autoComplete="one-time-code" /></Label>}<Feedback error={error} /><AlertDialogFooter><AlertDialogCancel disabled={pending}>Cancelar</AlertDialogCancel><Button variant="destructive" disabled={pending}>Confirmar</Button></AlertDialogFooter></form></AlertDialogContent></AlertDialog>
    <Dialog open={!!recovery || reauthenticate}><DialogContent showCloseButton={false} onEscapeKeyDown={e => e.preventDefault()} onInteractOutside={e => e.preventDefault()}><DialogHeader><DialogTitle>{recovery ? "Guardá tus códigos de recuperación" : "Seguridad actualizada"}</DialogTitle><DialogDescription>{recovery ? "Cada código se puede usar una vez si perdés el autenticador. Guardalos antes de volver a ingresar." : "Cerramos las sesiones anteriores. Volvé a ingresar con tus credenciales actualizadas."}</DialogDescription></DialogHeader>{recovery && <><div className="grid grid-cols-1 gap-2 rounded-lg bg-muted p-4 sm:grid-cols-2">{recovery.map(c => <code key={c} className="text-xs">{c}</code>)}</div><Button variant="outline" onClick={() => { const blob = new Blob([`Códigos de recuperación de Ubikka\n${recovery.join("\n")}`], { type: "text/plain" }); const url = URL.createObjectURL(blob); const a = document.createElement("a"); a.href = url; a.download = "ubikka-recuperacion.txt"; a.click(); URL.revokeObjectURL(url); }}>Descargar códigos</Button></>}<form action={signOut}><Button className="w-full">Volver a ingresar</Button></form></DialogContent></Dialog>
  </div>;
}
