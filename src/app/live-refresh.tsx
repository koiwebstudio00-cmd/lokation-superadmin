"use client";
import { useEffect, useTransition } from "react";
import { useRouter } from "next/navigation";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
export function LiveRefresh() {
  const router = useRouter(); const [pending, start] = useTransition();
  useEffect(() => { const refresh = () => { if (document.visibilityState === "visible") router.refresh(); }; window.addEventListener("focus", refresh); const timer = setInterval(refresh, 45000); return () => { window.removeEventListener("focus", refresh); clearInterval(timer); }; }, [router]);
  return <Button variant="outline" disabled={pending} onClick={() => start(() => router.refresh())}><RefreshCw className={pending ? "animate-spin" : ""} />Actualizar</Button>;
}
