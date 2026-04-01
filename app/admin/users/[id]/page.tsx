import Link from "next/link";
import { notFound } from "next/navigation";

import { getAdminScope } from "@/lib/auth/admin";
import { deleteUserAction } from "@/app/admin/users/actions";
import { Button } from "@/components/shared/button";
import { SectionHeading } from "@/components/shared/section-heading";
import { getUserById } from "@/lib/data/users";
import { formatDate } from "@/lib/utils";

export default async function UserDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { isSuperadmin, managedBusinessIds } = await getAdminScope();
  const customer = await getUserById(id).catch(() => null);

  if (!customer) {
    notFound();
  }

  if (!isSuperadmin && customer.roles.includes("superadmin")) {
    notFound();
  }

  if (!isSuperadmin && customer.primaryBusinessId && !managedBusinessIds.includes(customer.primaryBusinessId)) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <SectionHeading
        eyebrow="Perfil cliente"
        title={`${customer.firstName} ${customer.lastName}`}
        description="Historial, nivel, actividad y relación con negocios."
        actions={
          <>
            <Link href={`/admin/users/${customer.id}/edit`}>
              <Button variant="secondary">Editar</Button>
            </Link>
            {!customer.roles.includes("superadmin") || isSuperadmin ? (
              <form action={deleteUserAction.bind(null, customer.id)}>
                <Button variant="secondary">Eliminar</Button>
              </form>
            ) : null}
          </>
        }
      />
      <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="card-surface p-6">
          <div className="space-y-4">
            <div>
              <p className="text-sm text-muted">Email</p>
              <p className="mt-1 font-medium">{customer.email}</p>
            </div>
            <div>
              <p className="text-sm text-muted">Teléfono</p>
              <p className="mt-1 font-medium">{customer.phone}</p>
            </div>
            <div>
              <p className="text-sm text-muted">Tier actual</p>
              <p className="mt-1 font-medium">{customer.currentTier}</p>
            </div>
            <div>
              <p className="text-sm text-muted">Negocios visitados</p>
              <p className="mt-1 font-medium">{customer.businessesVisited}</p>
            </div>
            <div>
              <p className="text-sm text-muted">Puntos totales</p>
              <p className="mt-1 font-medium">{customer.totalPoints}</p>
            </div>
          </div>
          <div className="mt-6 border-t border-line pt-6">
            <p className="text-sm text-muted">Membresías</p>
            <div className="mt-3 space-y-3">
              {customer.memberships.map((membership) => (
                <div key={membership.businessId} className="rounded-2xl bg-slate-50 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-medium">{membership.businessName}</p>
                    <p className="text-sm text-muted">{membership.currentTier}</p>
                  </div>
                  <p className="mt-2 text-sm text-muted">
                    {membership.currentPoints} pts actuales · {membership.totalPointsRedeemed} pts canjeados
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="card-surface p-6">
          <p className="text-sm text-muted">Actividad reciente</p>
          <div className="mt-4 space-y-4">
            {customer.recentActivity.map((item) => (
              <div key={item.id} className="rounded-2xl border border-line bg-slate-50/70 p-4">
                <div className="flex items-center justify-between gap-4">
                  <p className="font-medium">{item.title}</p>
                  <p className="text-xs text-muted">{formatDate(item.date)}</p>
                </div>
                <p className="mt-2 text-sm text-muted">{item.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
