"use client";

import type { CSSProperties } from "react";
import type { InvitationConfig, ThemeColors } from "@/lib/invitation/types";
import { Vine } from "./landgoed-art";

/**
 * Animatie voor het thema "landgoed": een crème envelop met een olijfgroen hart als zegel. De klep klapt open,
 * de envelop schuift omlaag en de uitnodiging verschijnt.
 */

const col = (key: keyof ThemeColors) => `var(--inv-${key})`;
const heading = { fontFamily: "var(--inv-heading)" } satisfies CSSProperties;
const script = { fontFamily: "var(--inv-script)" } satisfies CSSProperties;

const FLAP = 50;
const EASE = "cubic-bezier(.6,0,.2,1)";
const HEART = "M50 86C10 56 2 34 12 18C22 4 42 6 50 24C58 6 78 4 88 18C98 34 90 56 50 86Z";

type Props = { config: InvitationConfig; opening: boolean; onOpen: () => void };

export function LandgoedEnvelope({ config, opening, onOpen }: Props) {
  const names = `${config.partner1} & ${config.partner2}`;
  return (
    <div className="absolute inset-0 z-30 overflow-hidden" style={{ perspective: "1600px", containerType: "inline-size", pointerEvents: opening ? "none" : "auto" }}>
      <div
        className="absolute inset-0"
        style={{
          transform: opening ? "translateY(165%)" : "none",
          transition: `transform 700ms ${EASE} ${opening ? "520ms" : "0ms"}`,
          background: col("background"),
        }}
      >
        {/* Envelop (crème) op het groene vlak */}
        <div className="absolute inset-0" style={{ background: col("envelope") }} />
        <div
          className="absolute inset-0"
          style={{
            clipPath: `polygon(0 0, 50% ${FLAP - 2}%, 100% 0, 100% 100%, 0 100%)`,
            background: `linear-gradient(180deg, color-mix(in srgb, ${col("envelope")} 94%, white), color-mix(in srgb, ${col("envelope")} 88%, black))`,
          }}
        />

        {/* Namen op de voorkant */}
        <div
          className="absolute inset-x-0 z-[2] text-center"
          style={{ top: `${FLAP + 9}%`, color: col("text"), opacity: opening ? 0 : 1, transition: "opacity 250ms ease" }}
        >
          <p style={{ ...script, fontSize: "15cqw", lineHeight: 1.1 }}>{names}</p>
          <p className="uppercase" style={{ ...heading, fontSize: "3.6cqw", letterSpacing: "0.24em", marginTop: "6cqw", opacity: 0.7 }}>
            Tik om te openen
          </p>
        </div>

        {/* Klep met hartzegel */}
        <div
          className="absolute inset-x-0 top-0"
          style={{
            height: `${FLAP}%`,
            transformStyle: "preserve-3d",
            transformOrigin: "top",
            transform: opening ? "rotateX(180deg)" : "rotateX(0deg)",
            zIndex: opening ? 1 : 3,
            transition: `transform 700ms ${EASE} ${opening ? "120ms" : "0ms"}, z-index 0s linear ${opening ? "420ms" : "0ms"}`,
            filter: "drop-shadow(0 6px 8px rgb(0 0 0 / .25))",
          }}
        >
          <div
            className="absolute inset-0"
            style={{
              backfaceVisibility: "hidden",
              clipPath: "polygon(0 0, 100% 0, 50% 100%)",
              background: `linear-gradient(180deg, color-mix(in srgb, ${col("envelope")} 96%, white), ${col("envelope")})`,
            }}
          />
          <svg
            viewBox="0 0 100 92"
            aria-hidden="true"
            className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2"
            style={{ top: "calc(100% - 3cqw)", width: "26cqw", backfaceVisibility: "hidden", filter: "drop-shadow(0 6px 8px rgb(0 0 0 / .3))" }}
          >
            <path d={HEART} fill={col("background")} />
            <path d={HEART} fill="none" stroke={col("surface")} strokeWidth={5} strokeLinecap="round" strokeDasharray="0.1 4.2" opacity={0.9} />
          </svg>
          {/* binnenkant van de klep: groen met rank */}
          <div
            className="absolute inset-0"
            style={{ transform: "rotateX(180deg)", backfaceVisibility: "hidden", clipPath: "polygon(0 100%, 100% 100%, 50% 0)", background: col("background") }}
          >
            <Vine className="absolute left-1/2 -translate-x-1/2" flip style={{ bottom: "8%", width: "60cqw", opacity: 0.6 }} />
          </div>
        </div>
      </div>

      <button type="button" onClick={onOpen} aria-label="Open de uitnodiging" className="absolute inset-0 z-[6] cursor-pointer" tabIndex={opening ? -1 : 0} />
    </div>
  );
}
