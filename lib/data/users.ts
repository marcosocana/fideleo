import type { ActivityItem, CustomerDetail, CustomerSnapshot, MembershipSummary } from "@/lib/types/domain";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import { getSupabaseServerClient } from "@/lib/supabase/server";

interface MembershipRow {
  id?: string;
  current_points: number;
  current_tier: string;
  total_points_earned?: number;
  total_points_redeemed: number;
  business_id: string;
  last_activity_at: string | null;
  businesses?: {
    name: string;
  } | null;
}

interface UserRow {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  created_at: string;
  business_memberships: MembershipRow[] | null;
  user_roles?: Array<{ role: string }> | null;
}

function mapUserRow(row: UserRow): CustomerSnapshot {
  const memberships = row.business_memberships ?? [];
  const totalPoints = memberships.reduce((sum, membership) => sum + membership.current_points, 0);
  const totalRewardsRedeemed = memberships.reduce((sum, membership) => sum + membership.total_points_redeemed, 0);
  const lastActivity = memberships
    .map((membership) => membership.last_activity_at)
    .filter((value): value is string => Boolean(value))
    .sort()
    .at(-1) ?? row.created_at;
  const currentTier = memberships[0]?.current_tier ?? "Bronze";

  return {
    id: row.id,
    firstName: row.first_name,
    lastName: row.last_name,
    email: row.email,
    phone: row.phone ?? undefined,
    currentTier,
    totalPoints,
    totalRewardsRedeemed,
    businessesVisited: memberships.length,
    lastActivity,
    joinedAt: row.created_at
  };
}

export async function getUsersList() {
  const supabase = getSupabaseAdminClient() ?? (await getSupabaseServerClient());

  if (!supabase) {
    return [];
  }

  const { data } = await supabase
    .from("profiles")
    .select(
      "id, first_name, last_name, email, phone, created_at, user_roles(role), business_memberships(current_points, current_tier, total_points_redeemed, business_id, last_activity_at)"
    )
    .order("created_at", { ascending: false });

  return ((data as unknown as UserRow[]) ?? []).map(mapUserRow);
}

function mapMemberships(memberships: MembershipRow[]): MembershipSummary[] {
  return memberships.map((membership) => ({
    businessId: membership.business_id,
    businessName: membership.businesses?.name ?? "Negocio",
    currentPoints: membership.current_points,
    currentTier: membership.current_tier,
    totalPointsEarned: membership.total_points_earned ?? membership.current_points,
    totalPointsRedeemed: membership.total_points_redeemed,
    lastActivity: membership.last_activity_at
  }));
}

export async function getUserById(id: string): Promise<CustomerDetail> {
  const supabase = getSupabaseAdminClient() ?? (await getSupabaseServerClient());

  if (!supabase) {
    throw new Error("Supabase no está configurado.");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select(
      "id, first_name, last_name, email, phone, created_at, business_memberships(current_points, current_tier, total_points_earned, total_points_redeemed, business_id, last_activity_at, businesses(name))"
    )
    .eq("id", id)
    .maybeSingle();

  const { data: transactions } = await supabase
    .from("point_transactions")
    .select("id, type, points_delta, note, created_at")
    .eq("user_id", id)
    .order("created_at", { ascending: false })
    .limit(6);

  if (!profile) {
    throw new Error("Usuario no encontrado.");
  }

  const base = mapUserRow(profile as unknown as UserRow);
  const memberships = mapMemberships(((profile as unknown as UserRow).business_memberships ?? []) as MembershipRow[]);
  const recentActivity: ActivityItem[] = (transactions ?? []).map((item: any) => ({
    id: item.id,
    title: item.type === "redeem" ? "Canje" : item.type === "bonus" ? "Bonus" : "Movimiento de puntos",
    detail: item.note ?? `${item.points_delta > 0 ? "+" : ""}${item.points_delta} puntos`,
    date: item.created_at
  }));

  return {
    ...base,
    memberships,
    recentActivity
  };
}

export async function getCustomerActivity(userId: string, businessId?: string): Promise<ActivityItem[]> {
  const supabase = await getSupabaseServerClient();

  if (!supabase) {
    return [];
  }

  let query = supabase
    .from("point_transactions")
    .select("id, type, points_delta, note, created_at, business_id")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(20);

  if (businessId) {
    query = query.eq("business_id", businessId);
  }

  const { data } = await query;

  return (data ?? []).map((item: any) => ({
    id: item.id,
    title: item.type === "redeem" ? "Canje" : item.type === "bonus" ? "Bonus" : "Movimiento de puntos",
    detail: item.note ?? `${item.points_delta > 0 ? "+" : ""}${item.points_delta} puntos`,
    date: item.created_at
  }));
}

export async function getMembershipForBusiness(userId: string, businessId: string) {
  const supabase = await getSupabaseServerClient();

  if (!supabase) {
    return null;
  }

  const { data: membership } = await supabase
    .from("business_memberships")
    .select("current_points, current_tier, total_points_earned, total_points_redeemed")
    .eq("user_id", userId)
    .eq("business_id", businessId)
    .maybeSingle();

  if (!membership) {
    return null;
  }

  const { data: rewards } = await supabase
    .from("rewards")
    .select("title, points_required")
    .eq("business_id", businessId)
    .eq("is_active", true)
    .order("points_required", { ascending: true });

  const nextReward = (rewards ?? []).find((reward: any) => reward.points_required > membership.current_points) ?? null;

  return {
    businessId,
    currentPoints: membership.current_points,
    currentTier: membership.current_tier as "Bronze" | "Silver" | "Gold",
    totalPointsEarned: membership.total_points_earned,
    totalPointsRedeemed: membership.total_points_redeemed,
    nextRewardTitle: nextReward?.title ?? "Sin recompensa pendiente",
    pointsToNextReward: nextReward ? Math.max(nextReward.points_required - membership.current_points, 0) : 0
  };
}
