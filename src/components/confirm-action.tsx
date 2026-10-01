"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { platformMutation } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel } from "@/components/ui/alert-dialog";
import { Feedback } from "./feedback";
export function ConfirmAction({ label, description, path, method = "PATCH", body, destructive = false, disabled = false }: { label: string; description: string; path: string; method?: "PATCH" | "DELETE"; body?: unknown; destructive?: boolean; disabled?: boolean }) {
  const [open, setOpen] = useState(false), [pending, setPending] = useState(false), [error, setError] = useState<string>(); const router = useRouter();
  return <AlertDialog open={open} onOpenChange={setOpen}><AlertDialogTrigger asChild><Button variant={destructive ? "destructive" : "outline"} size="sm" disabled={disabled}>{label}</Button></AlertDialogTrigger>
    <AlertDialogContent><AlertDialogHeader><AlertDialogTitle>{label}</AlertDialogTitle><AlertDialogDescription>{description}</AlertDialogDescription></AlertDialogHeader><Feedback error={error} /><AlertDialogFooter>
      <AlertDialogCancel disabled={pending}>Cancelar</AlertDialogCancel><Button variant={destructive ? "destructive" : "default"} disabled={pending} onClick={async () => {
        setPending(true); const result = await platformMutation(path, method, body); setPending(false);
        if (result.error) setError(result.error); else { setOpen(false); router.refresh(); }
      }}>{pending ? "Procesando…" : "Confirmar"}</Button></AlertDialogFooter></AlertDialogContent></AlertDialog>;
}
