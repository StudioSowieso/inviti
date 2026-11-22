import type { Metadata } from "next";
import { CtaBand, Eyebrow } from "@/components/landing/bits";
import { FEATURES, STEPS } from "@/components/landing/content";
import { MarketingShell } from "@/components/landing/marketing-shell";
import { PRICE_LABEL } from "@/lib/stripe";

export const metadata: Metadata = {
  title: "Zo werkt het — Proost Mee",
  description:
    "In drie stappen van idee naar RSVP: ontwerp de uitnodiging, maak de gastenlijst en verstuur en volg de reacties.",
};

export default function ZoWerktHetPage() {
  return (
    <MarketingShell>
      <section>
        <div className="mx-auto grid max-w-6xl gap-14 px-6 pt-36 pb-28 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20 lg:px-10 lg:pt-44 lg:pb-40">
          <div className="lg:sticky lg:top-32 lg:self-start">
            <Eyebrow>Zo werkt het</Eyebrow>
            <h1 data-split className="mt-5 font-serif text-5xl leading-[1.04] font-medium sm:text-7xl">
              In drie stappen van idee naar RSVP
            </h1>
            <p data-reveal className="mt-6 max-w-sm leading-relaxed text-ink/70">
              Geen ingewikkelde tools. Jullie doen wat bij jullie past, Proost Mee houdt het overzicht.
            </p>
          </div>
          <ol className="relative pl-10 sm:pl-14">
            <span aria-hidden className="absolute top-3 bottom-3 left-0 w-px bg-line" />
            <span data-line aria-hidden className="absolute top-3 bottom-3 left-0 w-px bg-clay" />
            {STEPS.map((s) => (
              <li key={s.n} data-reveal className="relative pb-16 last:pb-0">
                <span aria-hidden className="absolute top-3 -left-10 size-2.5 -translate-x-1/2 rounded-full bg-clay sm:-left-14" />
                <span className="font-serif text-6xl leading-none text-clay/80 sm:text-7xl">{s.n}</span>
                <h2 className="mt-4 font-serif text-3xl leading-tight font-medium sm:text-4xl">{s.title}</h2>
                <p className="mt-3 max-w-md leading-relaxed text-ink/70">{s.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="relative bg-sage/60">
        <div className="relative mx-auto max-w-6xl px-6 py-28 lg:px-10 lg:py-40">
          <Eyebrow>Alles wat je nodig hebt</Eyebrow>
          <h2 data-split className="mt-5 max-w-2xl font-serif text-4xl leading-[1.06] font-medium sm:text-6xl">
            Eén plek voor je hele bruiloftscommunicatie
          </h2>
          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((f) => (
              <article key={f.title} data-card className="card p-7">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-blush text-clay">
                  <f.icon width={20} height={20} />
                </span>
                <h3 className="mt-5 font-serif text-2xl leading-tight font-medium">{f.title}</h3>
                <p className="mt-3 text-[0.95rem] leading-relaxed text-ink/70">{f.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <CtaBand
        title="Begin met jullie uitnodiging"
        note={`Ontwerp en plan gratis in de testomgeving. Versturen kan met de volledige versie, eenmalig ${PRICE_LABEL}.`}
      />
    </MarketingShell>
  );
}
