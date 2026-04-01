import { Bell, ChevronDown } from "lucide-react";

import { getSessionContext } from "@/lib/auth/session";

export async function AdminHeader() {
  const session = await getSessionContext();
  const firstName = session.user?.firstName ?? "Usuario";
  const lastName = session.user?.lastName ?? "";
  const primaryRole = session.roles.includes("superadmin")
    ? "Superadmin"
    : session.roles.includes("business_admin")
      ? "Business admin"
      : session.roles.includes("customer")
        ? "Cliente"
        : "Sin rol";

  return (
    <header className="sticky top-0 z-20 border-b border-[#f1f1f1] bg-white/90 backdrop-blur">
      <div className="flex h-16 items-center justify-between px-6">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-muted">Loyalty SaaS</p>
          <p className="text-lg font-semibold">La Prospect</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex h-10 w-10 items-center justify-center rounded-full border border-line bg-white">
            <Bell className="h-4 w-4" />
          </button>
          <form action="/admin/logout" method="post">
            <button className="flex items-center gap-3 rounded-full border border-line bg-white px-3 py-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[color:var(--accent-soft)] text-sm font-semibold text-[color:var(--accent)]">
                {firstName[0]}
              </div>
              <div className="hidden text-left sm:block">
                <p className="text-sm font-medium">{firstName} {lastName}</p>
                <p className="text-xs text-muted">{primaryRole}</p>
              </div>
              <ChevronDown className="h-4 w-4 text-muted" />
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}
