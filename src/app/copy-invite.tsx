"use client";

import { useState } from "react";

export function CopyInvite({ url }: { url: string }) {
  const [copied, setCopied] = useState(false);
  return <div className="invite-link"><button type="button" className="copy-button" onClick={async () => {
    try { await navigator.clipboard.writeText(url); setCopied(true); }
    catch { setCopied(false); }
  }}>{copied ? "Enlace copiado ✓" : "Copiar enlace de invitación"}</button>
    <details><summary>Ver enlace</summary><input readOnly aria-label="Enlace de invitación"
      value={url} onFocus={(event) => event.currentTarget.select()} /></details></div>;
}
