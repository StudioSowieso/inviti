import Link from "next/link";
import { ChevronRightIcon, Sparkle } from "@/components/icons";
import { ScreenCard } from "./phone";

type Card = { slug: string };

/** Voorbeelden in de rij: uitnodigingsontwerpen en schermen uit de backoffice, om en om. */
const CARDS: Card[] = [
  { slug: "todo" },
  { slug: "modern" },
  { slug: "gastenlijst" },
  { slug: "sweet" },
  { slug: "leaf" },
  { slug: "dashboard" },
  { slug: "lemon" },
  { slug: "versturen" },
  { slug: "flowers" },
];
const CENTER = 4;

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
 * Hero zonder scroll- of muiseffecten: gecentreerde kop in een omrande kaart op een zachte
 * kleurverloop-achtergrond, met daaronder een waaier van uitnodigingen en backoffice-schermen.
 */
export function PhoneHero() {
  return (
    <section
      id="hero"
      aria-label="Proost Mee"
      className="bg-[radial-gradient(120%_80%_at_15%_0%,var(--color-sage)_0%,transparent_55%),radial-gradient(110%_80%_at_95%_100%,var(--color-clay)_0%,transparent_60%),linear-gradient(180deg,var(--color-blush),var(--color-cream))] px-3 pt-24 pb-8 sm:px-6 md:pb-12"
    >
      <div className="relative mx-auto max-w-[88rem] overflow-hidden rounded-[2rem] border-[10px] border-paper bg-cream px-4 pt-8 pb-8 text-center shadow-[0_30px_70px_-30px_rgb(44_56_47/0.45)] md:rounded-[2.75rem] md:border-[14px] md:pt-10">
        <p className="mx-auto inline-flex items-center gap-2 rounded-full bg-blush px-4 py-1.5 text-sm text-forest">
          <Sparkle width={11} height={11} className="text-clay" />
          Gratis uitproberen, betaal pas bij het versturen
        </p>

        <h1 className="mx-auto mt-4 max-w-4xl font-serif text-[clamp(2.75rem,6vw,5.5rem)] leading-[1.02] font-medium tracking-tight text-forest">
          Jullie dag,
          <br />
          <span className="italic">mooi geregeld.</span>
        </h1>

        <p className="mx-auto mt-4 max-w-xl leading-relaxed text-ink/70">
          Ontwerp een persoonlijke digitale uitnodiging, beheer jullie gastenlijst en houd alle RSVP&apos;s bij op één rustige plek.
        </p>

        {/* Notitie rechtsboven, wijst naar de rij */}
        <div
          aria-hidden
          className="pointer-events-none absolute top-[8rem] right-[5%] hidden -rotate-6 text-clay lg:block"
        >
          <p className="font-hand text-2xl leading-[1.05]">
            Jullie uitnodiging,
            <br />
            jullie stijl
          </p>
          <Arrow className="mt-1 ml-10 h-12 w-16 rotate-[78deg]" />
        </div>

        {/* Waaier met voorbeelden */}
        <div className="relative mt-4 overflow-hidden pt-2 pb-10">
          <div className="relative left-1/2 flex w-max -translate-x-1/2 items-start gap-3 md:gap-5">
            {CARDS.map((c, i) => {
              const d = i - CENTER;
              return (
                <div
                  key={c.slug}
                  aria-hidden
                  className="w-[clamp(8.5rem,13.5vw,12.5rem)] shrink-0"
                  style={{ transform: `translateY(${d * d * 9}px) rotate(${d * 4.5}deg)` }}
                >
                  <ScreenCard
                    slug={c.slug}
                    className="w-full border-[5px] border-paper shadow-[0_18px_34px_-14px_rgb(31_36_32/0.35)]"
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* Knop met notitie */}
        <div className="mt-2 md:grid md:grid-cols-[1fr_auto_1fr] md:items-center md:gap-6">
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
