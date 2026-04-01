import { getSessionContext } from "@/lib/auth/session";
import { SectionHeading } from "@/components/shared/section-heading";

export default async function ProfilePage() {
  const session = await getSessionContext();

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <SectionHeading eyebrow="Cuenta" title="Perfil del administrador" description="Configuración básica de usuario y rol." />
      <div className="card-surface grid gap-4 p-6 sm:grid-cols-2">
        <div>
          <p className="text-sm text-muted">Nombre</p>
          <p className="mt-1 font-medium">{session.user?.firstName} {session.user?.lastName}</p>
        </div>
        <div>
          <p className="text-sm text-muted">Email</p>
          <p className="mt-1 font-medium">{session.user?.email}</p>
        </div>
        <div>
          <p className="text-sm text-muted">Roles</p>
          <p className="mt-1 font-medium">{session.roles.join(", ") || "Sin rol"}</p>
        </div>
      </div>
    </div>
  );
}
