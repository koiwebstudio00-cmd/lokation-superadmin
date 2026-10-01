"use client";
import { useActionState, useState } from "react";
import { createTenant, type FormState } from "./actions";
import { CopyInvite } from "./copy-invite";

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
    <p className="hint">El sitio comienza como borrador. El administrador lo publica cuando esté listo.</p>
    {state.error && <p role="alert" className="error">{state.error}</p>}
    {state.success && <p role="status" className="success">{state.success}</p>}
    {state.invitationUrl && <div className="invite"><strong>Invitación lista para compartir</strong>
      <CopyInvite url={state.invitationUrl} /></div>}
    <button disabled={pending} className="primary-button">Registrar inmobiliaria <span aria-hidden="true">↗</span></button></form>;
}
