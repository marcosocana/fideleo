import Link from "next/link";

import { getAdminScope } from "@/lib/auth/admin";
import { getBusinessOptions } from "@/lib/data/admin-options";
import { Button } from "@/components/shared/button";
import { SectionHeading } from "@/components/shared/section-heading";
import { SimpleTable } from "@/components/shared/simple-table";
import { getUsersList } from "@/lib/data/users";
import { formatDate, formatPoints } from "@/lib/utils";

export default async function UsersPage({
  searchParams
}: {
  searchParams: Promise<{ q?: string; tier?: string; role?: string; businessId?: string }>;
}) {
  const params = await searchParams;
  const { isSuperadmin, managedBusinessIds } = await getAdminScope();
  const [customers, businessOptions] = await Promise.all([
    getUsersList({
      query: params.q,
      tier: params.tier ?? "all",
      role: params.role ?? "all",
      businessId: params.businessId,
      businessIds: isSuperadmin ? undefined : managedBusinessIds,
      requireTransactions: true
    }),
    getBusinessOptions(isSuperadmin ? undefined : managedBusinessIds)
  ]);

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <SectionHeading
        eyebrow="Usuarios"
        title="Base de clientes"
        description="Vista global preparada para filtros, búsqueda y detalle por actividad."
        actions={
          <Link href="/admin/users/new">
            <Button>Nuevo usuario</Button>
          </Link>
        }
      />
      <form className="grid gap-4 md:grid-cols-2 xl:grid-cols-[1.2fr_220px_220px_240px_auto]" method="get">
        <input className="input-soft" defaultValue={params.q ?? ""} name="q" placeholder="Buscar por nombre, email o teléfono" />
        <select className="input-soft" defaultValue={params.tier ?? "all"} name="tier">
          <option value="all">Todos los tiers</option>
          <option value="Bronze">Bronze</option>
          <option value="Silver">Silver</option>
          <option value="Gold">Gold</option>
        </select>
        <select className="input-soft" defaultValue={params.role ?? "all"} name="role">
          <option value="all">Todos los roles</option>
          <option value="customer">Customer</option>
          <option value="business_admin">Business admin</option>
          {isSuperadmin ? <option value="superadmin">Superadmin</option> : null}
        </select>
        <select className="input-soft" defaultValue={params.businessId ?? ""} name="businessId">
          <option value="">Todos los negocios</option>
          {businessOptions.map((business) => (
            <option key={business.value} value={business.value}>
              {business.label}
            </option>
          ))}
        </select>
        <Button variant="secondary">Filtrar</Button>
      </form>
      <SimpleTable
        emptyMessage="No hay usuarios que coincidan con los filtros."
        columns={[
          {
            key: "firstName",
            label: "Usuario",
            render: (row) => (
              <Link href={`/admin/users/${row.id}`} className="block">
                <p className="font-medium">{row.firstName} {row.lastName}</p>
                <p className="text-xs text-muted">{row.email}</p>
              </Link>
            )
          },
          {
            key: "currentTier",
            label: "Tier",
            render: (row) => row.roles.includes("superadmin") ? "Superadmin" : row.currentTier
          },
          {
            key: "totalPoints",
            label: "Puntos",
            align: "right",
            render: (row) => formatPoints(row.totalPoints)
          },
          { key: "totalRewardsRedeemed", label: "Canjes", align: "right" },
          {
            key: "lastActivity",
            label: "Última actividad",
            render: (row) => formatDate(row.lastActivity)
          }
        ]}
        rows={customers}
      />
    </div>
  );
}
