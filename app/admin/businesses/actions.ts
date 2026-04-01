"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { getAdminScope } from "@/lib/auth/admin";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { businessSchema } from "@/lib/validations/business";

export interface BusinessFormState {
  error?: string;
  success?: boolean;
  businessId?: string;
}

function getBusinessPayload(formData: FormData) {
  return businessSchema.safeParse({
    name: formData.get("name"),
    ownerName: formData.get("ownerName"),
    slug: formData.get("slug"),
    ownerEmail: formData.get("ownerEmail"),
    ownerPhone: formData.get("ownerPhone"),
    primaryColor: formData.get("primaryColor"),
    accentColor: formData.get("accentColor"),
    secondaryColor: formData.get("secondaryColor"),
    welcomeText: formData.get("welcomeText")
  });
}

export async function createBusinessAction(_: BusinessFormState, formData: FormData): Promise<BusinessFormState> {
  const parsed = getBusinessPayload(formData);

  if (!parsed.success) {
    return {
      error: parsed.error.issues[0]?.message ?? "Revisa el formulario."
    };
  }

  const { isSuperadmin } = await getAdminScope();

  if (!isSuperadmin) {
    return {
      error: "Solo un superadmin puede crear negocios."
    };
  }

  const supabase = await getSupabaseServerClient();

  if (!supabase) {
    revalidatePath("/admin/businesses");
    return {
      success: true
    };
  }

  const { data, error } = await supabase
    .from("businesses")
    .insert({
      name: parsed.data.name,
      slug: parsed.data.slug,
      owner_name: parsed.data.ownerName,
      owner_email: parsed.data.ownerEmail,
      owner_phone: parsed.data.ownerPhone,
      primary_color: parsed.data.primaryColor,
      secondary_color: parsed.data.secondaryColor,
      accent_color: parsed.data.accentColor,
      welcome_text: parsed.data.welcomeText
    })
    .select("id")
    .single();

  if (error) {
    return {
      error: error.message
    };
  }

  revalidatePath("/admin/businesses");

  return {
    success: true,
    businessId: data.id
  };
}

export async function updateBusinessAction(
  businessId: string,
  _: BusinessFormState,
  formData: FormData
): Promise<BusinessFormState> {
  const parsed = getBusinessPayload(formData);

  if (!parsed.success) {
    return {
      error: parsed.error.issues[0]?.message ?? "Revisa el formulario."
    };
  }

  const { isSuperadmin } = await getAdminScope();

  if (!isSuperadmin) {
    return {
      error: "Solo un superadmin puede editar negocios."
    };
  }

  const supabase = await getSupabaseServerClient();

  if (!supabase) {
    revalidatePath("/admin/businesses");
    return {
      success: true,
      businessId
    };
  }

  const { error } = await supabase
    .from("businesses")
    .update({
      name: parsed.data.name,
      slug: parsed.data.slug,
      owner_name: parsed.data.ownerName,
      owner_email: parsed.data.ownerEmail,
      owner_phone: parsed.data.ownerPhone,
      primary_color: parsed.data.primaryColor,
      secondary_color: parsed.data.secondaryColor,
      accent_color: parsed.data.accentColor,
      welcome_text: parsed.data.welcomeText,
      updated_at: new Date().toISOString()
    })
    .eq("id", businessId);

  if (error) {
    return {
      error: error.message
    };
  }

  revalidatePath("/admin/businesses");
  revalidatePath(`/admin/businesses/${businessId}`);

  return {
    success: true,
    businessId
  };
}

export async function deleteBusinessAction(businessId: string): Promise<void> {
  const { isSuperadmin } = await getAdminScope();

  if (!isSuperadmin) {
    return;
  }

  const supabase = await getSupabaseServerClient();

  if (supabase) {
    await supabase.from("businesses").delete().eq("id", businessId);
  }

  revalidatePath("/admin/businesses");
  redirect("/admin/businesses");
}
