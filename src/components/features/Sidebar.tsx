"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUser } from "@/context/UserContext";
import ThemeToggle from "@/components/ui/ThemeToggle";
import LogoutModal from "@/components/ui/LogoutModal";
import Logo from "@/components/ui/Logo";

/* ── Nav items ──────────────────────────────────────────────────────────── */
const NAV_ITEMS = [
  {
    id: "nav-dashboard",
    label: "Dashboard",
    href: "/dashboard",
    icon: <IconGrid />,
  },
  {
    id: "nav-practice",
    label: "Practice",
    href: "/dashboard/practice",
    icon: <IconPlay />,
  },
  {
    id: "nav-review",
    label: "Review",
    href: "/dashboard/review",
    icon: <IconSparkles />,
  },
  {
    id: "nav-insights",
    label: "Insights",
    href: "/dashboard/insights",
    icon: <IconLightbulb />,
  },
] as const;

/* ── Status label map ───────────────────────────────────────────────────── */
const STATUS_LABEL: Record<string, string> = {
  pelajar: "Student",
  pekerja: "Professional",
  freelancer: "Freelancer",
  lainnya: "Other",
};

/* ── Sidebar component ──────────────────────────────────────────────────── */
export default function Sidebar() {
  const pathname = usePathname();
  const { user } = useUser();
  const [logoutOpen, setLogoutOpen] = useState(false);

  return (
    <>
      <aside className="fixed left-0 top-0 h-full w-60 bg-white dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800 flex flex-col z-30 hidden lg:flex">
        {/* Logo */}
        <div className="px-6 py-5 border-b border-zinc-200 dark:border-zinc-800">
          <Link href="/" id="sidebar-logo" className="flex items-center gap-2.5">
            <Logo className="w-10 h-10 shrink-0" />
            <h2 className="font-urbanist font-extrabold text-xl text-zinc-900 dark:text-zinc-50">
              Toeflia
            </h2>
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
          {NAV_ITEMS.map((item) => {
            const active =
              item.href === "/dashboard"
                ? pathname === "/dashboard"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.id}
                id={item.id}
                href={item.href}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-2xl text-sm font-inter transition-all duration-200 ${
                  active
                    ? "bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50"
                    : "text-zinc-500 dark:text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800/50"
                }`}
              >
                <span className="shrink-0">{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Bottom: theme toggle + user card + logout */}
        <div className="px-3 py-4 border-t border-zinc-200 dark:border-zinc-800 flex flex-col gap-3">
          {/* Theme toggle — col layout */}
          <ThemeToggle layout="sidebar" />

          {/* User card */}
          <div className="flex items-center gap-3 px-3 py-3 rounded-2xl bg-zinc-100 dark:bg-zinc-800/50">
            {/* Avatar */}
            <div className="w-8 h-8 rounded-full bg-zinc-200 dark:bg-zinc-700 flex items-center justify-center text-xs font-urbanist font-bold text-zinc-700 dark:text-zinc-200 uppercase shrink-0">
              {user?.name?.charAt(0) ?? "?"}
            </div>

            {/* Name & status */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-zinc-800 dark:text-zinc-200 truncate">
                {user?.name ?? "—"}
              </p>
              <p className="text-xs text-zinc-500 dark:text-zinc-500 truncate">
                {user ? (STATUS_LABEL[user.status] ?? user.status) : ""}
              </p>
            </div>

            {/* Logout trigger */}
            <button
              id="sidebar-logout"
              onClick={() => setLogoutOpen(true)}
              title="Log out"
              className="text-zinc-400 dark:text-zinc-600 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"
                />
              </svg>
            </button>
          </div>
        </div>
      </aside>

      <LogoutModal open={logoutOpen} onClose={() => setLogoutOpen(false)} />
    </>
  );
}

/* ── Icons ──────────────────────────────────────────────────────────────── */
function IconGrid() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  );
}

function IconPlay() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <polygon strokeLinecap="round" strokeLinejoin="round" points="5 3 19 12 5 21 5 3" />
    </svg>
  );
}

function IconSparkles() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
    </svg>
  );
}

function IconLightbulb() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5M12 10V9m-8 9h16a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2z" />
    </svg>
  );
}
