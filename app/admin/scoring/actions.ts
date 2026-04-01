"use server";

import { revalidatePath } from "next/cache";

import { canManageBusinessId, getAdminScope } from "@/lib/auth/admin";
import { calculatePointsFromAmount } from "@/lib/loyalty/points";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export interface ScoringState {
  error?: string;
  success?: boolean;
}

async function applyPointsMutation({
  businessId,
  userId,
  pointsDelta,
  note,
  actorUserId
}: {
  businessId: string;
  userId: string;
  pointsDelta: number;
  note: string;
  actorUserId: string;
}) {
  const supabase = await getSupabaseServerClient();

  if (!supabase) {
    return { success: true as const };
  }

  const { data: membership, error: membershipError } = await supabase
    .from("business_memberships")
    .select("current_points, total_points_earned")
    .eq("business_id", businessId)
    .eq("user_id", userId)
    .maybeSingle();

  if (membershipError || !membership) {
    return { error: membershipError?.message ?? "No se ha encontrado la membresia del usuario." };
  }

  const now = new Date().toISOString();

  const { error: updateError } = await supabase
    .from("business_memberships")
    .update({
      current_points: membership.current_points + pointsDelta,
      total_points_earned: membership.total_points_earned + Math.max(pointsDelta, 0),
      last_activity_at: now
    })
    .eq("business_id", businessId)
    .eq("user_id", userId);

  if (updateError) {
    return { error: updateError.message };
  }

  await supabase.from("point_transactions").insert({
    business_id: businessId,
    user_id: userId,
    performed_by_user_id: actorUserId,
    type: pointsDelta >= 0 ? "earn" : "adjustment",
    points_delta: pointsDelta,
    source: "scoring_module",
    note,
    created_at: now
  });

  await supabase.from("audit_logs").insert({
    actor_user_id: actorUserId,
    business_id: businessId,
    target_user_id: userId,
    entity_type: "business_membership",
    action_type: "points_added",
    metadata_json: {
      points_delta: pointsDelta,
      note
    },
    created_at: now
  });

  revalidatePath("/admin/scoring");
  revalidatePath(`/admin/users/${userId}`);
  return { success: true as const };
}

export async function addPointAction(_: ScoringState, formData: FormData): Promise<ScoringState> {
  const userId = String(formData.get("userId") ?? "");
  const businessId = String(formData.get("businessId") ?? "");
  const note = String(formData.get("note") ?? "Punto manual desde puntuador");
  const pointsDelta = Number(formData.get("pointsDelta") ?? 1);

  if (!userId || !businessId || Number.isNaN(pointsDelta)) {
    return { error: "Faltan datos para registrar la puntuacion." };
  }

  const { session, isSuperadmin, isBusinessAdmin, managedBusinessIds } = await getAdminScope();

  if (!isSuperadmin && !isBusinessAdmin) {
    return { error: "No tienes permisos para puntuar." };
  }

  if (!isSuperadmin && !canManageBusinessId(managedBusinessIds, businessId)) {
    return { error: "No puedes puntuar en ese negocio." };
  }

  if (!session.user) {
    revalidatePath("/admin/scoring");
    return { success: true };
  }

  return applyPointsMutation({
    businessId,
    userId,
    pointsDelta,
    note,
    actorUserId: session.user.id
  });
}

export async function registerPurchaseAction(_: ScoringState, formData: FormData): Promise<ScoringState> {
  const userId = String(formData.get("userId") ?? "");
  const businessId = String(formData.get("businessId") ?? "");
  const amount = Number(formData.get("amount") ?? 0);

  if (!userId || !businessId || Number.isNaN(amount) || amount <= 0) {
    return { error: "Introduce un importe valido." };
  }

  const { session, isSuperadmin, isBusinessAdmin, managedBusinessIds } = await getAdminScope();

  if (!isSuperadmin && !isBusinessAdmin) {
    return { error: "No tienes permisos para puntuar." };
  }

  if (!isSuperadmin && !canManageBusinessId(managedBusinessIds, businessId)) {
    return { error: "No puedes puntuar en ese negocio." };
  }

  if (!session.user) {
    return { error: "No hemos podido recuperar la sesion del admin." };
  }

  const pointsDelta = calculatePointsFromAmount(amount);

  if (pointsDelta <= 0) {
    return { error: "El importe debe generar al menos 1 punto." };
  }

  return applyPointsMutation({
    businessId,
    userId,
    pointsDelta,
    note: `Compra registrada por ${amount.toFixed(2)} EUR desde lector QR`,
    actorUserId: session.user.id
  });
}
