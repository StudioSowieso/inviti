"use client";

import { useEffect, useRef } from "react";
import { CheckIcon, XIcon } from "@/components/icons";

/** Vaste balk bovenaan voor wie nog in de testomgeving zit. Hoogte staat in --banner-h (2.75rem). */
export const TRIAL_BANNER_HEIGHT = "2.75rem";

const BENEFITS = [
  {
    title: "Verstuur jullie uitnodiging",
    text: "De persoonlijke uitnodiging gaat naar al je gasten, met hun eigen naam en hun eigen link.",
  },
  {
    title: "Kies hoe je verstuurt",
    text: "Via WhatsApp, e-mail of een link per groep. Zo bereik je iedereen op de manier die bij hen past.",
  },
  {
    title: "RSVP's komen vanzelf binnen",
    text: "Gasten reageren met één tik. Je ziet direct wie komt, wie nog niet gereageerd heeft en wie niet kan.",
  },
  {
    title: "Alles uit de testomgeving blijft",
    text: "Je ontwerp, gastenlijst en to-do's blijven precies zoals ze zijn. Je hoeft niets opnieuw te doen.",
  },
  {
    title: "Eenmalig, geen abonnement",
    text: "Je betaalt één keer. Er volgen geen vervolgkosten.",
  },
];

export function TrialBanner({ price }: { price: string }) {
  const ref = useRef<HTMLDialogElement>(null);

  // Klik op de donkere achtergrond sluit het venster
  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    const onClick = (e: MouseEvent) => {
      if (e.target === d) d.close();
    };
    d.addEventListener("click", onClick);
    return () => d.removeEventListener("click", onClick);
  }, []);

  return (
    <>
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
        <button
          type="button"
          onClick={() => ref.current?.showModal()}
          className="shrink-0 cursor-pointer rounded-full bg-paper px-4 py-1.5 text-[0.8rem] font-semibold text-forest transition hover:bg-blush sm:text-sm"
        >
          Koop volledige versie
        </button>
      </div>

      <dialog
        ref={ref}
        aria-labelledby="upgrade-title"
        className="m-auto w-[calc(100%-2rem)] max-w-lg overflow-hidden rounded-[1.75rem] bg-paper p-0 text-ink shadow-[0_30px_80px_-20px_rgb(0_0_0/0.45)] backdrop:bg-ink/55 backdrop:backdrop-blur-sm"
      >
        <div className="max-h-[88dvh] overflow-y-auto">
          <div className="relative bg-forest px-7 pt-8 pb-7 text-paper sm:px-9">
            <button
              type="button"
              onClick={() => ref.current?.close()}
              aria-label="Sluiten"
              className="absolute top-4 right-4 grid size-9 cursor-pointer place-items-center rounded-full bg-paper/12 text-paper transition hover:bg-paper/22"
            >
              <XIcon width={16} height={16} />
            </button>
            <p className="text-sm text-paper/75">Volledige versie</p>
            <h2 id="upgrade-title" className="mt-2 pr-8 font-serif text-3xl leading-tight font-medium sm:text-[2.1rem]">
              Klaar om jullie uitnodiging te versturen?
            </h2>
            <p className="mt-3 text-[0.92rem] leading-relaxed text-paper/80">
              In de testomgeving heb je alles voorbereid. Met de volledige versie gaat het naar jullie gasten.
            </p>
          </div>

          <div className="px-7 py-7 sm:px-9">
            <p className="text-sm font-semibold">Dit krijg je</p>
            <ul className="mt-4 space-y-4">
              {BENEFITS.map((b) => (
                <li key={b.title} className="flex gap-3.5">
                  <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-sage text-forest">
                    <CheckIcon width={13} height={13} />
                  </span>
                  <div>
                    <p className="text-[0.95rem] leading-snug font-semibold">{b.title}</p>
                    <p className="mt-0.5 text-sm leading-relaxed text-muted">{b.text}</p>
                  </div>
                </li>
              ))}
            </ul>

            <div className="mt-8 rounded-2xl bg-cream p-5">
              <div className="flex items-baseline justify-between gap-3">
                <p className="font-serif text-4xl leading-none font-medium">{price}</p>
                <p className="text-sm text-muted">eenmalig, incl. btw</p>
              </div>
              {/* Gewone link: /afrekenen maakt per bezoek een betaalsessie aan, dus niet vooraf laden. */}
              <a href="/afrekenen" className="btn-primary mt-4">
                Koop de volledige versie
              </a>
              <button
                type="button"
                onClick={() => ref.current?.close()}
                className="mt-3 w-full cursor-pointer text-center text-sm text-muted underline-offset-4 hover:underline"
              >
                Verder in de testomgeving
              </button>
            </div>
            <p className="mt-4 text-center text-xs text-muted">
              Veilig betalen via Stripe, onder andere met iDEAL en creditcard.
            </p>
          </div>
        </div>
      </dialog>
    </>
  );
}
