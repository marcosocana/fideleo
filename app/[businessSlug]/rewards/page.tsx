import { notFound, redirect } from "next/navigation";

import { RewardTile } from "@/components/customer/reward-tile";
import { getBusinessBySlug, getSessionContext } from "@/lib/auth/session";
import { getRewardsByBusinessId } from "@/lib/data/rewards";

export const dynamic = "force-dynamic";

export default async function TenantRewardsPage({ params }: { params: Promise<{ businessSlug: string }> }) {
  const { businessSlug } = await params;
  const session = await getSessionContext();
  const business = await getBusinessBySlug(businessSlug);

  if (!business) {
    notFound();
  }

  if (!session.isAuthenticated) {
    redirect(`/${businessSlug}`);
  }

  const rewards = await getRewardsByBusinessId(business.id, { activeOnly: true });

  return (
    <main className="min-h-screen bg-[#f7f2e8] px-4 py-5">
      <div className="mx-auto max-w-md space-y-4">
        <h1 className="text-2xl font-semibold">Premios disponibles</h1>
        {rewards.length === 0 ? <p className="text-sm text-muted">No hay recompensas activas ahora mismo.</p> : null}
        {rewards.map((reward) => (
          <RewardTile key={reward.id} reward={reward} />
        ))}
      </div>
    </main>
  );
}
