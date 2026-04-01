import Link from "next/link";

import { getAdminScope } from "@/lib/auth/admin";
import { Button } from "@/components/shared/button";
import { SectionHeading } from "@/components/shared/section-heading";
import { SimpleTable } from "@/components/shared/simple-table";
import { getBusinessesList } from "@/lib/data/businesses";

export default async function BusinessesPage({
  searchParams
}: {
  searchParams: Promise<{ q?: string; status?: "all" | "active" | "inactive" }>;
}) {
  const params = await searchParams;
  const { isSuperadmin, managedBusinessIds } = await getAdminScope();
  const businesses = await getBusinessesList({
    query: params.q,
    active: params.status ?? "all",
    ids: isSuperadmin ? undefined : managedBusinessIds
  });

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <SectionHeading
        eyebrow={isSuperadmin ? "Superadmin" : "Negocio"}
        title={isSuperadmin ? "Negocios" : "Negocios asignados"}
        description="Listado con búsqueda y filtro por estado sobre datos reales."
        actions={
          isSuperadmin ? (
            <Link href="/admin/businesses/new">
              <Button>Nuevo negocio</Button>
            </Link>
          ) : null
        }
      />

      <form className="grid gap-4 md:grid-cols-[1fr_220px_auto]" method="get">
        <input className="input-soft" defaultValue={params.q ?? ""} name="q" placeholder="Buscar por nombre, slug o owner" />
        <select className="input-soft" defaultValue={params.status ?? "all"} name="status">
          <option value="all">Todos los estados</option>
          <option value="active">Activos</option>
          <option value="inactive">Inactivos</option>
        </select>
        <Button variant="secondary">Filtrar</Button>
      </form>

      <SimpleTable
        emptyMessage="No hay negocios que coincidan con los filtros."
        columns={[
          {
            key: "name",
            label: "Negocio",
            render: (row) => (
              <Link href={`/admin/businesses/${row.id}`} className="block">
                <p className="font-medium">{row.name}</p>
                <p className="text-xs text-muted">/{row.slug}</p>
              </Link>
            )
          },
          { key: "ownerEmail", label: "Contacto" },
          { key: "activeRewards", label: "Premios", align: "right" },
          { key: "totalUsers", label: "Usuarios", align: "right" },
          { key: "activeUsers", label: "Activos", align: "right" }
        ]}
        rows={businesses}
      />
    </div>
  );
}
