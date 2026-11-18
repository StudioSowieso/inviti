"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { WineLogo } from "@/components/brand-logo";
import { Logo } from "@/components/logo";

const LINKS = [
  { href: "/zo-werkt-het", label: "Zo werkt het" },
  { href: "/themas", label: "Thema's" },
  { href: "/prijzen", label: "Prijzen" },
];

/** Vaste navigatie, crème met blur. Op mobiel klapt het menu open met een hamburger. */
export function LandingNav({ brand = "classic" }: { brand?: "classic" | "wine" }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className={`fixed inset-x-0 top-0 z-40 text-ink ${open ? "bg-cream" : "bg-cream/90 backdrop-blur-md"}`}>
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 py-5 lg:px-10">
        <Link href="/" className="block" aria-label="Proost Mee, naar de homepage" onClick={() => setOpen(false)}>
          {brand === "wine" ? <WineLogo className="w-32 text-forest sm:w-40" /> : <Logo className="w-20 sm:w-24" />}
        </Link>

        <nav aria-label="Hoofdmenu" className="hidden items-center gap-9 text-sm md:flex">
          {LINKS.map((l) => {
            const active = pathname === l.href;
            return (
              <Link
                key={l.href}
                href={l.href}
                aria-current={active ? "page" : undefined}
                className={`py-1 font-medium underline-offset-[10px] transition hover:opacity-100 ${
                  active ? "underline decoration-clay decoration-2 opacity-100" : "opacity-80"
                }`}
              >
                {l.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2 text-sm">
          <Link
            href="/inloggen"
            className="hidden rounded-full px-4 py-2 font-medium opacity-85 transition hover:opacity-100 sm:block"
          >
            Inloggen
          </Link>
          <Link
            href="/account-aanmaken"
            className="rounded-full bg-forest px-5 py-2.5 font-medium text-paper transition hover:bg-forest-deep"
          >
            Aan de slag
          </Link>
          <button
            type="button"
            aria-label={open ? "Sluit menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobiel-menu"
            onClick={() => setOpen((v) => !v)}
            className="relative ml-1 grid size-10 place-items-center rounded-full md:hidden"
          >
            <span
              aria-hidden
              className={`absolute h-px w-5 bg-current transition-transform duration-300 ${open ? "rotate-45" : "-translate-y-1.5"}`}
            />
            <span
              aria-hidden
              className={`absolute h-px w-5 bg-current transition-transform duration-300 ${open ? "-rotate-45" : "translate-y-1.5"}`}
            />
          </button>
        </div>
      </div>

      {open && (
        <nav id="mobiel-menu" aria-label="Hoofdmenu" className="border-t border-line px-6 pt-2 pb-6 md:hidden">
          <ul>
            {[...LINKS, { href: "/inloggen", label: "Inloggen" }].map((l) => (
              <li key={l.href} className="border-b border-line last:border-0">
                <Link
                  href={l.href}
                  onClick={() => setOpen(false)}
                  aria-current={pathname === l.href ? "page" : undefined}
                  className="block py-4 font-serif text-2xl font-medium"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
