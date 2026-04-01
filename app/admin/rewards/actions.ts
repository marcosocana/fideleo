"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { getSessionContext } from "@/lib/auth/session";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { rewardSchema } from "@/lib/validations/reward";

export interface RewardFormState {
  error?: string;
  success?: boolean;
  rewardId?: string;
}

function toRewardPayload(formData: FormData) {
  return rewardSchema.safeParse({
    businessId: formData.get("businessId"),
    title: formData.get("title"),
    description: formData.get("description"),
    rewardType: formData.get("rewardType"),
    pointsRequired: formData.get("pointsRequired"),
    startsAt: formData.get("startsAt"),
    endsAt: formData.get("endsAt"),
    isActive: formData.get("isActive")
  });
}

export async function createRewardAction(_: RewardFormState, formData: FormData): Promise<RewardFormState> {
  const parsed = toRewardPayload(formData);

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Revisa el formulario." };
  }

  const session = await getSessionContext();

  if (!session.roles.some((role) => role === "superadmin" || role === "business_admin")) {
    return { error: "No tienes permisos para crear premios." };
  }

  const supabase = await getSupabaseServerClient();

  if (!supabase) {
    return { success: true };
  }

  const { data, error } = await supabase
    .from("rewards")
    .insert({
      business_id: parsed.data.businessId,
      title: parsed.data.title,
      description: parsed.data.description,
      reward_type: parsed.data.rewardType,
      points_required: parsed.data.pointsRequired,
      starts_at: parsed.data.startsAt,
      ends_at: parsed.data.endsAt,
      is_active: parsed.data.isActive === "true"
    })
    .select("id")
    .single();

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/admin/rewards");
  return { success: true, rewardId: data.id };
}

export async function updateRewardAction(
  rewardId: string,
  _: RewardFormState,
  formData: FormData
): Promise<RewardFormState> {
  const parsed = toRewardPayload(formData);

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Revisa el formulario." };
  }

  const session = await getSessionContext();

  if (!session.roles.some((role) => role === "superadmin" || role === "business_admin")) {
    return { error: "No tienes permisos para editar premios." };
  }

  const supabase = await getSupabaseServerClient();

  if (!supabase) {
    return { success: true, rewardId };
  }

  const { error } = await supabase
    .from("rewards")
    .update({
      business_id: parsed.data.businessId,
      title: parsed.data.title,
      description: parsed.data.description,
      reward_type: parsed.data.rewardType,
      points_required: parsed.data.pointsRequired,
      starts_at: parsed.data.startsAt,
      ends_at: parsed.data.endsAt,
      is_active: parsed.data.isActive === "true",
      updated_at: new Date().toISOString()
    })
    .eq("id", rewardId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/admin/rewards");
  revalidatePath(`/admin/rewards/${rewardId}`);
  return { success: true, rewardId };
}

export async function deleteRewardAction(rewardId: string): Promise<void> {
  const session = await getSessionContext();

  if (!session.roles.some((role) => role === "superadmin" || role === "business_admin")) {
    return;
  }

  const supabase = await getSupabaseServerClient();

  if (supabase) {
    await supabase.from("rewards").delete().eq("id", rewardId);
  }

  revalidatePath("/admin/rewards");
  redirect("/admin/rewards");
}
