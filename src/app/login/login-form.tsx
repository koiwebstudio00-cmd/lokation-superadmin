"use client";
import { useActionState, useState } from "react";
import { useRouter } from "next/navigation";
import { startAuthentication, type PublicKeyCredentialRequestOptionsJSON } from "@simplewebauthn/browser";
import { Fingerprint } from "lucide-react";
import { signIn, passkeyOptions, passkeySignIn, type FormState } from "../actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Feedback } from "@/components/feedback";
export function LoginForm() {
  const [state, action, pending] = useActionState<FormState, FormData>(signIn, {}); const [error, setError] = useState<string>(), [keyPending, setKeyPending] = useState(false); const router = useRouter();
  return <div className="space-y-5"><form action={action} className="space-y-4"><Label className="grid gap-2">Email<Input name="email" type="email" autoComplete="username webauthn" required /></Label><Label className="grid gap-2">Contraseña<Input name="password" type="password" autoComplete="current-password" required /></Label><Label className="grid gap-2">Código 2FA <span className="text-xs font-normal text-muted-foreground">Si lo activaste, ingresá el código o uno de recuperación.</span><Input name="otp" autoComplete="one-time-code" /></Label><Feedback error={state.error} /><Button disabled={pending || keyPending} className="w-full">{pending ? "Ingresando…" : "Ingresar"}</Button></form><Separator /><Feedback error={error} /><Button variant="outline" disabled={pending || keyPending} className="w-full" onClick={async () => {
    setKeyPending(true); setError(undefined); try { const result = await passkeyOptions(); if (result.error) throw new Error(result.error); const data = result.data as { options: PublicKeyCredentialRequestOptionsJSON; challengeId: string }; const response = await startAuthentication({ optionsJSON: data.options }); const login = await passkeySignIn({ response, challengeId: data.challengeId }); if (login.error) throw new Error(login.error); router.replace("/"); router.refresh(); } catch(e) { setError(e instanceof Error ? e.message : "No se pudo usar la passkey."); } finally { setKeyPending(false); }
  }}><Fingerprint />{keyPending ? "Esperando dispositivo…" : "Ingresar con passkey"}</Button></div>;
}
