import { notFound } from "next/navigation";

import { RewardForm } from "@/components/admin/reward-form";
import { SectionHeading } from "@/components/shared/section-heading";
import { getBusinessOptions } from "@/lib/data/admin-options";
import { getRewardById } from "@/lib/data/rewards";

export default async function EditRewardPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [reward, businesses] = await Promise.all([getRewardById(id), getBusinessOptions()]);

  if (!reward) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <SectionHeading eyebrow="Edicion" title={`Editar ${reward.title}`} description="Ajusta puntos, vigencia, negocio y estado del premio." />
      <RewardForm businesses={businesses} reward={reward} />
    </div>
  );
}
