import Link from "next/link";
import { ShieldCheck } from "lucide-react";

import { AdminLoginForm } from "@/components/auth/admin-login-form";

export default async function LoginPage({
  searchParams
}: {
  searchParams: Promise<{ redirectTo?: string }>;
}) {
  const params = await searchParams;
  const redirectTo = params.redirectTo ?? "/admin";

  return (
    <main className="min-h-screen bg-shell px-4 py-6">
      <div className="mx-auto grid min-h-[calc(100vh-3rem)] max-w-6xl gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <section className="hidden rounded-[32px] bg-[#163B33] p-10 text-white shadow-card lg:flex lg:flex-col lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-white/70">La Prospect</p>
            <h1 className="mt-6 max-w-lg text-5xl font-semibold tracking-tight">
              Fidelización premium para restaurantes con operación rápida y visibilidad total.
            </h1>
            <p className="mt-6 max-w-xl text-base leading-7 text-white/75">
              Administra negocios, usuarios, recompensas y acciones de puntuación desde una misma plataforma multitenant.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-3xl bg-white/8 p-5">
              <p className="text-sm text-white/70">KPIs vivos</p>
              <p className="mt-2 text-3xl font-semibold">+12.4%</p>
              <p className="mt-2 text-sm text-white/70">Crecimiento mensual en usuarios activos.</p>
            </div>
            <div className="rounded-3xl bg-white/8 p-5">
              <p className="text-sm text-white/70">Acceso seguro</p>
              <p className="mt-2 flex items-center gap-2 text-lg font-medium">
                <ShieldCheck className="h-5 w-5" />
                Supabase Auth + RLS
              </p>
            </div>
          </div>
        </section>

        <section className="card-surface flex items-center p-6 sm:p-10">
          <div className="mx-auto w-full max-w-md">
            <p className="text-sm uppercase tracking-[0.2em] text-muted">Acceso admin</p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight">Inicia sesión</h2>
            <p className="mt-3 text-sm leading-6 text-muted">
              Entrada unificada para superadmin y administradores de negocio.
            </p>
            <AdminLoginForm redirectTo={redirectTo} />

            <div className="mt-8 rounded-2xl bg-slate-50 p-4 text-sm text-muted">
              El acceso usa Supabase Auth y valida el rol real antes de entrar al panel.
              {" "}
              <Link className="font-medium text-[color:var(--accent)]" href="/casa-luma">
                Abrir portal cliente
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
