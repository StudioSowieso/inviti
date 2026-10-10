"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Logo } from "@/components/logo";

/** Vaste navigatie: transparant op de donkere hero, daarna crème met blur. */
export function LandingNav() {
  const [solid, setSolid] = useState(false);

  useEffect(() => {
    const update = () => {
      const hero = document.getElementById("hero");
      setSolid(hero ? hero.getBoundingClientRect().bottom < 90 : window.scrollY > 40);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-[background-color,backdrop-filter,color] duration-500 ${
        solid ? "bg-cream/85 text-ink backdrop-blur-md" : "bg-transparent text-paper"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 lg:px-10">
        <Link href="/" className="block" aria-label="Inviti">
          <Logo className="w-28 sm:w-32" />
        </Link>
        <nav className="flex items-center gap-2 text-sm">
          <Link href="/inloggen" className="rounded-full px-4 py-2 font-medium opacity-85 transition hover:opacity-100">
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
        </nav>
      </div>
    </header>
  );
}
