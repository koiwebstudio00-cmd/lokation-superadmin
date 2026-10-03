"use client";

import Link from "next/link";
import { useActionState } from "react";
import { requestPasswordReset, resetPassword } from "@/app/password-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PasswordInput } from "@/components/ui/password-input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Feedback } from "@/components/feedback";

export function PasswordRecovery({ token, reset = false }: { token?: string; reset?: boolean }) {
  const [state, action, pending] = useActionState(reset ? resetPassword : requestPasswordReset, {});
  return <main className="flex min-h-dvh items-center justify-center bg-muted/50 p-4">
    <Card className="w-full max-w-md">
      <CardHeader>
        <p className="mb-4 text-xl font-semibold text-primary">lokation</p>
        <CardTitle>{reset ? "Elegí tu nueva contraseña" : "Restablecer contraseña"}</CardTitle>
        <CardDescription>{reset ? "No necesitás la contraseña anterior. Se cerrarán tus sesiones al guardar." : "Te enviaremos un enlace a tu correo para que puedas elegir una nueva contraseña."}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Feedback error={state.error} success={state.success} />
        {reset && !token ? <p role="alert">Falta el enlace de recuperación. <Link className="underline" href="/recuperar-clave">Solicitá uno nuevo</Link>.</p> : !state.success && <form action={action} className="space-y-4">
          {reset ? <>
            <input type="hidden" name="token" value={token} />
            <div className="space-y-2"><Label htmlFor="new-password">Nueva contraseña</Label><PasswordInput id="new-password" name="password" autoComplete="new-password" required minLength={12} maxLength={72} /></div>
            <div className="space-y-2"><Label htmlFor="confirm-password">Repetir nueva contraseña</Label><PasswordInput id="confirm-password" name="confirm" autoComplete="new-password" required minLength={12} maxLength={72} /></div>
          </> : <div className="space-y-2"><Label htmlFor="recovery-email">Email de tu cuenta</Label><Input id="recovery-email" name="email" type="email" autoComplete="email" required /></div>}
          <Button className="w-full" disabled={pending}>{pending ? "Procesando…" : reset ? "Guardar nueva contraseña" : "Enviar enlace de recuperación"}</Button>
        </form>}
        {reset && state.error && <Link className="block text-sm underline" href="/recuperar-clave">Solicitar un nuevo enlace</Link>}
        <Link className="block text-center text-sm text-primary underline" href="/login">Volver al inicio de sesión</Link>
      </CardContent>
    </Card>
  </main>;
}
