import { notFound } from "next/navigation";

import { getAdminScope } from "@/lib/auth/admin";
import { UserForm } from "@/components/admin/user-form";
import { SectionHeading } from "@/components/shared/section-heading";
import { getBusinessOptions } from "@/lib/data/admin-options";
import { getUserById } from "@/lib/data/users";

export default async function EditUserPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { isSuperadmin, managedBusinessIds } = await getAdminScope();
  const [user, businesses] = await Promise.all([
    getUserById(id).catch(() => null),
    getBusinessOptions(isSuperadmin ? undefined : managedBusinessIds)
  ]);

  if (!user) {
    notFound();
  }

  if (!isSuperadmin && user.roles.includes("superadmin")) {
    notFound();
  }

  if (!isSuperadmin && user.primaryBusinessId && !managedBusinessIds.includes(user.primaryBusinessId)) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <SectionHeading eyebrow="Edicion" title={`Editar ${user.firstName} ${user.lastName}`} description="Actualiza perfil, rol y asignación de negocio." />
      <UserForm businesses={businesses} availableRoles={isSuperadmin ? ["superadmin", "customer", "business_admin"] : ["customer", "business_admin"]} user={user} />
    </div>
  );
}
