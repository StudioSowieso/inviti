import Link from "next/link";
import { ChevronRightIcon, Sparkle } from "@/components/icons";

export function Eyebrow({ children, className = "text-clay" }: { children: React.ReactNode; className?: string }) {
  return (
    <p className={`eyebrow flex items-center gap-2 ${className}`}>
      {children} <Sparkle width={9} height={9} />
    </p>
  );
}

/** Kop bovenaan de subpagina's. Houdt ruimte vrij voor het vaste menu. */
export function PageIntro({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mx-auto max-w-6xl px-6 pt-36 pb-12 lg:px-10 lg:pt-44 lg:pb-16">
      <Eyebrow>{eyebrow}</Eyebrow>
      <h1 data-split className="mt-5 max-w-3xl font-serif text-5xl leading-[1.04] font-medium sm:text-7xl">
        {title}
      </h1>
      <p data-reveal className="mt-6 max-w-lg leading-relaxed text-ink/70">
        {children}
      </p>
    </section>
  );
}

/** Slotsectie met het boogvenster dat openvalt, onderaan elke pagina. */
export function CtaBand({
  title = "Klaar om jullie gasten uit te nodigen?",
  text = "Maak een account aan en begin direct met jullie gastenlijst en uitnodiging.",
  note,
}: {
  title?: string;
  text?: string;
  note?: string;
}) {
  return (
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
          <h2 className="mx-auto mt-6 max-w-3xl font-serif text-5xl leading-[1.02] font-medium sm:text-7xl">{title}</h2>
          <p className="mx-auto mt-6 max-w-md text-paper/75">{text}</p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-5">
            <Link
              href="/account-aanmaken"
              className="cta inline-flex items-center gap-2 rounded-full bg-paper px-7 py-3.5 font-medium text-forest transition hover:bg-blush"
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
          {note && <p className="mx-auto mt-6 max-w-md text-sm text-paper/60">{note}</p>}
        </div>
      </div>
    </section>
  );
}
