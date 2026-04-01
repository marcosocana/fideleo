import { Button } from "@/components/shared/button";
import { SectionHeading } from "@/components/shared/section-heading";
import { StatCard } from "@/components/shared/stat-card";
import { businesses, superadminKpis } from "@/lib/data/demo";

export default function AdminDashboardPage() {
  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <SectionHeading
        eyebrow="Dashboard"
        title="Vista global de la plataforma"
        description="KPIs clave, progreso por negocio y una base visual lista para conectar con Supabase."
        actions={<Button variant="secondary">Últimos 30 días</Button>}
      />

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {superadminKpis.map((kpi) => (
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
            {[
              "Casa Luma activó una nueva misión semanal.",
              "Brasa Norte canjeó 14 premios esta semana.",
              "3 nuevos admins fueron invitados.",
              "La media de uso del puntuador subió un 9%."
            ].map((item) => (
              <div key={item} className="border-t border-line px-6 py-4 text-sm text-muted first:border-t-0">
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
