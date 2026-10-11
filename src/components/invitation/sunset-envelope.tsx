"use client";

import type { CSSProperties } from "react";
import type { InvitationConfig, ThemeColors } from "@/lib/invitation/types";
import { HalfCard, Paperclip, WavyCard } from "./sunset";
import { PAPER_NOISE } from "./nature";

/**
 * Animaties voor het thema "sunset":
 * - SunsetEnvelope: een oranje envelop met een perzikkleurig kaartje en een roze halfrond kaartje met
 *   paperclip op de voorkant. De klep klapt open en de envelop schuift omlaag.
 * - SunsetReveal ("Doorkijk"): gestapelde kaartjes (envelop, golvend perzik, oranje, halfrond) schuiven naar beide zijkanten.
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

// ---------- Doorkijk: de gestapelde kaartjes schuiven naar beide zijkanten ----------

export function SunsetReveal({ config, opening, onOpen }: Props) {
  const back = `color-mix(in srgb, ${col("envelope")} 84%, black)`;
  const orange = `color-mix(in srgb, ${col("envelope")} 92%, white)`;
  /** Elke laag schuift de zijkant uit; de voorste laag gaat als eerste. */
  const layer = (dir: -1 | 1, tilt: number, delay: number, z: number): CSSProperties => ({
    zIndex: z,
    transform: opening ? `translateX(${dir * 135}%) rotate(${tilt + dir * 6}deg)` : `rotate(${tilt}deg)`,
    transition: `transform 1100ms cubic-bezier(.6,0,.25,1) ${opening ? delay : 0}ms`,
  });
  return (
    <div className="absolute inset-0 z-30 overflow-hidden" style={{ pointerEvents: opening ? "none" : "auto" }}>
      <div
        className="absolute inset-0"
        style={{ background: col("background"), backgroundImage: PAPER_NOISE, opacity: opening ? 0 : 1, transition: `opacity 600ms ease ${opening ? "800ms" : "0ms"}` }}
      />
      <div className="absolute inset-x-[7%] top-[6%] bottom-[5%]" style={{ transform: "rotate(-3deg)" }}>
        {/* oranje envelop achteraan */}
        <div
          aria-hidden="true"
          className="absolute inset-x-[2%] top-0 bottom-[22%] rounded-[0.6rem]"
          style={{ ...layer(-1, 0, 330, 1), background: back, backgroundImage: PAPER_NOISE, boxShadow: "0 18px 30px -18px rgb(60 20 5 / .6)" }}
        />
        {/* perzikkleurig kaartje met golvende zijkanten */}
        <div aria-hidden="true" className="absolute inset-x-[4%] top-[5%] h-[66%]" style={{ ...layer(1, 1.5, 220, 2), filter: "drop-shadow(0 14px 14px rgb(60 20 5 / .35))" }}>
          <WavyCard tone="surface" className="h-full">
            <div className="px-6 pt-6 text-center text-[0.55rem] leading-relaxed tracking-[0.12em] uppercase" style={{ color: col("accent") }}>
              Wij nodigen jullie uit
              <br />
              om met ons te vieren
            </div>
          </WavyCard>
        </div>
        {/* oranje kaartje met afgeronde hoeken */}
        <div
          aria-hidden="true"
          className="absolute inset-x-[15%] top-[27%] h-[48%] rounded-[1.2rem] px-5 pt-6 text-center"
          style={{ ...layer(-1, -1, 110, 3), background: orange, backgroundImage: PAPER_NOISE, boxShadow: "0 16px 24px -14px rgb(60 20 5 / .6)" }}
        >
          <p className="text-[2rem] leading-none" style={{ ...script, color: col("surface") }}>
            Wij gaan trouwen
          </p>
          <p className="mt-3 text-[0.5rem] tracking-[0.2em] uppercase" style={{ color: col("surface") }}>
            Een kaartje vol details
          </p>
        </div>
        {/* halfrond kaartje met namen, voorop */}
        <div className="absolute inset-x-[6%] bottom-0" style={layer(1, 1, 0, 4)}>
          <NamesCard config={config} opening={opening} label="Ga naar binnen" />
        </div>
      </div>
      <TapArea opening={opening} onOpen={onOpen} />
    </div>
  );
}
