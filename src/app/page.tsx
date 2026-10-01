import { redirect } from "next/navigation";
import { callApi, getMe, type Tenant } from "../lib/api";
import { signOut } from "./actions";
import { LiveRefresh } from "./live-refresh";
import { TenantForm } from "./tenant-form";
import { TenantList } from "./tenant-list";

export default async function HomePage() {
  const me = await getMe();
  if (!me) redirect("/login");
  const { data: tenants } = await callApi<{ data: Tenant[] }>("/v1/tenants");
  const active = tenants.filter((tenant) => tenant.estado === "activo").length;
  const published = tenants.filter((tenant) => tenant.sitePublished && tenant.estado === "activo").length;
  const awaitingAdmin = tenants.filter((tenant) => tenant.estado === "activo" && tenant._count.users === 0).length;
  const publicSiteUrl = (process.env.PUBLIC_SITE_URL ?? "http://localhost:3002").replace(/\/$/, "");

  return <div className="app-frame">
    <aside className="sidebar"><div className="sidebar-brand"><span className="brand-icon">U</span>
      <div><strong>ubikka<span>.</span></strong><small>PLATAFORMA</small></div></div>
      <nav aria-label="Panel de plataforma"><span className="nav-label">MENÚ PRINCIPAL</span>
        <a href="#resumen" className="nav-item current"><span aria-hidden="true">▦</span> Resumen</a>
        <a href="#inmobiliarias" className="nav-item"><span aria-hidden="true">⌂</span> Inmobiliarias</a>
        <a href="#nueva-inmobiliaria" className="nav-item"><span aria-hidden="true">＋</span> Nueva cuenta</a>
      </nav>
      <div className="sidebar-bottom"><div className="operator-avatar" aria-hidden="true">{me.nombre.charAt(0)}</div>
        <div className="operator-info"><strong>{me.nombre}</strong><small>Operador Ubikka</small></div>
        <form action={signOut}><button aria-label="Cerrar sesión" title="Cerrar sesión" className="signout-button">↗</button></form>
      </div>
    </aside>
    <div className="workspace"><header className="topbar"><div className="mobile-brand">ubikka<span>.</span></div>
      <div className="breadcrumb">Plataforma <span>/</span> Resumen</div><div className="topbar-right">
        <span className="environment-tag"><span /> Plataforma activa</span><span className="operator-short">{me.nombre}</span>
        <form action={signOut} className="mobile-signout"><button>Cerrar sesión</button></form></div></header>
      <main className="main-content" id="resumen"><div className="page-title"><div>
        <p className="section-kicker">PANEL DE PLATAFORMA</p><h1>Resumen general</h1>
        <p>Administrá las inmobiliarias, sus accesos y sitios públicos desde un solo lugar.</p></div>
        <div className="page-actions"><LiveRefresh /><a href="#nueva-inmobiliaria" className="primary-link">＋ Nueva inmobiliaria</a></div></div>

        <section className="stats" aria-label="Métricas de plataforma">
          <div className="stat-card"><span className="stat-icon registered" aria-hidden="true">⌂</span>
            <span className="stat-label">INMOBILIARIAS</span><strong>{tenants.length}</strong><span className="stat-note">Cuentas registradas</span></div>
          <div className="stat-card"><span className="stat-icon active" aria-hidden="true">✓</span>
            <span className="stat-label">ACTIVAS</span><strong>{active}</strong><span className="stat-note">Operando en la plataforma</span></div>
          <div className="stat-card"><span className="stat-icon published" aria-hidden="true">↗</span>
            <span className="stat-label">SITIOS PUBLICADOS</span><strong>{published}</strong><span className="stat-note">Visibles en la web</span></div>
          <div className="stat-card"><span className="stat-icon pending" aria-hidden="true">◷</span>
            <span className="stat-label">PENDIENTES</span><strong>{awaitingAdmin}</strong><span className="stat-note">Esperando primer acceso</span></div>
        </section>

        <div className="content-grid"><section className="panel create-panel" id="nueva-inmobiliaria">
          <div className="panel-heading"><div><span className="section-kicker">DAR DE ALTA</span><h2>Nueva inmobiliaria</h2>
            <p>Creá la cuenta y enviá la invitación al primer administrador.</p></div>
            <span className="panel-badge" aria-hidden="true">＋</span></div><TenantForm /></section>
          <aside className="onboarding-card"><span className="onboarding-icon" aria-hidden="true">✦</span>
            <span className="section-kicker">CÓMO FUNCIONA</span><h2>De la invitación a su sitio web.</h2>
            <ol><li><span>01</span><p>Registrás la inmobiliaria y enviás el acceso.</p></li>
              <li><span>02</span><p>El administrador completa su perfil y sus propiedades.</p></li>
              <li><span>03</span><p>Publica su sitio con identidad propia.</p></li></ol>
            <p className="onboarding-note">La web permanece oculta hasta que se publique.</p></aside></div>

        <TenantList tenants={tenants} publicSiteUrl={publicSiteUrl} />
      </main>
    </div>
  </div>;
}
