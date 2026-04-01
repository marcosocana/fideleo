import { ScoringPanel } from "@/components/admin/scoring-panel";
import { Button } from "@/components/shared/button";
import { Input } from "@/components/shared/input";
import { SectionHeading } from "@/components/shared/section-heading";
import { getAdminScope } from "@/lib/auth/admin";
import { getBusinessOptions } from "@/lib/data/admin-options";
import { getUsersList } from "@/lib/data/users";

export default async function ScoringPage({
  searchParams
}: {
  searchParams: Promise<{ q?: string; businessId?: string; userId?: string }>;
}) {
  const params = await searchParams;
  const { isSuperadmin, managedBusinessIds } = await getAdminScope();
  const businesses = await getBusinessOptions(isSuperadmin ? undefined : managedBusinessIds);
  const selectedBusinessId = params.businessId ?? businesses[0]?.value ?? "";
  const customers = await getUsersList({
    query: params.q,
    businessId: selectedBusinessId || undefined,
    businessIds: isSuperadmin ? undefined : managedBusinessIds
  });
  const customer = customers.find((item) => item.id === params.userId) ?? customers[0] ?? null;

  if (businesses.length === 0) {
    return (
      <div className="mx-auto max-w-4xl space-y-6">
        <SectionHeading
          eyebrow="Puntuador"
          title="Operación rápida en sala"
          description="Necesitas al menos un negocio asignado para usar el puntuador."
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <SectionHeading
        eyebrow="Puntuador"
        title="Operación rápida en sala"
        description="Búsqueda por email o teléfono, saldo actual y acciones frecuentes para sumar o ajustar."
      />
      <section className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
        <div className="card-surface space-y-4 p-6">
          <form className="space-y-4" method="get">
            <div className="space-y-2">
              <label className="text-sm font-medium">Buscar cliente</label>
              <Input defaultValue={params.q ?? ""} name="q" placeholder="ana@correo.com o +34 600..." />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Negocio</label>
              <select className="input-soft" defaultValue={selectedBusinessId} name="businessId">
                {businesses.map((business) => (
                  <option key={business.value} value={business.value}>
                    {business.label}
                  </option>
                ))}
              </select>
            </div>
            <Button variant="secondary">Buscar</Button>
          </form>
          {customer ? (
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="font-medium">{customer.firstName} {customer.lastName}</p>
              <p className="mt-1 text-sm text-muted">{customer.email}</p>
              <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-muted">Tier</p>
                  <p className="mt-1 font-medium">{customer.currentTier}</p>
                </div>
                <div>
                  <p className="text-muted">Puntos</p>
                  <p className="mt-1 font-medium">{customer.totalPoints}</p>
                </div>
              </div>
            </div>
          ) : null}
          {customers.length > 1 ? (
            <div className="space-y-2">
              <p className="text-sm font-medium">Resultados</p>
              <div className="space-y-2">
                {customers.slice(0, 8).map((item) => (
                  <a
                    key={item.id}
                    className={`block rounded-2xl border px-4 py-3 text-sm ${customer?.id === item.id ? "border-[color:var(--accent)] bg-white" : "border-line bg-white/60"}`}
                    href={`/admin/scoring?businessId=${encodeURIComponent(selectedBusinessId)}&q=${encodeURIComponent(params.q ?? "")}&userId=${encodeURIComponent(item.id)}`}
                  >
                    <p className="font-medium">{item.firstName} {item.lastName}</p>
                    <p className="text-muted">{item.email}</p>
                  </a>
                ))}
              </div>
            </div>
          ) : null}
          {!customer ? <p className="text-sm text-muted">Busca un cliente para operar desde sala.</p> : null}
        </div>
        {customer ? <ScoringPanel businessId={selectedBusinessId} customer={customer} /> : null}
      </section>
    </div>
  );
}
