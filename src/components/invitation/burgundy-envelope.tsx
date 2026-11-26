"use client";

import type { CSSProperties } from "react";
import type { InvitationConfig, ThemeColors } from "@/lib/invitation/types";
import { BurgStripes } from "./burgundy-art";

/**
 * Animatie voor het thema "burgundy": een bordeaux envelop met een gestreepte binnenkant. De klep klapt open
 * (de strepen komen tevoorschijn) en de envelop schuift omlaag, waarna de uitnodiging zichtbaar is.
 */

const col = (key: keyof ThemeColors) => `var(--inv-${key})`;
const heading = { fontFamily: "var(--inv-heading)" } satisfies CSSProperties;
const script = { fontFamily: "var(--inv-script)" } satisfies CSSProperties;
const mono = { fontFamily: "var(--inv-body)" } satisfies CSSProperties;

const FLAP = 50; // hoogte van de klep in % van het scherm
const EASE = "cubic-bezier(.6,0,.2,1)";

type Props = { config: InvitationConfig; opening: boolean; onOpen: () => void };

export function BurgEnvelope({ config, opening, onOpen }: Props) {
  const names = `${config.partner1} & ${config.partner2}`;
  return (
    <div className="absolute inset-0 z-30 overflow-hidden" style={{ perspective: "1600px", pointerEvents: opening ? "none" : "auto" }}>
      <div
        className="absolute inset-0"
        style={{
          transform: opening ? "translateY(165%)" : "none",
          transition: `transform 700ms ${EASE} ${opening ? "520ms" : "0ms"}`,
        }}
      >
        {/* Achterkant en voorkant van de envelop */}
        <div className="absolute inset-0" style={{ background: col("envelope") }} />
        <div
          className="absolute inset-0"
          style={{
            clipPath: `polygon(0 0, 50% ${FLAP - 2}%, 100% 0, 100% 100%, 0 100%)`,
            background: `linear-gradient(180deg, color-mix(in srgb, ${col("envelope")} 92%, white), color-mix(in srgb, ${col("envelope")} 82%, black))`,
          }}
        />

        {/* Kaartje met de namen op de voorkant */}
        <div
          className="absolute inset-x-0 z-[2] flex justify-center px-10"
          style={{ top: `${FLAP + 8}%`, opacity: opening ? 0 : 1, transition: "opacity 250ms ease" }}
        >
          <div className="w-full max-w-[16rem] text-center" style={{ color: col("envelopeCard") }}>
            <p className="text-[1.5rem] leading-none" style={script}>
              Wij gaan trouwen
            </p>
            <p className="mt-3 text-[1.7rem] leading-[1.1] uppercase" style={heading}>
              {names}
            </p>
            <p className="mt-5 text-[0.56rem] font-bold tracking-[0.18em] uppercase opacity-80" style={mono}>
              Tik om te openen
            </p>
          </div>
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
            transition: `transform 700ms ${EASE} ${opening ? "120ms" : "0ms"}, z-index 0s linear ${opening ? "420ms" : "0ms"}`,
            filter: "drop-shadow(0 6px 8px rgb(0 0 0 / .28))",
          }}
        >
          {/* buitenkant: effen bordeaux */}
          <div
            className="absolute inset-0"
            style={{
              backfaceVisibility: "hidden",
              clipPath: "polygon(0 0, 100% 0, 50% 100%)",
              background: `linear-gradient(180deg, color-mix(in srgb, ${col("envelope")} 90%, white), ${col("envelope")})`,
            }}
          />
          {/* binnenkant: gestreepte voering (poederblauw met bordeaux) */}
          <div
            className="absolute inset-0"
            style={{ transform: "rotateX(180deg)", backfaceVisibility: "hidden", clipPath: "polygon(0 100%, 100% 100%, 50% 0)" }}
          >
            <BurgStripes className="absolute inset-0" />
          </div>
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
