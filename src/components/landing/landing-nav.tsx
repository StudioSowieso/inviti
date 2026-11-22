"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Logo } from "@/components/logo";

const LINKS = [
  { href: "/zo-werkt-het", label: "Zo werkt het" },
  { href: "/themas", label: "Thema's" },
  { href: "/prijzen", label: "Prijzen" },
];

/** Vaste navigatie, crème met blur. Op mobiel klapt het menu open met een hamburger. */
export function LandingNav({ brand = "wine" }: { brand?: "classic" | "wine" }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  if (brand === "wine") {
    return (
      <header className="nav-pill fixed inset-x-0 top-3 z-40 px-3 text-ink sm:top-4 sm:px-6">
        {/* Vervorming voor het glas: golvend verschuiven van wat achter de balk zit (alleen Chrome en Edge) */}
        <svg width="0" height="0" aria-hidden className="absolute">
          <filter id="nav-distort" x="0%" y="0%" width="100%" height="100%" colorInterpolationFilters="sRGB">
            <feTurbulence type="fractalNoise" baseFrequency="0.006 0.03" numOctaves="2" seed="7" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="60" xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </svg>
        <div className="nav-pill-bar mx-auto max-w-4xl rounded-[2rem] px-5 py-2.5 sm:rounded-full sm:px-7">
          <div className="flex items-center justify-between gap-4">
            <Link href="/" className="block" aria-label="Proost Mee, naar de homepage" onClick={() => setOpen(false)}>
              <Logo className="w-28 text-forest sm:w-36" />
            </Link>

            <nav aria-label="Hoofdmenu" className="hidden items-center gap-7 text-sm md:flex">
              {LINKS.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  aria-current={pathname === l.href ? "page" : undefined}
                  className="font-medium transition hover:text-coral aria-[current=page]:text-coral"
                >
                  {l.label}
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-1 text-sm">
              <Link href="/inloggen" className="hidden items-center gap-1.5 px-3 py-2 font-medium transition hover:text-coral sm:flex">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden className="text-coral">
                  <circle cx="12" cy="8" r="3.5" />
                  <path d="M5 20c.8-3.6 3.5-5.5 7-5.5s6.2 1.9 7 5.5" strokeLinecap="round" />
                </svg>
                Inloggen
              </Link>
              <Link href="/account-aanmaken" className="cta rounded-full px-5 py-2.5 font-medium transition">
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
                <span aria-hidden className={`absolute h-px w-5 bg-current transition-transform duration-300 ${open ? "rotate-45" : "-translate-y-1.5"}`} />
                <span aria-hidden className={`absolute h-px w-5 bg-current transition-transform duration-300 ${open ? "-rotate-45" : "translate-y-1.5"}`} />
              </button>
            </div>
          </div>

          {open && (
            <nav id="mobiel-menu" aria-label="Hoofdmenu" className="mt-3 border-t border-line pt-1 pb-2 md:hidden">
              <ul>
                {[...LINKS, { href: "/inloggen", label: "Inloggen" }].map((l) => (
                  <li key={l.href} className="border-b border-line last:border-0">
                    <Link href={l.href} onClick={() => setOpen(false)} className="block py-3 text-lg font-medium">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          )}
        </div>
      </header>
    );
  }

  return (
    <header className={`fixed inset-x-0 top-0 z-40 text-ink ${open ? "bg-cream" : "bg-cream/90 backdrop-blur-md"}`}>
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 py-5 lg:px-10">
        <Link href="/" className="block" aria-label="Proost Mee, naar de homepage" onClick={() => setOpen(false)}>
          <Logo className="w-28 sm:w-36" />
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
