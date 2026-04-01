import { notFound, redirect } from "next/navigation";

import { getBusinessBySlug, getSessionContext } from "@/lib/auth/session";
import { getCustomerActivity } from "@/lib/data/users";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function TenantHistoryPage({ params }: { params: Promise<{ businessSlug: string }> }) {
  const { businessSlug } = await params;
  const session = await getSessionContext();
  const business = await getBusinessBySlug(businessSlug);

  if (!business) {
    notFound();
  }

  if (!session.isAuthenticated || !session.user) {
    redirect(`/${businessSlug}`);
  }

  const activityTimeline = await getCustomerActivity(session.user.id, business.id);

  return (
    <main className="min-h-screen bg-[#f7f2e8] px-4 py-5">
      <div className="mx-auto max-w-md space-y-4">
        <h1 className="text-2xl font-semibold">Historial</h1>
        {activityTimeline.length === 0 ? <p className="text-sm text-muted">Todavía no hay movimientos registrados.</p> : null}
        {activityTimeline.map((item) => (
          <article key={`${item.title}-${item.date}`} className="card-surface p-5">
            <div className="flex items-center justify-between gap-3">
              <h2 className="font-semibold">{item.title}</h2>
              <span className="text-xs text-muted">{formatDate(item.date)}</span>
            </div>
            <p className="mt-2 text-sm text-muted">{item.detail}</p>
          </article>
        ))}
      </div>
    </main>
  );
}
