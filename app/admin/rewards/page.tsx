import Link from "next/link";

import { getAdminScope } from "@/lib/auth/admin";
import { getBusinessOptions } from "@/lib/data/admin-options";
import { Button } from "@/components/shared/button";
import { RewardTile } from "@/components/customer/reward-tile";
import { SectionHeading } from "@/components/shared/section-heading";
import { getRewardsList } from "@/lib/data/rewards";

export default async function RewardsPage({
  searchParams
}: {
  searchParams: Promise<{ q?: string; status?: string; businessId?: string }>;
}) {
  const params = await searchParams;
  const { isSuperadmin, managedBusinessIds } = await getAdminScope();
  const [rewards, businessOptions] = await Promise.all([
    getRewardsList({
      query: params.q,
      status: (params.status as "all" | "active" | "inactive" | undefined) ?? "all",
      businessId: params.businessId,
      businessIds: isSuperadmin ? undefined : managedBusinessIds
    }),
    getBusinessOptions(isSuperadmin ? undefined : managedBusinessIds)
  ]);

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <SectionHeading
        eyebrow="Premios"
        title="Catálogo de recompensas"
        description="Catálogo en tiempo real conectado a Supabase, listo para CRUD, validez y stock."
        actions={
          <Link href="/admin/rewards/new">
            <Button>Nuevo premio</Button>
          </Link>
        }
      />
      <form className="grid gap-4 md:grid-cols-[1fr_240px_240px_auto]" method="get">
        <input className="input-soft" defaultValue={params.q ?? ""} name="q" placeholder="Buscar por titulo o descripción" />
        <select className="input-soft" defaultValue={params.businessId ?? ""} name="businessId">
          <option value="">Todos los negocios</option>
          {businessOptions.map((business) => (
            <option key={business.value} value={business.value}>
              {business.label}
            </option>
          ))}
        </select>
        <select className="input-soft" defaultValue={params.status ?? "all"} name="status">
          <option value="all">Todos los estados</option>
          <option value="active">Activos</option>
          <option value="inactive">Inactivos</option>
        </select>
        <Button variant="secondary">Filtrar</Button>
      </form>
      <div className="grid gap-5 lg:grid-cols-2">
        {rewards.length === 0 ? <div className="card-surface p-6 text-sm text-muted">No hay premios para esos filtros.</div> : null}
        {rewards.map((reward) => (
          <Link key={reward.id} href={`/admin/rewards/${reward.id}`}>
            <RewardTile reward={reward} />
          </Link>
        ))}
      </div>
    </div>
  );
}
