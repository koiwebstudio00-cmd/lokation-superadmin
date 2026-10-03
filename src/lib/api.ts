import { cookies } from "next/headers";

const base = (process.env.API_URL ?? "http://localhost:3001").replace(/\/$/, "");
export const names = { access_token: "ubikka_sa_access", refresh_token: "ubikka_sa_refresh",
  csrf_token: "ubikka_sa_csrf" } as const;
type ApiName = keyof typeof names;
export type Operator = { id: string; nombre: string; email: string; estado: string; createdAt: string };
export type Me = Pick<Operator, "id" | "nombre" | "email"> & { rol: string };
export type Tenant = { id: string; nombre: string; slug: string; estado: string;
  sitePublished: boolean; createdAt: string; _count: { users: number } };

export class ApiError extends Error {
  constructor(message: string, public status: number) { super(message); }
}

export function sessionCookies(response: Response) {
  return response.headers.getSetCookie().flatMap((raw) => {
    const [pair, ...attributes] = raw.split(";");
    const separator = pair.indexOf("=");
    if (separator < 0) return [];
    const apiName = pair.slice(0, separator).trim() as ApiName;
    if (!(apiName in names)) return [];
    const maxAge = attributes.map((item) => item.trim().toLowerCase())
      .find((item) => item.startsWith("max-age="));
    return [{ name: names[apiName], value: decodeURIComponent(pair.slice(separator + 1)),
      maxAge: maxAge ? Number(maxAge.slice(8)) : undefined }];
  });
}

export async function saveSession(response: Response) {
  const store = await cookies();
  for (const item of sessionCookies(response)) {
    if (!item.value || item.maxAge === 0) store.delete(item.name);
    else store.set(item.name, item.value, { httpOnly: true, sameSite: "lax",
      secure: process.env.NODE_ENV === "production", path: "/", maxAge: item.maxAge });
  }
}

export async function callApi<T>(path: string, options: { method?: string; body?: unknown } = {}): Promise<T> {
  const store = await cookies();
  const cookie = (Object.keys(names) as ApiName[]).map((name) => {
    const value = store.get(names[name])?.value;
    return value ? `${name}=${encodeURIComponent(value)}` : null;
  }).filter(Boolean).join("; ");
  const csrf = store.get(names.csrf_token)?.value;
  const response = await fetch(`${base}${path}`, { method: options.method ?? "GET", cache: "no-store",
    headers: { Accept: "application/json", ...(cookie ? { Cookie: cookie } : {}),
      ...(csrf ? { "X-CSRF-Token": csrf } : {}),
      ...(options.body !== undefined ? { "Content-Type": "application/json" } : {}) },
    body: options.body === undefined ? undefined : JSON.stringify(options.body) });
  const data = await response.json().catch(() => ({})) as T & { error?: { message?: string } };
  if (!response.ok) throw new ApiError(data.error?.message ?? "La operación falló.", response.status);
  return data;
}

export async function login(email: string, password: string, otp?: string) {
  const response = await fetch(`${base}/v1/auth/login`, { method: "POST", cache: "no-store",
    headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, password, otp }) });
  const data = await response.json().catch(() => ({})) as { user?: { rol: string }; error?: { message?: string } };
  if (!response.ok) throw new ApiError(data.error?.message ?? "No pudimos iniciar sesión.", response.status);
  if (data.user?.rol !== "super_admin") throw new ApiError("Esta cuenta no es operadora de Lokation.", 403);
  await saveSession(response);
}

export async function logout() {
  await callApi("/v1/auth/logout", { method: "POST", body: {} }).catch(() => undefined);
  const store = await cookies();
  for (const name of Object.values(names)) store.delete(name);
}

export async function getMe() {
  try {
    const data = await callApi<{ user: Me }>("/v1/auth/me");
    return data.user.rol === "super_admin" ? data.user : null;
  } catch (error) {
    if (error instanceof ApiError && [401, 403].includes(error.status)) return null;
    throw error;
  }
}

export async function publicApi<T>(path: string, body: unknown, session = false): Promise<T> {
  const response = await fetch(`${base}${path}`, { method: "POST", cache: "no-store", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
  const data = await response.json();
  if (!response.ok) throw new ApiError(data.error?.message ?? "La operación falló.", response.status);
  if (session) await saveSession(response);
  return data;
}
export type Audit = { id: string; actorId: string; targetId: string; action: string; createdAt: string };
export type TenantDetail = Tenant & { logoUrl: string | null; agentEnabled: boolean; configSitio: Record<string, unknown> | null;
  _count: { users: number; properties: number; leads: number; conversations: number }; users: (Operator & { rol: string })[];
  invitations: { email: string; expiresAt: string }[]; activity: Audit[] };
export type Stats = { totals: { tenants: number; active: number; published: number; users: number; properties: number; leads: number; conversations: number };
  tenants: TenantDetail[]; propertyStates: { estado: string; _count: number }[]; leadStates: { estado: string; _count: number }[];
  growth: { month: string; tenants: number }[]; activity: Audit[]; generatedAt: string };
export type Security = { twoFactorEnabled: boolean; recoveryCodesRemaining: number; passkeys: { id: string; nombre: string; createdAt: string }[] };
