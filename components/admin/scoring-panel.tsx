"use client";

import { useActionState } from "react";

import { addPointAction, type ScoringState } from "@/app/admin/scoring/actions";
import { Button } from "@/components/shared/button";
import { Input } from "@/components/shared/input";
import type { CustomerSnapshot } from "@/lib/types/domain";

const initialState: ScoringState = {};

export function ScoringPanel({
  customer,
  businessId
}: {
  customer: CustomerSnapshot;
  businessId: string;
}) {
  const [state, formAction, isPending] = useActionState(addPointAction, initialState);

  return (
    <div className="card-surface p-6">
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <form action={formAction}>
          <input name="userId" type="hidden" value={customer.id} />
          <input name="businessId" type="hidden" value={businessId} />
          <input name="pointsDelta" type="hidden" value="1" />
          <input name="note" type="hidden" value="Punto rapido desde puntuador" />
          <Button disabled={isPending}>+1 punto</Button>
        </form>
        <form action={formAction}>
          <input name="userId" type="hidden" value={customer.id} />
          <input name="businessId" type="hidden" value={businessId} />
          <input name="pointsDelta" type="hidden" value="5" />
          <input name="note" type="hidden" value="Carga rapida de 5 puntos" />
          <Button disabled={isPending} variant="secondary">+5 puntos</Button>
        </form>
        <form action={formAction}>
          <input name="userId" type="hidden" value={customer.id} />
          <input name="businessId" type="hidden" value={businessId} />
          <input name="pointsDelta" type="hidden" value="-5" />
          <input name="note" type="hidden" value="Ajuste manual de -5 puntos" />
          <Button disabled={isPending} variant="secondary">Ajuste -5</Button>
        </form>
        <form action={formAction}>
          <input name="userId" type="hidden" value={customer.id} />
          <input name="businessId" type="hidden" value={businessId} />
          <input name="pointsDelta" type="hidden" value="10" />
          <input name="note" type="hidden" value="Bonus manual de 10 puntos" />
          <Button disabled={isPending} variant="secondary">Bonus +10</Button>
        </form>
      </div>
      <form action={formAction} className="mt-5 grid gap-3 md:grid-cols-[1fr_160px_auto]">
        <input name="userId" type="hidden" value={customer.id} />
        <input name="businessId" type="hidden" value={businessId} />
        <Input defaultValue="Ajuste manual desde puntuador" name="note" />
        <Input defaultValue="1" name="pointsDelta" type="number" />
        <Button disabled={isPending} variant="secondary">
          Aplicar custom
        </Button>
      </form>
      {state.error ? <p className="mt-4 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">{state.error}</p> : null}
      {state.success ? <p className="mt-4 rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">Movimiento registrado.</p> : null}
      <div className="mt-6 rounded-2xl border border-dashed border-line p-5 text-sm text-muted">
        Cada acción registra `point_transactions` y `audit_logs`, y actualiza `business_memberships`.
      </div>
    </div>
  );
}
