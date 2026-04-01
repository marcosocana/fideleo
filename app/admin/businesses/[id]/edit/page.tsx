import { BusinessForm } from "@/components/admin/business-form";
import { SectionHeading } from "@/components/shared/section-heading";
import { getBusinessById } from "@/lib/data/businesses";

export default async function EditBusinessPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const business = await getBusinessById(id);

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <SectionHeading eyebrow="Edicion" title={`Editar ${business.name}`} description="Actualiza branding y datos principales del tenant." />
      <BusinessForm business={business} />
    </div>
  );
}
