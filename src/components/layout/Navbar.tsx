"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { btnGhost, chipActive, chipInactive } from "@/components/ui/styles";
import type { SessionUser } from "@/types";

type NavItem = { href: string; label: string; icon: string };

const studentNav: NavItem[] = [
  { href: "/events", label: "Keşfet", icon: "✦" },
  { href: "/favorites", label: "Favoriler", icon: "♥" },
  { href: "/my-events", label: "Kayıtlarım", icon: "◎" },
  { href: "/announcements", label: "Duyurular", icon: "◈" },
];

const presidentNav: NavItem[] = [
  { href: "/president/events", label: "Yönetim", icon: "⚙" },
  { href: "/president/announcements", label: "Duyuru", icon: "◈" },
  { href: "/events", label: "Keşfet", icon: "✦" },
];

const adminNav: NavItem[] = [
  { href: "/admin/reports", label: "Raporlar", icon: "▣" },
  { href: "/admin/users", label: "Kullanıcılar", icon: "👤" },
  { href: "/admin/clubs", label: "Kulüpler", icon: "🏛" },
];

export function Navbar({ user }: { user: SessionUser }) {
  const pathname = usePathname();
  const router = useRouter();

  const nav =
    user.role === "ADMIN" ? adminNav : user.role === "CLUB_PRESIDENT" ? presidentNav : studentNav;

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  if (pathname === "/login") return null;

  return (
    <header className="sticky top-0 z-50 border-b border-white/40 bg-white/75 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 md:px-6">
        <Link href="/" className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-campus-600 to-violet-600 text-lg font-bold text-white shadow-glow">
            CP
          </span>
          <div className="hidden sm:block">
            <p className="font-display text-sm font-bold leading-none text-slate-900">CampusPulse</p>
            <p className="text-xs text-slate-500">Kulüp Etkinlikleri</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {nav.map((item) => {
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition ${
                  active
                    ? "bg-gradient-to-r from-campus-600 to-violet-600 text-white shadow-md"
                    : "text-slate-600 hover:bg-campus-50 hover:text-campus-700"
                }`}
              >
                <span className="text-xs opacity-80">{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <div className="hidden text-right sm:block">
            <p className="text-sm font-semibold text-slate-800">{user.name}</p>
            <p className="text-xs text-slate-500">
              {user.role === "STUDENT"
                ? "Öğrenci"
                : user.role === "CLUB_PRESIDENT"
                  ? "Kulüp Başkanı"
                  : "Admin"}
            </p>
          </div>
          <button type="button" onClick={handleLogout} className={`${btnGhost} text-sm`}>
            Çıkış
          </button>
        </div>
      </div>

      <nav className="flex gap-1 overflow-x-auto border-t border-slate-100/80 px-4 py-2 md:hidden">
        {nav.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`shrink-0 ${active ? chipActive : chipInactive}`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
