/** Vaste balk bovenaan voor wie nog in de testomgeving zit. Hoogte staat in --banner-h (2.75rem). */
export const TRIAL_BANNER_HEIGHT = "2.75rem";

export function TrialBanner() {
  return (
    <div
      role="region"
      aria-label="Testomgeving"
      className="sticky top-0 z-40 flex h-11 items-center justify-center gap-3 bg-forest px-4 text-paper sm:gap-5"
    >
      <p className="min-w-0 truncate text-[0.8rem] sm:text-sm">
        <strong className="font-semibold">Je zit in de testomgeving.</strong>{" "}
        <span className="hidden text-paper/80 md:inline">
          Uitnodigingen versturen is beschikbaar in de volledige versie.
        </span>
      </p>
      {/* Gewone link: /afrekenen maakt per bezoek een betaalsessie aan, dus niet vooraf laden. */}
      <a
        href="/afrekenen"
        className="shrink-0 rounded-full bg-paper px-4 py-1.5 text-[0.8rem] font-semibold text-forest transition hover:bg-blush sm:text-sm"
      >
        Koop volledige versie
      </a>
    </div>
  );
}
