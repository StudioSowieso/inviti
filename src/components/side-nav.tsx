"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { HomeIcon, ListIcon, PenIcon, SendIcon, Sparkle, UsersIcon } from "./icons";

const ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: HomeIcon, ready: true },
  { href: "/gasten", label: "Gasten", icon: UsersIcon, ready: true },
  { href: "/uitnodiging", label: "Uitnodiging", icon: PenIcon, ready: true },
  { href: "#", label: "Versturen", icon: SendIcon, ready: false },
  { href: "#", label: "To do", icon: ListIcon, ready: false },
];

export function SideNav() {
  const pathname = usePathname();

  return (
    <nav className="sticky top-4 hidden h-[calc(100dvh-2rem)] w-24 shrink-0 flex-col items-center rounded-[1.75rem] border border-line bg-paper py-6 lg:flex">
      <Link
        href="/dashboard"
        className="flex flex-col items-center gap-1 text-forest"
        aria-label="Inviti"
      >
        <span className="font-serif text-2xl leading-none">In</span>
        <Sparkle width={8} height={8} className="text-clay" />
      </Link>

      <ul className="mt-10 flex flex-col gap-2">
        {ITEMS.map(({ href, label, icon: Icon, ready }) => {
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
                  title="Binnenkort beschikbaar"
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
