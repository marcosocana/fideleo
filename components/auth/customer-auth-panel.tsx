"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/shared/button";
import { Input } from "@/components/shared/input";
import { getBaseUrl } from "@/lib/supabase/env";
import type { Business } from "@/lib/types/domain";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import {
  type CustomerLoginInput,
  type CustomerRegisterInput,
  customerLoginSchema,
  customerRegisterSchema
} from "@/lib/validations/auth";

interface CustomerAuthPanelProps {
  business: Business;
}

export function CustomerAuthPanel({ business }: CustomerAuthPanelProps) {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [feedback, setFeedback] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const loginForm = useForm<CustomerLoginInput>({
    resolver: zodResolver(customerLoginSchema),
    defaultValues: { email: "", password: "" }
  });
  const registerForm = useForm<CustomerRegisterInput>({
    resolver: zodResolver(customerRegisterSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
      acceptTerms: true
    }
  });

  const handleLogin = loginForm.handleSubmit((values) => {
    startTransition(async () => {
      setError(null);
      setFeedback(null);

      const supabase = getSupabaseBrowserClient();

      if (!supabase) {
        router.refresh();
        return;
      }

      const { error: signInError } = await supabase.auth.signInWithPassword(values);

      if (signInError) {
        setError(signInError.message);
        return;
      }

      router.refresh();
    });
  });

  const handleRegister = registerForm.handleSubmit((values) => {
    startTransition(async () => {
      setError(null);
      setFeedback(null);

      const supabase = getSupabaseBrowserClient();

      if (!supabase) {
        setFeedback("Entorno demo activo. Configura Supabase para registrar clientes reales.");
        return;
      }

      const { error: signUpError, data } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
        options: {
          emailRedirectTo: `${getBaseUrl()}/auth/callback?next=/${business.slug}`,
          data: {
            first_name: values.firstName,
            last_name: values.lastName,
            phone: values.phone,
            role: "customer",
            business_slug: business.slug
          }
        }
      });

      if (signUpError) {
        setError(signUpError.message);
        return;
      }

      if (data.user && data.session) {
        router.push(`/${business.slug}`);
        router.refresh();
        return;
      }

      if (data.user && !data.session) {
        setFeedback("Cuenta creada. Revisa tu email para confirmar el acceso.");
        return;
      }

      router.refresh();
    });
  });

  return (
    <section className="card-surface p-5">
      <div className="flex gap-2 rounded-2xl bg-slate-100 p-1">
        <button
          className={`flex-1 rounded-2xl px-4 py-3 text-sm font-medium ${mode === "login" ? "bg-white shadow-soft" : "text-muted"}`}
          onClick={() => setMode("login")}
          type="button"
        >
          Entrar
        </button>
        <button
          className={`flex-1 rounded-2xl px-4 py-3 text-sm font-medium ${mode === "register" ? "bg-white shadow-soft" : "text-muted"}`}
          onClick={() => setMode("register")}
          type="button"
        >
          Crear cuenta
        </button>
      </div>

      {mode === "login" ? (
        <form className="mt-4 space-y-3" onSubmit={handleLogin}>
          <Input placeholder="Email" type="email" {...loginForm.register("email")} />
          {loginForm.formState.errors.email ? (
            <p className="text-sm text-red-600">{loginForm.formState.errors.email.message}</p>
          ) : null}
          <Input placeholder="Contraseña" type="password" {...loginForm.register("password")} />
          {loginForm.formState.errors.password ? (
            <p className="text-sm text-red-600">{loginForm.formState.errors.password.message}</p>
          ) : null}
          {error ? <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p> : null}
          {feedback ? <p className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{feedback}</p> : null}
          <Button className="w-full" disabled={isPending} type="submit">
            {isPending ? "Accediendo..." : "Acceder"}
          </Button>
        </form>
      ) : (
        <form className="mt-4 space-y-3" onSubmit={handleRegister}>
          <Input placeholder="Nombre" {...registerForm.register("firstName")} />
          {registerForm.formState.errors.firstName ? (
            <p className="text-sm text-red-600">{registerForm.formState.errors.firstName.message}</p>
          ) : null}
          <Input placeholder="Apellidos" {...registerForm.register("lastName")} />
          {registerForm.formState.errors.lastName ? (
            <p className="text-sm text-red-600">{registerForm.formState.errors.lastName.message}</p>
          ) : null}
          <Input placeholder="Email" type="email" {...registerForm.register("email")} />
          {registerForm.formState.errors.email ? (
            <p className="text-sm text-red-600">{registerForm.formState.errors.email.message}</p>
          ) : null}
          <Input placeholder="Telefono (opcional)" {...registerForm.register("phone")} />
          <Input placeholder="Contraseña" type="password" {...registerForm.register("password")} />
          {registerForm.formState.errors.password ? (
            <p className="text-sm text-red-600">{registerForm.formState.errors.password.message}</p>
          ) : null}
          <Input placeholder="Confirmar contraseña" type="password" {...registerForm.register("confirmPassword")} />
          {registerForm.formState.errors.confirmPassword ? (
            <p className="text-sm text-red-600">{registerForm.formState.errors.confirmPassword.message}</p>
          ) : null}
          <label className="flex items-start gap-3 rounded-2xl bg-slate-50 px-4 py-3 text-sm">
            <input className="mt-1" type="checkbox" {...registerForm.register("acceptTerms")} />
            <span>Acepto los terminos y condiciones del programa de fidelizacion.</span>
          </label>
          {registerForm.formState.errors.acceptTerms ? (
            <p className="text-sm text-red-600">{registerForm.formState.errors.acceptTerms.message}</p>
          ) : null}
          {error ? <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p> : null}
          {feedback ? <p className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{feedback}</p> : null}
          <Button className="w-full" disabled={isPending} type="submit">
            {isPending ? "Creando cuenta..." : "Crear cuenta"}
          </Button>
        </form>
      )}
    </section>
  );
}
