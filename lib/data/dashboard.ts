import type { Kpi } from "@/lib/types/domain";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { getBusinessesList } from "@/lib/data/businesses";

interface ActivitySignal {
  id: string;
  message: string;
  createdAt: string;
}

function formatTrend(value: number) {
  if (value === 0) {
    return "Sin cambios";
  }

  return `${value > 0 ? "+" : ""}${value}%`;
}

export async function getDashboardSnapshot(options?: { businessIds?: string[] }): Promise<{
  kpis: Kpi[];
  businesses: Awaited<ReturnType<typeof getBusinessesList>>;
  recentSignals: ActivitySignal[];
}> {
  const supabase = getSupabaseAdminClient() ?? (await getSupabaseServerClient());

  if (!supabase) {
    return {
      kpis: [
        { label: "Negocios", value: "0", trendDirection: "flat", trend: "Sin datos" },
        { label: "Usuarios", value: "0", trendDirection: "flat", trend: "Sin datos" },
        { label: "Premios", value: "0", trendDirection: "flat", trend: "Sin datos" },
        { label: "Transacciones", value: "0", trendDirection: "flat", trend: "Sin datos" }
      ],
      businesses: [],
      recentSignals: []
    };
  }

  const businesses = await getBusinessesList({ ids: options?.businessIds });
  const [{ count: usersCount }, { count: rewardsCount }, { count: transactionCount }, { data: audits }] = await Promise.all([
    supabase.from("profiles").select("*", { count: "exact", head: true }),
    supabase.from("rewards").select("*", { count: "exact", head: true }),
    supabase.from("point_transactions").select("*", { count: "exact", head: true }),
    (() => {
      let query = supabase
        .from("audit_logs")
        .select("id, action, action_type, details, entity_type, created_at, business_id")
        .order("created_at", { ascending: false })
        .limit(5);

      if (options?.businessIds?.length) {
        query = query.in("business_id", options.businessIds);
      }

      return query;
    })()
  ]);

  const totalActiveUsers = businesses.reduce((sum, business) => sum + business.activeUsers, 0);
  const totalUsers = businesses.reduce((sum, business) => sum + business.totalUsers, 0);
  const activeUserRatio = totalUsers === 0 ? 0 : Math.round((totalActiveUsers / totalUsers) * 100);

  const kpis: Kpi[] = [
    {
      label: "Negocios",
      value: String(businesses.length),
      trendDirection: businesses.length > 0 ? "up" : "flat",
      trend: businesses.length > 0 ? "Operativos" : "Sin datos"
    },
    {
      label: "Usuarios",
      value: String(usersCount ?? 0),
      trendDirection: activeUserRatio > 0 ? "up" : "flat",
      trend: `${activeUserRatio}% activos`
    },
    {
      label: "Premios",
      value: String(rewardsCount ?? 0),
      trendDirection: (rewardsCount ?? 0) > 0 ? "up" : "flat",
      trend: "Catálogo en vivo"
    },
    {
      label: "Transacciones",
      value: String(transactionCount ?? 0),
      trendDirection: (transactionCount ?? 0) > 0 ? "up" : "flat",
      trend: formatTrend(Math.min(transactionCount ?? 0, 100))
    }
  ];

  const recentSignals: ActivitySignal[] = (audits ?? []).map((item: any) => ({
    id: item.id,
    message:
      item.details ??
      item.action_type ??
      item.action ??
      item.entity_type ??
      "Actualización operativa registrada.",
    createdAt: item.created_at
  }));

  return { kpis, businesses, recentSignals };
}
