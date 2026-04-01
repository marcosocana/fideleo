import Link from "next/link";
import { notFound } from "next/navigation";

import { getAdminScope } from "@/lib/auth/admin";
import { deleteRewardAction } from "@/app/admin/rewards/actions";
import { Button } from "@/components/shared/button";
import { SectionHeading } from "@/components/shared/section-heading";
import { getRewardById } from "@/lib/data/rewards";
import { formatDate } from "@/lib/utils";

export default async function RewardDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const reward = await getRewardById(id);
  const { isSuperadmin, managedBusinessIds } = await getAdminScope();

  if (!reward) {
    notFound();
  }

  if (!isSuperadmin && !managedBusinessIds.includes(reward.businessId)) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <SectionHeading
        eyebrow="Detalle premio"
        title={reward.title}
        description={reward.description}
        actions={
          <>
            <Link href={`/admin/rewards/${reward.id}/edit`}>
              <Button variant="secondary">Editar</Button>
            </Link>
            <form action={deleteRewardAction.bind(null, reward.id)}>
              <Button variant="secondary">Eliminar</Button>
            </form>
          </>
        }
      />
      <section className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="card-surface p-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <p className="text-sm text-muted">Negocio</p>
              <p className="mt-1 font-medium">{reward.businessName ?? reward.businessId}</p>
            </div>
            <div>
              <p className="text-sm text-muted">Tipo</p>
              <p className="mt-1 font-medium">{reward.rewardType}</p>
            </div>
            <div>
              <p className="text-sm text-muted">Puntos requeridos</p>
              <p className="mt-1 font-medium">{reward.pointsRequired}</p>
            </div>
            <div>
              <p className="text-sm text-muted">Estado</p>
              <p className="mt-1 font-medium">{reward.isActive ? "Activo" : "Inactivo"}</p>
            </div>
            <div>
              <p className="text-sm text-muted">Inicio</p>
              <p className="mt-1 font-medium">{formatDate(reward.startsAt)}</p>
            </div>
            <div>
              <p className="text-sm text-muted">Fin</p>
              <p className="mt-1 font-medium">{formatDate(reward.endsAt)}</p>
            </div>
          </div>
        </div>
        <div className="card-surface p-6">
          <p className="text-sm text-muted">Vista rápida</p>
          <div className="mt-4 rounded-[24px] border border-line bg-slate-50 p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.16em] text-muted">{reward.rewardType}</p>
                <h3 className="mt-2 text-xl font-semibold">{reward.title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted">{reward.description}</p>
              </div>
              <div className="rounded-2xl bg-[color:var(--accent-soft)] px-3 py-2 text-sm font-semibold text-[color:var(--accent)]">
                {reward.pointsRequired} pts
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
