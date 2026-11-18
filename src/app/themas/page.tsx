import type { Metadata } from "next";
import { CtaBand, PageIntro } from "@/components/landing/bits";
import { MarketingShell } from "@/components/landing/marketing-shell";
import { PhoneFrame } from "@/components/landing/phone";
import { FALLBACK_THEMES } from "@/lib/invitation/fallback-themes";

export const metadata: Metadata = {
  title: "Thema's — Proost Mee",
  description:
    "Negen sfeervolle thema's voor jullie bruiloftsuitnodiging, elk met een eigen openingsanimatie. Maak ze van jullie met eigen kleuren en lettertypes.",
};

export default function ThemasPage() {
  return (
    <MarketingShell>
      <PageIntro eyebrow="Thema's" title="Negen sfeervolle thema's, elk met een eigen openingsanimatie">
        Dit zijn echte voorbeelden. Kies je favoriet en maak hem helemaal van jullie met eigen kleuren en lettertypes.
      </PageIntro>

      <section id="themas" className="pb-16 lg:pb-24">
        <div
          data-hscroll
          tabIndex={0}
          role="region"
          aria-label="Voorbeelden van de thema's, scroll horizontaal"
          className="overflow-x-auto pb-6 focus-visible:outline-2 focus-visible:outline-clay"
        >
          <div
            data-hscroll-track
            className="flex w-max gap-6 px-6 pt-2 lg:gap-8 lg:px-[max(2.5rem,calc((100vw-72rem)/2+2.5rem))]"
          >
            {FALLBACK_THEMES.map((t, i) => (
              <figure
                key={t.slug}
                data-card
                className={`w-[min(17rem,calc((86svh-11rem)*0.47))] shrink-0 ${i % 2 ? "mt-8" : ""}`}
              >
                <div aria-hidden>
                  <PhoneFrame slugs={[t.slug]} className="w-full" />
                </div>
                <figcaption className="mt-4">
                  <span className="block font-serif text-2xl font-medium">{t.title}</span>
                  <span className="mt-1 line-clamp-3 text-sm leading-snug text-ink/65">{t.description}</span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <CtaBand
        title="Vind het thema dat bij jullie past"
        text="Maak een account aan en probeer ze uit met jullie eigen namen en datum."
      />
    </MarketingShell>
  );
}
