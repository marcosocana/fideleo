"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";

import { createRewardAction, type RewardFormState, updateRewardAction } from "@/app/admin/rewards/actions";
import { Button } from "@/components/shared/button";
import { Input } from "@/components/shared/input";
import type { SelectOption } from "@/lib/data/admin-options";
import type { Reward } from "@/lib/types/domain";

const initialState: RewardFormState = {};

interface RewardFormProps {
  businesses: SelectOption[];
  reward?: Reward;
}

export function RewardForm({ businesses, reward }: RewardFormProps) {
  const router = useRouter();
  const action = reward ? updateRewardAction.bind(null, reward.id) : createRewardAction;
  const [state, formAction, isPending] = useActionState(action, initialState);

  useEffect(() => {
    if (!state.success) {
      return;
    }

    router.push(state.rewardId ? `/admin/rewards/${state.rewardId}` : "/admin/rewards");
    router.refresh();
  }, [router, state.rewardId, state.success]);

  return (
    <form action={formAction} className="card-surface grid gap-5 p-6 md:grid-cols-2">
      <div className="space-y-2">
        <label className="text-sm font-medium">Negocio</label>
        <select className="input-soft" defaultValue={reward?.businessId ?? businesses[0]?.value} name="businessId">
          {businesses.map((business) => (
            <option key={business.value} value={business.value}>
              {business.label}
            </option>
          ))}
        </select>
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">Tipo</label>
        <select className="input-soft" defaultValue={reward?.rewardType ?? "standard"} name="rewardType">
          <option value="standard">Standard</option>
          <option value="special">Special</option>
          <option value="bonus">Bonus</option>
        </select>
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">Titulo</label>
        <Input defaultValue={reward?.title} name="title" placeholder="Postre artesanal" />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">Puntos</label>
        <Input defaultValue={reward?.pointsRequired ?? 20} name="pointsRequired" type="number" />
      </div>
      <div className="space-y-2 md:col-span-2">
        <label className="text-sm font-medium">Descripcion</label>
        <textarea
          className="min-h-28 w-full rounded-xl bg-slate-50 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[color:var(--accent)]"
          defaultValue={reward?.description}
          name="description"
          placeholder="Describe la recompensa y como se utiliza."
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">Inicio</label>
        <Input defaultValue={reward?.startsAt?.slice(0, 10)} name="startsAt" type="date" />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">Fin</label>
        <Input defaultValue={reward?.endsAt?.slice(0, 10)} name="endsAt" type="date" />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">Estado</label>
        <select className="input-soft" defaultValue={String(reward?.isActive ?? true)} name="isActive">
          <option value="true">Activo</option>
          <option value="false">Inactivo</option>
        </select>
      </div>
      {state.error ? <p className="md:col-span-2 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">{state.error}</p> : null}
      <div className="md:col-span-2">
        <Button disabled={isPending}>{isPending ? "Guardando..." : reward ? "Guardar cambios" : "Crear premio"}</Button>
      </div>
    </form>
  );
}
