import type { Metadata } from "next";
import { Sparkle } from "@/components/icons";
import { Logo } from "@/components/logo";

export const metadata: Metadata = {
  title: "Proost Mee — Binnenkort online",
  description: "Proost Mee: digitale bruiloftsuitnodigingen en RSVP. Binnenkort online.",
};

/** Wordt getoond op elke pagina zolang COMING_SOON=1 staat (zie middleware). */
export default function ComingSoonPage() {
  return (
    <main className="relative grid min-h-dvh place-items-center overflow-hidden bg-forest px-6 py-16 text-paper">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.09]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 15% 20%, #fff 0, transparent 40%), radial-gradient(circle at 90% 90%, #fff 0, transparent 35%)",
        }}
      />
      <div className="relative flex max-w-xl flex-col items-center text-center">
        <Logo className="w-48 sm:w-60" tagline />
        <p className="eyebrow mt-14 flex items-center gap-2 text-blush/80">
          Binnenkort online <Sparkle width={9} height={9} />
        </p>
        <h1 className="mt-5 font-serif text-5xl leading-[1.05] font-medium sm:text-6xl">
          Jullie dag,
          <br />
          <span className="text-blush italic">mooi geregeld.</span>
        </h1>
        <p className="mt-6 max-w-md text-[0.95rem] leading-relaxed text-paper/80">
          We werken aan een plek waar je jullie bruiloftsuitnodiging ontwerpt, je gasten uitnodigt en alle reacties
          overzichtelijk bijhoudt. Nog even geduld.
        </p>
        <p className="mt-12 text-xs tracking-[0.2em] text-paper/50 uppercase">proostmee.nl</p>
      </div>
    </main>
  );
}
