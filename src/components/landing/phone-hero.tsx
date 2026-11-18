import Link from "next/link";
import { ChevronRightIcon, Sparkle } from "@/components/icons";
import { PhoneFrame, ScreenCard } from "./phone";

type Card = { slug: string; label?: string; phone?: boolean };

/** Rij met voorbeelden: in het midden een telefoon, aan weerszijden ontwerpen en schermen uit de backoffice. */
const CARDS: Card[] = [
  { slug: "modern", label: "Modern" },
  { slug: "sweet", label: "Uitnodiging" },
  { slug: "gastenlijst", label: "Gastenlijst" },
  { slug: "leaf", phone: true },
  { slug: "dashboard", label: "Dashboard" },
  { slug: "versturen", label: "Versturen" },
  { slug: "lemon", label: "Lemon" },
];
const CENTER = 3;

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
 * Hero zonder scroll- of muiseffecten: grote kop, daaronder een rij met een telefoon in het midden
 * en aan weerszijden kaarten die naar het midden kijken en buiten beeld doorlopen.
 */
export function PhoneHero() {
  return (
    <section
      id="hero"
      aria-label="Proost Mee"
      className="overflow-hidden bg-gradient-to-b from-blush/70 to-cream px-4 pt-28 pb-12 text-center md:pt-32"
    >
      <p className="mx-auto inline-flex items-center gap-2 rounded-full bg-blush px-4 py-1.5 text-sm text-forest">
        <Sparkle width={11} height={11} className="text-clay" />
        Digitale bruiloftsuitnodigingen
      </p>

      <div className="relative mx-auto max-w-5xl">
        <h1 className="mt-5 font-serif text-[clamp(3.25rem,8.5vw,7.5rem)] leading-[0.98] font-medium tracking-tight text-forest">
          Jullie dag,
          <br />
          <span className="italic">mooi geregeld.</span>
        </h1>

        <p className="mx-auto mt-6 max-w-xl leading-relaxed text-ink/70">
          Ontwerp een persoonlijke digitale uitnodiging, beheer jullie gastenlijst en houd alle RSVP&apos;s bij op één rustige plek.
        </p>

        {/* Notitie rechts van de kop */}
        <div
          aria-hidden
          className="pointer-events-none absolute top-[2.5rem] right-0 hidden -rotate-6 text-clay lg:block"
        >
          <p className="font-hand text-3xl leading-none">Kies een onderdeel</p>
          <Arrow className="mt-1 ml-16 h-12 w-16 rotate-[20deg]" />
        </div>
      </div>

      {/* Rij met voorbeelden */}
      <div className="relative mt-10 md:mt-14">
        <div className="relative left-1/2 flex w-max -translate-x-1/2 items-center gap-2 md:gap-4">
          {CARDS.map((c, i) => {
            const d = i - CENTER;
            const tilt = c.phone ? 0 : -d * 9;
            return (
              <div
                key={c.slug}
                aria-hidden
                className={`shrink-0 ${
                  c.phone ? "w-[clamp(9.5rem,17vw,15rem)]" : "w-[clamp(8rem,15vw,13rem)]"
                }`}
                style={{ transform: `perspective(1100px) rotateY(${tilt}deg)` }}
              >
                {c.phone ? (
                  <PhoneFrame slugs={[c.slug]} className="w-full" />
                ) : (
                  <div className="relative">
                    <ScreenCard
                      slug={c.slug}
                      className="w-full border border-line/70 shadow-[0_24px_40px_-20px_rgb(31_36_32/0.4)]"
                    />
                    <span className="absolute bottom-3 left-3 rounded-full bg-paper px-3 py-1 text-[11px] font-medium whitespace-nowrap text-forest shadow">
                      {c.label}
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Knoppen */}
      <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center sm:gap-6">
        <span className="inline-block rounded-full border-2 border-dashed border-forest/35 p-1.5">
          <Link
            href="/account-aanmaken"
            className="inline-flex items-center gap-2 rounded-full bg-forest px-7 py-3.5 font-medium text-paper transition hover:bg-forest-deep"
          >
            Begin met jullie uitnodiging <ChevronRightIcon width={16} height={16} />
          </Link>
        </span>
        <Link href="/zo-werkt-het" className="font-medium text-forest hover:underline">
          Zo werkt het
        </Link>
      </div>
      <p className="mt-4 text-sm text-ink/60">Gratis uitproberen, je betaalt pas als je gaat versturen.</p>
    </section>
  );
}
