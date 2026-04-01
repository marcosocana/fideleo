import { redirect } from "next/navigation";

import { getSessionContext } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

export default async function TenantProfilePage({ params }: { params: Promise<{ businessSlug: string }> }) {
  const { businessSlug } = await params;
  const session = await getSessionContext();

  if (!session.isAuthenticated) {
    redirect(`/${businessSlug}`);
  }

  return (
    <main className="min-h-screen bg-[#f7f2e8] px-4 py-5">
      <div className="mx-auto max-w-md">
        <section className="card-surface p-6">
          <h1 className="text-2xl font-semibold">Mi perfil</h1>
          <p className="mt-3 text-sm text-muted">
            Página base lista para editar datos del cliente, preferencias y consentimiento.
          </p>
        </section>
      </div>
    </main>
  );
}
