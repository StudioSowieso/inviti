"use client";

import type { CSSProperties } from "react";
import type { InvitationConfig, ThemeColors } from "@/lib/invitation/types";
import { BourgCard, BourgStripes, Doodle } from "./bourgondisch-art";

/**
 * Animaties voor het thema "bourgondisch":
 * - BourgEnvelope: een grote envelop van het gestreepte papier. De klep klapt open (met een zegel van druiven)
 *   en de envelop schuift omlaag.
 * - BourgReveal ("Doorkijk"): het papier bestaat uit twee helften die als gordijnen opzij schuiven.
 */

const col = (key: keyof ThemeColors) => `var(--inv-${key})`;
const heading = { fontFamily: "var(--inv-heading)" } satisfies CSSProperties;
const script = { fontFamily: "var(--inv-script)" } satisfies CSSProperties;

const FLAP = 54; // hoogte van de klep in % van het scherm
const EASE = "cubic-bezier(.6,0,.2,1)";

type Props = { config: InvitationConfig; opening: boolean; onOpen: () => void };

function TapArea({ opening, onOpen }: { opening: boolean; onOpen: () => void }) {
  return (
    <button
      type="button"
      onClick={onOpen}
      aria-label="Open de uitnodiging"
      className="absolute inset-0 z-[6] cursor-pointer"
      tabIndex={opening ? -1 : 0}
    />
  );
}

/** Een kleine kaart met de namen en een knop. */
function NameCard({ config, opening, label }: { config: InvitationConfig; opening: boolean; label: string }) {
  return (
    <BourgCard className="px-5 py-6 text-center" curls={false} style={{ boxShadow: `0 0 0 0.36rem ${col("surface")}, 0 14px 26px -14px rgb(40 50 25 / .5)` }}>
      <p className="text-[0.6rem] tracking-[0.28em] uppercase" style={{ ...heading, color: col("text") }}>
        Wij gaan trouwen
      </p>
      <p className="mt-2 text-[2.1rem] leading-[1.05] text-balance" style={{ ...script, color: col("text") }}>
        {config.partner1} <span style={{ color: col("accent") }}>&amp;</span> {config.partner2}
      </p>
      <span
        className="mt-4 inline-flex items-center px-6 py-2.5 text-[0.58rem] font-medium tracking-[0.22em] whitespace-nowrap uppercase"
        style={{
          background: col("buttonBackground"),
          color: col("buttonText"),
          borderRadius: "var(--inv-radius)",
          opacity: opening ? 0 : 1,
          transition: "opacity 300ms ease",
        }}
      >
        {label}
      </span>
    </BourgCard>
  );
}

// ---------- Envelop van gestreept papier ----------

export function BourgEnvelope({ config, opening, onOpen }: Props) {
  const hair = `color-mix(in srgb, ${col("accent")} 55%, transparent)`;

  return (
    <div
      className="absolute inset-0 z-30 overflow-hidden"
      style={{ perspective: "1600px", pointerEvents: opening ? "none" : "auto" }}
    >
      <div
        className="absolute inset-0"
        style={{
          transform: opening ? "translateY(165%)" : "none",
          transition: `transform 700ms ${EASE} ${opening ? "520ms" : "0ms"}`,
        }}
      >
        {/* Achterkant */}
        <BourgStripes className="absolute inset-0" />

        {/* Voorkant met vouwlijnen; iets donkerder dan de klep, zodat de vouwen leesbaar blijven */}
        <div className="absolute inset-0" style={{ clipPath: `polygon(0 0, 50% ${FLAP - 2}%, 100% 0, 100% 100%, 0 100%)` }}>
          <BourgStripes className="absolute inset-0" />
          <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgb(255 255 255 / .1), rgb(60 70 30 / .12))" }} />
        </div>
        <svg
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 h-full w-full"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          fill="none"
          style={{ stroke: hair }}
          strokeWidth="1.6"
        >
          <path d={`M0 0 L50 ${FLAP - 2} L100 0`} vectorEffect="non-scaling-stroke" />
          <path d={`M0 100 L50 ${FLAP - 2} L100 100`} vectorEffect="non-scaling-stroke" />
        </svg>

        {/* Kaart met namen op de voorkant */}
        <div
          className="absolute inset-x-0 z-[2] flex justify-center px-10"
          style={{ top: `${FLAP + 7}%`, opacity: opening ? 0 : 1, transition: "opacity 250ms ease" }}
        >
          <div className="w-full max-w-[17rem]">
            <NameCard config={config} opening={opening} label="Tik om te openen" />
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
            filter: "drop-shadow(0 6px 6px rgb(40 50 25 / .22))",
          }}
        >
          {/* buitenkant van de klep: ook gestreept, met een lichte rand */}
          <div className="absolute inset-0" style={{ backfaceVisibility: "hidden", clipPath: "polygon(0 0, 100% 0, 50% 100%)" }}>
            <BourgStripes className="absolute inset-0" />
            <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgb(255 255 255 / .3), rgb(255 255 255 / 0) 70%)" }} />
          </div>
          <svg
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 h-full w-full"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            fill="none"
            style={{ stroke: col("accent"), backfaceVisibility: "hidden" }}
          >
            <path d="M0 0 L50 100 L100 0" strokeWidth="2.2" vectorEffect="non-scaling-stroke" />
          </svg>
          {/* zegel: druiven op een crème schijf */}
          <span
            className="absolute left-1/2 grid size-[4.8rem] -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full"
            style={{
              top: "calc(100% - 1.6rem)",
              background: col("surface"),
              backfaceVisibility: "hidden",
              border: `2px solid ${col("accent")}`,
              boxShadow: `0 0 0 0.3rem ${col("surface")}, 0 10px 20px -8px rgb(40 50 25 / .45)`,
            }}
          >
            <Doodle kind="grapes" w="2.3rem" />
          </span>
          {/* binnenkant van de klep */}
          <div
            className="absolute inset-0"
            style={{
              transform: "rotateX(180deg)",
              backfaceVisibility: "hidden",
              clipPath: "polygon(0 100%, 100% 100%, 50% 0)",
              background: `linear-gradient(0deg, ${col("surfaceAlt")}, ${col("surface")})`,
            }}
          />
        </div>
      </div>

      <TapArea opening={opening} onOpen={onOpen} />
    </div>
  );
}

// ---------- Doorkijk: gordijnen van gestreept papier ----------

export function BourgReveal({ config, opening, onOpen }: Props) {
  const half = (side: "left" | "right"): CSSProperties => ({
    transform: opening ? `translateX(${side === "left" ? "-102%" : "102%"})` : "none",
    transition: `transform 950ms cubic-bezier(.65,0,.3,1) ${opening ? "180ms" : "0ms"}`,
    boxShadow: opening ? undefined : `${side === "left" ? "1px" : "-1px"} 0 0 ${col("accent")}`,
  });

  return (
    <div className="absolute inset-0 z-30 overflow-hidden" style={{ containerType: "inline-size", pointerEvents: opening ? "none" : "auto" }}>
      {/* Twee helften van het papier; elke helft toont de juiste helft van hetzelfde patroon */}
      <div className="absolute inset-y-0 left-0 w-1/2 overflow-hidden" style={half("left")}>
        <BourgStripes className="absolute inset-y-0 left-0" style={{ width: "200%" }} />
      </div>
      <div className="absolute inset-y-0 right-0 w-1/2 overflow-hidden" style={half("right")}>
        <BourgStripes className="absolute inset-y-0 right-0" style={{ width: "200%" }} />
      </div>

      {/* Kaart met de namen */}
      <div
        className="pointer-events-none absolute inset-0 z-[4] flex items-center justify-center px-[9cqw]"
        style={{
          opacity: opening ? 0 : 1,
          transform: opening ? "scale(0.94)" : "none",
          transition: "opacity 420ms ease, transform 600ms ease",
        }}
      >
        <div className="w-full max-w-[19rem]">
          <NameCard config={config} opening={opening} label="Ga naar binnen" />
        </div>
      </div>
      <TapArea opening={opening} onOpen={onOpen} />
    </div>
  );
}
