import type { Metadata } from "next";
import Link from "next/link";
import {
  Botanical,
  CheckIcon,
  ChevronRightIcon,
  ListIcon,
  MailIcon,
  PenIcon,
  SendIcon,
  Sparkle,
  UsersIcon,
} from "@/components/icons";
import { Logo } from "@/components/logo";

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

export default function Home() {
  return (
    <div className="min-h-dvh">
      {/* Navigatie */}
      <header className="absolute inset-x-0 top-0 z-10">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6 lg:px-10">
          <Link href="/" className="block text-paper" aria-label="Inviti">
            <Logo className="w-28 sm:w-32" />
          </Link>
          <nav className="flex items-center gap-2 text-sm">
            <Link
              href="/inloggen"
              className="rounded-full px-4 py-2 font-medium text-paper/85 transition hover:text-paper"
            >
              Inloggen
            </Link>
            <Link
              href="/account-aanmaken"
              className="rounded-full bg-paper px-5 py-2.5 font-medium text-forest transition hover:bg-blush"
            >
              Aan de slag
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden bg-forest text-paper">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 15%, #fff 0, transparent 40%), radial-gradient(circle at 85% 90%, #fff 0, transparent 35%)",
          }}
        />
        <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-6 pt-32 pb-20 lg:grid-cols-[1.2fr_1fr] lg:gap-8 lg:px-10 lg:pt-40 lg:pb-28">
          <div>
            <p className="eyebrow flex items-center gap-2 text-blush/80">
              Digitale bruiloftsuitnodigingen <Sparkle width={9} height={9} />
            </p>
            <h1 className="mt-6 max-w-xl font-serif text-5xl leading-[1.02] font-medium sm:text-6xl lg:text-7xl">
              Jullie dag,
              <br />
              mooi geregeld.
            </h1>
            <p className="mt-6 max-w-md text-base leading-relaxed text-paper/75">
              Ontwerp een persoonlijke digitale uitnodiging, beheer jullie gastenlijst en
              houd alle RSVP&apos;s bij op één rustige plek. Zodat jullie aandacht naar elkaar
              kan gaan.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-4">
              <Link
                href="/account-aanmaken"
                className="inline-flex items-center gap-2 rounded-full bg-paper px-7 py-3.5 font-medium text-forest transition hover:bg-blush"
              >
                Begin met jullie uitnodiging <ChevronRightIcon width={16} height={16} />
              </Link>
              <Link
                href="#zo-werkt-het"
                className="text-sm font-medium text-paper/80 underline-offset-4 hover:text-paper hover:underline"
              >
                Zo werkt het
              </Link>
            </div>
          </div>

          {/* Boogvenster met uitnodiging-preview */}
          <div className="relative mx-auto h-[30rem] w-72 overflow-hidden rounded-t-full border border-paper/25 bg-forest-deep/40 sm:h-[34rem] sm:w-80">
            <Botanical className="absolute inset-x-0 bottom-0 mx-auto h-[40%] text-blush/45" />
            <div className="absolute inset-x-8 top-14 text-center">
              <p className="eyebrow text-blush/80">Wij gaan trouwen</p>
              <p className="mt-5 font-serif text-4xl leading-none font-medium">
                Anna
                <span className="mx-2 text-blush">&amp;</span>
                Tom
              </p>
              <p className="eyebrow mt-5 text-paper/60">14 · 06 · 2027</p>
              <span className="mt-6 inline-flex items-center gap-2 rounded-full border border-paper/30 px-4 py-2 text-xs text-paper/85">
                <MailIcon width={14} height={14} /> Open de uitnodiging
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Concept */}
      <section className="mx-auto max-w-3xl px-6 py-20 text-center lg:py-28">
        <p className="eyebrow flex items-center justify-center gap-2 text-clay">
          Het idee <Sparkle width={9} height={9} />
        </p>
        <h2 className="mt-5 font-serif text-4xl leading-[1.08] font-medium sm:text-5xl">
          Een uitnodiging die voelt als een begin van het feest
        </h2>
        <p className="mt-6 text-[1.02rem] leading-relaxed text-muted">
          Papieren kaarten zijn mooi, maar het bijhouden van reacties, adressen en dieetwensen
          is veel werk. Met Inviti verstuur je een digitale uitnodiging die opent met een
          animatie naar keuze, en reageren gasten met één klik. Alles komt automatisch
          samen in jullie eigen dashboard.
        </p>
      </section>

      {/* Zo werkt het */}
      <section id="zo-werkt-het" className="scroll-mt-8 bg-sage/60">
        <div className="mx-auto max-w-6xl px-6 py-20 lg:px-10 lg:py-28">
          <p className="eyebrow flex items-center gap-2 text-clay">
            Zo werkt het <Sparkle width={9} height={9} />
          </p>
          <h2 className="mt-5 max-w-xl font-serif text-4xl leading-[1.08] font-medium sm:text-5xl">
            In drie stappen van idee naar RSVP
          </h2>
          <ol className="mt-12 grid gap-6 md:grid-cols-3">
            {steps.map((s) => (
              <li key={s.n} className="card p-7">
                <span className="font-serif text-4xl text-clay">{s.n}</span>
                <h3 className="mt-4 font-serif text-2xl leading-tight font-medium">{s.title}</h3>
                <p className="mt-3 text-[0.95rem] leading-relaxed text-muted">{s.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-6xl px-6 py-20 lg:px-10 lg:py-28">
        <p className="eyebrow flex items-center gap-2 text-clay">
          Alles wat je nodig hebt <Sparkle width={9} height={9} />
        </p>
        <h2 className="mt-5 max-w-xl font-serif text-4xl leading-[1.08] font-medium sm:text-5xl">
          Eén plek voor je hele bruiloftscommunicatie
        </h2>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <article key={f.title} className="card p-7">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-blush text-clay">
                <f.icon width={20} height={20} />
              </span>
              <h3 className="mt-5 font-serif text-2xl leading-tight font-medium">{f.title}</h3>
              <p className="mt-3 text-[0.95rem] leading-relaxed text-muted">{f.text}</p>
            </article>
          ))}
        </div>
      </section>

      {/* Slotsectie */}
      <section className="px-6 pb-20 lg:px-10 lg:pb-28">
        <div className="relative mx-auto max-w-6xl overflow-hidden rounded-[2rem] bg-forest px-8 py-16 text-center text-paper sm:px-16 lg:py-24">
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.07]"
            style={{
              backgroundImage:
                "radial-gradient(circle at 15% 20%, #fff 0, transparent 40%), radial-gradient(circle at 90% 90%, #fff 0, transparent 35%)",
            }}
          />
          <div className="relative">
            <p className="eyebrow flex items-center justify-center gap-2 text-blush/80">
              Een nieuw hoofdstuk begint <Sparkle width={9} height={9} />
            </p>
            <h2 className="mx-auto mt-5 max-w-2xl font-serif text-4xl leading-[1.05] font-medium sm:text-6xl">
              Klaar om jullie gasten uit te nodigen?
            </h2>
            <p className="mx-auto mt-5 max-w-md text-paper/70">
              Maak een account aan en begin direct met jullie gastenlijst en uitnodiging.
            </p>
            <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
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

      <footer className="border-t border-line">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-6 py-8 text-sm text-muted sm:flex-row lg:px-10">
          <Logo className="w-28 text-ink" />
          <p>© {new Date().getFullYear()} Inviti. Jullie dag, mooi geregeld.</p>
        </div>
      </footer>
    </div>
  );
}
