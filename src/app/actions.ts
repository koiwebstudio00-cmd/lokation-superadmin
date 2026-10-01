"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { ApiError, callApi, getMe, login, logout, publicApi } from "../lib/api";

export type FormState = { error?: string; success?: string; invitationUrl?: string };
const message = (error: unknown) => error instanceof ApiError ? error.message : "No pudimos conectar con el backend.";

export async function signIn(_state: FormState, formData: FormData): Promise<FormState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  if (!email || !password) return { error: "Completá email y contraseña." };
  try { await login(email, password, String(formData.get("otp") ?? "") || undefined); } catch (error) { return { error: message(error) }; }
  redirect("/");
}

export async function signOut() {
  await logout();
  redirect("/login");
}

export async function createTenant(_state: FormState, formData: FormData): Promise<FormState> {
  if (!(await getMe())) return { error: "Sesión de operador requerida." };
  const nombre = String(formData.get("nombre") ?? "").trim();
  const slug = String(formData.get("slug") ?? "").trim();
  const admin_email = String(formData.get("admin_email") ?? "").trim();
  if (nombre.length < 2 || !/^[a-z0-9][a-z0-9-]{1,48}$/.test(slug) ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(admin_email)) {
    return { error: "Revisá el nombre, slug y email del administrador." };
  }
  try {
    const result = await callApi<{ tenant: { nombre: string }; dev_invitation_url?: string }>(
      "/v1/tenants", { method: "POST", body: { nombre, slug, admin_email } });
    revalidatePath("/", "layout");
    return { success: `${result.tenant.nombre} creada. ${result.dev_invitation_url
      ? "Entregá el enlace de invitación al administrador." : "Se envió la invitación por email."}`,
      invitationUrl: result.dev_invitation_url };
  } catch (error) { return { error: message(error) }; }
}

export async function changeTenantStatus(formData: FormData) {
  if (!(await getMe())) return;
  const id = String(formData.get("id") ?? "");
  const estado = formData.get("estado");
  if (!/^[a-f0-9-]{36}$/i.test(id) || !["activo", "suspendido"].includes(String(estado))) return;
  await callApi(`/v1/tenants/${id}`, { method: "PATCH", body: { estado } });
  revalidatePath("/", "layout");
}

export async function resendInvitation(_state: FormState, formData: FormData): Promise<FormState> {
  if (!(await getMe())) return { error: "Sesión de operador requerida." };
  const id = String(formData.get("id") ?? "");
  if (!/^[a-f0-9-]{36}$/i.test(id)) return { error: "Inmobiliaria inválida." };
  try {
    const result = await callApi<{ email: string; dev_invitation_url?: string }>(
      `/v1/tenants/${id}/resend-invitation`, { method: "POST", body: {} });
    return { success: result.dev_invitation_url ? `Invitación renovada para ${result.email}.`
      : `Invitación reenviada a ${result.email}.`, invitationUrl: result.dev_invitation_url };
  } catch (error) { return { error: message(error) }; }
}

export async function platformMutation(path: string, method: "POST" | "PATCH" | "DELETE", body: unknown) {
  // Restricción del proxy: las rutas de seguridad con sesiones se manejan por separado.
  if (!/^\/v1\/(platform\/(operators(?:\/[a-f0-9-]{36})?|security(?:\/(?:password|2fa\/(?:setup|enable|disable)|passkeys\/(?:options|verify|remove)))?)|users\/me|tenants\/[a-f0-9-]{36})$/.test(path)) return { error: "Ruta inválida." };
  try {
    if (!(await getMe())) return { error: "Sesión requerida." };
    const data = await callApi(path, { method, body });
    if (!path.startsWith("/v1/platform/security")) revalidatePath("/", "layout");
    return { data };
  } catch (error) { return { error: message(error) }; }
}
export async function passkeyOptions() {
  try { return { data: await publicApi("/v1/auth/passkey/options", {}) }; }
  catch (error) { return { error: message(error) }; }
}
export async function passkeySignIn(body: unknown) {
  try { await publicApi("/v1/auth/passkey/verify", body, true); return { ok: true }; }
  catch (error) { return { error: message(error) }; }
}
