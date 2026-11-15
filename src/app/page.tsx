import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRightIcon, Sparkle } from "@/components/icons";
import { CtaBand, Eyebrow } from "@/components/landing/bits";
import { USPS } from "@/components/landing/content";
import { MarketingShell } from "@/components/landing/marketing-shell";
import { PhoneHero } from "@/components/landing/phone-hero";
import { PRICE_LABEL } from "@/lib/stripe";

export const metadata: Metadata = {
  title: "Proost Mee — Digitale bruiloftsuitnodigingen en RSVP",
  description:
    "Ontwerp jullie digitale bruiloftsuitnodiging, beheer de gastenlijst en volg alle RSVP's op één rustige plek.",
};

const TILES = [
  {
    href: "/zo-werkt-het",
    title: "Zo werkt het",
    text: "Van ontwerp tot RSVP in drie stappen, met alles wat erbij komt kijken.",
    cta: "Bekijk de stappen",
  },
  {
    href: "/themas",
    title: "Thema's",
    text: "Negen thema's, elk met een eigen openingsanimatie. Dit zijn echte voorbeelden.",
    cta: "Bekijk de thema's",
  },
  {
    href: "/prijzen",
    title: "Prijzen",
    text: `Gratis uitproberen. Voor het versturen betaal je eenmalig ${PRICE_LABEL}, geen abonnement.`,
    cta: "Bekijk de prijzen",
  },
];

export default function Home() {
  return (
    <MarketingShell>
      <PhoneHero />

      {/* Het idee */}
      <section className="mx-auto max-w-4xl px-6 py-28 text-center lg:py-40">
        <Eyebrow className="justify-center text-clay">Het idee</Eyebrow>
        <p
          data-words
          className="mt-8 font-serif text-4xl leading-[1.12] font-medium sm:text-5xl lg:text-6xl"
        >
          Een uitnodiging die voelt als het begin van het feest. Mooi om te ontvangen, makkelijk om te beheren.
        </p>
        <p data-reveal className="mx-auto mt-10 max-w-lg leading-relaxed text-ink/70">
          Papieren kaarten zijn mooi, maar adressen, reacties en dieetwensen bijhouden is veel werk. Met Proost Mee
          komt alles samen in jullie eigen dashboard.
        </p>
      </section>

      {/* Lopende band */}
      <section aria-label="Wat je krijgt" className="overflow-hidden border-y border-forest/15 bg-sage/60 py-8 sm:py-10">
        <div data-marquee className="flex w-max items-center whitespace-nowrap">
          {[0, 1].map((k) => (
            <div key={k} aria-hidden={k === 1} className="flex items-center">
              {USPS.map((t) => (
                <span key={t + k} className="flex items-center font-serif text-4xl font-medium text-forest italic sm:text-6xl">
                  <span className="px-8 sm:px-12">{t}</span>
                  <Sparkle width={18} height={18} className="text-clay" />
                </span>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* Doorverwijzing naar de andere pagina's */}
      <section className="mx-auto max-w-6xl px-6 py-28 lg:px-10 lg:py-40">
        <h2 data-split className="max-w-2xl font-serif text-4xl leading-[1.06] font-medium sm:text-6xl">
          Alles om jullie gasten uit te nodigen
        </h2>
        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {TILES.map((t) => (
            <Link
              key={t.href}
              href={t.href}
              data-card
              className="card group flex flex-col p-8 transition-colors hover:border-clay/60"
            >
              <h3 className="font-serif text-3xl leading-tight font-medium">{t.title}</h3>
              <p className="mt-3 flex-1 text-[0.95rem] leading-relaxed text-ink/70">{t.text}</p>
              <span className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-forest">
                {t.cta}
                <ChevronRightIcon width={16} height={16} className="transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      <CtaBand note={`Gratis uitproberen. Voor het versturen betaal je eenmalig ${PRICE_LABEL}, geen abonnement.`} />
    </MarketingShell>
  );
}
