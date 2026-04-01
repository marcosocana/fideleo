import { notFound } from "next/navigation";

import { BrandingForm } from "@/components/admin/branding-form";
import { SectionHeading } from "@/components/shared/section-heading";
import { getAdminScope } from "@/lib/auth/admin";
import { getBusinessOptions } from "@/lib/data/admin-options";
import { getBusinessesList } from "@/lib/data/businesses";

export default async function BrandingPage({
  searchParams
}: {
  searchParams: Promise<{ businessId?: string }>;
}) {
  const params = await searchParams;
  const { isSuperadmin, managedBusinessIds } = await getAdminScope();
  const businesses = await getBusinessesList({ ids: isSuperadmin ? undefined : managedBusinessIds });
  const business =
    businesses.find((item) => item.id === params.businessId) ??
    businesses[0];
  const businessOptions = await getBusinessOptions(isSuperadmin ? undefined : managedBusinessIds);

  if (!business) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <SectionHeading
        eyebrow="Branding"
        title="Personalización de la experiencia cliente"
        description="Configuración visual real del tenant con guardado persistente en Supabase."
      />
      <BrandingForm business={business} businesses={businessOptions} canSwitchBusiness={isSuperadmin && businessOptions.length > 1} />
    </div>
  );
}
