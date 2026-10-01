"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export function LiveRefresh() {
  const router = useRouter();
  useEffect(() => {
    const refresh = () => { if (document.visibilityState === "visible") router.refresh(); };
    const onFocus = () => router.refresh();
    const timer = window.setInterval(refresh, 45_000);
    window.addEventListener("focus", onFocus);
    return () => { window.clearInterval(timer); window.removeEventListener("focus", onFocus); };
  }, [router]);
  return <button className="refresh-button" type="button" onClick={() => router.refresh()}>
    <span aria-hidden="true">↻</span> Actualizar datos</button>;
}
