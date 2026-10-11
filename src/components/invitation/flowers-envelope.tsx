"use client";

import { useMemo, type CSSProperties } from "react";
import type { InvitationConfig, ThemeColors } from "@/lib/invitation/types";
import { Blossom, buildSprig, CornerSprigs, SprigArt, type SprigData } from "./flowers";
import { PAPER_NOISE } from "./nature";

/**
 * Animaties voor het thema "flowers":
 * - FlowersEnvelope: een grote papieren envelop met een bloemenzegel op de klep. De klep klapt open en de
 *   envelop schuift omlaag.
 * - FlowersReveal ("Doorkijk"): je gaat door de bloemtakken heen die naar de zijkanten wegzwaaien.
 */

const col = (key: keyof ThemeColors) => `var(--inv-${key})`;
const heading = { fontFamily: "var(--inv-heading)" } satisfies CSSProperties;
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

/** Zegel: één grote bloem met twee lagen bloemblaadjes, zonder rand eromheen. */
function FlowerSeal({ size = 104 }: { size?: number }) {
  return (
    <svg viewBox="-48 -48 96 96" width={size} height={size} aria-hidden="true" overflow="visible" style={{ filter: "drop-shadow(0 8px 7px rgb(30 30 20 / .3))" }}>
      <Blossom x={0} y={0} r={31} rot={0} petal={`color-mix(in srgb, ${col("accent")} 80%, black)`} />
      <Blossom x={0} y={0} r={27} rot={36} petal={col("accent")} />
      <Blossom x={0} y={0} r={17} rot={18} petal={`color-mix(in srgb, ${col("accent")} 55%, white)`} />
      <circle r="5.2" fill="#e9c75f" />
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <circle key={i} cx={Math.cos((i / 6) * Math.PI * 2) * 7.6} cy={Math.sin((i / 6) * Math.PI * 2) * 7.6} r="1.2" fill="#f6e7a8" />
      ))}
    </svg>
  );
}

// ---------- Envelop met bloemenzegel ----------

export function FlowersEnvelope({ config, opening, onOpen }: Props) {
  const body = `color-mix(in srgb, ${col("envelope")} 26%, ${col("surface")})`;
  const bodyDark = `color-mix(in srgb, ${col("envelope")} 38%, ${col("surface")})`;
  const fold = `color-mix(in srgb, ${col("envelope")} 55%, ${col("surface")})`;

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
        <div className="absolute inset-0" style={{ background: bodyDark, backgroundImage: PAPER_NOISE }} />

        {/* Voorkant */}
        <div className="absolute inset-0" style={{ clipPath: `polygon(0 0, 50% ${FLAP - 2}%, 100% 0, 100% 100%, 0 100%)` }}>
          <div className="absolute inset-0" style={{ background: body, backgroundImage: PAPER_NOISE }} />
          <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgb(255 255 255 / .18), rgb(60 60 30 / .08))" }} />
          <CornerSprigs corner="bl" seed={19} size="11rem" />
          <CornerSprigs corner="br" seed={23} size="9rem" className="opacity-90" />
        </div>
        <svg
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 h-full w-full"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          fill="none"
          style={{ stroke: fold }}
          strokeWidth="1.4"
        >
          <path d={`M0 100 L50 ${FLAP - 2} L100 100`} vectorEffect="non-scaling-stroke" />
        </svg>

        {/* Namen op de voorkant */}
        <div
          className="pointer-events-none absolute inset-x-0 z-[2] flex flex-col items-center px-8 text-center"
          style={{ top: `${FLAP + 6}%`, opacity: opening ? 0 : 1, transition: "opacity 250ms ease", color: col("text") }}
        >
          <p className="text-[0.5rem] tracking-[0.3em] uppercase" style={{ color: col("muted") }}>
            Wij gaan trouwen
          </p>
          <p className="mt-2.5 text-[1.5rem] leading-[1.2] tracking-[0.16em] uppercase" style={heading}>
            {config.partner1}
          </p>
          <p className="text-[1.5rem] leading-none italic" style={{ ...script, color: col("accent") }}>
            en
          </p>
          <p className="text-[1.5rem] leading-[1.2] tracking-[0.16em] uppercase" style={heading}>
            {config.partner2}
          </p>
          <span
            className="mt-5 inline-flex items-center px-6 py-2.5 text-[0.55rem] font-medium tracking-[0.22em] whitespace-nowrap uppercase"
            style={{ background: col("buttonBackground"), color: col("buttonText"), borderRadius: "var(--inv-radius)" }}
          >
            Tik om te openen
          </span>
        </div>

        {/* Klep met het zegel */}
        <div
          className="absolute inset-x-0 top-0"
          style={{
            height: `${FLAP}%`,
            transformStyle: "preserve-3d",
            transformOrigin: "top",
            transform: opening ? "rotateX(180deg)" : "rotateX(0deg)",
            zIndex: opening ? 1 : 3,
            transition: `transform 700ms ${EASE} ${opening ? "120ms" : "0ms"}, z-index 0s linear ${opening ? "420ms" : "0ms"}`,
            filter: "drop-shadow(0 6px 6px rgb(40 40 20 / .22))",
          }}
        >
          <div className="absolute inset-0" style={{ backfaceVisibility: "hidden", clipPath: "polygon(0 0, 100% 0, 50% 100%)" }}>
            <div className="absolute inset-0" style={{ background: `color-mix(in srgb, ${col("envelope")} 32%, ${col("surface")})`, backgroundImage: PAPER_NOISE }} />
            <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgb(255 255 255 / .3), rgb(255 255 255 / 0) 70%)" }} />
          </div>
          <span
            className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2"
            style={{ top: "calc(100% - 2.6rem)", backfaceVisibility: "hidden" }}
          >
            <FlowerSeal />
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

// ---------- Doorkijk: door de bloemen heen ----------

type Spec = { y: number; rot: number; scale: number; data: SprigData };

function makeSpecs(offset: number, ys: number[], scale: number): Spec[] {
  return ys.map((y, i) => ({
    y,
    rot: (i % 2 === 0 ? 1 : -1) * (6 + ((i * 5) % 11)),
    scale,
    data: buildSprig(offset + i * 7, { len: 120 + ((i * 13) % 30), bow: (i % 2 === 0 ? 1 : -1) * (12 + ((i * 5) % 8)), leaves: 9, flowers: 4 }),
  }));
}

function FlowerSide({ side, specs, depth, opening }: { side: "left" | "right"; specs: Spec[]; depth: "near" | "far"; opening: boolean }) {
  const near = depth === "near";
  const dir = side === "left" ? -1 : 1;
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute top-0 h-full w-[68%]"
      style={{
        [side]: 0,
        transformOrigin: `${side === "left" ? "0%" : "100%"} 50%`,
        transform: opening ? `translateX(${dir * (near ? 100 : 60)}%) scale(${near ? 1.9 : 1.4}) rotate(${dir * (near ? 5 : 2)}deg)` : "none",
        opacity: opening ? 0 : 1,
        transition: `transform ${near ? 1250 : 1450}ms cubic-bezier(.55,0,.25,1), opacity 480ms ease ${near ? 780 : 950}ms`,
        zIndex: near ? 3 : 2,
      }}
    >
      <svg
        viewBox="0 0 240 620"
        preserveAspectRatio={side === "left" ? "xMinYMid slice" : "xMaxYMid slice"}
        className="h-full w-full"
        style={{ transform: side === "right" ? "scaleX(-1)" : undefined, opacity: near ? 1 : 0.7 }}
      >
        {specs.map((s, i) => (
          <g key={i} transform={`translate(-14 ${s.y}) rotate(${s.rot}) scale(${s.scale})`}>
            <SprigArt data={s.data} />
          </g>
        ))}
      </svg>
    </div>
  );
}

export function FlowersReveal({ config, opening, onOpen }: Props) {
  const specs = useMemo(
    () => ({
      nearLeft: makeSpecs(41, [50, 200, 350, 500], 1.7),
      nearRight: makeSpecs(141, [110, 260, 410, 560], 1.7),
      farLeft: makeSpecs(241, [120, 270, 420], 1.2),
      farRight: makeSpecs(341, [60, 210, 360, 510], 1.2),
    }),
    [],
  );
  return (
    <div className="absolute inset-0 z-30 overflow-hidden" style={{ pointerEvents: opening ? "none" : "auto" }}>
      <div
        className="absolute inset-0"
        style={{
          background: col("background"),
          backgroundImage: PAPER_NOISE,
          opacity: opening ? 0 : 1,
          transition: `opacity 900ms ease ${opening ? "380ms" : "0ms"}`,
        }}
      />
      <FlowerSide side="left" specs={specs.farLeft} depth="far" opening={opening} />
      <FlowerSide side="right" specs={specs.farRight} depth="far" opening={opening} />
      <FlowerSide side="left" specs={specs.nearLeft} depth="near" opening={opening} />
      <FlowerSide side="right" specs={specs.nearRight} depth="near" opening={opening} />
      <div
        className="pointer-events-none absolute inset-0 z-[4] flex flex-col items-center justify-center px-8 text-center"
        style={{ opacity: opening ? 0 : 1, transform: opening ? "scale(1.12)" : "none", transition: "opacity 450ms ease, transform 700ms ease" }}
      >
        <div
          className="px-10 py-12"
          style={{ background: `radial-gradient(closest-side, ${col("background")} 64%, color-mix(in srgb, ${col("background")} 0%, transparent))` }}
        >
          <p className="text-[0.5rem] tracking-[0.3em] uppercase" style={{ color: col("muted") }}>
            Wij gaan trouwen
          </p>
          <p className="mt-3 text-[1.9rem] leading-[1.2] tracking-[0.16em] uppercase" style={{ ...heading, color: col("text") }}>
            {config.partner1}
          </p>
          <p className="text-[1.7rem] leading-none italic" style={{ ...script, color: col("accent") }}>
            en
          </p>
          <p className="text-[1.9rem] leading-[1.2] tracking-[0.16em] uppercase" style={{ ...heading, color: col("text") }}>
            {config.partner2}
          </p>
          <span
            className="mt-6 inline-flex items-center px-6 py-2.5 text-[0.55rem] font-medium tracking-[0.22em] whitespace-nowrap uppercase"
            style={{ background: col("buttonBackground"), color: col("buttonText"), borderRadius: "var(--inv-radius)" }}
          >
            Ga naar binnen
          </span>
        </div>
      </div>
      <TapArea opening={opening} onOpen={onOpen} />
    </div>
  );
}
