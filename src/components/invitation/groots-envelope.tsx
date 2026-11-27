"use client";

import type { CSSProperties } from "react";
import type { InvitationConfig, ThemeColors } from "@/lib/invitation/types";
import { monogram } from "@/lib/invitation/format";
import { scriptSize } from "./groots";

/**
 * Animatie voor het thema "groots": een diepe envelop met een rond zegel met de beginletters in handschrift.
 * De klep klapt open, de envelop schuift omlaag en de uitnodiging verschijnt.
 */

const col = (key: keyof ThemeColors) => `var(--inv-${key})`;
const script = { fontFamily: "var(--inv-script)" } satisfies CSSProperties;
const body = { fontFamily: "var(--inv-body)" } satisfies CSSProperties;

const FLAP = 50;
const EASE = "cubic-bezier(.6,0,.2,1)";

type Props = { config: InvitationConfig; opening: boolean; onOpen: () => void };

export function GrootsEnvelope({ config, opening, onOpen }: Props) {
  const size = scriptSize(config.partner1, config.partner2) * 0.7;
  const short = monogram(config.partner1, config.partner2, "&");
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
        <div className="absolute inset-0" style={{ background: col("envelope") }} />
        <div
          className="absolute inset-0"
          style={{
            clipPath: `polygon(0 0, 50% ${FLAP - 2}%, 100% 0, 100% 100%, 0 100%)`,
            background: `linear-gradient(180deg, color-mix(in srgb, ${col("envelope")} 92%, white), color-mix(in srgb, ${col("envelope")} 84%, black))`,
          }}
        />

        <div
          className="absolute inset-x-0 z-[2] text-center"
          style={{ top: `${FLAP + 8}%`, color: col("envelopeCard"), opacity: opening ? 0 : 1, transition: "opacity 250ms ease" }}
        >
          <p aria-label={`${config.partner1} & ${config.partner2}`} style={{ ...script, fontSize: `${size}cqw`, lineHeight: 1 }}>
            <span className="block">{config.partner1}</span>
            <span className="block" style={{ marginTop: "-1cqw" }}>
              {config.partner2}
            </span>
          </p>
          <p style={{ ...body, fontSize: "3cqw", letterSpacing: "0.26em", textTransform: "uppercase", marginTop: "8cqw", opacity: 0.8 }}>Tik om te openen</p>
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
          <div
            className="absolute left-1/2 grid -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full"
            style={{
              top: "calc(100% - 3cqw)",
              width: "22cqw",
              height: "22cqw",
              background: col("envelopeCard"),
              color: col("envelope"),
              backfaceVisibility: "hidden",
              boxShadow: `0 0 0 1cqw ${col("envelopeCard")}, 0 6px 10px rgb(0 0 0 / .3)`,
              ...script,
              fontSize: "9cqw",
              lineHeight: 1,
            }}
          >
            {short}
          </div>
          <div
            className="absolute inset-0"
            style={{ transform: "rotateX(180deg)", backfaceVisibility: "hidden", clipPath: "polygon(0 100%, 100% 100%, 50% 0)", background: col("envelopeCard") }}
          />
        </div>
      </div>

      <button type="button" onClick={onOpen} aria-label="Open de uitnodiging" className="absolute inset-0 z-[6] cursor-pointer" tabIndex={opening ? -1 : 0} />
    </div>
  );
}
