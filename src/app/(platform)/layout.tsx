import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { getMe } from "@/lib/api";
import { AppSidebar } from "@/components/app-sidebar";
import { ShellHeader } from "@/components/shell-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
export default async function PlatformLayout({ children }: { children: React.ReactNode }) {
  const me = await getMe(); if (!me) redirect("/login");
  return <SidebarProvider defaultOpen={(await cookies()).get("ubikka_sa_sidebar")?.value !== "false"}>
    <AppSidebar nombre={me.nombre} email={me.email} /><SidebarInset className="min-w-0"><ShellHeader />
      <div className="mx-auto w-full min-w-0 max-w-7xl space-y-6 p-4 sm:p-6 lg:p-8">{children}</div>
    </SidebarInset></SidebarProvider>;
}
