import { cache } from "react";

import type { Business, Role } from "@/lib/types/domain";
import { businesses as demoBusinesses, viewer as demoViewer } from "@/lib/data/demo";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export interface SessionContext {
  isDemo: boolean;
  isAuthenticated: boolean;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
  } | null;
  roles: Role[];
  assignedBusinesses: Business[];
}

interface AssignmentBusinessRow {
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

export const getSessionContext = cache(async (): Promise<SessionContext> => {
  const supabase = await getSupabaseServerClient();

  if (!supabase) {
    return {
      isDemo: true,
      isAuthenticated: false,
      user: null,
      roles: [],
      assignedBusinesses: demoBusinesses
    };
  }

  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      isDemo: false,
      isAuthenticated: false,
      user: null,
      roles: [],
      assignedBusinesses: []
    };
  }

  const [{ data: profile }, { data: roleRows }, { data: assignmentRows }] = await Promise.all([
    supabase.from("profiles").select("first_name, last_name, email").eq("id", user.id).maybeSingle(),
    supabase.from("user_roles").select("role").eq("user_id", user.id),
    supabase
      .from("business_admin_assignments")
      .select("business_id, businesses(*)")
      .eq("user_id", user.id)
  ]);

  const roles = ((roleRows ?? []).map((item) => item.role) as Role[]) ?? [];
  const assignmentItems = (assignmentRows ?? []) as Array<{ businesses?: AssignmentBusinessRow | null }>;
  const assignedBusinesses = assignmentItems
    .map((item) => item.businesses ?? null)
    .map((item) =>
      item
        ? {
            id: item.id,
            name: item.name,
            slug: item.slug,
            logo: item.logo_url ?? item.name.slice(0, 2).toUpperCase(),
            ownerName: item.owner_name ?? "",
            ownerEmail: item.owner_email ?? "",
            primaryColor: item.primary_color,
            secondaryColor: item.secondary_color,
            accentColor: item.accent_color,
            fontFamily: item.font_family,
            welcomeText: item.welcome_text ?? "",
            isActive: item.is_active,
            totalUsers: 0,
            activeUsers: 0,
            activeRewards: 0
          }
        : null
    )
    .filter((item): item is Business => Boolean(item));

  return {
    isDemo: false,
    isAuthenticated: true,
    user: {
      id: user.id,
      email: profile?.email ?? user.email ?? demoViewer.email,
      firstName: profile?.first_name ?? demoViewer.firstName,
      lastName: profile?.last_name ?? demoViewer.lastName
    },
    roles,
    assignedBusinesses
  };
});

export async function getBusinessBySlug(slug: string) {
  const supabase = await getSupabaseServerClient();

  if (!supabase) {
    return demoBusinesses.find((business) => business.slug === slug) ?? null;
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

  return {
    id: data.id,
    name: data.name,
    slug: data.slug,
    logo: data.logo_url ?? data.name.slice(0, 2).toUpperCase(),
    ownerName: data.owner_name ?? "",
    ownerEmail: data.owner_email ?? "",
    primaryColor: data.primary_color,
    secondaryColor: data.secondary_color,
    accentColor: data.accent_color,
    fontFamily: data.font_family,
    welcomeText: data.welcome_text ?? "",
    isActive: data.is_active,
    totalUsers: 0,
    activeUsers: 0,
    activeRewards: 0
  } satisfies Business;
}
