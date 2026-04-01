import { redirect } from "next/navigation";

import { RewardTile } from "@/components/customer/reward-tile";
import { getSessionContext } from "@/lib/auth/session";
import { rewards } from "@/lib/data/demo";

export const dynamic = "force-dynamic";

export default async function TenantRewardsPage({ params }: { params: Promise<{ businessSlug: string }> }) {
  const { businessSlug } = await params;
  const session = await getSessionContext();

  if (!session.isAuthenticated) {
    redirect(`/${businessSlug}`);
  }

  return (
    <main className="min-h-screen bg-[#f7f2e8] px-4 py-5">
      <div className="mx-auto max-w-md space-y-4">
        <h1 className="text-2xl font-semibold">Premios disponibles</h1>
        {rewards.map((reward) => (
          <RewardTile key={reward.id} reward={reward} />
        ))}
      </div>
    </main>
  );
}
