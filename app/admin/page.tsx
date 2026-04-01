import { Button } from "@/components/shared/button";
import { SectionHeading } from "@/components/shared/section-heading";
import { StatCard } from "@/components/shared/stat-card";
import { formatDate } from "@/lib/utils";
import { getDashboardSnapshot } from "@/lib/data/dashboard";

export default async function AdminDashboardPage() {
  const { kpis, businesses, recentSignals } = await getDashboardSnapshot();

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <SectionHeading
        eyebrow="Dashboard"
        title="Vista global de la plataforma"
        description="KPIs clave, progreso por negocio y actividad operativa en tiempo real."
        actions={<Button variant="secondary">Últimos 30 días</Button>}
      />

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {kpis.map((kpi) => (
          <StatCard key={kpi.label} {...kpi} />
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.4fr_0.9fr]">
        <div className="card-surface p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted">Negocios monitorizados</p>
              <h2 className="mt-1 text-2xl font-semibold">Rendimiento por tenant</h2>
            </div>
            <Button variant="secondary">Ver detalles</Button>
          </div>
          <div className="mt-6 space-y-4">
            {businesses.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-line bg-slate-50/70 p-4 text-sm text-muted">
                No hay negocios registrados todavía.
              </div>
            ) : null}
            {businesses.map((business) => (
              <div key={business.id} className="rounded-2xl border border-line bg-slate-50/70 p-4">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <p className="text-lg font-semibold">{business.name}</p>
                    <p className="text-sm text-muted">/{business.slug}</p>
                  </div>
                  <div className="grid gap-3 text-sm text-muted sm:grid-cols-3">
                    <span>{business.totalUsers} usuarios</span>
                    <span>{business.activeRewards} premios activos</span>
                    <span>{business.activeUsers} activos</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card-surface overflow-hidden">
          <div className="border-b border-line px-6 py-5">
            <p className="text-sm text-muted">Actividad reciente</p>
            <h2 className="mt-1 text-2xl font-semibold">Señales operativas</h2>
          </div>
          <div className="space-y-0">
            {recentSignals.length === 0 ? (
              <div className="px-6 py-4 text-sm text-muted">Todavía no hay eventos recientes.</div>
            ) : null}
            {recentSignals.map((item) => (
              <div key={item.id} className="border-t border-line px-6 py-4 text-sm text-muted first:border-t-0">
                <p>{item.message}</p>
                <p className="mt-1 text-xs">{formatDate(item.createdAt)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
