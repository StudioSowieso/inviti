import type { Metadata } from "next";
import Link from "next/link";
import {
  Botanical,
  CheckIcon,
  ChevronRightIcon,
  ListIcon,
  PenIcon,
  SendIcon,
  Sparkle,
  UsersIcon,
} from "@/components/icons";
import { LandingNav } from "@/components/landing/landing-nav";
import { PhoneHero } from "@/components/landing/phone-hero";
import { ScrollFx } from "@/components/landing/scroll-fx";
import { SmoothScroll } from "@/components/landing/smooth-scroll";
import { Logo } from "@/components/logo";
import { PhoneFrame } from "@/components/landing/phone";
import { FALLBACK_THEMES } from "@/lib/invitation/fallback-themes";

export const metadata: Metadata = {
  title: "Inviti — Digitale bruiloftsuitnodigingen en RSVP",
  description:
    "Ontwerp jullie digitale bruiloftsuitnodiging, beheer de gastenlijst en volg alle RSVP's op één rustige plek.",
};

const steps = [
  {
    n: "01",
    title: "Ontwerp jullie uitnodiging",
    text: "Kies een thema, een openingsanimatie en voeg jullie namen, datum en lettertype toe. Met contentblokken vertel je alles over de dag.",
  },
  {
    n: "02",
    title: "Maak de gastenlijst",
    text: "Voeg gasten toe met e-mail, telefoonnummer, +1 en dieetwensen. Deel ze in groepen in, zoals familie, vrienden of collega's.",
  },
  {
    n: "03",
    title: "Verstuur en volg",
    text: "Stuur de uitnodiging per e-mail en zie per persoon wie komt, wie niet en wie nog moet reageren.",
  },
];

const features = [
  {
    icon: PenIcon,
    title: "Uitnodiging naar jullie smaak",
    text: "Thema's, lettertypes en contentblokken. Jullie uitnodiging voelt als jullie, niet als een template.",
  },
  {
    icon: Sparkle,
    title: "Een openingsanimatie",
    text: "Kies hoe de uitnodiging opent. Het eerste moment is meteen een klein cadeautje voor jullie gasten.",
  },
  {
    icon: UsersIcon,
    title: "Gastenlijst en groepen",
    text: "Alles per gast op één plek: naam, contactgegevens, +1 en dieetwensen. Gegroepeerd zoals jullie dat willen.",
  },
  {
    icon: CheckIcon,
    title: "RSVP's in één overzicht",
    text: "Geen losse appjes meer. Gasten reageren online en jullie zien direct wie ja, nee of nog niets heeft gezegd.",
  },
  {
    icon: SendIcon,
    title: "Save the Date, uitnodiging en nabericht",
    text: "Drie momenten, één plek. Kondig de datum aan, nodig uit en bedank iedereen na de bruiloft.",
  },
  {
    icon: ListIcon,
    title: "To-do lijst met deadlines",
    text: "Plan alles wat nog moet gebeuren en koppel het aan een persoon. Inviti vinkt zelf af wanneer de gastenlijst klaar is of de uitnodigingen zijn verstuurd.",
  },
];

const USPS = [
  "Gepersonaliseerde uitnodiging",
  "Eigen bruiloftswebsite",
  "Gastenlijst met groepen",
  "Persoonlijk versturen",
  "Import uit spreadsheet",
  "RSVP-overzicht",
  "To-do met deadlines",
  "Zes thema's",
];

function Eyebrow({ children, className = "text-clay" }: { children: React.ReactNode; className?: string }) {
  return (
    <p className={`eyebrow flex items-center gap-2 ${className}`}>
      {children} <Sparkle width={9} height={9} />
    </p>
  );
}

export default function Home() {
  return (
    <div className="min-h-dvh overflow-x-clip">
      <SmoothScroll />
      <ScrollFx />
      <LandingNav />

      <main>
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
            Papieren kaarten zijn mooi, maar adressen, reacties en dieetwensen bijhouden is veel werk. Met Inviti
            komt alles samen in jullie eigen dashboard.
          </p>
        </section>

        {/* Thema's */}
        <section aria-label="Thema's" className="overflow-hidden border-y border-forest/15 bg-sage/60 py-8 sm:py-10">
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

        {/* Thema's */}
        <section id="themas" className="scroll-mt-8 pt-28 pb-16 lg:pt-40 lg:pb-24">
          <div className="mx-auto max-w-6xl px-6 lg:px-10">
            <Eyebrow>Thema&apos;s</Eyebrow>
            <h2 data-split className="mt-5 max-w-2xl font-serif text-4xl leading-[1.06] font-medium sm:text-6xl">
              Zes sfeervolle thema&apos;s, elk met een eigen openingsanimatie
            </h2>
            <p data-reveal className="mt-6 max-w-md leading-relaxed text-ink/70">
              Dit zijn echte voorbeelden. Kies je favoriet en maak hem helemaal van jullie met eigen kleuren en lettertypes.
            </p>
          </div>
          <div
            data-hscroll
            tabIndex={0}
            role="region"
            aria-label="Voorbeelden van de thema's, scroll horizontaal"
            className="mt-12 overflow-x-auto pb-6 focus-visible:outline-2 focus-visible:outline-clay"
          >
            <div
              data-hscroll-track
              className="flex w-max gap-6 px-6 pt-2 lg:gap-8 lg:px-[max(2.5rem,calc((100vw-72rem)/2+2.5rem))]"
            >
              {FALLBACK_THEMES.map((t, i) => (
                <figure
                  key={t.slug}
                  data-card
                  className={`w-[min(17rem,calc((100svh-15rem)*0.47))] shrink-0 ${i % 2 ? "mt-8" : ""}`}
                >
                  <div aria-hidden>
                    <PhoneFrame slugs={[t.slug]} className="w-full" />
                  </div>
                  <figcaption className="mt-4">
                    <span className="block font-serif text-2xl font-medium">{t.title}</span>
                    <span className="mt-1 block text-sm leading-snug text-ink/65">{t.description}</span>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>

        {/* Zo werkt het */}
        <section id="zo-werkt-het" className="scroll-mt-8">
          <div className="mx-auto grid max-w-6xl gap-14 px-6 py-28 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20 lg:px-10 lg:py-40">
            <div className="lg:sticky lg:top-32 lg:self-start">
              <Eyebrow>Zo werkt het</Eyebrow>
              <h2 data-split className="mt-5 font-serif text-4xl leading-[1.06] font-medium sm:text-6xl">
                In drie stappen van idee naar RSVP
              </h2>
              <p data-reveal className="mt-6 max-w-sm leading-relaxed text-ink/70">
                Geen ingewikkelde tools. Jullie doen wat bij jullie past, Inviti houdt het overzicht.
              </p>
            </div>
            <ol className="relative pl-10 sm:pl-14">
              <span aria-hidden className="absolute top-3 bottom-3 left-0 w-px bg-line" />
              <span data-line aria-hidden className="absolute top-3 bottom-3 left-0 w-px bg-clay" />
              {steps.map((s) => (
                <li key={s.n} data-reveal className="relative pb-16 last:pb-0">
                  <span aria-hidden className="absolute top-3 -left-10 size-2.5 -translate-x-1/2 rounded-full bg-clay sm:-left-14" />
                  <span className="font-serif text-6xl leading-none text-clay/80 sm:text-7xl">{s.n}</span>
                  <h3 className="mt-4 font-serif text-3xl leading-tight font-medium sm:text-4xl">{s.title}</h3>
                  <p className="mt-3 max-w-md leading-relaxed text-ink/70">{s.text}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Features */}
        <section className="relative bg-sage/60">
          <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
            <Botanical
              data-parallax="0.12"
              className="absolute -right-10 bottom-0 h-[26rem] text-forest/10 sm:right-10 sm:h-[34rem]"
            />
          </div>
          <div className="relative mx-auto max-w-6xl px-6 py-28 lg:px-10 lg:py-40">
            <Eyebrow>Alles wat je nodig hebt</Eyebrow>
            <h2 data-split className="mt-5 max-w-2xl font-serif text-4xl leading-[1.06] font-medium sm:text-6xl">
              Eén plek voor je hele bruiloftscommunicatie
            </h2>
            <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((f) => (
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

        {/* Slot */}
        <section className="bg-sage/60">
          <div data-arch className="relative overflow-hidden bg-forest px-6 py-32 text-center text-paper sm:py-44">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 opacity-[0.07]"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 15% 20%, #fff 0, transparent 40%), radial-gradient(circle at 90% 90%, #fff 0, transparent 35%)",
              }}
            />
            <div data-arch-content className="relative">
              <Eyebrow className="justify-center text-blush/80">Een nieuw hoofdstuk begint</Eyebrow>
              <h2 className="mx-auto mt-6 max-w-3xl font-serif text-5xl leading-[1.02] font-medium sm:text-7xl">
                Klaar om jullie gasten uit te nodigen?
              </h2>
              <p className="mx-auto mt-6 max-w-md text-paper/75">
                Maak een account aan en begin direct met jullie gastenlijst en uitnodiging.
              </p>
              <div className="mt-10 flex flex-wrap items-center justify-center gap-5">
                <Link
                  href="/account-aanmaken"
                  className="inline-flex items-center gap-2 rounded-full bg-paper px-7 py-3.5 font-medium text-forest transition hover:bg-blush"
                >
                  Account aanmaken <ChevronRightIcon width={16} height={16} />
                </Link>
                <Link
                  href="/inloggen"
                  className="text-sm font-medium text-paper/80 underline-offset-4 hover:text-paper hover:underline"
                >
                  Ik heb al een account
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-forest text-paper/80">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 border-t border-paper/15 px-6 py-8 text-sm sm:flex-row lg:px-10">
          <Logo className="w-28 text-paper" />
          <p>© {new Date().getFullYear()} Inviti. Jullie dag, mooi geregeld.</p>
        </div>
      </footer>
    </div>
  );
}
