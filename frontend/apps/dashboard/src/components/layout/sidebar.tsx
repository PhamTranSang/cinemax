import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  UserPlus,
  KeyRound,
  ClipboardCheck,
  Film,
} from "lucide-react";
import { cn } from "@cinemax/ui";
import type { Role } from "@cinemax/shared";
import { ROLES } from "@cinemax/shared";

type NavItem = {
  to: string;
  label: string;
  icon: typeof LayoutDashboard;
  allow: Role[];
};

const NAV: NavItem[] = [
  {
    to: "/overview",
    label: "Overview",
    icon: LayoutDashboard,
    allow: [ROLES.SUPER_ADMIN, ROLES.CINEMA_MANAGER],
  },
  {
    to: "/users",
    label: "Users",
    icon: Users,
    allow: [ROLES.SUPER_ADMIN, ROLES.CINEMA_MANAGER],
  },
  {
    to: "/accounts/new",
    label: "Create account",
    icon: UserPlus,
    allow: [ROLES.SUPER_ADMIN, ROLES.CINEMA_MANAGER],
  },
  {
    to: "/accounts/reset-password",
    label: "Reset password",
    icon: KeyRound,
    allow: [ROLES.SUPER_ADMIN, ROLES.CINEMA_MANAGER],
  },
  {
    to: "/attendance",
    label: "Attendance",
    icon: ClipboardCheck,
    allow: [ROLES.STAFF, ROLES.SUPER_ADMIN, ROLES.CINEMA_MANAGER],
  },
];

export function Sidebar({ role }: Readonly<{ role: Role }>) {
  const items = NAV.filter((n) => n.allow.includes(role));

  return (
    <aside className="hidden w-64 shrink-0 border-r border-border/60 bg-card/40 md:flex md:flex-col">
      <div className="flex h-16 items-center gap-2 border-b border-border/60 px-5">
        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
          <Film className="h-4 w-4" />
        </div>
        <div className="flex flex-col">
          <span className="font-serif text-base font-semibold leading-none">
            Cinemax
          </span>
          <span className="text-[10px] uppercase tracking-widest text-muted-foreground">
            Admin
          </span>
        </div>
      </div>

      <nav className="flex flex-1 flex-col gap-1 p-3">
        {items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                isActive
                  ? "bg-primary/15 text-foreground"
                  : "text-muted-foreground hover:bg-card hover:text-foreground",
              )
            }
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-border/60 p-4 text-[11px] leading-relaxed text-muted-foreground">
        <p className="font-medium text-foreground">Signed in as</p>
        <p className="mt-1">{role.replace("_", " ").toLowerCase()}</p>
      </div>
    </aside>
  );
}
