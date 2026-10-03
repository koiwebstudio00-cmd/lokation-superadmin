"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Building2, ChartNoAxesCombined, LayoutDashboard, ShieldCheck, UserRound, Command } from "lucide-react";
import { NavUser } from "@/components/nav-user";
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarRail, useSidebar } from "@/components/ui/sidebar";
const items = [{ href: "/", label: "Resumen", icon: LayoutDashboard }, { href: "/inmobiliarias", label: "Inmobiliarias", icon: Building2 },
  { href: "/superadministradores", label: "Superadministradores", icon: ShieldCheck }, { href: "/estadisticas", label: "Estadísticas", icon: ChartNoAxesCombined }, { href: "/perfil", label: "Mi perfil", icon: UserRound }];
export function AppSidebar({ nombre, email }: { nombre: string; email: string }) {
  const pathname = usePathname(); const { isMobile, setOpenMobile } = useSidebar();
  const close = () => { if (isMobile) setOpenMobile(false); };
  return <Sidebar collapsible="icon" variant="inset"><SidebarHeader><SidebarMenu><SidebarMenuItem><SidebarMenuButton asChild size="lg">
    <Link href="/" onClick={close}><span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground"><Command className="size-5" /></span>
      <span className="grid min-w-0 text-left"><span className="text-lg font-semibold tracking-tight">lokation</span><span className="truncate text-xs text-muted-foreground">Administración de plataforma</span></span></Link>
  </SidebarMenuButton></SidebarMenuItem></SidebarMenu></SidebarHeader>
    <SidebarContent><SidebarGroup><SidebarGroupLabel>Plataforma</SidebarGroupLabel><SidebarMenu>{items.map(item => <SidebarMenuItem key={item.href}>
      <SidebarMenuButton asChild tooltip={item.label} isActive={item.href === "/" ? pathname === "/" : pathname.startsWith(item.href)}>
        <Link href={item.href} onClick={close}><item.icon /><span>{item.label}</span></Link>
      </SidebarMenuButton></SidebarMenuItem>)}</SidebarMenu></SidebarGroup></SidebarContent>
    <SidebarFooter><NavUser nombre={nombre} email={email} /></SidebarFooter><SidebarRail /></Sidebar>;
}
