"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { HomeIcon, ListIcon, PenIcon, SendIcon, SettingsIcon, UsersIcon } from "./icons";
import { Logo } from "./logo";

const ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: HomeIcon, ready: true },
  { href: "/gasten", label: "Gasten", icon: UsersIcon, ready: true },
  { href: "/uitnodiging", label: "Uitnodiging", icon: PenIcon, ready: true },
  { href: "/versturen", label: "Versturen", icon: SendIcon, ready: true },
  { href: "/todo", label: "To do", icon: ListIcon, ready: true },
];

export function SideNav({ isAdmin = false, hasPaid = false }: { isAdmin?: boolean; hasPaid?: boolean }) {
  const pathname = usePathname();
  const all = isAdmin
    ? [...ITEMS, { href: "/admin", label: "Admin", icon: SettingsIcon, ready: true }]
    : ITEMS;
  // Versturen is alleen voor betalers: voor anderen lichter en niet klikbaar.
  const items = all.map((i) => (i.href === "/versturen" && !hasPaid ? { ...i, ready: false } : i));

  return (
    <nav className="sticky top-[calc(1rem_+_var(--banner-h,0px))] hidden h-[calc(100dvh_-_2rem_-_var(--banner-h,0px))] w-24 shrink-0 flex-col items-center rounded-[1.75rem] border border-line bg-paper py-6 lg:flex">
      <Link
        href="/dashboard"
        className="flex flex-col items-center gap-1 text-forest"
        aria-label="Proost Mee"
      >
        <Logo className="w-[4.4rem]" />
      </Link>

      <ul className="mt-10 flex flex-col gap-2">
        {items.map(({ href, label, icon: Icon, ready }) => {
          const active = ready && pathname.startsWith(href);
          return (
            <li key={label}>
              {ready ? (
                <Link
                  href={href}
                  className={`flex w-[4.5rem] flex-col items-center gap-1.5 rounded-2xl py-3 text-[0.6rem] tracking-[0.14em] uppercase transition ${
                    active ? "bg-blush/70 text-ink" : "text-muted hover:bg-cream hover:text-ink"
                  }`}
                >
                  <Icon width={19} height={19} />
                  {label}
                </Link>
              ) : (
                <span
                  title="Beschikbaar na aankoop"
                  className="flex w-[4.5rem] cursor-not-allowed flex-col items-center gap-1.5 rounded-2xl py-3 text-[0.6rem] tracking-[0.14em] text-muted/50 uppercase"
                >
                  <Icon width={19} height={19} />
                  {label}
                </span>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
