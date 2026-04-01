import type { Business } from "@/lib/types/domain";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import { getSupabaseServerClient } from "@/lib/supabase/server";

interface BusinessRow {
  id: string;
  name: string;
  slug: string;
  logo_url: string | null;
  owner_name: string | null;
  owner_email: string | null;
  primary_color: string;
  secondary_color: string;
  accent_color: string;
  font_family: string;
  welcome_text: string | null;
  is_active: boolean;
}

function mapBusinessRow(row: BusinessRow): Business {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    logo: row.logo_url ?? row.name.slice(0, 2).toUpperCase(),
    ownerName: row.owner_name ?? "",
    ownerEmail: row.owner_email ?? "",
    primaryColor: row.primary_color,
    secondaryColor: row.secondary_color,
    accentColor: row.accent_color,
    fontFamily: row.font_family,
    welcomeText: row.welcome_text ?? "",
    isActive: row.is_active,
    totalUsers: 0,
    activeUsers: 0,
    activeRewards: 0
  };
}

export async function getBusinessesList() {
  const supabase = getSupabaseAdminClient() ?? (await getSupabaseServerClient());

  if (!supabase) {
    return [];
  }

  const [{ data: businessesData }, { data: memberships }, { data: rewards }] = await Promise.all([
    supabase
      .from("businesses")
      .select("id, name, slug, logo_url, owner_name, owner_email, primary_color, secondary_color, accent_color, font_family, welcome_text, is_active")
      .order("created_at", { ascending: false }),
    supabase.from("business_memberships").select("business_id, last_activity_at"),
    supabase.from("rewards").select("business_id, is_active")
  ]);

  if (!businessesData?.length) {
    return [];
  }

  return (businessesData as unknown as BusinessRow[]).map((row) => {
    const base = mapBusinessRow(row);
    const businessMemberships = (memberships ?? []).filter((item: any) => item.business_id === row.id);
    const businessRewards = (rewards ?? []).filter((item: any) => item.business_id === row.id);
    const thirtyDaysAgo = Date.now() - 1000 * 60 * 60 * 24 * 30;

    return {
      ...base,
      totalUsers: businessMemberships.length,
      activeUsers: businessMemberships.filter((item: any) => {
        if (!item.last_activity_at) {
          return false;
        }

        return new Date(item.last_activity_at).getTime() >= thirtyDaysAgo;
      }).length,
      activeRewards: businessRewards.filter((item: any) => item.is_active).length
    };
  });
}

export async function getBusinessById(id: string) {
  const businesses = await getBusinessesList();
  return businesses.find((business) => business.id === id) ?? null;
}

export async function getBusinessBySlugRecord(slug: string) {
  const supabase = getSupabaseAdminClient() ?? (await getSupabaseServerClient());

  if (!supabase) {
    return null;
  }

  const { data } = await supabase
    .from("businesses")
    .select("id, name, slug, logo_url, owner_name, owner_email, primary_color, secondary_color, accent_color, font_family, welcome_text, is_active")
    .eq("slug", slug)
    .eq("is_active", true)
    .maybeSingle();

  if (!data) {
    return null;
  }

  return mapBusinessRow(data as unknown as BusinessRow);
}
