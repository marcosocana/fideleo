import { redirect } from "next/navigation";

import { getSessionContext } from "@/lib/auth/session";
import { activityTimeline } from "@/lib/data/demo";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function TenantHistoryPage({ params }: { params: Promise<{ businessSlug: string }> }) {
  const { businessSlug } = await params;
  const session = await getSessionContext();

  if (!session.isAuthenticated) {
    redirect(`/${businessSlug}`);
  }

  return (
    <main className="min-h-screen bg-[#f7f2e8] px-4 py-5">
      <div className="mx-auto max-w-md space-y-4">
        <h1 className="text-2xl font-semibold">Historial</h1>
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
