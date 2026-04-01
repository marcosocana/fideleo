import { activityTimeline, customers as demoCustomers } from "@/lib/data/demo";
import type { ActivityItem, CustomerDetail, CustomerSnapshot, MembershipSummary } from "@/lib/types/domain";
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
  const supabase = await getSupabaseServerClient();

  if (!supabase) {
    return demoCustomers;
  }

  const { data } = await supabase
    .from("profiles")
    .select(
      "id, first_name, last_name, email, phone, created_at, business_memberships(current_points, current_tier, total_points_redeemed, business_id, last_activity_at)"
    )
    .order("created_at", { ascending: false });

  if (!data?.length) {
    return demoCustomers;
  }

  return (data as unknown as UserRow[])
    .map(mapUserRow)
    .filter((row) => row.businessesVisited > 0);
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
  const supabase = await getSupabaseServerClient();

  if (!supabase) {
    const customer = demoCustomers.find((item) => item.id === id) ?? demoCustomers[0];

    return {
      ...customer,
      memberships: [
        {
          businessId: "biz-casa-luma",
          businessName: "Casa Luma",
          currentPoints: customer.totalPoints,
          currentTier: customer.currentTier,
          totalPointsEarned: customer.totalPoints + customer.totalRewardsRedeemed * 10,
          totalPointsRedeemed: customer.totalRewardsRedeemed * 10,
          lastActivity: customer.lastActivity
        }
      ],
      recentActivity: activityTimeline.map((item, index) => ({
        id: `demo-${index}`,
        title: item.title,
        detail: item.detail,
        date: item.date
      }))
    };
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
    const fallback = demoCustomers[0];
    return {
      ...fallback,
      memberships: [],
      recentActivity: []
    };
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
