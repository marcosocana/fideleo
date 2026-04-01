import { BusinessForm } from "@/components/admin/business-form";
import { SectionHeading } from "@/components/shared/section-heading";

export default function NewBusinessPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <SectionHeading
        eyebrow="Alta"
        title="Crear negocio"
        description="Alta persistente de tenant con branding y datos operativos."
      />
      <BusinessForm />
    </div>
  );
}
