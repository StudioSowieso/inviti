"use client";

import type { CSSProperties, ReactNode } from "react";
import type { InvitationConfig, ThemeColors } from "@/lib/invitation/types";
import { BigLemon, Frame, LEMON_STRIPES, LemonBranch, LemonSprig } from "./lemon";

/**
 * Animaties voor het thema "lemon":
 * - LemonEnvelope: een envelop met een grote citroen als zegel. Tik op de citroen: hij rolt weg,
 *   daarna klapt de klep open en schuift de envelop omlaag.
 * - LemonReveal ("Doorkijk"): je gaat door de citroentakken heen naar de uitnodiging.
 */

const col = (key: keyof ThemeColors) => `var(--inv-${key})`;
const heading = { fontFamily: "var(--inv-heading)", fontWeight: 500 } satisfies CSSProperties;
const script = { fontFamily: "var(--inv-script)" } satisfies CSSProperties;

const FLAP = 52; // hoogte van de klep in % van het scherm
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

function Hint({ opening, label }: { opening: boolean; label: string }) {
  return (
    <span
      className="inline-flex items-center px-6 py-3 text-[0.6rem] font-medium tracking-[0.18em] whitespace-nowrap uppercase"
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
  );
}

// ---------- Envelop met citroen ----------

export function LemonEnvelope({ config, opening, onOpen }: Props) {
  const base = col("envelope");
  const hair = "rgb(60 70 90 / .22)";

  return (
    <div
      className="absolute inset-0 z-30 overflow-hidden"
      style={{ perspective: "1600px", containerType: "inline-size", pointerEvents: opening ? "none" : "auto" }}
    >
      <div
        className="absolute inset-0"
        style={{
          transform: opening ? "translateY(104%)" : "none",
          transition: `transform 650ms ${EASE} ${opening ? "700ms" : "0ms"}`,
        }}
      >
        {/* Achterkant: gestreepte voering */}
        <div className="absolute inset-0" style={LEMON_STRIPES} />

        {/* Voorkant met vouwlijnen */}
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(180deg, color-mix(in srgb, ${base} 90%, white), ${base} 45%, color-mix(in srgb, ${base} 92%, black))`,
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

        {/* Namen op de voorkant */}
        <div
          className="pointer-events-none absolute inset-x-0 z-[2] flex flex-col items-center px-6 text-center"
          style={{ top: `${FLAP + 15}%`, opacity: opening ? 0 : 1, transition: "opacity 250ms ease" }}
        >
          <p className="text-[2.2rem] leading-none" style={{ ...script, color: col("accent") }}>
            {config.partner1} &amp; {config.partner2}
          </p>
          <p className="mt-3 text-[0.58rem] tracking-[0.3em] uppercase" style={{ color: col("text") }}>
            Wij gaan trouwen · tik op de citroen
          </p>
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
            transition: `transform 650ms ${EASE} ${opening ? "380ms" : "0ms"}, z-index 0s linear ${opening ? "700ms" : "0ms"}`,
          }}
        >
          <div
            className="absolute inset-0"
            style={{
              backfaceVisibility: "hidden",
              clipPath: "polygon(0 0, 100% 0, 50% 100%)",
              background: `linear-gradient(180deg, color-mix(in srgb, ${base} 82%, white), ${base})`,
              boxShadow: "inset 0 -2px 0 rgb(0 0 0 / .15)",
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
          {/* binnenkant van de klep: dezelfde strepen */}
          <div
            className="absolute inset-0"
            style={{
              transform: "rotateX(180deg)",
              backfaceVisibility: "hidden",
              clipPath: "polygon(0 100%, 100% 100%, 50% 0)",
              ...LEMON_STRIPES,
            }}
          />
        </div>
      </div>

      {/* Takken bovenin, over de klep heen; ze verdwijnen zodra de envelop opent */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 z-[4]"
        style={{ opacity: opening ? 0 : 1, transition: "opacity 300ms ease" }}
      >
        <LemonBranch className="absolute -top-3 -left-10 w-[64%]" />
        <LemonBranch className="absolute -top-3 -right-10 w-[52%]" flip />
      </div>

      {/* De citroen als zegel op de punt van de klep: rolt naar rechts weg zodra je tikt */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 z-[4]"
        style={{
          top: "50%",
          width: "10rem",
          marginLeft: "-5rem",
          marginTop: "-3.4rem",
          transform: opening ? "translateX(calc(50cqw + 7rem)) rotate(640deg)" : "none",
          transition: `transform 820ms cubic-bezier(.5,0,.8,.6)`,
          filter: "drop-shadow(0 10px 8px rgb(60 50 10 / .35))",
        }}
      >
        <BigLemon className="w-full" leaves={false} />
      </div>

      <TapArea opening={opening} onOpen={onOpen} />
    </div>
  );
}

// ---------- Doorkijk: door de citroenen heen ----------

type Layer = { side: "left" | "right"; style: CSSProperties; move: number; scale: number; delay: number; z: number; flipY?: boolean };

const LAYERS: Layer[] = [
  { side: "left", style: { top: "-7%", left: "-30%", width: "104%" }, move: -95, scale: 1.9, delay: 0, z: 3 },
  { side: "right", style: { bottom: "-8%", right: "-32%", width: "100%" }, move: 95, scale: 1.9, delay: 0, z: 3, flipY: true },
  { side: "right", style: { top: "6%", right: "-34%", width: "70%" }, move: 60, scale: 1.5, delay: 120, z: 2 },
  { side: "left", style: { bottom: "4%", left: "-34%", width: "72%" }, move: -60, scale: 1.5, delay: 120, z: 2, flipY: true },
];

function BranchLayer({ layer, opening }: { layer: Layer; opening: boolean }) {
  const { side, style, move, scale, delay, z, flipY } = layer;
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute"
      style={{
        ...style,
        zIndex: z,
        transformOrigin: side === "left" ? "0% 50%" : "100% 50%",
        transform: opening ? `translateX(${move}%) scale(${scale}) rotate(${side === "left" ? -6 : 6}deg)` : "none",
        opacity: opening ? 0 : 1,
        transition: `transform ${1300 - delay}ms cubic-bezier(.55,0,.25,1) ${delay}ms, opacity 500ms ease ${800 + delay}ms`,
      }}
    >
      <LemonBranch
        className="w-full"
        flip={side === "right"}
        style={flipY ? { transform: `scale(${side === "right" ? -1 : 1},-1)` } : undefined}
      />
    </div>
  );
}

export function LemonReveal({ config, opening, onOpen }: Props): ReactNode {
  return (
    <div className="absolute inset-0 z-30 overflow-hidden" style={{ containerType: "inline-size", pointerEvents: opening ? "none" : "auto" }}>
      <div
        className="absolute inset-0"
        style={{ ...LEMON_STRIPES, opacity: opening ? 0 : 1, transition: `opacity 900ms ease ${opening ? "380ms" : "0ms"}` }}
      />
      {LAYERS.map((l, i) => (
        <BranchLayer key={i} layer={l} opening={opening} />
      ))}
      <div
        className="pointer-events-none absolute inset-0 z-[4] flex items-center justify-center px-8"
        style={{
          opacity: opening ? 0 : 1,
          transform: opening ? "scale(1.12)" : "none",
          transition: "opacity 450ms ease, transform 700ms ease",
        }}
      >
        <div className="w-full max-w-[17rem]">
          <Frame padding="px-6 pt-10 pb-10">
            <LemonSprig className="mx-auto" width={64} />
            <p className="mt-3 text-[0.55rem] tracking-[0.3em] uppercase" style={{ color: col("muted") }}>
              Wij gaan trouwen
            </p>
            <p className="mt-2 text-[1.9rem] leading-[1.05] tracking-[0.12em] uppercase" style={{ ...heading, color: col("text") }}>
              {config.partner1}
            </p>
            <p className="text-[2rem] leading-[0.9]" style={{ ...script, color: col("accent") }}>
              &amp;
            </p>
            <p className="text-[1.9rem] leading-[1.05] tracking-[0.12em] uppercase" style={{ ...heading, color: col("text") }}>
              {config.partner2}
            </p>
            <div className="mt-6">
              <Hint opening={opening} label="Ga naar binnen" />
            </div>
          </Frame>
        </div>
      </div>
      <TapArea opening={opening} onOpen={onOpen} />
    </div>
  );
}
