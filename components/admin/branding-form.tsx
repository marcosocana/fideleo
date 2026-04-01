"use client";

import { useActionState, useEffect, useState } from "react";

import { type BrandingFormState, updateBrandingAction } from "@/app/admin/branding/actions";
import { Button } from "@/components/shared/button";
import { Input } from "@/components/shared/input";
import type { SelectOption } from "@/lib/data/admin-options";
import type { Business } from "@/lib/types/domain";

const initialState: BrandingFormState = {};

export function BrandingForm({
  business,
  businesses,
  canSwitchBusiness
}: {
  business: Business;
  businesses: SelectOption[];
  canSwitchBusiness: boolean;
}) {
  const [state, formAction, isPending] = useActionState(updateBrandingAction, initialState);
  const [isDirty, setIsDirty] = useState(false);
  const [preview, setPreview] = useState({
    primaryColor: business.primaryColor,
    secondaryColor: business.secondaryColor,
    accentColor: business.accentColor,
    welcomeText: business.welcomeText
  });

  useEffect(() => {
    setIsDirty(false);
    setPreview({
      primaryColor: business.primaryColor,
      secondaryColor: business.secondaryColor,
      accentColor: business.accentColor,
      welcomeText: business.welcomeText
    });
  }, [business.id]);

  return (
    <form action={formAction} className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]" onChange={() => setIsDirty(true)}>
      <input name="businessId" type="hidden" value={business.id} />
      <div className="card-surface space-y-5 p-6">
        {canSwitchBusiness ? (
          <div className="space-y-2">
            <label className="text-sm font-medium">Negocio seleccionado</label>
            <select
              className="input-soft"
              defaultValue={business.id}
              name="businessIdDisplay"
              onChange={(event) => {
                const url = new URL(window.location.href);
                url.searchParams.set("businessId", event.currentTarget.value);
                window.location.href = url.toString();
              }}
            >
              {businesses.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
          </div>
        ) : null}
        <div className="space-y-2">
          <label className="text-sm font-medium">Color principal</label>
          <Input
            name="primaryColor"
            onChange={(event) => setPreview((current) => ({ ...current, primaryColor: event.currentTarget.value }))}
            value={preview.primaryColor}
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Color secundario</label>
          <Input
            name="secondaryColor"
            onChange={(event) => setPreview((current) => ({ ...current, secondaryColor: event.currentTarget.value }))}
            value={preview.secondaryColor}
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Acento</label>
          <Input
            name="accentColor"
            onChange={(event) => setPreview((current) => ({ ...current, accentColor: event.currentTarget.value }))}
            value={preview.accentColor}
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Welcome text</label>
          <Input
            name="welcomeText"
            onChange={(event) => setPreview((current) => ({ ...current, welcomeText: event.currentTarget.value }))}
            value={preview.welcomeText}
          />
        </div>
        {state.error ? <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">{state.error}</p> : null}
        {state.success ? <p className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">Branding actualizado.</p> : null}
        <Button disabled={isPending || !isDirty}>{isPending ? "Guardando..." : "Guardar branding"}</Button>
      </div>
      <div className="card-surface overflow-hidden p-4">
        <div
          className="rounded-[32px] p-6"
          style={{ background: `linear-gradient(180deg, ${preview.secondaryColor} 0%, #ffffff 100%)` }}
        >
          <div className="mx-auto max-w-sm rounded-[28px] p-5 text-white shadow-card" style={{ background: preview.primaryColor }}>
            <p className="text-xs uppercase tracking-[0.18em] text-white/70">Preview</p>
            <h2 className="mt-3 text-3xl font-semibold">{business.name}</h2>
            <p className="mt-3 text-sm text-white/75">{preview.welcomeText}</p>
            <div className="mt-6 h-2 rounded-full bg-white/15">
              <div className="h-2 w-2/3 rounded-full" style={{ background: preview.accentColor }} />
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
