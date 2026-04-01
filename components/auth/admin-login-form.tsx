"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/shared/button";
import { Input } from "@/components/shared/input";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { type AdminLoginInput, adminLoginSchema } from "@/lib/validations/auth";

export function AdminLoginForm({ redirectTo = "/admin" }: { redirectTo?: string }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<AdminLoginInput>({
    resolver: zodResolver(adminLoginSchema),
    defaultValues: {
      email: "",
      password: ""
    }
  });

  const onSubmit = handleSubmit((values) => {
    startTransition(async () => {
      setError(null);

      const supabase = getSupabaseBrowserClient();

      if (!supabase) {
        router.push(redirectTo);
        return;
      }

      const { error: signInError } = await supabase.auth.signInWithPassword(values);

      if (signInError) {
        setError(signInError.message);
        return;
      }

      const {
        data: { user }
      } = await supabase.auth.getUser();

      if (!user) {
        setError("No hemos podido recuperar la sesion.");
        return;
      }

      const { data: roleRows, error: rolesError } = await supabase.from("user_roles").select("role").eq("user_id", user.id);

      if (rolesError) {
        setError(rolesError.message);
        return;
      }

      const roles = (roleRows ?? []).map((item) => item.role);

      if (!roles.includes("superadmin") && !roles.includes("business_admin")) {
        await supabase.auth.signOut();
        setError("Tu usuario no tiene acceso al panel de administracion.");
        return;
      }

      router.push(redirectTo);
      router.refresh();
    });
  });

  return (
    <form className="mt-8 space-y-4" onSubmit={onSubmit}>
      <div className="space-y-2">
        <label className="text-sm font-medium">Email</label>
        <Input type="email" placeholder="admin@laprospect.com" {...register("email")} />
        {errors.email ? <p className="text-sm text-red-600">{errors.email.message}</p> : null}
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">Contraseña</label>
        <Input type="password" placeholder="••••••••" {...register("password")} />
        {errors.password ? <p className="text-sm text-red-600">{errors.password.message}</p> : null}
      </div>
      {error ? <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p> : null}
      <Button className="w-full" disabled={isPending} type="submit">
        {isPending ? "Entrando..." : "Entrar al panel"}
        <ArrowRight className="ml-2 h-4 w-4" />
      </Button>
    </form>
  );
}
