"use client";
import { useActionState, useState } from "react";
import { createTenant, type FormState } from "./actions";

export function TenantForm() {
  const [state, action, pending] = useActionState<FormState, FormData>(createTenant, {});
  const [slugEdited, setSlugEdited] = useState(false);
  const [slug, setSlug] = useState("");
  return <form action={action} className="form"><div className="fields"><label>Nombre de la inmobiliaria
    <input name="nombre" required minLength={2} onChange={(event) => {
      if (!slugEdited) setSlug(event.target.value.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
        .toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""));
    }} /></label><label>Identificador para la URL
    <input name="slug" value={slug} required minLength={2} maxLength={49}
      pattern="[a-z0-9][a-z0-9-]+" onChange={(event) => { setSlugEdited(true); setSlug(event.target.value); }} /></label></div>
    <label>Email del primer administrador<input name="admin_email" type="email" required /></label>
    <p className="hint">La inmobiliaria nace como borrador. Su administrador completa los datos y publica el sitio.</p>
    {state.error && <p role="alert" className="error">{state.error}</p>}
    {state.success && <p role="status" className="success">{state.success}</p>}
    {state.invitationUrl && <div className="invite"><strong>Enlace de invitación para desarrollo</strong>
      <input readOnly value={state.invitationUrl} onFocus={(event) => event.currentTarget.select()} /></div>}
    <button disabled={pending}>Registrar inmobiliaria</button></form>;
}
