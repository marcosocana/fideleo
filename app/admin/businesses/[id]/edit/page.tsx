import { notFound } from "next/navigation";

import { getAdminScope } from "@/lib/auth/admin";
import { BusinessForm } from "@/components/admin/business-form";
import { SectionHeading } from "@/components/shared/section-heading";
import { getBusinessById } from "@/lib/data/businesses";

export default async function EditBusinessPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { isSuperadmin, managedBusinessIds } = await getAdminScope();
  const business = await getBusinessById(id);

  if (!business) {
    notFound();
  }

  if (!isSuperadmin && !managedBusinessIds.includes(business.id)) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <SectionHeading eyebrow="Edicion" title={`Editar ${business.name}`} description="Actualiza branding y datos principales del tenant." />
      <BusinessForm business={business} />
    </div>
  );
}
