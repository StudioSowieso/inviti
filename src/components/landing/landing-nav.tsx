"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Logo } from "@/components/logo";

const LINKS = [
  { href: "/zo-werkt-het", label: "Zo werkt het" },
  { href: "/themas", label: "Thema's" },
  { href: "/prijzen", label: "Prijzen" },
];

/**
 * Vaste navigatie. Op de homepage is hij transparant boven de donkere hero en daarna crème met blur,
 * op de andere pagina's staat hij meteen crème.
 */
export function LandingNav() {
  const pathname = usePathname();
  const onHome = pathname === "/";
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const update = () => {
      const hero = document.getElementById("hero");
      setScrolled(hero ? hero.getBoundingClientRect().bottom < 90 : window.scrollY > 40);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  const solid = !onHome || scrolled || open;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-[background-color,backdrop-filter,color] duration-500 ${
        solid ? "bg-cream/90 text-ink backdrop-blur-md" : "bg-transparent text-paper"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 py-5 lg:px-10">
        <Link href="/" className="block" aria-label="Proost Mee, naar de homepage" onClick={() => setOpen(false)}>
          <Logo className="w-20 sm:w-24" />
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
            className={`rounded-full px-5 py-2.5 font-medium transition ${
              solid ? "bg-forest text-paper hover:bg-forest-deep" : "bg-paper text-forest hover:bg-blush"
            }`}
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
