"use client";
import { useActionState } from "react";
import { resendInvitation, type FormState } from "./actions";
import { CopyInvite } from "./copy-invite";

export function ResendInvite({ id }: { id: string }) {
  const [state, action, pending] = useActionState<FormState, FormData>(resendInvitation, {});
  return <form action={action} className="resend"><input type="hidden" name="id" value={id} />
    <button className="secondary" disabled={pending}>Renovar invitación</button>
    {state.error && <small role="alert" className="error">{state.error}</small>}
    {state.success && <small role="status" className="success">{state.success}</small>}
    {state.invitationUrl && <CopyInvite url={state.invitationUrl} />}</form>;
}
