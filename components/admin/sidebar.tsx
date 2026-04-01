import Link from "next/link";
import { BarChart3, BrushCleaning, Building2, Gift, Search, ShieldCheck, Users } from "lucide-react";

const items = [
  { href: "/admin", label: "Dashboard", icon: BarChart3 },
  { href: "/admin/businesses", label: "Negocios", icon: Building2 },
  { href: "/admin/users", label: "Usuarios", icon: Users },
  { href: "/admin/rewards", label: "Premios", icon: Gift },
  { href: "/admin/branding", label: "Branding", icon: BrushCleaning },
  { href: "/admin/scoring", label: "Puntuador", icon: Search },
  { href: "/admin/profile", label: "Perfil", icon: ShieldCheck }
];

export function AdminSidebar() {
  return (
    <aside className="hidden w-72 shrink-0 border-r border-line bg-[#fafafa] px-4 py-6 lg:block">
      <div className="flex h-full flex-col">
        <div className="rounded-2xl bg-white p-4 shadow-soft">
          <p className="text-sm text-muted">Plataforma</p>
          <p className="mt-1 text-xl font-semibold">La Prospect</p>
        </div>
        <nav className="mt-8 space-y-1">
          {items.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="group flex items-center gap-3 rounded-2xl px-4 py-3 text-sm text-slate-600 transition hover:bg-white hover:text-ink"
              >
                <span className="h-8 w-1 rounded-full bg-transparent transition group-hover:bg-[color:var(--accent)]" />
                <Icon className="h-4 w-4" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
