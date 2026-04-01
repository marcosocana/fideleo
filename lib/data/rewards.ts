import type { Reward } from "@/lib/types/domain";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import { getSupabaseServerClient } from "@/lib/supabase/server";

interface RewardRow {
  id: string;
  business_id: string;
  businesses?: { name: string } | null;
  title: string;
  description: string | null;
  reward_type: Reward["rewardType"];
  points_required: number;
  starts_at: string | null;
  ends_at: string | null;
  is_active: boolean;
}

interface GetRewardsListOptions {
  query?: string;
  businessId?: string;
  status?: "all" | "active" | "inactive";
  businessIds?: string[];
}

function mapRewardRow(row: RewardRow): Reward {
  return {
    id: row.id,
    businessId: row.business_id,
    businessName: row.businesses?.name,
    title: row.title,
    description: row.description ?? "",
    rewardType: row.reward_type,
    pointsRequired: row.points_required,
    startsAt: row.starts_at ?? new Date().toISOString(),
    endsAt: row.ends_at ?? new Date().toISOString(),
    isActive: row.is_active
  };
}

export async function getRewardsList(options: GetRewardsListOptions = {}) {
  const supabase = getSupabaseAdminClient() ?? (await getSupabaseServerClient());

  if (!supabase) {
    return [];
  }

  let query = supabase
    .from("rewards")
    .select("id, business_id, title, description, reward_type, points_required, starts_at, ends_at, is_active, businesses(name)")
    .order("created_at", { ascending: false });

  if (options.businessId) {
    query = query.eq("business_id", options.businessId);
  }

  if (options.businessIds?.length) {
    query = query.in("business_id", options.businessIds);
  }

  if (options.status === "active") {
    query = query.eq("is_active", true);
  }

  if (options.status === "inactive") {
    query = query.eq("is_active", false);
  }

  const { data } = await query;

  const normalizedQuery = options.query?.trim().toLowerCase();

  return ((data as unknown as RewardRow[]) ?? [])
    .filter((row) => {
      if (!normalizedQuery) {
        return true;
      }

      return [row.title, row.description ?? "", row.businesses?.name ?? ""].join(" ").toLowerCase().includes(normalizedQuery);
    })
    .map(mapRewardRow);
}

export async function getRewardById(id: string) {
  const supabase = getSupabaseAdminClient() ?? (await getSupabaseServerClient());

  if (!supabase) {
    return null;
  }

  const { data } = await supabase
    .from("rewards")
    .select("id, business_id, title, description, reward_type, points_required, starts_at, ends_at, is_active, businesses(name)")
    .eq("id", id)
    .maybeSingle();

  if (!data) {
    return null;
  }

  return mapRewardRow(data as unknown as RewardRow);
}

export async function getRewardsByBusinessId(businessId: string, options?: { activeOnly?: boolean }) {
  const supabase = await getSupabaseServerClient();

  if (!supabase) {
    return [];
  }

  let query = supabase
    .from("rewards")
    .select("id, business_id, title, description, reward_type, points_required, starts_at, ends_at, is_active, businesses(name)")
    .eq("business_id", businessId)
    .order("points_required", { ascending: true });

  if (options?.activeOnly) {
    query = query.eq("is_active", true);
  }

  const { data } = await query;
  return ((data as unknown as RewardRow[]) ?? []).map(mapRewardRow);
}
