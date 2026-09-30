"use client";
import { useActionState } from "react";
import { signIn, type FormState } from "../actions";

export function LoginForm() {
  const [state, action, pending] = useActionState<FormState, FormData>(signIn, {});
  return <form action={action} className="form"><label>Email<input name="email" type="email" autoComplete="email" required /></label>
    <label>Contraseña<input name="password" type="password" autoComplete="current-password" required /></label>
    {state.error && <p role="alert" className="error">{state.error}</p>}
    <button disabled={pending}>Ingresar</button></form>;
}
