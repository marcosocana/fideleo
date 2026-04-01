import Link from "next/link";

import { Button } from "@/components/shared/button";
import { SectionHeading } from "@/components/shared/section-heading";
import { SimpleTable } from "@/components/shared/simple-table";
import { getUsersList } from "@/lib/data/users";
import { formatDate, formatPoints } from "@/lib/utils";

export default async function UsersPage() {
  const customers = await getUsersList();

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
      <div className="grid gap-4 md:grid-cols-[1fr_auto_auto]">
        <input className="input-soft" placeholder="Buscar por nombre, email o teléfono" />
        <button className="button-secondary">Tier</button>
        <button className="button-secondary">Más filtros</button>
      </div>
      <SimpleTable
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
          { key: "currentTier", label: "Tier" },
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
