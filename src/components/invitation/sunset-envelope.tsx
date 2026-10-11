"use client";

import type { CSSProperties } from "react";
import type { InvitationConfig, ThemeColors } from "@/lib/invitation/types";
import { HalfCard, Paperclip } from "./sunset";
import { PAPER_NOISE } from "./nature";

/**
 * Animaties voor het thema "sunset":
 * - SunsetEnvelope: een oranje envelop met een perzikkleurig kaartje en een roze halfrond kaartje met
 *   paperclip op de voorkant. De klep klapt open en de envelop schuift omlaag.
 * - SunsetReveal ("Doorkijk"): gestapelde kaartjes in rood, oranje en perzik waaieren weg.
 */

const col = (key: keyof ThemeColors) => `var(--inv-${key})`;
const script = { fontFamily: "var(--inv-script)" } satisfies CSSProperties;

const FLAP = 50;
const EASE = "cubic-bezier(.6,0,.2,1)";

type Props = { config: InvitationConfig; opening: boolean; onOpen: () => void };

function TapArea({ opening, onOpen }: { opening: boolean; onOpen: () => void }) {
  return (
    <button type="button" onClick={onOpen} aria-label="Open de uitnodiging" className="absolute inset-0 z-[6] cursor-pointer" tabIndex={opening ? -1 : 0} />
  );
}

function NamesCard({ config, opening, label }: { config: InvitationConfig; opening: boolean; label: string }) {
  return (
    <HalfCard className="w-full px-5 pt-14 pb-7 text-center">
      <p className="text-[2.1rem] leading-[1.05]" style={{ ...script, color: col("accent") }}>
        {config.partner1}
        <span className="mx-1.5 text-[1.5rem]" style={{ color: col("text") }}>
          &amp;
        </span>
        {config.partner2}
      </p>
      <p className="mt-2 text-[0.5rem] tracking-[0.22em] uppercase" style={{ color: col("text") }}>
        Wij gaan trouwen
      </p>
      <span
        className="mt-4 inline-flex items-center px-6 py-2.5 text-[0.55rem] font-medium tracking-[0.2em] whitespace-nowrap uppercase"
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
    </HalfCard>
  );
}

// ---------- Oranje envelop met kaartjes ----------

export function SunsetEnvelope({ config, opening, onOpen }: Props) {
  const front = `color-mix(in srgb, ${col("envelope")} 90%, white)`;
  const back = `color-mix(in srgb, ${col("envelope")} 82%, black)`;

  return (
    <div className="absolute inset-0 z-30 overflow-hidden" style={{ perspective: "1600px", pointerEvents: opening ? "none" : "auto" }}>
      <div
        className="absolute inset-0"
        style={{
          transform: opening ? "translateY(165%)" : "none",
          transition: `transform 700ms ${EASE} ${opening ? "520ms" : "0ms"}`,
        }}
      >
        <div className="absolute inset-0" style={{ background: back, backgroundImage: PAPER_NOISE }} />

        {/* Voorkant met kaartjes */}
        <div className="absolute inset-0" style={{ clipPath: `polygon(0 0, 50% ${FLAP - 2}%, 100% 0, 100% 100%, 0 100%)` }}>
          <div className="absolute inset-0" style={{ background: front, backgroundImage: PAPER_NOISE }} />
          <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgb(255 255 255 / .16), rgb(80 20 0 / .12))" }} />
        </div>

        <div
          className="pointer-events-none absolute inset-x-0 z-[2] px-9"
          style={{ top: `${FLAP + 3}%`, opacity: opening ? 0 : 1, transition: "opacity 250ms ease" }}
        >
          <div className="relative mx-auto w-full max-w-[17rem]">
            {/* perzikkleurig en rood kaartje dat erachter uitsteekt */}
            <div className="absolute -top-5 right-1 left-5 h-24 rounded-[1.1rem]" style={{ background: col("accent"), transform: "rotate(3deg)" }} />
            <div className="absolute -top-3 right-5 left-1 h-24 rounded-[1.1rem]" style={{ background: col("surface"), transform: "rotate(-2deg)" }} />
            <NamesCard config={config} opening={opening} label="Tik om te openen" />
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
            filter: "drop-shadow(0 6px 6px rgb(80 20 0 / .3))",
          }}
        >
          <div className="absolute inset-0" style={{ backfaceVisibility: "hidden", clipPath: "polygon(0 0, 100% 0, 50% 100%)" }}>
            <div className="absolute inset-0" style={{ background: col("envelope"), backgroundImage: PAPER_NOISE }} />
            <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgb(255 255 255 / .2), rgb(255 255 255 / 0) 70%)" }} />
          </div>
          <span className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2" style={{ top: "calc(100% - 3rem)", backfaceVisibility: "hidden" }}>
            <Paperclip style={{ transform: "rotate(-12deg) scale(1.3)" }} />
          </span>
          <div
            className="absolute inset-0"
            style={{
              transform: "rotateX(180deg)",
              backfaceVisibility: "hidden",
              clipPath: "polygon(0 100%, 100% 100%, 50% 0)",
              background: `linear-gradient(0deg, ${col("surface")}, color-mix(in srgb, ${col("surface")} 80%, white))`,
            }}
          />
        </div>
      </div>
      <TapArea opening={opening} onOpen={onOpen} />
    </div>
  );
}

// ---------- Doorkijk: kaartjes waaieren weg ----------

export function SunsetReveal({ config, opening, onOpen }: Props) {
  const panels: { tone: keyof ThemeColors; dir: [number, number]; rot: number; delay: number; tilt: number }[] = [
    { tone: "accent", dir: [110, -4], rot: 14, delay: 260, tilt: 4 },
    { tone: "envelope", dir: [-110, 6], rot: -12, delay: 140, tilt: -3 },
    { tone: "surface", dir: [4, 112], rot: 6, delay: 0, tilt: 1.5 },
  ];
  return (
    <div className="absolute inset-0 z-30 overflow-hidden" style={{ pointerEvents: opening ? "none" : "auto" }}>
      <div
        className="absolute inset-0"
        style={{ background: col("background"), backgroundImage: PAPER_NOISE, opacity: opening ? 0 : 1, transition: `opacity 700ms ease ${opening ? "700ms" : "0ms"}` }}
      />
      {panels.map((p, i) => (
        <div
          key={i}
          className="absolute inset-x-[6%] top-[5%] bottom-[5%] rounded-[1.5rem]"
          style={{
            background: col(p.tone),
            backgroundImage: PAPER_NOISE,
            zIndex: 1 + (panels.length - i),
            boxShadow: "0 18px 30px -18px rgb(60 20 5 / .6)",
            transform: opening ? `translate(${p.dir[0]}%, ${p.dir[1]}%) rotate(${p.rot}deg)` : `rotate(${p.tilt}deg)`,
            transition: `transform 1100ms cubic-bezier(.6,0,.25,1) ${opening ? p.delay : 0}ms`,
          }}
        />
      ))}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-[16%] z-[8] flex justify-center px-10"
        style={{ opacity: opening ? 0 : 1, transform: opening ? "translateY(30px) scale(.96)" : "none", transition: "opacity 400ms ease, transform 600ms ease" }}
      >
        <div className="w-full max-w-[17rem]">
          <NamesCard config={config} opening={opening} label="Ga naar binnen" />
        </div>
      </div>
      <TapArea opening={opening} onOpen={onOpen} />
    </div>
  );
}
