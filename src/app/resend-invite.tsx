"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Feedback } from "@/components/feedback";
import { useActionState } from "react";
import { resendInvitation, type FormState } from "./actions";
import { CopyInvite } from "./copy-invite";

export function ResendInvite({ id }: { id: string }) {
  const [state, action, pending] = useActionState<FormState, FormData>(resendInvitation, {});
  return <form action={action} className="space-y-3"><Input type="hidden" name="id" value={id} />
    <Button variant="outline" disabled={pending}>Renovar invitación</Button>
    <Feedback error={state.error} success={state.success} />

    {state.invitationUrl && <CopyInvite url={state.invitationUrl} />}</form>;
}
