import { rewards as demoRewards } from "@/lib/data/demo";
import type { Reward } from "@/lib/types/domain";
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

export async function getRewardsList() {
  const supabase = await getSupabaseServerClient();

  if (!supabase) {
    return demoRewards;
  }

  const { data } = await supabase
    .from("rewards")
    .select("id, business_id, title, description, reward_type, points_required, starts_at, ends_at, is_active, businesses(name)")
    .order("created_at", { ascending: false });

  if (!data?.length) {
    return demoRewards;
  }

  return (data as unknown as RewardRow[]).map(mapRewardRow);
}

export async function getRewardById(id: string) {
  const supabase = await getSupabaseServerClient();

  if (!supabase) {
    return demoRewards.find((reward) => reward.id === id) ?? demoRewards[0];
  }

  const { data } = await supabase
    .from("rewards")
    .select("id, business_id, title, description, reward_type, points_required, starts_at, ends_at, is_active, businesses(name)")
    .eq("id", id)
    .maybeSingle();

  if (!data) {
    return demoRewards.find((reward) => reward.id === id) ?? demoRewards[0];
  }

  return mapRewardRow(data as unknown as RewardRow);
}
