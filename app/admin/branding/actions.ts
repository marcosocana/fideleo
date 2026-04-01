"use server";

import { revalidatePath } from "next/cache";

import { canManageBusinessId, getAdminScope } from "@/lib/auth/admin";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export interface BrandingFormState {
  error?: string;
  success?: boolean;
}

export async function updateBrandingAction(_: BrandingFormState, formData: FormData): Promise<BrandingFormState> {
  const businessId = String(formData.get("businessId") ?? "");
  const primaryColor = String(formData.get("primaryColor") ?? "");
  const secondaryColor = String(formData.get("secondaryColor") ?? "");
  const accentColor = String(formData.get("accentColor") ?? "");
  const welcomeText = String(formData.get("welcomeText") ?? "");

  if (!businessId || !primaryColor || !secondaryColor || !accentColor || welcomeText.trim().length < 8) {
    return { error: "Revisa los campos de branding." };
  }

  const { isSuperadmin, isBusinessAdmin, managedBusinessIds } = await getAdminScope();

  if (!isSuperadmin && !isBusinessAdmin) {
    return { error: "No tienes permisos para actualizar este negocio." };
  }

  if (!isSuperadmin && !canManageBusinessId(managedBusinessIds, businessId)) {
    return { error: "No puedes editar el branding de ese negocio." };
  }

  const supabase = await getSupabaseServerClient();

  if (!supabase) {
    return { error: "Supabase no está disponible." };
  }

  const { error } = await supabase
    .from("businesses")
    .update({
      primary_color: primaryColor,
      secondary_color: secondaryColor,
      accent_color: accentColor,
      welcome_text: welcomeText,
      updated_at: new Date().toISOString()
    })
    .eq("id", businessId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/admin/branding");
  revalidatePath(`/admin/businesses/${businessId}`);
  return { success: true };
}
