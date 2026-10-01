import "@fontsource-variable/lexend-deca";
import "@fontsource-variable/jetbrains-mono";
import "./globals.css";
import { Providers } from "@/components/providers";
export const metadata = { title: { default: "Ubikka · Plataforma", template: "%s · Ubikka" }, robots: { index: false, follow: false } };
export default function Layout({ children }: { children: React.ReactNode }) {
  return <html lang="es" suppressHydrationWarning><body className="antialiased"><Providers>{children}</Providers></body></html>;
}
