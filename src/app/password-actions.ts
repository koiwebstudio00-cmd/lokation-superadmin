"use server";

import { ApiError, publicApi } from "@/lib/api";
import type { FormState } from "./actions";

export async function requestPasswordReset(_state: FormState, form: FormData): Promise<FormState> {
  const email = String(form.get("email") ?? "").trim();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { error: "Ingresá un email válido." };
  try {
    await publicApi("/v1/auth/forgot-password", { email });
    return { success: "Si la cuenta está habilitada, recibirás un enlace por correo. Revisá también spam. El enlace vence en una hora." };
  } catch (error) {
    return { error: error instanceof ApiError ? error.message : "No pudimos solicitar el correo. Intentá nuevamente." };
  }
}

export async function resetPassword(_state: FormState, form: FormData): Promise<FormState> {
  const token = String(form.get("token") ?? "");
  const password = String(form.get("password") ?? "");
  if (!token) return { error: "Abrí el enlace que recibiste por correo." };
  if (password.length < 12 || new TextEncoder().encode(password).length > 72) {
    return { error: "Usá al menos 12 caracteres y un máximo de 72 bytes." };
  }
  if (password !== form.get("confirm")) return { error: "Las contraseñas no coinciden." };
  try {
    await publicApi("/v1/auth/reset-password", { token, password });
    return { success: "Contraseña actualizada. Tus sesiones anteriores se cerraron. Ya podés ingresar con la nueva contraseña." };
  } catch (error) {
    return { error: error instanceof ApiError ? error.message : "No pudimos actualizar la contraseña. Intentá nuevamente." };
  }
}
