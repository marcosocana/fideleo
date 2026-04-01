# La Prospect

Base inicial de una plataforma SaaS multitenant para programas de fidelización de restaurantes y negocios, construida sobre el spec técnico y la guía visual del proyecto.

## Incluye

- Next.js App Router con TypeScript y Tailwind.
- Shell admin con dashboard, negocios, usuarios, premios, branding, puntuador y perfil.
- Experiencia cliente mobile-first en `/{businessSlug}` con login/register visual, wallet de puntos, recompensas e historial.
- Estructura de Supabase lista para auth, multitenancy, rewards, scoring, auditoría y reglas de fidelización.
- Migraciones SQL iniciales con tablas y políticas RLS base.
- Preparación para emails transaccionales con Resend.
- Auth SSR con Supabase para sesiones persistentes en App Router.

## Puesta en marcha

1. Copia `.env.example` a `.env.local`.
2. Añade las credenciales de Supabase y Resend.
3. Instala dependencias con `npm install`.
4. Crea en Supabase el redirect URL `http://localhost:3000/auth/callback`.
5. Ejecuta las migraciones SQL de `supabase/migrations/`.
6. Arranca el proyecto con `npm run dev`.

## Configuracion Supabase

- `NEXT_PUBLIC_SUPABASE_URL`: URL del proyecto.
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: clave anon para auth y lecturas del cliente.
- `SUPABASE_SERVICE_ROLE_KEY`: necesaria para altas/ediciones admin que usan `auth.admin`.
- `NEXT_PUBLIC_SITE_URL`: base para callbacks de confirmación de email.

Flujos conectados:

- Login admin por email/password con validación de roles `superadmin` y `business_admin`.
- Registro cliente con `signUp`, metadata inicial y confirmación opcional por email.
- Callback `/auth/callback` para intercambiar el código de Supabase por sesión.
- Persistencia de `profiles`, `user_roles` y `business_memberships` vía trigger SQL.

## Estructura

- `app/`: rutas admin, auth y tenant.
- `components/`: shell y bloques reutilizables.
- `lib/`: tipos, utilidades, demo data y clientes Supabase.
- `supabase/migrations/`: esquema inicial y seed base.
- `scripts/`: utilidades de soporte.

## Siguientes pasos recomendados

- Conectar formularios de login/register a Supabase Auth.
- Ampliar los guards reales por rol y tenant en middleware/server actions.
- Sustituir los datos demo por queries a Supabase.
- Añadir CRUD persistente con validación `react-hook-form` + `zod`.
- Integrar emails de invitación, canje y bienvenida con Resend.
