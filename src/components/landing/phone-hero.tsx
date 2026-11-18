"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { ChevronRightIcon, Sparkle } from "@/components/icons";
import { ScreenCard } from "./phone";

type Card = { slug: string; label: string; kind: "design" | "app" };

/** Voorbeelden in de rij: uitnodigingsontwerpen en schermen uit de backoffice, om en om. */
const CARDS: Card[] = [
  { slug: "todo", label: "To-do's", kind: "app" },
  { slug: "modern", label: "Modern", kind: "design" },
  { slug: "gastenlijst", label: "Gastenlijst", kind: "app" },
  { slug: "sweet", label: "Sweet", kind: "design" },
  { slug: "leaf", label: "Leaf", kind: "design" },
  { slug: "dashboard", label: "Dashboard", kind: "app" },
  { slug: "lemon", label: "Lemon", kind: "design" },
  { slug: "versturen", label: "Versturen", kind: "app" },
  { slug: "flowers", label: "Flowers", kind: "design" },
];
const CENTER = 4;

/** Hoeveel de rij met de muis meedraait, in graden bij de rand van de hero. */
const LOOK = 7;

/** Handgetekende pijl, voor de notities. */
function Arrow({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 44"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className={className}
    >
      <path d="M3 30C16 10 36 8 54 26" />
      <path d="M44 24l11 3 1-12" />
    </svg>
  );
}

/**
 * Hero zonder scroll-effecten: gecentreerde kop en daaronder een gebogen rij met voorbeelden van
 * uitnodigingen en backoffice-schermen. De rij draait zacht mee met de muis.
 */
export function PhoneHero() {
  const root = useRef<HTMLElement>(null);
  const row = useRef<HTMLDivElement>(null);

  // De rij kijkt mee met de muis (alleen met een muis, en niet bij "minder beweging").
  useEffect(() => {
    const section = root.current;
    const el = row.current;
    if (!section || !el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const onMove = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      const r = section.getBoundingClientRect();
      const x = ((e.clientX - r.left) / r.width - 0.5) * 2;
      el.style.setProperty("--look", String(x));
    };
    const onLeave = () => el.style.setProperty("--look", "0");

    section.addEventListener("pointermove", onMove);
    section.addEventListener("pointerleave", onLeave);
    return () => {
      section.removeEventListener("pointermove", onMove);
      section.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <section
      ref={root}
      id="hero"
      aria-label="Proost Mee"
      className="bg-gradient-to-b from-blush to-cream px-3 pt-24 pb-6 sm:px-5 md:pt-28"
    >
      <div className="relative mx-auto max-w-[88rem] overflow-hidden rounded-[2rem] bg-paper px-4 pt-10 pb-10 text-center shadow-[0_0_0_6px_rgb(251_249_246/0.6)] md:rounded-[2.5rem] md:pt-14">
        <p className="mx-auto inline-flex items-center gap-2 rounded-full bg-blush px-4 py-1.5 text-sm text-forest">
          <Sparkle width={11} height={11} className="text-clay" />
          Gratis uitproberen, betaal pas bij het versturen
        </p>

        <h1 className="mx-auto mt-6 max-w-4xl font-serif text-[clamp(2.75rem,6vw,5.5rem)] leading-[1.02] font-medium tracking-tight text-forest">
          Jullie dag,
          <br />
          <span className="italic">mooi geregeld.</span>
        </h1>

        <p className="mx-auto mt-6 max-w-xl leading-relaxed text-ink/70">
          Ontwerp een persoonlijke digitale uitnodiging, beheer jullie gastenlijst en houd alle RSVP&apos;s bij op één rustige plek.
        </p>

        {/* Notitie rechtsboven, wijst naar de rij */}
        <div
          aria-hidden
          className="pointer-events-none absolute top-[9rem] right-[5%] hidden -rotate-6 text-clay lg:block"
        >
          <p className="font-hand text-2xl leading-[1.05]">
            Jullie uitnodiging,
            <br />
            jullie stijl
          </p>
          <Arrow className="mt-1 ml-10 h-12 w-16 rotate-[78deg]" />
        </div>

        {/* Gebogen rij met voorbeelden */}
        <div className="relative mt-8 overflow-hidden py-6 md:mt-10">
          <div
            ref={row}
            className="relative left-1/2 flex w-max -translate-x-1/2 items-center gap-3 md:gap-5"
            style={{ ["--look" as string]: "0" }}
          >
            {CARDS.map((c, i) => {
              const d = i - CENTER;
              const rot = -d * 13;
              const scale = 1.08 - Math.abs(d) * 0.06;
              return (
                <div
                  key={c.slug}
                  aria-hidden
                  className="w-[clamp(8.5rem,13.5vw,12.5rem)] shrink-0 transition-transform duration-300 ease-out motion-reduce:transition-none"
                  style={{
                    transform: `perspective(900px) rotateY(calc(${rot}deg + var(--look, 0) * ${LOOK}deg)) scale(${scale})`,
                  }}
                >
                  <div className="relative">
                    <ScreenCard
                      slug={c.slug}
                      className="w-full border border-line/70 shadow-[0_24px_40px_-20px_rgb(31_36_32/0.4)]"
                    />
                    <span
                      className={`absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full px-3 py-1 text-[11px] font-medium whitespace-nowrap shadow ${
                        c.kind === "app" ? "bg-forest text-paper" : "bg-paper text-forest"
                      }`}
                    >
                      {c.label}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Knop met notitie */}
        <div className="mt-6 md:grid md:grid-cols-[1fr_auto_1fr] md:items-center md:gap-6">
          <div aria-hidden className="pointer-events-none hidden items-center justify-end gap-2 text-clay md:flex">
            <p className="-rotate-6 font-hand text-2xl leading-none">Eerst gratis proberen</p>
            <Arrow className="h-9 w-14 rotate-[18deg]" />
          </div>
          <span className="inline-block rounded-full border-2 border-dashed border-forest/35 p-1.5">
            <Link
              href="/account-aanmaken"
              className="inline-flex items-center gap-2 rounded-full bg-forest px-7 py-3.5 font-medium text-paper transition hover:bg-forest-deep"
            >
              Begin met jullie uitnodiging <ChevronRightIcon width={16} height={16} />
            </Link>
          </span>
        </div>
      </div>
    </section>
  );
}
