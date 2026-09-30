import { redirect } from "next/navigation";
import { callApi, getMe, type Tenant } from "../lib/api";
import { changeTenantStatus, signOut } from "./actions";
import { TenantForm } from "./tenant-form";
import { ResendInvite } from "./resend-invite";

export default async function HomePage() {
  const me = await getMe();
  if (!me) redirect("/login");
  const { data: tenants } = await callApi<{ data: Tenant[] }>("/v1/tenants");
  const active = tenants.filter((tenant) => tenant.estado === "activo").length;
  const published = tenants.filter((tenant) => tenant.sitePublished && tenant.estado === "activo").length;
  return <main className="shell"><header className="header"><div><p className="eyebrow">Ubikka · Operaciones</p>
    <h1>Inmobiliarias</h1></div><form action={signOut}><button className="secondary">Salir · {me.nombre}</button></form></header>
    <section className="stats"><div><strong>{tenants.length}</strong><span>Registradas</span></div>
      <div><strong>{active}</strong><span>Activas</span></div><div><strong>{published}</strong><span>Sitios publicados</span></div></section>
    <section className="panel"><h2>Nueva inmobiliaria</h2><TenantForm /></section>
    <section className="panel"><h2>Inmobiliarias registradas</h2>
      {tenants.length ? <div className="table-wrap"><table><thead><tr><th>Inmobiliaria</th><th>Estado</th>
        <th>Sitio</th><th>Usuarios</th><th>Acción</th></tr></thead><tbody>{tenants.map((tenant) =>
        <tr key={tenant.id}><td><strong>{tenant.nombre}</strong><small>/{tenant.slug}</small></td>
          <td>{tenant.estado}</td><td>{tenant.sitePublished ? "Publicado" : "Borrador"}</td>
          <td>{tenant._count.users}</td><td><form action={changeTenantStatus}>
            <input type="hidden" name="id" value={tenant.id} /><input type="hidden" name="estado"
              value={tenant.estado === "activo" ? "suspendido" : "activo"} />
            <button className="secondary">{tenant.estado === "activo" ? "Suspender" : "Activar"}</button>
          </form>{tenant._count.users === 0 && tenant.estado === "activo" &&
            <ResendInvite id={tenant.id} />}</td></tr>)}</tbody></table></div> : <p>Todavía no hay inmobiliarias.</p>}
    </section></main>;
}
