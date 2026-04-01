import { businesses as demoBusinesses } from "@/lib/data/demo";
import type { Business } from "@/lib/types/domain";
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
  const supabase = await getSupabaseServerClient();

  if (!supabase) {
    return demoBusinesses;
  }

  const { data } = await supabase
    .from("businesses")
    .select("id, name, slug, logo_url, owner_name, owner_email, primary_color, secondary_color, accent_color, font_family, welcome_text, is_active")
    .order("created_at", { ascending: false });

  if (!data?.length) {
    return demoBusinesses;
  }

  return (data as unknown as BusinessRow[]).map(mapBusinessRow);
}

export async function getBusinessById(id: string) {
  const supabase = await getSupabaseServerClient();

  if (!supabase) {
    return demoBusinesses.find((business) => business.id === id) ?? demoBusinesses[0];
  }

  const { data } = await supabase
    .from("businesses")
    .select("id, name, slug, logo_url, owner_name, owner_email, primary_color, secondary_color, accent_color, font_family, welcome_text, is_active")
    .eq("id", id)
    .maybeSingle();

  if (!data) {
    return demoBusinesses.find((business) => business.id === id) ?? demoBusinesses[0];
  }

  return mapBusinessRow(data as unknown as BusinessRow);
}
