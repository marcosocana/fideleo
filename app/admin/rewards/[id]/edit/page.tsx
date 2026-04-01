import { notFound } from "next/navigation";

import { getAdminScope } from "@/lib/auth/admin";
import { RewardForm } from "@/components/admin/reward-form";
import { SectionHeading } from "@/components/shared/section-heading";
import { getBusinessOptions } from "@/lib/data/admin-options";
import { getRewardById } from "@/lib/data/rewards";

export default async function EditRewardPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { isSuperadmin, managedBusinessIds } = await getAdminScope();
  const [reward, businesses] = await Promise.all([
    getRewardById(id),
    getBusinessOptions(isSuperadmin ? undefined : managedBusinessIds)
  ]);

  if (!reward) {
    notFound();
  }

  if (!isSuperadmin && !managedBusinessIds.includes(reward.businessId)) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <SectionHeading eyebrow="Edicion" title={`Editar ${reward.title}`} description="Ajusta puntos, vigencia, negocio y estado del premio." />
      <RewardForm businesses={businesses} reward={reward} />
    </div>
  );
}
