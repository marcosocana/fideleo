import { notFound, redirect } from "next/navigation";

import { getBusinessBySlug, getSessionContext } from "@/lib/auth/session";
import { getMembershipForBusiness } from "@/lib/data/users";

export const dynamic = "force-dynamic";

export default async function TenantProfilePage({ params }: { params: Promise<{ businessSlug: string }> }) {
  const { businessSlug } = await params;
  const session = await getSessionContext();
  const business = await getBusinessBySlug(businessSlug);

  if (!business) {
    notFound();
  }

  if (!session.isAuthenticated || !session.user) {
    redirect(`/${businessSlug}`);
  }

  const membership = await getMembershipForBusiness(session.user.id, business.id);

  return (
    <main className="min-h-screen bg-[#f7f2e8] px-4 py-5">
      <div className="mx-auto max-w-md">
        <section className="card-surface p-6">
          <h1 className="text-2xl font-semibold">Mi perfil</h1>
          <div className="mt-4 space-y-4">
            <div>
              <p className="text-sm text-muted">Nombre</p>
              <p className="mt-1 font-medium">{session.user.firstName} {session.user.lastName}</p>
            </div>
            <div>
              <p className="text-sm text-muted">Email</p>
              <p className="mt-1 font-medium">{session.user.email}</p>
            </div>
            <div>
              <p className="text-sm text-muted">Negocio</p>
              <p className="mt-1 font-medium">{business.name}</p>
            </div>
            <div>
              <p className="text-sm text-muted">Saldo actual</p>
              <p className="mt-1 font-medium">{membership?.currentPoints ?? 0} puntos</p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
