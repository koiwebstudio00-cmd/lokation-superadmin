# Ubikka · app-super-admin

Panel exclusivo de operadores de Ubikka. Permite iniciar sesión, ver métricas generales de inmobiliarias, registrar una nueva con invitación a su primer administrador, renovar esa invitación y activar o suspender inmobiliarias. Incluye búsqueda y filtros de cuentas; los datos se actualizan al volver a la pestaña y cada 45 segundos mientras permanece visible. El panel no consulta leads ni conversaciones privadas.

## Desarrollo local

1. Levantar PostgreSQL y el backend con sus migraciones aplicadas.
2. Copiar `.env.example` a `.env.local` y ajustar `API_URL`.
3. Ejecutar `npm install` y `npm run dev` (puerto 3003).
4. Ingresar con una cuenta `super_admin`. En seed local: `operador@ubikka.test` / `password123`.

Al registrar una inmobiliaria se envía la invitación al email indicado si hay SMTP. En desarrollo sin SMTP aparece un enlace para entregar manualmente. El administrador acepta en `app-dashboard` (puerto 3000), configura su sitio y lo publica.

Ver el [plan general](../docs/PLAN_IMPLEMENTACION.md).
