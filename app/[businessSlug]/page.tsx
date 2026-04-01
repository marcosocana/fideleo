import Link from "next/link";

import { CustomerAuthPanel } from "@/components/auth/customer-auth-panel";
import { LoyaltyCard } from "@/components/customer/loyalty-card";
import { RewardTile } from "@/components/customer/reward-tile";
import { Button } from "@/components/shared/button";
import { businesses, customerMembership, rewards } from "@/lib/data/demo";
import { getBusinessBySlug, getSessionContext } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

export default async function BusinessHomePage({ params }: { params: Promise<{ businessSlug: string }> }) {
  const { businessSlug } = await params;
  const session = await getSessionContext();
  const business = (await getBusinessBySlug(businessSlug)) ?? businesses[0];
  const isAuthenticatedCustomer = session.isAuthenticated && (session.roles.includes("customer") || session.roles.length === 0);

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
            <LoyaltyCard membership={customerMembership} />

            <section className="space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Recompensas</h2>
                <Link className="text-sm font-medium text-[color:var(--accent)]" href={`/${businessSlug}/rewards`}>
                  Ver todas
                </Link>
              </div>
              {rewards
                .filter((reward) => reward.businessId === business.id || reward.businessId === "biz-casa-luma")
                .slice(0, 2)
                .map((reward) => (
                  <RewardTile key={reward.id} reward={reward} />
                ))}
            </section>
          </>
        ) : null}
      </div>
    </main>
  );
}
