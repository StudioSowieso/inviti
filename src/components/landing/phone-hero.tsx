"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
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

/** Hoeveel de telefoon met de muis meedraait, in graden bij de rand van de hero. */
const TILT_Y = 18;
const TILT_X = 8;

const HEADING = "font-serif text-4xl leading-[1.06] font-medium sm:text-5xl md:text-6xl";

/**
 * Hero zonder scroll-effecten. Rechts kies je een onderdeel, links past de tekst zich aan
 * en de telefoon wisselt mee.
 */
export function PhoneHero() {
  const [active, setActive] = useState(0);
  const root = useRef<HTMLElement>(null);
  const tilt = useRef<HTMLDivElement>(null);

  // De telefoon draait zacht mee met de muis (alleen met een muis, en niet bij "minder beweging").
  useEffect(() => {
    const section = root.current;
    const phone = tilt.current;
    if (!section || !phone) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let tx = 0;
    let ty = 0;
    let cx = 0;
    let cy = 0;
    let raf = 0;

    const apply = () => {
      cx += (tx - cx) * 0.08;
      cy += (ty - cy) * 0.08;
      // De telefoon kijkt naar de muis: muis links = naar links gedraaid, muis rechts = naar rechts.
      phone.style.transform = `rotateY(${-cx * TILT_Y}deg) rotateX(${-cy * TILT_X}deg)`;
      raf = Math.abs(tx - cx) > 0.001 || Math.abs(ty - cy) > 0.001 ? requestAnimationFrame(apply) : 0;
    };
    const kick = () => {
      if (!raf) raf = requestAnimationFrame(apply);
    };
    const onMove = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      const r = section.getBoundingClientRect();
      tx = ((e.clientX - r.left) / r.width - 0.5) * 2;
      ty = ((e.clientY - r.top) / r.height - 0.5) * 2;
      kick();
    };
    const onLeave = () => {
      tx = 0;
      ty = 0;
      kick();
    };

    section.addEventListener("pointermove", onMove);
    section.addEventListener("pointerleave", onLeave);
    return () => {
      section.removeEventListener("pointermove", onMove);
      section.removeEventListener("pointerleave", onLeave);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section ref={root} id="hero" aria-label="Proost Mee" className="relative overflow-hidden bg-forest-deep text-paper">
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

        <div aria-hidden className="relative mx-auto" style={{ perspective: "1600px" }}>
          <span className="pointer-events-none absolute inset-x-6 -bottom-5 h-12 rounded-full bg-black/45 blur-2xl" />
          <div ref={tilt} className="will-change-transform" style={{ transformStyle: "preserve-3d" }}>
            <PhoneFrame solid slugs={SLUGS} active={active} className="h-[52svh] md:h-[min(68svh,42rem)]" />
          </div>
        </div>

        {/* Keuze: alleen titels, duidelijk als knoppen */}
        <div className="text-center md:text-left">
          <p className="mb-4 text-sm text-paper/65">Kies een onderdeel</p>
          <ul aria-label="Kies een onderdeel" className="flex flex-wrap justify-center gap-3 md:max-w-xs md:flex-col md:flex-nowrap">
            {STEPS.map((s, i) => {
              const on = i === active;
              return (
                <li key={s.slug} className="md:w-full">
                  <button
                    type="button"
                    aria-pressed={on}
                    onClick={() => setActive(i)}
                    className={`group flex w-full items-center justify-between gap-4 rounded-full border px-6 py-3 text-left font-serif text-xl font-medium transition-colors motion-reduce:transition-none ${
                      on
                        ? "border-paper bg-paper text-forest"
                        : "border-paper/30 text-paper hover:border-paper/70 hover:bg-paper/10"
                    }`}
                  >
                    {s.label}
                    <ChevronRightIcon
                      width={18}
                      height={18}
                      className={`shrink-0 transition-transform motion-reduce:transition-none ${on ? "" : "group-hover:translate-x-1"}`}
                    />
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
