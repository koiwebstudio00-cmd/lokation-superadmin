"use client";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
export function ShellHeader() {
  const path = usePathname(); const { resolvedTheme, setTheme } = useTheme();
  const title = path.startsWith("/inmobiliarias") ? "Inmobiliarias" : path.startsWith("/superadministradores") ? "Superadministradores" : path === "/perfil" ? "Mi perfil" : path === "/estadisticas" ? "Estadísticas" : "Resumen";
  return <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-3 border-b bg-background/95 px-4 backdrop-blur sm:px-6">
    <SidebarTrigger aria-label="Abrir o cerrar navegación" /><Separator orientation="vertical" className="h-5!" />
    <span className="hidden text-sm text-muted-foreground sm:inline">Plataforma /</span><span className="truncate text-sm font-medium">{title}</span>
    <Button className="ml-auto shrink-0" variant="ghost" size="icon" aria-label="Cambiar tema" onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}><Sun className="dark:hidden" /><Moon className="hidden dark:block" /></Button>
  </header>;
}
