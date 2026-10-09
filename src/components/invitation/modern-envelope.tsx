"use client";

import type { CSSProperties } from "react";
import { monogram } from "@/lib/invitation/format";
import type { InvitationConfig, ThemeColors } from "@/lib/invitation/types";

/**
 * Envelop voor het thema "modern": één grote envelop over het hele scherm. De klep klapt omhoog open
 * en daarna schuift de hele envelop omlaag weg, zodat de uitnodiging eronder zichtbaar wordt.
 */

const col = (key: keyof ThemeColors) => `var(--inv-${key})`;
const heading = { fontFamily: "var(--inv-heading)", fontWeight: 400 } satisfies CSSProperties;
const script = { fontFamily: "var(--inv-script)" } satisfies CSSProperties;

const FLAP = 56; // hoogte van de klep in % van het scherm
const EASE = "cubic-bezier(.6,0,.2,1)";

export function ModernEnvelope({
  config,
  opening,
  onOpen,
}: {
  config: InvitationConfig;
  opening: boolean;
  onOpen: () => void;
}) {
  const short = monogram(config.partner1, config.partner2, "&");
  const names = `${config.partner1} & ${config.partner2}`.toUpperCase();
  const base = col("envelope");
  const ink = col("envelopeCard");
  const hair = `color-mix(in srgb, ${ink} 28%, transparent)`;

  return (
    <div
      className="absolute inset-0 z-30 overflow-hidden"
      style={{ perspective: "1600px", pointerEvents: opening ? "none" : "auto" }}
    >
      <div
        className="absolute inset-0"
        style={{
          transform: opening ? "translateY(104%)" : "none",
          transition: `transform 720ms ${EASE} ${opening ? "480ms" : "0ms"}`,
        }}
      >
        {/* Achterkant van de envelop */}
        <div className="absolute inset-0" style={{ background: `color-mix(in srgb, ${base} 82%, black)` }} />

        {/* Voorkant: zijkleppen en onderklep met vouwlijnen */}
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(180deg, color-mix(in srgb, ${base} 94%, white), ${base} 40%, color-mix(in srgb, ${base} 90%, black))`,
            clipPath: `polygon(0 0, 50% ${FLAP - 2}%, 100% 0, 100% 100%, 0 100%)`,
          }}
        />
        <svg
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 h-full w-full"
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
          className="pointer-events-none absolute inset-x-0 z-[2] flex flex-col items-center px-6 text-center"
          style={{ top: `${FLAP + 8}%`, opacity: opening ? 0 : 1, transition: "opacity 300ms ease" }}
        >
          <p className="text-[1.5rem] leading-tight tracking-[0.08em]" style={{ ...heading, color: ink }}>
            {names}
          </p>
          <span
            className="mt-6 inline-flex items-center px-7 py-2.5 text-[0.68rem] tracking-[0.1em]"
            style={{ background: ink, color: base, borderRadius: "var(--inv-radius)" }}
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
            zIndex: opening ? 1 : 3,
            transition: `transform 700ms ${EASE}, z-index 0s linear ${opening ? "300ms" : "0ms"}`,
          }}
        >
          {/* buitenkant van de klep */}
          <div
            className="absolute inset-0"
            style={{
              backfaceVisibility: "hidden",
              clipPath: "polygon(0 0, 100% 0, 50% 100%)",
              background: `linear-gradient(180deg, color-mix(in srgb, ${base} 88%, white), color-mix(in srgb, ${base} 96%, black))`,
              boxShadow: "inset 0 -2px 0 rgb(0 0 0 / .2)",
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
          <p
            className="absolute inset-x-0 text-center text-[2.2rem] leading-none"
            style={{ top: "14%", color: ink, backfaceVisibility: "hidden", ...script }}
          >
            Wij gaan trouwen
          </p>
          <span
            className="absolute left-1/2 grid size-[4.6rem] -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full text-[1.35rem] tracking-[0.06em]"
            style={{
              top: "calc(100% - 1.4rem)",
              background: ink,
              color: base,
              backfaceVisibility: "hidden",
              boxShadow: `0 0 0 3px ${base}, 0 0 0 4px ${hair}, 0 10px 22px -8px rgb(0 0 0 / .5)`,
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
              // na het omklappen staat de punt van de klep omhoog, met de breedte aan de scharnierrand
              clipPath: "polygon(0 100%, 100% 100%, 50% 0)",
              background: `linear-gradient(0deg, color-mix(in srgb, ${ink} 88%, black), ${ink})`,
            }}
          />
        </div>
      </div>

      <button
        type="button"
        onClick={onOpen}
        aria-label="Open de uitnodiging"
        className="absolute inset-0 z-[5] cursor-pointer"
        tabIndex={opening ? -1 : 0}
      />
    </div>
  );
}
