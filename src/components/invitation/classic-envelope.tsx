"use client";

import type { CSSProperties } from "react";
import { formatDateUpper, monogram } from "@/lib/invitation/format";
import type { InvitationConfig, ThemeColors } from "@/lib/invitation/types";

/**
 * Envelop voor de klassieke thema's (o.a. "In alle eenvoud"): één grote envelop over het hele scherm.
 * De klep klapt open, de uitnodigingskaart schuift omhoog uit de envelop en daarna schuift de envelop
 * omlaag weg, zodat de uitnodiging eronder zichtbaar wordt.
 */

const col = (key: keyof ThemeColors) => `var(--inv-${key})`;
const heading = { fontFamily: "var(--inv-heading)" } satisfies CSSProperties;

/** De kaart komt uit de envelop (0-40%) en groeit daarna uit tot het hele scherm (40-100%), waarna hij vervaagt. */
const CARD_KEYFRAMES = `
@keyframes classic-card-out {
  0% { top: 22%; left: 50%; width: min(66%, 22rem); height: 50%; opacity: 1; }
  38% { top: 6%; left: 50%; width: min(66%, 22rem); height: 50%; opacity: 1; }
  88% { top: 0%; left: 50%; width: 100%; height: 100%; opacity: 1; }
  100% { top: 0%; left: 50%; width: 100%; height: 100%; opacity: 0; }
}`;
const CARD_MS = 1150;
const CARD_DELAY = 250;

const FLAP = 54; // hoogte van de klep in % van het scherm
const EASE = "cubic-bezier(.6,0,.2,1)";

export function ClassicEnvelope({
  config,
  opening,
  onOpen,
}: {
  config: InvitationConfig;
  opening: boolean;
  onOpen: () => void;
}) {
  const short = monogram(config.partner1, config.partner2);
  const names = `${config.partner1} & ${config.partner2}`.toUpperCase();
  const base = col("envelope");
  const paper = col("envelopeCard");
  const hair = "rgb(0 0 0 / 0.1)";

  return (
    <div
      className="absolute inset-0 z-30 overflow-hidden"
      style={{ perspective: "1600px", pointerEvents: opening ? "none" : "auto" }}
    >
      {/* Achterlaag: binnenkant van de envelop */}
      <div className="absolute inset-0 z-[1]" style={{
          transform: opening ? "translateY(104%)" : "none",
          transition: `transform 650ms ${EASE} ${opening ? "800ms" : "0ms"}`,
        }}>
        {/* Achterkant van de envelop */}
        <div className="absolute inset-0" style={{ background: `color-mix(in srgb, ${base} 80%, black)` }} />
      </div>

      {/* De uitnodigingskaart: zit eerst in de envelop, komt eruit en vergroot tot de landingspagina */}
      <div
        className="absolute z-[2] flex -translate-x-1/2 flex-col items-center justify-center overflow-hidden text-center"
        style={{
          top: "22%",
          left: "50%",
          width: "min(66%, 22rem)",
          height: "50%",
          background: paper,
          boxShadow: "0 8px 22px -12px rgb(0 0 0 / .45)",
          animation: opening ? `classic-card-out ${CARD_MS}ms ${EASE} ${CARD_DELAY}ms both` : undefined,
        }}
      >
        <style>{CARD_KEYFRAMES}</style>
        <p className="text-[0.5rem] tracking-[0.3em] uppercase" style={{ color: col("muted") }}>
          Wij gaan trouwen
        </p>
        <p className="mt-3 text-[1.35rem] leading-tight tracking-[0.04em]" style={{ ...heading, color: col("text") }}>
          {config.partner1}
          <span className="block text-[0.9rem] italic" style={{ color: col("accent") }}>
            &amp;
          </span>
          {config.partner2}
        </p>
        <span className="mt-4 block h-px w-8" style={{ background: col("accent") }} />
        <p className="mt-3 text-[0.5rem] tracking-[0.22em] uppercase" style={{ color: col("muted") }}>
          {formatDateUpper(config.date)}
        </p>
      </div>

      {/* Voorlaag: voorkant en klep, ligt boven de kaart */}
      <div className="absolute inset-0 z-[3]" style={{
          transform: opening ? "translateY(104%)" : "none",
          transition: `transform 650ms ${EASE} ${opening ? "800ms" : "0ms"}`,
        }}>
        {/* Voorkant: zijkleppen en onderklep met vouwlijnen */}
        <div
          className="absolute inset-0 z-[2]"
          style={{
            background: `linear-gradient(180deg, color-mix(in srgb, ${base} 94%, white), ${base} 45%, color-mix(in srgb, ${base} 92%, black))`,
            clipPath: `polygon(0 0, 50% ${FLAP - 2}%, 100% 0, 100% 100%, 0 100%)`,
          }}
        />
        <svg
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-[2] h-full w-full"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          fill="none"
          style={{ stroke: hair }}
          strokeWidth="1"
        >
          <path d={`M0 0 L50 ${FLAP - 2} L100 0`} vectorEffect="non-scaling-stroke" />
          <path d={`M0 100 L50 ${FLAP - 2} L100 100`} vectorEffect="non-scaling-stroke" />
        </svg>

        {/* Namen en knop op de voorkant */}
        <div
          className="pointer-events-none absolute inset-x-0 z-[3] flex flex-col items-center px-6 text-center"
          style={{ top: `${FLAP + 9}%`, opacity: opening ? 0 : 1, transition: "opacity 250ms ease" }}
        >
          <p className="text-[0.62rem] tracking-[0.28em]" style={{ ...heading, color: col("text") }}>
            {names}
          </p>
          <p className="mt-2 text-[0.5rem] tracking-[0.22em] uppercase" style={{ color: col("muted") }}>
            {formatDateUpper(config.date)}
          </p>
          <span
            className="mt-7 inline-flex items-center gap-2 px-7 py-3 text-[0.6rem] font-medium tracking-[0.16em] uppercase"
            style={{ background: col("buttonBackground"), color: col("buttonText"), borderRadius: "var(--inv-radius)" }}
          >
            Tik om te openen
          </span>
        </div>

        {/* Klep */}
        <div
          className="absolute inset-x-0 top-0"
          style={{
            height: `${FLAP}%`,
            transformStyle: "preserve-3d",
            transformOrigin: "top",
            transform: opening ? "rotateX(180deg)" : "rotateX(0deg)",
            zIndex: opening ? 1 : 4,
            transition: `transform 700ms ${EASE}, z-index 0s linear ${opening ? "350ms" : "0ms"}`,
            filter: "drop-shadow(0 5px 5px rgb(0 0 0 / .18))",
          }}
        >
          {/* buitenkant van de klep */}
          <div
            className="absolute inset-0"
            style={{
              backfaceVisibility: "hidden",
              clipPath: "polygon(0 0, 100% 0, 50% 100%)",
              background: `linear-gradient(180deg, color-mix(in srgb, ${base} 86%, white), color-mix(in srgb, ${base} 93%, black))`,
            }}
          />
          <svg
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 h-full w-full"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            fill="none"
            style={{ stroke: hair, backfaceVisibility: "hidden" }}
          >
            <path d="M0 0 L50 100 L100 0" strokeWidth="1" vectorEffect="non-scaling-stroke" />
          </svg>
          {/* zegel op de punt van de klep */}
          <span
            className="absolute left-1/2 grid size-[4.4rem] -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full text-[1.2rem] tracking-[0.06em]"
            style={{
              top: "calc(100% - 1.3rem)",
              background: col("buttonBackground"),
              color: col("buttonText"),
              backfaceVisibility: "hidden",
              boxShadow: "0 0 0 3px rgb(255 255 255 / .35), 0 10px 20px -8px rgb(0 0 0 / .5)",
              ...heading,
            }}
          >
            {short}
          </span>
          {/* binnenkant van de klep */}
          <div
            className="absolute inset-0"
            style={{
              transform: "rotateX(180deg)",
              backfaceVisibility: "hidden",
              clipPath: "polygon(0 100%, 100% 100%, 50% 0)",
              background: `linear-gradient(0deg, color-mix(in srgb, ${base} 74%, black), color-mix(in srgb, ${base} 82%, black))`,
            }}
          />
        </div>
      </div>

      <button
        type="button"
        onClick={onOpen}
        aria-label="Open de uitnodiging"
        className="absolute inset-0 z-[6] cursor-pointer"
        tabIndex={opening ? -1 : 0}
      />
    </div>
  );
}
