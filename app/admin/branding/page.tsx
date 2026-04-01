import { notFound } from "next/navigation";

import { SectionHeading } from "@/components/shared/section-heading";
import { Input } from "@/components/shared/input";
import { getBusinessesList } from "@/lib/data/businesses";

export default async function BrandingPage() {
  const business = (await getBusinessesList())[0];

  if (!business) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <SectionHeading
        eyebrow="Branding"
        title="Personalización de la experiencia cliente"
        description="Configuración visual del tenant con una previsualización inmediata."
      />
      <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="card-surface space-y-5 p-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">Color principal</label>
            <Input defaultValue={business.primaryColor} />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Color secundario</label>
            <Input defaultValue={business.secondaryColor} />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Acento</label>
            <Input defaultValue={business.accentColor} />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Welcome text</label>
            <Input defaultValue={business.welcomeText} />
          </div>
        </div>
        <div className="card-surface overflow-hidden p-4">
          <div
            className="rounded-[32px] p-6"
            style={{ background: `linear-gradient(180deg, ${business.secondaryColor} 0%, #ffffff 100%)` }}
          >
            <div className="mx-auto max-w-sm rounded-[28px] p-5 text-white shadow-card" style={{ background: business.primaryColor }}>
              <p className="text-xs uppercase tracking-[0.18em] text-white/70">Preview</p>
              <h2 className="mt-3 text-3xl font-semibold">{business.name}</h2>
              <p className="mt-3 text-sm text-white/75">{business.welcomeText}</p>
              <div className="mt-6 h-2 rounded-full bg-white/15">
                <div className="h-2 w-2/3 rounded-full" style={{ background: business.accentColor }} />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
