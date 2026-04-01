import { RewardForm } from "@/components/admin/reward-form";
import { SectionHeading } from "@/components/shared/section-heading";
import { getBusinessOptions } from "@/lib/data/admin-options";

export default async function NewRewardPage() {
  const businesses = await getBusinessOptions();

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <SectionHeading eyebrow="Alta" title="Crear premio" description="Define recompensa, puntos requeridos, vigencia y negocio asociado." />
      <RewardForm businesses={businesses} />
    </div>
  );
}
