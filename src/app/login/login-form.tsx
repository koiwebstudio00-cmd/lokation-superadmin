"use client";
import Link from "next/link";
import { PasswordInput } from "@/components/ui/password-input";
import { useActionState, useState } from "react";
import { useRouter } from "next/navigation";
import { startAuthentication, type PublicKeyCredentialRequestOptionsJSON } from "@simplewebauthn/browser";
import { Fingerprint } from "lucide-react";
import { passkeyOptions, passkeySignIn } from "../actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Feedback } from "@/components/feedback";
import { passwordSignIn } from "@/actions/login-flow";
import { GoogleLogin } from "@/components/google-login";
export function LoginForm({ googleEnabled }: { googleEnabled: boolean }) {
  const [state, action, pending] = useActionState(passwordSignIn, {}); const [error, setError] = useState<string>(), [keyPending, setKeyPending] = useState(false); const router = useRouter();
  return <div className="space-y-5"><form action={action} className="space-y-4"><div className="space-y-2"><Label htmlFor="email">Email</Label><Input id="email" name="email" type="email" autoComplete="username webauthn" required /></div><div className="space-y-2"><Label htmlFor="password">Contraseña</Label><PasswordInput id="password" name="password" autoComplete="current-password" required /></div><Feedback error={state.error} /><Button disabled={pending || keyPending} className="w-full">{pending ? "Ingresando…" : "Ingresar"}</Button></form><Link href="/recuperar-clave" className="block text-center text-sm text-primary underline underline-offset-4">Olvidé mi contraseña</Link><GoogleLogin enabled={googleEnabled} /><Separator /><Feedback error={error} /><Button variant="outline" disabled={pending || keyPending} className="w-full" onClick={async () => {
    setKeyPending(true); setError(undefined); try { const result = await passkeyOptions(); if (result.error) throw new Error(result.error); const data = result.data as { options: PublicKeyCredentialRequestOptionsJSON; challengeId: string }; const response = await startAuthentication({ optionsJSON: data.options }); const login = await passkeySignIn({ response, challengeId: data.challengeId }); if (login.error) throw new Error(login.error); router.replace("/"); router.refresh(); } catch(e) { setError(e instanceof Error ? e.message : "No se pudo usar la passkey."); } finally { setKeyPending(false); }
  }}><Fingerprint />{keyPending ? "Esperando dispositivo…" : "Ingresar con passkey"}</Button></div>;
}
