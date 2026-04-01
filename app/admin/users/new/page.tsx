import { getAdminScope } from "@/lib/auth/admin";
import { UserForm } from "@/components/admin/user-form";
import { SectionHeading } from "@/components/shared/section-heading";
import { getBusinessOptions } from "@/lib/data/admin-options";

export default async function NewUserPage() {
  const { isSuperadmin, managedBusinessIds } = await getAdminScope();
  const businesses = await getBusinessOptions(isSuperadmin ? undefined : managedBusinessIds);

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <SectionHeading eyebrow="Alta" title="Crear usuario" description="Alta de customer o business admin con asignación opcional a negocio." />
      <UserForm businesses={businesses} availableRoles={isSuperadmin ? ["superadmin", "customer", "business_admin"] : ["customer", "business_admin"]} />
    </div>
  );
}
