"use client";

import type { CSSProperties } from "react";
import type { InvitationConfig, ThemeColors } from "@/lib/invitation/types";
import { HalfCard, WavyCard } from "./sunset";
import { PAPER_NOISE } from "./nature";

/**
 * Animaties voor het thema "sunset":
 * - SunsetEnvelope: een oranje kaart met een perzikkleurige envelop en een kaart met golvende rand, samengebonden
 *   met een touwtje en een label. Bij openen valt het touwtje eraf, gaat de envelop open en schuift alles weg.
 * - SunsetReveal ("Doorkijk"): gestapelde kaartjes (envelop, golvend perzik, oranje, halfrond) schuiven naar beide zijkanten.
 */

const col = (key: keyof ThemeColors) => `var(--inv-${key})`;
const script = { fontFamily: "var(--inv-script)" } satisfies CSSProperties;

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

// ---------- Oranje kaart met envelop, touwtje en label ----------

/** Rechthoek met halfronde bolletjes links en rechts (viewBox 100x150). */
function scallopRect(n: number) {
  const step = 150 / n;
  const r = step / 2;
  let d = "M12 0 H88";
  for (let i = 1; i <= n; i++) d += ` A ${r} ${r} 0 0 1 88 ${(i * step).toFixed(2)}`;
  d += " H12";
  for (let i = n - 1; i >= 0; i--) d += ` A ${r} ${r} 0 0 1 12 ${(i * step).toFixed(2)}`;
  return `${d} Z`;
}

/** Rond label met golvende rand (viewBox 100x100). */
function scallopCircle(n: number, R: number) {
  const pt = (k: number) => {
    const a = (k / n) * Math.PI * 2 - Math.PI / 2;
    return `${(50 + R * Math.cos(a)).toFixed(2)} ${(50 + R * Math.sin(a)).toFixed(2)}`;
  };
  const r = (R * Math.sin(Math.PI / n)).toFixed(2);
  let d = `M${pt(0)}`;
  for (let k = 1; k <= n; k++) d += ` A ${r} ${r} 0 0 1 ${pt(k)}`;
  return `${d} Z`;
}

const CARD_PATH = scallopRect(7);
const TAG_PATH = scallopCircle(14, 41);
const TAG_INNER = scallopCircle(14, 36);

export function SunsetEnvelope({ config, opening, onOpen }: Props) {
  const back = `color-mix(in srgb, ${col("envelope")} 84%, black)`;
  const flapOut = `color-mix(in srgb, ${col("surface")} 88%, white)`;
  const flapIn = `color-mix(in srgb, ${col("surface")} 80%, black)`;
  const at = (ms: number) => (opening ? `${ms}ms` : "0ms");

  return (
    <div className="absolute inset-0 z-30 overflow-hidden" style={{ perspective: "1600px", pointerEvents: opening ? "none" : "auto" }}>
      <div
        className="absolute inset-0"
        style={{ background: col("background"), backgroundImage: PAPER_NOISE, opacity: opening ? 0 : 1, transition: `opacity 500ms ease ${at(850)}` }}
      />

      {/* alles samen schuift aan het eind naar beneden weg */}
      <div
        className="absolute inset-x-[8%] top-[9%] bottom-[16%]"
        style={{ transform: opening ? "translateY(130%) rotate(-3deg)" : "rotate(-4deg)", transition: `transform 650ms ${EASE} ${at(850)}` }}
      >
        <div className="absolute inset-0 rounded-[0.5rem]" style={{ background: back, backgroundImage: PAPER_NOISE, boxShadow: "0 20px 34px -18px rgb(60 20 5 / .65)" }} />

        <div className="absolute inset-x-[9%] top-[7%] bottom-[7%]">
          {/* gescheiden kaart met golvende rand, steekt links uit de envelop */}
          <div
            className="absolute top-[12%] bottom-[3%] left-[-6%] w-[90%]"
            style={{ transform: opening ? "translateY(-13%)" : "none", transition: `transform 600ms ${EASE} ${at(420)}` }}
          >
            <svg viewBox="0 0 100 150" preserveAspectRatio="none" aria-hidden="true" className="absolute inset-0 h-full w-full overflow-visible" style={{ fill: col("surfaceAlt"), filter: "drop-shadow(0 6px 8px rgb(60 20 5 / .3))" }}>
              <path d={CARD_PATH} />
            </svg>
            <p className="absolute inset-x-[16%] top-[6%] text-center text-[1.5rem] leading-none" style={{ ...script, color: col("accent") }}>
              Wij gaan trouwen
            </p>
          </div>

          {/* envelop */}
          <div className="absolute top-[24%] right-0 bottom-[1%] left-[22%]" style={{ transformStyle: "preserve-3d" }}>
            <div className="absolute inset-0" style={{ background: col("surface"), backgroundImage: PAPER_NOISE, boxShadow: "0 12px 20px -12px rgb(60 20 5 / .5)" }} />
            <div
              className="absolute inset-x-0 top-0"
              style={{
                height: "36%",
                transformStyle: "preserve-3d",
                transformOrigin: "top",
                transform: opening ? "rotateX(180deg)" : "rotateX(0deg)",
                zIndex: opening ? 0 : 2,
                transition: `transform 600ms ${EASE} ${at(220)}, z-index 0s linear ${at(400)}`,
              }}
            >
              <div className="absolute inset-0" style={{ backfaceVisibility: "hidden", clipPath: "polygon(0 0, 100% 0, 50% 100%)", background: flapOut, backgroundImage: PAPER_NOISE, filter: "drop-shadow(0 4px 4px rgb(60 20 5 / .3))" }} />
              <div className="absolute inset-0" style={{ transform: "rotateX(180deg)", backfaceVisibility: "hidden", clipPath: "polygon(0 100%, 100% 100%, 50% 0)", background: flapIn }} />
            </div>
          </div>
        </div>

        {/* touwtje met label: valt eraf bij het openen */}
        <div
          className="pointer-events-none absolute inset-x-[-5%] top-[52%] z-[4]"
          style={{
            transform: opening ? "translateY(420%) rotate(16deg)" : "rotate(-7deg)",
            opacity: opening ? 0 : 1,
            transition: `transform 700ms cubic-bezier(.5,0,.9,.5) ${at(0)}, opacity 250ms ease ${at(450)}`,
          }}
        >
          <div className="h-[2px] w-full" style={{ background: "rgb(255 255 255 / .92)", boxShadow: "0 1px 2px rgb(60 20 5 / .35)" }} />
          <div className="absolute top-0 left-[48%] w-[8.6rem] -translate-x-1/2 -translate-y-1/2" style={{ filter: "drop-shadow(0 6px 6px rgb(60 20 5 / .35))" }}>
            <svg viewBox="0 0 100 100" aria-hidden="true" className="block w-full">
              <path d={TAG_PATH} fill="#fffaf2" />
              <path d={TAG_INNER} fill="none" stroke={`color-mix(in srgb, ${col("accent")} 80%, white)`} strokeWidth="0.8" />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center px-5 text-center">
              <span className="text-[0.4rem] tracking-[0.22em] uppercase" style={{ color: col("text") }}>
                Wij gaan trouwen
              </span>
              <span className="mt-1 text-[1.35rem] leading-[0.95]" style={{ ...script, color: col("accent") }}>
                {config.partner1}
                <span className="block text-[1rem]" style={{ color: col("text") }}>
                  &amp;
                </span>
                {config.partner2}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-[5%] z-[5] flex justify-center" style={{ opacity: opening ? 0 : 1, transition: "opacity 250ms ease" }}>
        <span
          className="inline-flex items-center px-6 py-3 text-[0.6rem] font-medium tracking-[0.18em] whitespace-nowrap uppercase"
          style={{ background: col("buttonBackground"), color: col("buttonText"), borderRadius: "var(--inv-radius)" }}
        >
          Tik om te openen
        </span>
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
