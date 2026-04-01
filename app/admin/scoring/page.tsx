import { ScoringPanel } from "@/components/admin/scoring-panel";
import { Input } from "@/components/shared/input";
import { SectionHeading } from "@/components/shared/section-heading";
import { getBusinessOptions } from "@/lib/data/admin-options";
import { getUsersList } from "@/lib/data/users";

export default async function ScoringPage() {
  const [customers, businesses] = await Promise.all([getUsersList(), getBusinessOptions()]);
  const customer = customers[0];
  const selectedBusinessId = customer?.id ? businesses[0]?.value ?? "" : "";

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <SectionHeading
        eyebrow="Puntuador"
        title="Operación rápida en sala"
        description="Búsqueda por email o teléfono, saldo actual y acciones frecuentes para sumar o ajustar."
      />
      <section className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
        <div className="card-surface space-y-4 p-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">Buscar cliente</label>
            <Input placeholder="ana@correo.com o +34 600..." />
          </div>
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
        </div>
        {customer ? <ScoringPanel businessId={selectedBusinessId} customer={customer} /> : null}
      </section>
    </div>
  );
}
