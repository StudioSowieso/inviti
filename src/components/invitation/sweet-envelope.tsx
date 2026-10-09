"use client";

import type { CSSProperties } from "react";
import type { InvitationConfig, ThemeColors } from "@/lib/invitation/types";
import { Bow, SWEET_STRIPES } from "./sweet";

/**
 * Animaties voor het thema "sweet":
 * - SweetEnvelope: een grote envelop over het hele scherm, helemaal in het streepjesbehang van het thema.
 *   De klep klapt open en de envelop schuift omlaag.
 * - SweetReveal ("Doorkijk"): het behang bestaat uit losse strepen die om en om omhoog en omlaag
 *   openschuiven, waarna de uitnodiging zichtbaar wordt.
 */

const col = (key: keyof ThemeColors) => `var(--inv-${key})`;
const heading = { fontFamily: "var(--inv-heading)", fontWeight: 400 } satisfies CSSProperties;
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

/** Een kleine kaart met dubbele rand voor namen en knop. */
function NameCard({ config, opening, label }: { config: InvitationConfig; opening: boolean; label: string }) {
  return (
    <div style={{ background: col("surface"), padding: "0.45rem", borderRadius: "0.9rem", boxShadow: "0 12px 24px -14px rgb(30 50 40 / .5)" }}>
      <div
        className="px-5 py-5 text-center"
        style={{ border: `0.28rem solid ${col("surfaceAlt")}`, borderRadius: "0.6rem", background: col("surface") }}
      >
        <p className="text-[0.78rem] tracking-[0.3em] uppercase" style={{ color: col("text") }}>
          {config.partner1} &amp; {config.partner2}
        </p>
        <p className="mt-1 text-[1.9rem] leading-none" style={{ ...script, color: col("text") }}>
          Wij gaan trouwen
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
      </div>
    </div>
  );
}

// ---------- Envelop in streepjes ----------

export function SweetEnvelope({ config, opening, onOpen }: Props) {
  const hair = `color-mix(in srgb, ${col("surface")} 90%, transparent)`;

  return (
    <div
      className="absolute inset-0 z-30 overflow-hidden"
      style={{ perspective: "1600px", pointerEvents: opening ? "none" : "auto" }}
    >
      <div
        className="absolute inset-0"
        style={{
          transform: opening ? "translateY(104%)" : "none",
          transition: `transform 700ms ${EASE} ${opening ? "520ms" : "0ms"}`,
        }}
      >
        {/* Achterkant */}
        <div className="absolute inset-0" style={SWEET_STRIPES} />

        {/* Voorkant met vouwlijnen; iets donkerder dan de klep, zodat de vouwen leesbaar blijven */}
        <div className="absolute inset-0" style={{ clipPath: `polygon(0 0, 50% ${FLAP - 2}%, 100% 0, 100% 100%, 0 100%)` }}>
          <div className="absolute inset-0" style={SWEET_STRIPES} />
          <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgb(255 255 255 / .12), rgb(20 40 30 / .1))" }} />
        </div>
        <svg
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 h-full w-full"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          fill="none"
          style={{ stroke: hair }}
          strokeWidth="2"
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
            filter: "drop-shadow(0 6px 6px rgb(20 40 30 / .22))",
          }}
        >
          {/* buitenkant van de klep: ook gestreept, met een lichte rand */}
          <div className="absolute inset-0" style={{ backfaceVisibility: "hidden", clipPath: "polygon(0 0, 100% 0, 50% 100%)" }}>
            <div className="absolute inset-0" style={{ ...SWEET_STRIPES, backgroundPosition: "center top" }} />
            <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgb(255 255 255 / .28), rgb(255 255 255 / 0) 70%)" }} />
          </div>
          <svg
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 h-full w-full"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            fill="none"
            style={{ stroke: col("surface"), backfaceVisibility: "hidden" }}
          >
            <path d="M0 0 L50 100 L100 0" strokeWidth="3" vectorEffect="non-scaling-stroke" />
          </svg>
          {/* zegel: een strik op een witte schijf */}
          <span
            className="absolute left-1/2 grid size-[4.8rem] -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full"
            style={{
              top: "calc(100% - 1.6rem)",
              background: col("surface"),
              backfaceVisibility: "hidden",
              boxShadow: `0 0 0 0.3rem ${col("surfaceAlt")}, 0 10px 20px -8px rgb(20 40 30 / .45)`,
            }}
          >
            <Bow size={32} />
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

// ---------- Doorkijk: strepen die opengaan ----------

const COLUMNS = 9;

export function SweetReveal({ config, opening, onOpen }: Props) {
  const mid = (COLUMNS - 1) / 2;
  return (
    <div className="absolute inset-0 z-30 overflow-hidden" style={{ containerType: "inline-size", pointerEvents: opening ? "none" : "auto" }}>
      {/* Het behang als losse stroken: om en om schuiven ze omhoog en omlaag weg, vanuit het midden */}
      <div className="absolute inset-0 flex">
        {Array.from({ length: COLUMNS }, (_, i) => {
          const dir = i % 2 === 0 ? -1 : 1;
          const delay = Math.abs(i - mid) * 70;
          return (
            <div
              key={i}
              className="relative h-full flex-1"
              style={{
                background: col("background"),
                transform: opening ? `translateY(${dir * 104}%)` : "none",
                transition: `transform 900ms cubic-bezier(.65,0,.3,1) ${opening ? delay + 150 : 0}ms`,
                // de strepen zelf: drie groene lijnen met crème ertussen, in het midden van elke strook
                backgroundImage: `linear-gradient(90deg,
                  transparent 0 calc(50% - 0.62rem),
                  ${col("surface")} calc(50% - 0.62rem) calc(50% - 0.54rem),
                  ${col("accent")} calc(50% - 0.54rem) calc(50% - 0.34rem),
                  ${col("surface")} calc(50% - 0.34rem) calc(50% - 0.26rem),
                  ${col("accent")} calc(50% - 0.26rem) calc(50% + 0.26rem),
                  ${col("surface")} calc(50% + 0.26rem) calc(50% + 0.34rem),
                  ${col("accent")} calc(50% + 0.34rem) calc(50% + 0.54rem),
                  ${col("surface")} calc(50% + 0.54rem) calc(50% + 0.62rem),
                  transparent calc(50% + 0.62rem) 100%)`,
                boxShadow: opening ? `0 0 0 1px ${col("line")}` : undefined,
              }}
            />
          );
        })}
      </div>

      {/* Boogkaart met de namen */}
      <div
        className="pointer-events-none absolute inset-0 z-[4] flex items-center justify-center"
        style={{
          opacity: opening ? 0 : 1,
          transform: opening ? "scale(0.94)" : "none",
          transition: "opacity 420ms ease, transform 600ms ease",
        }}
      >
        <div
          style={{
            width: "74cqw",
            background: col("surface"),
            padding: "0.7rem",
            borderRadius: "50% 50% 0.7rem 0.7rem / 37cqw 37cqw 0.7rem 0.7rem",
            boxShadow: "0 18px 30px -18px rgb(30 50 40 / .55)",
          }}
        >
          <div
            className="px-5 pt-[16cqw] pb-9 text-center"
            style={{
              border: `0.4rem solid ${col("surfaceAlt")}`,
              borderRadius: "50% 50% 0.3rem 0.3rem / calc(37cqw - 0.7rem) calc(37cqw - 0.7rem) 0.3rem 0.3rem",
            }}
          >
            <Bow size={34} className="mx-auto" />
            <p className="mt-4 text-[0.8rem] tracking-[0.3em] uppercase" style={{ ...heading, color: col("text") }}>
              {config.partner1}
            </p>
            <p className="text-[0.8rem] tracking-[0.3em]" style={{ color: col("accent") }}>
              &amp;
            </p>
            <p className="text-[0.8rem] tracking-[0.3em] uppercase" style={{ ...heading, color: col("text") }}>
              {config.partner2}
            </p>
            <p className="mt-2 text-[1.9rem] leading-none" style={{ ...script, color: col("text") }}>
              Wij gaan trouwen
            </p>
            <span
              className="mt-5 inline-flex items-center px-6 py-2.5 text-[0.58rem] font-medium tracking-[0.22em] whitespace-nowrap uppercase"
              style={{ background: col("buttonBackground"), color: col("buttonText"), borderRadius: "var(--inv-radius)" }}
            >
              Ga naar binnen
            </span>
          </div>
        </div>
      </div>
      <TapArea opening={opening} onOpen={onOpen} />
    </div>
  );
}
