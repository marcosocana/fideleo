import { redirect } from "next/navigation";

import { getAdminScope } from "@/lib/auth/admin";
import { BusinessForm } from "@/components/admin/business-form";
import { SectionHeading } from "@/components/shared/section-heading";

export default async function NewBusinessPage() {
  const { isSuperadmin } = await getAdminScope();

  if (!isSuperadmin) {
    redirect("/admin/businesses");
  }

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
