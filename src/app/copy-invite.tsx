"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
export function CopyInvite({ url }: { url: string }) {
  const [copied, setCopied] = useState(false);
  return <div className="space-y-3"><Button type="button" variant="outline" onClick={async () => { try { await navigator.clipboard.writeText(url); setCopied(true); } catch { setCopied(false); } }}>{copied ? "Enlace copiado" : "Copiar invitación"}</Button><details className="text-sm"><summary className="cursor-pointer text-muted-foreground">Ver enlace</summary><Input className="mt-2" readOnly aria-label="Enlace de invitación" value={url} onFocus={e => e.currentTarget.select()} /></details></div>;
}
