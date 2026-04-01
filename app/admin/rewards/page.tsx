import Link from "next/link";

import { Button } from "@/components/shared/button";
import { RewardTile } from "@/components/customer/reward-tile";
import { SectionHeading } from "@/components/shared/section-heading";
import { getRewardsList } from "@/lib/data/rewards";

export default async function RewardsPage() {
  const rewards = await getRewardsList();

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <SectionHeading
        eyebrow="Premios"
        title="Catálogo de recompensas"
        description="Catálogo en tiempo real conectado a Supabase, listo para CRUD, validez y stock."
        actions={
          <Link href="/admin/rewards/new">
            <Button>Nuevo premio</Button>
          </Link>
        }
      />
      <div className="grid gap-5 lg:grid-cols-2">
        {rewards.map((reward) => (
          <Link key={reward.id} href={`/admin/rewards/${reward.id}`}>
            <RewardTile reward={reward} />
          </Link>
        ))}
      </div>
    </div>
  );
}
