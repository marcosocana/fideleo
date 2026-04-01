import { UserForm } from "@/components/admin/user-form";
import { SectionHeading } from "@/components/shared/section-heading";
import { getBusinessOptions } from "@/lib/data/admin-options";

export default async function NewUserPage() {
  const businesses = await getBusinessOptions();

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <SectionHeading eyebrow="Alta" title="Crear usuario" description="Alta de customer o business admin con asignación opcional a negocio." />
      <UserForm businesses={businesses} />
    </div>
  );
}
