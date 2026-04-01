import Link from "next/link";

import { Button } from "@/components/shared/button";
import { SectionHeading } from "@/components/shared/section-heading";
import { SimpleTable } from "@/components/shared/simple-table";
import { getBusinessesList } from "@/lib/data/businesses";

export default async function BusinessesPage() {
  const businesses = await getBusinessesList();

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <SectionHeading
        eyebrow="Superadmin"
        title="Negocios"
        description="Listado con estructura preparada para búsqueda, filtros y paginación."
        actions={
          <Link href="/admin/businesses/new">
            <Button>Nuevo negocio</Button>
          </Link>
        }
      />

      <div className="grid gap-4 md:grid-cols-[1fr_auto_auto]">
        <input className="input-soft" placeholder="Buscar por nombre, slug o owner" />
        <Button variant="secondary">Activos</Button>
        <Button variant="secondary">Ordenar</Button>
      </div>

      <SimpleTable
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
