# Ubikka · app-super-admin

Panel de operadores de Ubikka con Next.js, Tailwind CSS y componentes oficiales shadcn/ui basados en Radix. El sidebar parte de `sidebar-07`; reutiliza el menú de usuario y el comportamiento móvil del dashboard inmobiliario. Tema tweakcn `cmr2oi77k000404lda9x9felg`, claro/oscuro, Lexend Deca y JetBrains Mono servidas localmente. Georgia usa la fuente del sistema.

## Desarrollo local

1. Levantar PostgreSQL y el backend. En `backend`: `npm install`, `npm run db:generate`, `npm run db:migrate:deploy`.
2. Copiar `.env.example` a `.env.local` si todavía no existe, y ajustar `API_URL`.
3. Ejecutar `npm install` y `npm run dev` (puerto 3003).
4. Ingresar con una cuenta `super_admin`. El seed local usa `operador@ubikka.test` / `password123`.

## Pantallas

- `/`: resumen y últimas inmobiliarias, actividad administrativa, acceso a seguridad.
- `/inmobiliarias`: búsqueda y filtros, tabla en escritorio y tarjetas en móvil.
- `/inmobiliarias/nueva`: alta con invitación al primer administrador.
- `/inmobiliarias/[id]`: datos, usuarios, estadísticas agregadas, sitio, invitación pendiente y suspensión/reactivación.
- `/superadministradores`: crear, editar, suspender, reactivar y eliminar operadores. La baja es lógica para conservar la auditoría. No se permite suspender/eliminar la propia cuenta ni dejar la plataforma sin operadores activos.
- `/perfil`: nombre, cambio/generador de contraseña, 2FA TOTP y passkeys.
- `/estadisticas`: totales, altas mensuales, distribución de propiedades y consultas, actividad por inmobiliaria. No expone contenido privado de leads o conversaciones.

El resumen, listado y estadísticas se actualizan al recuperar foco y cada 45 segundos mientras la pantalla esté visible. El servidor autoriza todas las operaciones; ocultar botones no sustituye los permisos.

## Seguridad y producción

En el backend configurar:

- `SUPER_ADMIN_URL`: origen exacto del panel, por ejemplo `https://admin.ubikka.example`. Es el origen verificado por WebAuthn; el hostname es su RP ID. En local vale `http://localhost:3003`. No intercambiar localhost y 127.0.0.1 al probar passkeys.
- `SECURITY_ENCRYPTION_KEY`: 32 bytes en hexadecimal (`openssl rand -hex 32`) para cifrar los secretos TOTP con AES-256-GCM. Guardarla junto con el backup de la base, fuera del repositorio. No rotarla sin migrar los secretos ya cifrados. En desarrollo, si se omite, se deriva una clave local de JWT_SECRET.

2FA se habilita después de verificar un código. Los diez códigos de recuperación aparecen una sola vez, se almacenan como hashes y son de un solo uso. Los códigos TOTP tampoco se pueden reutilizar en la misma ventana temporal. La activación, desactivación y cambio de contraseña cierran las sesiones anteriores. Conservá los códigos antes de volver a ingresar.

Las passkeys requieren navegador compatible y HTTPS (localhost es válido para desarrollo). El registro pide contraseña y, si corresponde, 2FA. El login con passkey exige verificación del usuario en el dispositivo. Las pruebas automatizadas validan registro y autenticación con claves/firma reales, origen, presencia de verificación y desafíos de un solo uso; la interacción física con Touch ID/Face ID/PIN se prueba manualmente en el dispositivo final.

No registrar formularios de seguridad ni sus respuestas en telemetría. La auditoría guarda actor, acción, destino y fecha, sin contraseñas, secretos ni mensajes de clientes.

## Recorrido de prueba

1. Revisar resumen, filtrar inmobiliarias y abrir un detalle.
2. Crear un operador de prueba, editarlo, suspenderlo y confirmar que ya no puede entrar. Reactivarlo y luego eliminarlo desde otra cuenta.
3. En el perfil del operador de prueba, cambiar la contraseña; comprobar que se exige volver a ingresar.
4. Activar 2FA con una app autenticadora, guardar los códigos, ingresar con un código nuevo y probar un código de recuperación una sola vez.
5. Registrar una passkey y usarla desde el login; probar cancelación del diálogo del dispositivo.
6. A 390 px y en escritorio, abrir/cerrar el sidebar, navegar, buscar y revisar formularios, tablas/tarjetas y modo oscuro.

Validación: `npm run build`, `npm run lint`; en backend `npm run test:prepare` y `npm test`.

Ver el [plan general](../docs/PLAN_IMPLEMENTACION.md).

## Login con Google y 2FA por etapas

Ver [configuración y pruebas](../docs/LOGIN_GOOGLE_2FA.md). Google usa Better Auth; las sesiones y los permisos de Ubikka continúan en el backend.

## Relación con el dashboard inmobiliario

Cada panel tiene su tema y navegación propios. Los cambios de 2026-10-01 en `app-dashboard` (Noto Sans JP, selector de tema en navbar, contenedores redondeados y ajuste de activación de DropdownMenu) corresponden al panel inmobiliario. Este repositorio conserva su tema Lexend Deca y su flujo de seguridad. Las nuevas analíticas del tenant no amplían el acceso de los operadores a conversaciones o leads.

## Actualización: correos, notificaciones y web pública

Ver [guía de implementación y pruebas](../docs/CORREOS_NOTIFICACIONES_WEB.md).
Campana en navbar con contador, últimas cinco notificaciones y página `/notificaciones`. Lectura individual/global y actualización cada 45 segundos con pestaña visible.
