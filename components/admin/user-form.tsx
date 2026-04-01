"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { createUserAction, type UserFormState, updateUserAction } from "@/app/admin/users/actions";
import { Button } from "@/components/shared/button";
import { Input } from "@/components/shared/input";
import type { SelectOption } from "@/lib/data/admin-options";
import type { CustomerDetail } from "@/lib/types/domain";

const initialState: UserFormState = {};

interface UserFormProps {
  businesses: SelectOption[];
  user?: CustomerDetail;
  availableRoles?: Array<"superadmin" | "customer" | "business_admin">;
}

export function UserForm({ businesses, user, availableRoles = ["customer", "business_admin"] }: UserFormProps) {
  const router = useRouter();
  const defaultRole = user?.roles[0] ?? availableRoles[0] ?? "customer";
  const inferredBusinessId = user?.primaryBusinessId ?? user?.managedBusinessId ?? user?.memberships[0]?.businessId ?? "";
  const action = user ? updateUserAction.bind(null, user.id) : createUserAction;
  const [state, formAction, isPending] = useActionState(action, initialState);
  const [isDirty, setIsDirty] = useState(!user);

  useEffect(() => {
    if (!state.success) {
      return;
    }

    router.push(state.userId ? `/admin/users/${state.userId}` : "/admin/users");
    router.refresh();
  }, [router, state.success, state.userId]);

  useEffect(() => {
    setIsDirty(!user);
  }, [user]);

  return (
    <form action={formAction} className="card-surface grid gap-5 p-6 md:grid-cols-2" onChange={() => setIsDirty(true)}>
      <div className="space-y-2">
        <label className="text-sm font-medium">Nombre</label>
        <Input defaultValue={user?.firstName} name="firstName" />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">Apellidos</label>
        <Input defaultValue={user?.lastName} name="lastName" />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">Email</label>
        <Input defaultValue={user?.email} name="email" type="email" />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">Telefono</label>
        <Input defaultValue={user?.phone} name="phone" />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">Rol</label>
        <select className="input-soft" defaultValue={defaultRole} name="role">
          {availableRoles.includes("customer") ? <option value="customer">Customer</option> : null}
          {availableRoles.includes("business_admin") ? <option value="business_admin">Business admin</option> : null}
          {availableRoles.includes("superadmin") ? <option value="superadmin">Superadmin</option> : null}
        </select>
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">Negocio</label>
        <select className="input-soft" defaultValue={inferredBusinessId} name="businessId">
          <option value="">Sin asignar</option>
          {businesses.map((business) => (
            <option key={business.value} value={business.value}>
              {business.label}
            </option>
          ))}
        </select>
      </div>
      <div className="space-y-2 md:col-span-2">
        <label className="text-sm font-medium">{user ? "Nueva contrasena (opcional)" : "Contrasena inicial (opcional)"}</label>
        <Input name="password" type="password" />
      </div>
      {state.error ? <p className="md:col-span-2 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">{state.error}</p> : null}
      <div className="md:col-span-2">
        <Button disabled={isPending || !isDirty}>{isPending ? "Guardando..." : user ? "Guardar usuario" : "Crear usuario"}</Button>
      </div>
    </form>
  );
}
