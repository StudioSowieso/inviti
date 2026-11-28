"use client";

import type { CSSProperties } from "react";
import type { InvitationConfig, ThemeColors } from "@/lib/invitation/types";
import { Poppy, Sprig } from "./klaproos-art";
import { nameSize } from "./klaproos";

/**
 * Animatie voor het thema "klaproos": een zachte papieren envelop met een getekende klaproos en een rond zegel met een takje.
 * De klep klapt open, de envelop schuift omlaag en de uitnodiging verschijnt.
 */

const col = (key: keyof ThemeColors) => `var(--inv-${key})`;
const heading = { fontFamily: "var(--inv-heading)" } satisfies CSSProperties;
const body = { fontFamily: "var(--inv-body)" } satisfies CSSProperties;

const FLAP = 48;
const EASE = "cubic-bezier(.6,0,.2,1)";

type Props = { config: InvitationConfig; opening: boolean; onOpen: () => void };

export function KlaproosEnvelope({ config, opening, onOpen }: Props) {
  const size = nameSize(config.partner1, config.partner2) * 0.95;
  const fade: CSSProperties = { opacity: opening ? 0 : 1, transition: "opacity 250ms ease" };
  return (
    <div className="absolute inset-0 z-30 overflow-hidden" style={{ perspective: "1600px", containerType: "inline-size", pointerEvents: opening ? "none" : "auto", "--inv-fill": col("envelope") } as CSSProperties}>
      <div
        className="absolute inset-0"
        style={{
          transform: opening ? "translateY(165%)" : "none",
          transition: `transform 700ms ${EASE} ${opening ? "520ms" : "0ms"}`,
          background: col("background"),
        }}
      >
        <div className="absolute inset-0" style={{ background: col("envelope") }} />
        <div
          className="absolute inset-0"
          style={{
            clipPath: `polygon(0 0, 50% ${FLAP - 2}%, 100% 0, 100% 100%, 0 100%)`,
            background: `linear-gradient(180deg, color-mix(in srgb, ${col("envelope")} 96%, white), color-mix(in srgb, ${col("envelope")} 92%, black))`,
          }}
        />

        {/* Klaproos linksonder op de voorkant, naast de namen */}
        <Poppy className="absolute z-[1]" style={{ right: "-6cqw", bottom: "-8cqw", width: "44cqw", color: col("accent"), ...fade }} />

        <div className="absolute z-[2]" style={{ left: "11cqw", top: `${FLAP + 9}%`, color: col("text"), ...fade }}>
          <p aria-label={`${config.partner1} & ${config.partner2}`} className="uppercase" style={{ ...heading, fontSize: `${size}cqw`, lineHeight: 1.1, letterSpacing: "0.05em" }}>
            <span className="block">{config.partner1}</span>
            <span className="block" style={{ fontSize: "0.55em", marginTop: "0.2em" }}>
              &amp;
            </span>
            <span className="block">{config.partner2}</span>
          </p>
          <p style={{ ...body, fontSize: "3cqw", letterSpacing: "0.24em", textTransform: "uppercase", marginTop: "9cqw", color: col("muted") }}>Tik om te openen</p>
        </div>

        <div
          className="absolute inset-x-0 top-0"
          style={{
            height: `${FLAP}%`,
            transformStyle: "preserve-3d",
            transformOrigin: "top",
            transform: opening ? "rotateX(180deg)" : "rotateX(0deg)",
            zIndex: opening ? 1 : 3,
            transition: `transform 700ms ${EASE} ${opening ? "120ms" : "0ms"}, z-index 0s linear ${opening ? "420ms" : "0ms"}`,
            filter: "drop-shadow(0 5px 7px rgb(0 0 0 / .18))",
          }}
        >
          <div
            className="absolute inset-0"
            style={{
              backfaceVisibility: "hidden",
              clipPath: "polygon(0 0, 100% 0, 50% 100%)",
              background: `linear-gradient(180deg, color-mix(in srgb, ${col("envelope")} 90%, white), ${col("envelope")})`,
            }}
          />
          <div
            className="absolute left-1/2 grid -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full"
            style={{
              top: "calc(100% - 3cqw)",
              width: "20cqw",
              height: "20cqw",
              background: col("accent"),
              color: col("background"),
              backfaceVisibility: "hidden",
              boxShadow: "0 5px 9px rgb(0 0 0 / .28)",
            }}
          >
            <Sprig style={{ width: "9cqw", color: col("background") }} />
          </div>
          <div
            className="absolute inset-0"
            style={{ transform: "rotateX(180deg)", backfaceVisibility: "hidden", clipPath: "polygon(0 100%, 100% 100%, 50% 0)", background: col("surface") }}
          />
        </div>
      </div>

      <button type="button" onClick={onOpen} aria-label="Open de uitnodiging" className="absolute inset-0 z-[6] cursor-pointer" tabIndex={opening ? -1 : 0} />
    </div>
  );
}
