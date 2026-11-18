"use client";

import Link from "next/link";
import { useState } from "react";
import { ChevronRightIcon, Sparkle } from "@/components/icons";
import { PhoneFrame } from "./phone";

const STEPS = [
  {
    slug: "leaf",
    glow: "#8c9b78",
    label: "Uitnodiging",
    title: "Jullie dag, mooi geregeld.",
    text: "Ontwerp een persoonlijke digitale uitnodiging, beheer jullie gastenlijst en houd alle RSVP's bij op één rustige plek. Zodat jullie aandacht naar elkaar kan gaan.",
  },
  {
    slug: "sweet",
    glow: "#e6a7b4",
    label: "Website",
    title: "Eigen bruiloftswebsite",
    text: "Elke uitnodiging is meteen een website met jullie verhaal, programma, locatie en dresscode. Eén link, alles erop.",
  },
  {
    slug: "gastenlijst",
    glow: "#e8c764",
    label: "Gastenlijst",
    title: "Makkelijk gasten beheren",
    text: "Voeg gasten toe of importeer ze, deel ze in groepen in en zie wie komt. Plus-één en dieetwensen staan bij de juiste persoon.",
  },
  {
    slug: "modern",
    glow: "#b9ae9d",
    label: "Versturen",
    title: "Uitnodigingen versturen",
    text: "Stuur elke gast een persoonlijke link via WhatsApp of mail, of maak één link per groep die je zelf deelt.",
  },
];

const SLUGS = STEPS.map((s) => s.slug);

const CTA_PRIMARY =
  "inline-flex items-center gap-2 rounded-full bg-paper px-6 py-3 font-medium text-forest transition hover:bg-blush";

const HEADING = "font-serif text-4xl leading-[1.06] font-medium sm:text-5xl md:text-6xl";

/**
 * Hero zonder scroll-effecten. Rechts kies je een onderdeel, links past de tekst zich aan
 * en de telefoon wisselt mee.
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

      <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-6 pt-32 pb-16 md:min-h-svh md:grid-cols-[1fr_auto_1fr] md:gap-12 md:py-28 lg:px-10">
        {/* Tekst, past zich aan op de gekozen stap */}
        <div className="text-center md:text-left">
          <p className="eyebrow flex items-center justify-center gap-2 text-blush/80 md:justify-start">
            Digitale bruiloftsuitnodigingen <Sparkle width={9} height={9} />
          </p>

          <div className="mt-4 grid">
            {STEPS.map((s, i) => {
              const on = i === active;
              const Heading = i === 0 ? "h1" : "h2";
              return (
                <div
                  key={s.slug}
                  aria-hidden={!on}
                  className={`col-start-1 row-start-1 transition-opacity duration-500 motion-reduce:transition-none ${
                    on ? "opacity-100" : "pointer-events-none opacity-0"
                  }`}
                >
                  <Heading className={HEADING}>{s.title}</Heading>
                  <p className="mx-auto mt-5 max-w-md leading-relaxed text-paper/75 md:mx-0">{s.text}</p>
                </div>
              );
            })}
          </div>

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

        {/* Keuze: alleen titels */}
        <ul aria-label="Kies een onderdeel" className="flex justify-center gap-x-6 gap-y-2 max-md:flex-wrap md:flex-col md:items-start md:gap-1">
          {STEPS.map((s, i) => {
            const on = i === active;
            return (
              <li key={s.slug}>
                <button
                  type="button"
                  aria-pressed={on}
                  onClick={() => setActive(i)}
                  className={`flex items-center gap-3 py-1.5 font-serif text-2xl font-medium transition-opacity motion-reduce:transition-none ${
                    on ? "opacity-100" : "opacity-50 hover:opacity-100"
                  }`}
                >
                  <span aria-hidden className={`h-px bg-blush transition-all duration-500 motion-reduce:transition-none ${on ? "w-8" : "w-0 md:w-3"}`} />
                  {s.label}
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
