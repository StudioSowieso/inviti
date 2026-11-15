import type { Metadata } from "next";
import Link from "next/link";
import { CheckIcon, ChevronDownIcon } from "@/components/icons";
import { CtaBand, PageIntro } from "@/components/landing/bits";
import { MarketingShell } from "@/components/landing/marketing-shell";
import { PRICE_LABEL } from "@/lib/stripe";

export const metadata: Metadata = {
  title: "Prijzen — Proost Mee",
  description: `Gratis uitproberen. Voor het versturen van de uitnodiging betaal je eenmalig ${PRICE_LABEL}, geen abonnement.`,
};

const FREE = [
  "Je uitnodiging ontwerpen met thema en openingsanimatie",
  "Je gastenlijst opbouwen en importeren",
  "Een to-do lijst met deadlines",
];

const FULL = [
  "Alles uit de testomgeving",
  "Verstuur de persoonlijke uitnodiging aan al je gasten",
  "Via WhatsApp, e-mail of een link per groep",
  "RSVP's komen automatisch binnen",
];

const FAQ = [
  {
    q: "Is het een abonnement?",
    a: `Nee. Je betaalt eenmalig ${PRICE_LABEL} voor de volledige versie.`,
  },
  {
    q: "Kan ik eerst uitproberen?",
    a: "Ja. In de testomgeving ontwerp je je uitnodiging, bouw je de gastenlijst op en houd je je to-do's bij. Alleen voor het versturen heb je de volledige versie nodig.",
  },
  {
    q: "Hoe betaal ik?",
    a: "Veilig via Stripe, onder andere met iDEAL en creditcard.",
  },
];

function Check({ light = false }: { light?: boolean }) {
  return (
    <span className={`mt-0.5 grid size-6 shrink-0 place-items-center rounded-full ${light ? "bg-paper/15 text-paper" : "bg-sage text-forest"}`}>
      <CheckIcon width={13} height={13} />
    </span>
  );
}

export default function PrijzenPage() {
  return (
    <MarketingShell>
      <PageIntro eyebrow="Prijzen" title="Gratis uitproberen, eenmalig betalen om te versturen">
        Je ontwerpt, bouwt de gastenlijst en plant je to-do&apos;s in de testomgeving. Pas als de uitnodiging de deur uit gaat,
        heb je de volledige versie nodig.
      </PageIntro>

      <section className="mx-auto max-w-6xl px-6 pb-28 lg:px-10 lg:pb-40">
        <div className="grid gap-5 md:grid-cols-2">
          <article data-card className="card flex flex-col p-8 sm:p-10">
            <h2 className="font-serif text-3xl font-medium">Testomgeving</h2>
            <p className="mt-4 font-serif text-5xl leading-none font-medium">Gratis</p>
            <p className="mt-2 text-sm text-ink/65">Zonder betaalgegevens</p>
            <ul className="mt-8 flex-1 space-y-3.5 text-[0.95rem]">
              {FREE.map((t) => (
                <li key={t} className="flex gap-3">
                  <Check />
                  {t}
                </li>
              ))}
            </ul>
            <Link
              href="/account-aanmaken"
              className="mt-10 inline-flex w-full items-center justify-center rounded-full border border-forest/30 px-6 py-3.5 font-medium text-forest transition hover:bg-sage/60"
            >
              Gratis beginnen
            </Link>
          </article>

          <article data-card className="flex flex-col rounded-[1.25rem] bg-forest p-8 text-paper sm:p-10">
            <h2 className="font-serif text-3xl font-medium">Volledige versie</h2>
            <p className="mt-4 font-serif text-5xl leading-none font-medium">{PRICE_LABEL}</p>
            <p className="mt-2 text-sm text-paper/70">Eenmalig, geen abonnement</p>
            <ul className="mt-8 flex-1 space-y-3.5 text-[0.95rem]">
              {FULL.map((t) => (
                <li key={t} className="flex gap-3">
                  <Check light />
                  {t}
                </li>
              ))}
            </ul>
            <Link
              href="/account-aanmaken"
              className="mt-10 inline-flex w-full items-center justify-center rounded-full bg-paper px-6 py-3.5 font-medium text-forest transition hover:bg-blush"
            >
              Aan de slag
            </Link>
            <p className="mt-4 text-center text-xs text-paper/60">Je kiest de volledige versie pas als je gaat versturen.</p>
          </article>
        </div>

        <div className="mx-auto mt-24 max-w-2xl">
          <h2 data-split className="font-serif text-4xl leading-[1.06] font-medium sm:text-5xl">
            Veelgestelde vragen
          </h2>
          <div className="mt-8 divide-y divide-line border-y border-line">
            {FAQ.map((f) => (
              <details key={f.q} className="group py-5">
                <summary className="flex items-center justify-between gap-4 font-serif text-2xl font-medium">
                  {f.q}
                  <ChevronDownIcon width={20} height={20} className="shrink-0 text-clay transition-transform group-open:rotate-180" />
                </summary>
                <p className="mt-3 max-w-lg leading-relaxed text-ink/70">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <CtaBand title="Probeer het gratis" text="Maak een account aan en ontwerp jullie uitnodiging. Betalen kan later." />
    </MarketingShell>
  );
}
