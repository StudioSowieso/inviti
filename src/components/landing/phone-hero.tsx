"use client";

import Link from "next/link";
import { useState } from "react";
import { ChevronRightIcon, Sparkle } from "@/components/icons";
import { PhoneFrame } from "./phone";

const STEPS = [
  {
    slug: "leaf",
    glow: "#8c9b78",
    title: "Een uitnodiging met openingsanimatie",
    text: "Elke uitnodiging opent met een animatie, per thema een eigen envelop. Het eerste moment is meteen een cadeautje voor jullie gasten.",
  },
  {
    slug: "sweet",
    glow: "#e6a7b4",
    title: "Eigen bruiloftswebsite",
    text: "Elke uitnodiging is meteen een website met jullie verhaal, programma, locatie en dresscode. Eén link, alles erop.",
  },
  {
    slug: "gastenlijst",
    glow: "#e8c764",
    title: "Makkelijk gasten beheren",
    text: "Voeg gasten toe of importeer ze, deel ze in groepen in en zie wie komt. Plus-één en dieetwensen staan bij de juiste persoon.",
  },
  {
    slug: "modern",
    glow: "#b9ae9d",
    title: "Uitnodigingen versturen",
    text: "Stuur elke gast een persoonlijke link via WhatsApp of mail, of maak één link per groep die je zelf deelt.",
  },
];

const SLUGS = STEPS.map((s) => s.slug);

const CTA_PRIMARY =
  "inline-flex items-center gap-2 rounded-full bg-paper px-6 py-3 font-medium text-forest transition hover:bg-blush";

/**
 * Hero zonder scroll-effecten: een gewone sectie waarin je zelf een onderdeel kiest,
 * waarna de telefoon meewisselt.
 */
export function PhoneHero() {
  const [active, setActive] = useState(0);

  return (
    <section id="hero" aria-label="Proost Mee" className="relative overflow-hidden bg-forest-deep text-paper">
      {STEPS.map((s, i) => (
        <div
          key={s.slug}
          aria-hidden
          className="pointer-events-none absolute inset-0 transition-opacity duration-700 motion-reduce:transition-none"
          style={{ background: `radial-gradient(55% 50% at 50% 52%, ${s.glow}59, transparent 72%)`, opacity: i === active ? 1 : 0 }}
        />
      ))}

      <div
        aria-hidden
        className="pointer-events-none absolute bottom-0 left-1/2 hidden h-[92%] w-[min(44vw,34rem)] -translate-x-1/2 rounded-t-full border border-b-0 border-paper/15 md:block"
      />

      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-6 pt-32 pb-16 md:min-h-svh md:grid-cols-[1fr_auto_1fr] md:gap-10 md:py-28 lg:px-10">
        <div className="text-center md:text-left">
          <p className="eyebrow flex items-center justify-center gap-2 text-blush/80 md:justify-start">
            Digitale bruiloftsuitnodigingen <Sparkle width={9} height={9} />
          </p>
          <h1 className="mt-4 font-serif text-5xl leading-[1.04] font-medium md:text-6xl">Jullie dag, mooi geregeld.</h1>
          <p className="mx-auto mt-5 max-w-md leading-relaxed text-paper/75 md:mx-0">
            Ontwerp een persoonlijke digitale uitnodiging, beheer jullie gastenlijst en houd alle RSVP&apos;s bij op één rustige
            plek. Zodat jullie aandacht naar elkaar kan gaan.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-5 gap-y-3 md:justify-start">
            <Link href="/account-aanmaken" className={CTA_PRIMARY}>
              Begin met jullie uitnodiging <ChevronRightIcon width={16} height={16} />
            </Link>
            <Link href="/zo-werkt-het" className="text-sm font-medium text-paper/80 underline-offset-4 hover:text-paper hover:underline">
              Zo werkt het
            </Link>
          </div>
          <p className="mt-4 text-xs text-paper/60">Gratis uitproberen. Je betaalt pas als je gaat versturen.</p>
        </div>

        <div aria-hidden className="mx-auto">
          <PhoneFrame slugs={SLUGS} active={active} className="h-[52svh] md:h-[min(68svh,42rem)]" />
        </div>

        <ul className="divide-y divide-paper/15 border-y border-paper/15">
          {STEPS.map((s, i) => {
            const on = i === active;
            return (
              <li key={s.slug}>
                <button
                  type="button"
                  aria-pressed={on}
                  onClick={() => setActive(i)}
                  className={`flex w-full items-center justify-between gap-4 py-4 text-left font-serif text-2xl leading-tight font-medium transition-opacity motion-reduce:transition-none ${
                    on ? "opacity-100" : "opacity-60 hover:opacity-100"
                  }`}
                >
                  {s.title}
                  <span aria-hidden className={`size-2 shrink-0 rounded-full transition-colors ${on ? "bg-blush" : "bg-paper/25"}`} />
                </button>
                <div
                  aria-hidden={!on}
                  className={`grid transition-[grid-template-rows] duration-500 motion-reduce:transition-none ${
                    on ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="max-w-sm pb-5 text-[0.95rem] leading-relaxed text-paper/75">{s.text}</p>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
