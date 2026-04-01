"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";

import { createBusinessAction, type BusinessFormState, updateBusinessAction } from "@/app/admin/businesses/actions";
import { Button } from "@/components/shared/button";
import { Input } from "@/components/shared/input";
import type { Business } from "@/lib/types/domain";

const initialState: BusinessFormState = {};

export function BusinessForm({ business }: { business?: Business }) {
  const router = useRouter();
  const action = business ? updateBusinessAction.bind(null, business.id) : createBusinessAction;
  const [state, formAction, isPending] = useActionState(action, initialState);

  useEffect(() => {
    if (!state.success) {
      return;
    }

    router.push(state.businessId ? `/admin/businesses/${state.businessId}` : "/admin/businesses");
    router.refresh();
  }, [router, state.businessId, state.success]);

  return (
    <form action={formAction} className="card-surface grid gap-5 p-6 md:grid-cols-2">
      <div className="space-y-2">
        <label className="text-sm font-medium">Nombre</label>
        <Input defaultValue={business?.name} name="name" placeholder="Casa Luma" />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">Responsable</label>
        <Input defaultValue={business?.ownerName} name="ownerName" placeholder="Lucia Romero" />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">Slug</label>
        <Input defaultValue={business?.slug} name="slug" placeholder="casa-luma" />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">Email owner</label>
        <Input defaultValue={business?.ownerEmail} name="ownerEmail" placeholder="owner@negocio.com" />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">Teléfono</label>
        <Input defaultValue={business?.ownerPhone} name="ownerPhone" placeholder="+34 600 000 000" />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">Color principal</label>
        <Input defaultValue={business?.primaryColor ?? "#163B33"} name="primaryColor" />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">Color secundario</label>
        <Input defaultValue={business?.secondaryColor ?? "#F7F2E8"} name="secondaryColor" />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">Acento</label>
        <Input defaultValue={business?.accentColor ?? "#C8873F"} name="accentColor" />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">Welcome text</label>
        <Input defaultValue={business?.welcomeText ?? "Tu club de fidelización para cenas memorables."} name="welcomeText" />
      </div>
      {state.error ? <p className="md:col-span-2 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">{state.error}</p> : null}
      <div className="md:col-span-2">
        <Button disabled={isPending}>{isPending ? "Guardando..." : business ? "Guardar cambios" : "Guardar negocio"}</Button>
      </div>
    </form>
  );
}
