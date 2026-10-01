"use client";

import { useState } from "react";
import type { Tenant } from "../lib/api";
import { changeTenantStatus } from "./actions";
import { ResendInvite } from "./resend-invite";

type Filter = "todas" | "activas" | "borrador" | "publicadas";

export function TenantList({ tenants, publicSiteUrl }: { tenants: Tenant[]; publicSiteUrl: string }) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<Filter>("todas");
  const normalized = search.trim().toLocaleLowerCase("es-AR");
  const visible = tenants.filter((tenant) => {
    const matchesSearch = !normalized || `${tenant.nombre} ${tenant.slug}`.toLocaleLowerCase("es-AR").includes(normalized);
    const matchesFilter = filter === "todas" || (filter === "activas" && tenant.estado === "activo") ||
      (filter === "borrador" && !tenant.sitePublished) ||
      (filter === "publicadas" && tenant.sitePublished && tenant.estado === "activo");
    return matchesSearch && matchesFilter;
  });

  return <section className="panel registry-panel" id="inmobiliarias">
    <div className="panel-heading"><div><span className="section-kicker">GESTIÓN DE CUENTAS</span>
      <h2>Inmobiliarias</h2><p>Revisá el estado de cada cuenta y su sitio web.</p></div>
      <span className="registry-total">{tenants.length} en total</span></div>
    <div className="registry-tools">
      <label className="search-box"><span aria-hidden="true">⌕</span><span className="sr-only">Buscar inmobiliarias</span>
        <input type="search" placeholder="Buscar por nombre o URL..." value={search}
          onChange={(event) => setSearch(event.target.value)} /></label>
      <div className="filter-tabs" role="group" aria-label="Filtrar inmobiliarias">
        {([ ["todas", "Todas"], ["activas", "Activas"], ["borrador", "Borrador"],
          ["publicadas", "Publicadas"] ] as [Filter, string][]).map(([value, label]) =>
          <button type="button" key={value} className={filter === value ? "selected" : ""}
            aria-pressed={filter === value} onClick={() => setFilter(value)}>{label}</button>)}
      </div>
    </div>
    {visible.length ? <div className="table-wrap"><table><thead><tr><th>INMOBILIARIA</th><th>ESTADO</th>
      <th>SITIO WEB</th><th>USUARIOS</th><th>ACCIONES</th></tr></thead><tbody>{visible.map((tenant) =>
      <tr key={tenant.id}><td><div className="tenant-cell"><span className="tenant-avatar" aria-hidden="true">{tenant.nombre.charAt(0)}</span>
        <div><strong>{tenant.nombre}</strong><small>/s/{tenant.slug}</small></div></div></td>
        <td><span className={`status-pill ${tenant.estado === "activo" ? "active" : "suspended"}`}>
          <span className="status-dot" />{tenant.estado === "activo" ? "Activa" : "Suspendida"}</span></td>
        <td>{tenant.sitePublished && tenant.estado === "activo" ? <a className="site-link"
          href={`${publicSiteUrl}/s/${tenant.slug}`} target="_blank" rel="noopener noreferrer">Ver sitio ↗</a>
          : <span className="draft-label">{tenant.sitePublished ? "No disponible" : "Borrador"}</span>}</td>
        <td><span className="user-count">{tenant._count.users}</span></td><td><div className="row-actions">
          <form action={changeTenantStatus} onSubmit={(event) => {
            if (tenant.estado === "activo" && !window.confirm(`¿Suspender ${tenant.nombre}? Su sitio dejará de estar disponible.`)) event.preventDefault();
          }}><input type="hidden" name="id" value={tenant.id} /><input type="hidden" name="estado"
            value={tenant.estado === "activo" ? "suspendido" : "activo"} />
            <button className={tenant.estado === "activo" ? "action-muted" : "action-activate"}>
              {tenant.estado === "activo" ? "Suspender" : "Activar"}</button></form>
          {tenant._count.users === 0 && tenant.estado === "activo" && <ResendInvite id={tenant.id} />}
        </div></td></tr>)}</tbody></table></div>
      : <div className="empty-table"><strong>No hay inmobiliarias para mostrar.</strong>
        <p>Probá otro nombre o cambiá el filtro.</p></div>}
    <div className="registry-foot">Mostrando {visible.length} de {tenants.length} inmobiliarias</div>
  </section>;
}
