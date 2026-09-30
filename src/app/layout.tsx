import "./styles.css";

export const metadata = { title: "Ubikka · Super admin", robots: { index: false, follow: false } };
export default function Layout({ children }: { children: React.ReactNode }) {
  return <html lang="es"><body>{children}</body></html>;
}
