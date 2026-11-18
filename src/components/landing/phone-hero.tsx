"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ChevronRightIcon, LinkIcon, PenIcon, SendIcon, Sparkle, UsersIcon } from "@/components/icons";
import { PhoneFrame } from "./phone";

const STEPS = [
  {
    slug: "leaf",
    glow: "#8c9b78",
    label: "Uitnodiging",
    icon: PenIcon,
    title: "Jullie eigen uitnodiging",
    text: "Ontwerp een persoonlijke digitale uitnodiging die opent met een animatie, per thema een eigen envelop.",
  },
  {
    slug: "sweet",
    glow: "#e6a7b4",
    label: "Website",
    icon: LinkIcon,
    title: "Eigen bruiloftswebsite",
    text: "Elke uitnodiging is meteen een website met jullie verhaal, programma, locatie en dresscode. Eén link, alles erop.",
  },
  {
    slug: "gastenlijst",
    glow: "#e8c764",
    label: "Gastenlijst",
    icon: UsersIcon,
    title: "Makkelijk gasten beheren",
    text: "Voeg gasten toe of importeer ze, deel ze in groepen in en zie wie komt. Plus-één en dieetwensen staan bij de juiste persoon.",
  },
  {
    slug: "modern",
    glow: "#b9ae9d",
    label: "Versturen",
    icon: SendIcon,
    title: "Uitnodigingen versturen",
    text: "Stuur elke gast een persoonlijke link via WhatsApp of mail, of maak één link per groep die je zelf deelt.",
  },
];

const SLUGS = STEPS.map((s) => s.slug);

/** Hoeveel de telefoon met de muis meedraait, in graden bij de rand van de hero. */
const TILT_Y = 18;
const TILT_X = 8;

/* Telefoonbreedte: clamp(11rem,20vw,17rem). Staat letterlijk in de klassen hieronder (kolommen en telefoon),
   want Tailwind herkent geen klassen die uit een variabele worden samengesteld. */

/** Groot woord in de kop, met een zachte streek in blush eronder. */
const BIG =
  "relative isolate inline-block font-serif font-semibold uppercase leading-[0.95] tracking-tight text-forest text-[clamp(2.9rem,13vw,5rem)] md:text-[clamp(3.2rem,7vw,7rem)]";

function Stroke({ className = "bg-blush" }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={`absolute inset-x-[-0.06em] bottom-[0.04em] -z-10 h-[0.32em] -rotate-1 rounded-full ${className}`}
    />
  );
}

/**
 * Hero zonder scroll-effecten. Grote kop links en rechts van de telefoon, daaronder een groen paneel
 * waarin je een onderdeel kiest. De tekst past zich aan en de telefoon wisselt en draait mee met de muis.
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
    <section ref={root} id="hero" aria-label="Proost Mee" className="bg-cream px-3 pt-24 pb-6 sm:px-5 md:pt-28">
      <div className="relative mx-auto max-w-[88rem] rounded-[2rem] border border-line bg-paper pt-6 pb-3 md:rounded-[3rem] md:px-3 md:pt-8 md:pb-3">
        <p className="px-6 text-center text-sm text-ink/60 md:px-9 md:text-left">Digitale bruiloftsuitnodigingen en RSVP</p>

        {/* Kop: links en rechts van de telefoon */}
        <h1
          className="px-6 pt-3 text-center md:grid md:grid-cols-[1fr_clamp(11rem,20vw,17rem)_1fr] md:items-end md:gap-8 md:px-9 md:pt-5 md:text-left"
        >
          <span className="block md:justify-self-start">
            <span className="font-serif text-3xl font-medium italic md:text-[clamp(1.6rem,3.2vw,3.2rem)]">Jullie dag,</span>{" "}
            <span className={BIG}>
              mooi
              <Stroke />
            </span>
          </span>
          <span aria-hidden className="hidden md:block" />
          <span className="block md:mt-8 md:justify-self-end">
            <span className={BIG}>
              geregeld.
              <Stroke className="bg-sage" />
            </span>
          </span>
        </h1>

        {/* Telefoon, overlapt de kop en het paneel */}
        <div
          aria-hidden
          className="relative z-20 mx-auto -mb-24 mt-6 w-fit md:absolute md:top-[4.5rem] md:left-1/2 md:mt-0 md:mb-0 md:-translate-x-1/2"
          style={{ perspective: "1600px" }}
        >
          <span className="pointer-events-none absolute inset-x-6 -bottom-5 h-12 rounded-full bg-black/40 blur-2xl" />
          <div ref={tilt} className="will-change-transform" style={{ transformStyle: "preserve-3d" }}>
            <PhoneFrame solid slugs={SLUGS} active={active} className="w-[clamp(11rem,20vw,17rem)]" />
          </div>
        </div>

        {/* Paneel */}
        <div className="relative mx-3 mt-6 overflow-hidden rounded-[1.75rem] bg-forest-deep text-paper md:mx-0 md:mt-8 md:rounded-[2.25rem]">
          {STEPS.map((s, i) => (
            <div
              key={s.slug}
              aria-hidden
              className="pointer-events-none absolute inset-0 transition-opacity duration-700 motion-reduce:transition-none"
              style={{ background: `radial-gradient(40% 70% at 50% 55%, ${s.glow}59, transparent 72%)`, opacity: i === active ? 1 : 0 }}
            />
          ))}

          <div
            className="relative grid gap-8 px-6 pt-32 pb-8 md:min-h-[27rem] md:grid-cols-[1fr_clamp(11rem,20vw,17rem)_1fr] md:gap-10 md:px-12 md:py-12"
          >
            {/* Links: tekst bij de gekozen stap */}
            <div>
              <div className="grid">
                {STEPS.map((s, i) => {
                  const on = i === active;
                  return (
                    <div
                      key={s.slug}
                      aria-hidden={!on}
                      className={`col-start-1 row-start-1 transition-opacity duration-500 motion-reduce:transition-none ${
                        on ? "opacity-100" : "pointer-events-none opacity-0"
                      }`}
                    >
                      <h2 className="font-serif text-3xl leading-tight font-medium md:text-4xl">{s.title}</h2>
                      <p className="mt-3 max-w-sm text-[0.95rem] leading-relaxed text-paper/75">{s.text}</p>
                    </div>
                  );
                })}
              </div>

              <Link
                href="/account-aanmaken"
                className="mt-6 inline-flex items-center gap-3 rounded-full bg-paper py-1.5 pr-1.5 pl-6 font-medium text-forest transition hover:bg-blush"
              >
                Begin met jullie uitnodiging
                <span className="grid size-9 place-items-center rounded-full bg-forest text-paper">
                  <ChevronRightIcon width={16} height={16} />
                </span>
              </Link>

              <p className="mt-6 flex max-w-xs items-start gap-3 rounded-2xl bg-paper/10 p-4 text-sm leading-snug text-paper/80">
                <Sparkle width={14} height={14} className="mt-0.5 shrink-0 text-blush" />
                Gratis uitproberen. Je betaalt pas als je gaat versturen.
              </p>
            </div>

            <span aria-hidden className="hidden md:block" />

            {/* Rechts: keuze en doorverwijzing */}
            <div>
              <p className="text-sm text-paper/65">Kies een onderdeel</p>
              <ul aria-label="Kies een onderdeel" className="mt-3 grid grid-cols-2 gap-2.5">
                {STEPS.map((s, i) => {
                  const on = i === active;
                  const Icon = s.icon;
                  return (
                    <li key={s.slug}>
                      <button
                        type="button"
                        aria-pressed={on}
                        onClick={() => setActive(i)}
                        className={`flex w-full items-center gap-3 rounded-2xl border px-3.5 py-3 text-left text-[0.95rem] font-medium transition-colors motion-reduce:transition-none ${
                          on ? "border-paper bg-paper text-forest" : "border-paper/30 text-paper hover:border-paper/70 hover:bg-paper/10"
                        }`}
                      >
                        <span
                          className={`grid size-8 shrink-0 place-items-center rounded-full ${on ? "bg-forest text-paper" : "bg-paper/10 text-blush"}`}
                        >
                          <Icon width={16} height={16} />
                        </span>
                        {s.label}
                      </button>
                    </li>
                  );
                })}
              </ul>

              <div className="mt-6 rounded-3xl bg-paper p-5 text-ink">
                <p className="font-serif text-2xl leading-tight font-medium">Negen thema&apos;s</p>
                <p className="mt-1 text-sm leading-snug text-ink/65">Elk met een eigen openingsanimatie. Dit zijn echte voorbeelden.</p>
                <Link
                  href="/themas"
                  className="mt-4 inline-flex items-center gap-2 rounded-full border border-forest/30 px-4 py-2 text-sm font-medium text-forest transition hover:bg-sage/60"
                >
                  Bekijk de thema&apos;s <ChevronRightIcon width={14} height={14} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
