"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Feedback } from "@/components/feedback";
import { useActionState, useState } from "react";
import { createTenant, type FormState } from "./actions";
import { CopyInvite } from "./copy-invite";

export function TenantForm() {
  const [state, action, pending] = useActionState<FormState, FormData>(createTenant, {});
  const [slugEdited, setSlugEdited] = useState(false);
  const [slug, setSlug] = useState("");
  return <form action={action} className="space-y-5"><div className="grid gap-5 sm:grid-cols-2"><Label className="grid gap-2">Nombre de la inmobiliaria
    <Input name="nombre" required minLength={2} onChange={(event) => {
      if (!slugEdited) setSlug(event.target.value.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
        .toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""));
    }} /></Label><Label className="grid gap-2">Identificador para la URL
    <Input name="slug" value={slug} required minLength={2} maxLength={49}
      pattern="[a-z0-9][a-z0-9-]+" onChange={(event) => { setSlugEdited(true); setSlug(event.target.value); }} /></Label></div>
    <Label className="grid gap-2">Email del primer administrador<Input name="admin_email" type="email" required /></Label>
    <p className="text-sm text-muted-foreground">El sitio comienza como borrador. El administrador lo publica cuando esté listo.</p>
    <Feedback error={state.error} success={state.success} />

    {state.invitationUrl && <div className="space-y-3 rounded-lg border bg-muted p-4"><strong>Invitación lista para compartir</strong>
      <CopyInvite url={state.invitationUrl} /></div>}
    <Button disabled={pending} className="w-full sm:w-auto">Registrar inmobiliaria <span aria-hidden="true">↗</span></Button></form>;
}
