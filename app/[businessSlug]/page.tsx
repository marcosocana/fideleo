import Link from "next/link";
import { notFound } from "next/navigation";

import { CustomerAuthPanel } from "@/components/auth/customer-auth-panel";
import { LoyaltyCard } from "@/components/customer/loyalty-card";
import { RewardTile } from "@/components/customer/reward-tile";
import { Button } from "@/components/shared/button";
import { getBusinessBySlug, getSessionContext } from "@/lib/auth/session";
import { getRewardsByBusinessId } from "@/lib/data/rewards";
import { getMembershipForBusiness } from "@/lib/data/users";

export const dynamic = "force-dynamic";

export default async function BusinessHomePage({ params }: { params: Promise<{ businessSlug: string }> }) {
  const { businessSlug } = await params;
  const session = await getSessionContext();
  const business = await getBusinessBySlug(businessSlug);

  if (!business) {
    notFound();
  }

  const isAuthenticatedCustomer = session.isAuthenticated && (session.roles.includes("customer") || session.roles.length === 0);
  const [membership, rewards] = await Promise.all([
    isAuthenticatedCustomer && session.user ? getMembershipForBusiness(session.user.id, business.id) : Promise.resolve(null),
    getRewardsByBusinessId(business.id, { activeOnly: true })
  ]);

  return (
    <main className="min-h-screen px-4 py-4" style={{ background: business.secondaryColor }}>
      <div className="mx-auto max-w-md space-y-5">
        <header className="rounded-[28px] bg-white/90 p-5 shadow-soft backdrop-blur">
          <p className="text-xs uppercase tracking-[0.18em] text-muted">La Prospect</p>
          <div className="mt-3 flex items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight">{business.name}</h1>
              <p className="mt-1 text-sm text-muted">{business.welcomeText || `Acceso al club de /${businessSlug}`}</p>
            </div>
            <Link href="/login">
              <Button variant="ghost">Admin</Button>
            </Link>
          </div>
        </header>

        {!isAuthenticatedCustomer ? <CustomerAuthPanel business={business} /> : null}

        {isAuthenticatedCustomer ? (
          <>
            {membership ? <LoyaltyCard membership={membership} /> : null}

            <section className="space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Recompensas</h2>
                <Link className="text-sm font-medium text-[color:var(--accent)]" href={`/${businessSlug}/rewards`}>
                  Ver todas
                </Link>
              </div>
              {rewards.slice(0, 2).map((reward) => (
                <RewardTile key={reward.id} reward={reward} />
              ))}
              {rewards.length === 0 ? (
                <div className="card-surface p-5 text-sm text-muted">Este negocio todavía no tiene recompensas activas.</div>
              ) : null}
            </section>
          </>
        ) : null}
      </div>
    </main>
  );
}
