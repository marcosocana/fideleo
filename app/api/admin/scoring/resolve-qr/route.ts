import { NextResponse } from "next/server";

import { canManageBusinessId, getAdminScope } from "@/lib/auth/admin";
import { decodeCustomerQrToken } from "@/lib/loyalty/qr";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token") ?? "";
  const currentBusinessId = searchParams.get("businessId") ?? "";
  const parsed = decodeCustomerQrToken(token);

  if (!parsed || !currentBusinessId || parsed.businessId !== currentBusinessId) {
    return NextResponse.json({ error: "QR no valido para este negocio." }, { status: 400 });
  }

  const { isSuperadmin, isBusinessAdmin, managedBusinessIds } = await getAdminScope();

  if (!isSuperadmin && !isBusinessAdmin) {
    return NextResponse.json({ error: "No autorizado." }, { status: 403 });
  }

  if (!isSuperadmin && !canManageBusinessId(managedBusinessIds, currentBusinessId)) {
    return NextResponse.json({ error: "No autorizado para ese negocio." }, { status: 403 });
  }

  const adminClient = getSupabaseAdminClient();

  if (!adminClient) {
    return NextResponse.json({ error: "Supabase no disponible." }, { status: 500 });
  }

  const { data: profile, error: profileError } = await adminClient
    .from("profiles")
    .select("id, first_name, last_name, email, phone")
    .eq("id", parsed.userId)
    .maybeSingle();

  if (profileError || !profile) {
    return NextResponse.json({ error: "No hemos encontrado el perfil del usuario." }, { status: 404 });
  }

  const { data: membership, error: membershipError } = await adminClient
    .from("business_memberships")
    .select("current_points, current_tier, total_points_redeemed")
    .eq("business_id", currentBusinessId)
    .eq("user_id", parsed.userId)
    .maybeSingle();

  if (membershipError || !membership) {
    return NextResponse.json({ error: "El usuario no pertenece a este negocio." }, { status: 404 });
  }

  return NextResponse.json({
    customer: {
      id: profile.id,
      firstName: profile.first_name,
      lastName: profile.last_name,
      email: profile.email,
      phone: profile.phone,
      currentTier: membership.current_tier,
      totalPoints: membership.current_points,
      totalRewardsRedeemed: membership.total_points_redeemed,
      businessesVisited: 1,
      lastActivity: new Date().toISOString(),
      joinedAt: new Date().toISOString(),
      roles: ["customer"],
      primaryBusinessId: currentBusinessId
    }
  });
}
