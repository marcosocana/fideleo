import { cache } from "react";

import type { Business, Role } from "@/lib/types/domain";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { getBusinessBySlugRecord } from "@/lib/data/businesses";

export interface SessionContext {
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
      isAuthenticated: false,
      user: null,
      roles: [],
      assignedBusinesses: []
    };
  }

  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return {
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
  let assignedBusinesses = assignmentItems
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

  if (assignedBusinesses.length === 0 && roles.includes("business_admin")) {
    const { data: membershipBusinesses } = await supabase
      .from("business_memberships")
      .select("businesses(*)")
      .eq("user_id", user.id);

    assignedBusinesses = ((membershipBusinesses ?? []) as Array<{ businesses?: AssignmentBusinessRow | null }>)
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
  }

  return {
    isAuthenticated: true,
    user: {
      id: user.id,
      email: profile?.email ?? user.email ?? "",
      firstName: profile?.first_name ?? user.user_metadata.first_name ?? "",
      lastName: profile?.last_name ?? user.user_metadata.last_name ?? ""
    },
    roles,
    assignedBusinesses
  };
});

export async function getBusinessBySlug(slug: string) {
  return getBusinessBySlugRecord(slug);
}
