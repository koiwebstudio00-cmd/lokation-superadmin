import { NextResponse, type NextRequest } from "next/server";
import { names, sessionCookies } from "./lib/api";

export async function proxy(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith("/api/auth/")) return NextResponse.next();
  const refresh = request.cookies.get(names.refresh_token)?.value;
  const prefetch = request.headers.has("next-router-prefetch") || request.headers.get("purpose") === "prefetch";
  let renewed: ReturnType<typeof sessionCookies> = [];
  if (!request.cookies.has(names.access_token) && refresh && !prefetch) {
    try {
      const response = await fetch(`${(process.env.API_URL ?? "http://localhost:3001").replace(/\/$/, "")}/v1/auth/refresh`, {
        method: "POST", headers: { Cookie: `refresh_token=${encodeURIComponent(refresh)}` }, cache: "no-store" });
      if (response.ok) {
        renewed = sessionCookies(response);
        for (const item of renewed) request.cookies.set(item.name, item.value);
      }
    } catch { /* La página maneja la falta de sesión. */ }
  }
  const response = !request.cookies.has(names.access_token) && !request.nextUrl.pathname.startsWith("/login")
    ? NextResponse.redirect(new URL("/login", request.url))
    : NextResponse.next({ request });
  for (const item of renewed) response.cookies.set(item.name, item.value, {
    httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/",
    maxAge: item.maxAge });
  return response;
}

export const config = { matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"] };
