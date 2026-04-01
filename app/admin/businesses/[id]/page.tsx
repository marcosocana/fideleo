import Link from "next/link";

import { deleteBusinessAction } from "@/app/admin/businesses/actions";
import { SectionHeading } from "@/components/shared/section-heading";
import { Button } from "@/components/shared/button";
import { getBusinessById } from "@/lib/data/businesses";

export default async function BusinessDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const business = await getBusinessById(id);

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <SectionHeading
        eyebrow="Detalle negocio"
        title={business.name}
        description={`Configuración editable del tenant /${business.slug}`}
        actions={
          <>
            <Link href={`/admin/businesses/${business.id}/edit`}>
              <Button variant="secondary">Editar</Button>
            </Link>
            <form action={deleteBusinessAction.bind(null, business.id)}>
              <Button variant="secondary">Eliminar</Button>
            </form>
          </>
        }
      />
      <section className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="card-surface p-6">
          <h2 className="text-lg font-semibold">Resumen</h2>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <div>
              <p className="text-sm text-muted">Owner</p>
              <p className="mt-1 font-medium">{business.ownerName}</p>
            </div>
            <div>
              <p className="text-sm text-muted">Email</p>
              <p className="mt-1 font-medium">{business.ownerEmail}</p>
            </div>
            <div>
              <p className="text-sm text-muted">Usuarios</p>
              <p className="mt-1 font-medium">{business.totalUsers}</p>
            </div>
            <div>
              <p className="text-sm text-muted">Premios activos</p>
              <p className="mt-1 font-medium">{business.activeRewards}</p>
            </div>
          </div>
        </div>
        <div className="card-surface p-6">
          <p className="text-sm text-muted">Branding</p>
          <div className="mt-4 rounded-[24px] p-6 text-white shadow-soft" style={{ background: business.primaryColor }}>
            <p className="text-sm opacity-80">Vista previa</p>
            <h3 className="mt-2 text-2xl font-semibold">{business.name}</h3>
            <p className="mt-3 text-sm opacity-80">{business.welcomeText}</p>
          </div>
        </div>
      </section>
    </div>
  );
}
