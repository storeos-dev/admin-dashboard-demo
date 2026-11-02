import {
  LayoutDashboard,
  LogOut,
  Package,
  Receipt,
  ExternalLink,
} from "lucide-react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { clearAccessToken } from "@/lib/auth";
import { gqlRequest } from "@/lib/gql";
import { ME_QUERY } from "@/lib/queries";

const NAV = [
  { to: "/", label: "Overview", icon: LayoutDashboard, end: true },
  { to: "/orders", label: "Orders", icon: Receipt },
  { to: "/products", label: "Products", icon: Package },
] as const;

type MeData = {
  identity__me: {
    name?: string | null;
    email?: string | null;
    memberships: { tenant: string; roles: string[] }[];
  };
};

export function Shell() {
  const navigate = useNavigate();
  const meQuery = useQuery({
    queryKey: ["me"],
    queryFn: () => gqlRequest<MeData>(ME_QUERY),
  });

  const me = meQuery.data?.identity__me;
  const tenant = me?.memberships?.[0]?.tenant;

  function logout() {
    clearAccessToken();
    navigate("/login", { replace: true });
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-6xl gap-6 px-4 py-6 md:px-6">
      <aside className="sticky top-6 flex h-[calc(100vh-3rem)] w-56 shrink-0 flex-col rounded-[calc(var(--radius)+4px)] border border-[var(--border)] bg-[var(--bg-elevated)] p-4 shadow-[var(--shadow)]">
        <div className="px-2 pt-1 pb-5">
          <p className="text-xs font-semibold tracking-[0.16em] text-[var(--primary)] uppercase">
            StoreOS demo
          </p>
          <h1
            className="mt-1 text-2xl text-[var(--fg)]"
            style={{ fontFamily: "var(--display)" }}
          >
            Admin
          </h1>
          {tenant ? (
            <p className="mt-2 truncate text-xs text-[var(--muted)]">{tenant}</p>
          ) : null}
        </div>

        <nav className="flex flex-1 flex-col gap-1">
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={"end" in item ? item.end : false}
              className={({ isActive }) =>
                [
                  "flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-[var(--primary-soft)] text-[var(--primary)]"
                    : "text-[var(--muted)] hover:bg-[#eef3f0] hover:text-[var(--fg)]",
                ].join(" ")
              }
            >
              <item.icon className="size-4" />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="mt-4 space-y-3 border-t border-[var(--border)] pt-4">
          <div className="px-2">
            <p className="truncate text-sm font-medium">
              {me?.name || me?.email || "Staff"}
            </p>
            {me?.email ? (
              <p className="truncate text-xs text-[var(--muted)]">{me.email}</p>
            ) : null}
          </div>
          <a
            href="https://storeos.dev/docs/guides/admin-dashboard"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 px-2 text-xs text-[var(--muted)] hover:text-[var(--primary)]"
          >
            Docs
            <ExternalLink className="size-3" />
          </a>
          <button
            type="button"
            onClick={logout}
            className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm text-[var(--muted)] transition-colors hover:bg-[#eef3f0] hover:text-[var(--fg)]"
          >
            <LogOut className="size-4" />
            Sign out
          </button>
        </div>
      </aside>

      <main className="min-w-0 flex-1 py-1">
        <Outlet />
      </main>
    </div>
  );
}
