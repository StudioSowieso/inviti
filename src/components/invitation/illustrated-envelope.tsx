"use client";

import type { CSSProperties } from "react";
import type { InvitationConfig, ThemeColors } from "@/lib/invitation/types";
import { Seal, Sparkle } from "./illustrated-art";
import { nameSize } from "./illustrated";

/**
 * Animatie voor het thema "illustrated": een kobaltblauwe envelop met een crèmekleurig zegel met een schelp.
 * De klep klapt open (de binnenkant is poederblauw), de envelop schuift omlaag en de uitnodiging verschijnt.
 */

const col = (key: keyof ThemeColors) => `var(--inv-${key})`;
const heading = { fontFamily: "var(--inv-heading)" } satisfies CSSProperties;
const body = { fontFamily: "var(--inv-body)" } satisfies CSSProperties;

const FLAP = 50;
const EASE = "cubic-bezier(.6,0,.2,1)";

type Props = { config: InvitationConfig; opening: boolean; onOpen: () => void };

export function IllustratedEnvelope({ config, opening, onOpen }: Props) {
  const second = `& ${config.partner2}`;
  const size = nameSize(config.partner1, second) * 0.62;
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
        {/* Envelop (kobalt) */}
        <div className="absolute inset-0" style={{ background: col("envelope") }} />
        <div
          className="absolute inset-0"
          style={{
            clipPath: `polygon(0 0, 50% ${FLAP - 2}%, 100% 0, 100% 100%, 0 100%)`,
            background: `linear-gradient(180deg, color-mix(in srgb, ${col("envelope")} 92%, white), color-mix(in srgb, ${col("envelope")} 86%, black))`,
          }}
        />

        {/* Namen op de voorkant */}
        <div
          className="absolute inset-x-0 z-[2] text-center"
          style={{ top: `${FLAP + 8}%`, color: col("envelopeCard"), opacity: opening ? 0 : 1, transition: "opacity 250ms ease" }}
        >
          <p className="lowercase" aria-label={`${config.partner1} ${second}`} style={{ ...heading, fontSize: `${size}cqw`, lineHeight: 0.95, letterSpacing: "-0.02em" }}>
            <span className="block">{config.partner1}</span>
            <span className="block">{second}</span>
          </p>
          <p className="lowercase" style={{ ...body, fontSize: "3.8cqw", marginTop: "8cqw", opacity: 0.8 }}>
            tik om te openen
          </p>
        </div>
        <Sparkle className="absolute z-[2]" style={{ left: "12cqw", top: `${FLAP + 10}%`, width: "4.5cqw", color: col("accent"), opacity: opening ? 0 : 1, transition: "opacity 250ms ease" }} />
        <Sparkle className="absolute z-[2]" style={{ right: "11cqw", bottom: "14%", width: "3.6cqw", color: col("accent"), opacity: opening ? 0 : 1, transition: "opacity 250ms ease" }} />

        {/* Klep met zegel */}
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
              background: `linear-gradient(180deg, color-mix(in srgb, ${col("envelope")} 94%, white), ${col("envelope")})`,
            }}
          />
          <Seal
            className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2"
            style={{ top: "calc(100% - 3cqw)", width: "27cqw", color: col("background"), backfaceVisibility: "hidden", filter: "drop-shadow(0 6px 8px rgb(0 0 0 / .3))" }}
          />
          {/* binnenkant van de klep: poederblauw */}
          <div
            className="absolute inset-0"
            style={{ transform: "rotateX(180deg)", backfaceVisibility: "hidden", clipPath: "polygon(0 100%, 100% 100%, 50% 0)", background: col("accent") }}
          />
        </div>
      </div>

      <button type="button" onClick={onOpen} aria-label="Open de uitnodiging" className="absolute inset-0 z-[6] cursor-pointer" tabIndex={opening ? -1 : 0} />
    </div>
  );
}
