"use client";

import { useId, type CSSProperties } from "react";
import { formatDateDots, monogram } from "@/lib/invitation/format";
import type { InvitationConfig } from "@/lib/invitation/types";
import { NaturePhoto, PAPER_NOISE, Sprig } from "./nature";

/**
 * Envelop-animatie van het thema "nature": een penseelstreken-achtergrond als gips, een
 * olijfgroene envelop met geschulpte flap, een reliëf-monogram en een calla-lelie als zegel.
 * Bij het openen klapt de flap open en komt er een hartvormige kaart met fotostrips uit.
 */

const col = (key: string) => `var(--inv-${key})`;
const script = { fontFamily: "var(--inv-script)" } satisfies CSSProperties;
const ease = "cubic-bezier(.6,0,.2,1)";

// Envelop in verhouding 100 : 64,5; de flap reikt tot 38/64,5 van de hoogte.
const ENV_H = 64.5;
const FLAP_H = 38;
const SCALLOPS = 7;

/** Flap met geschulpte (golvende) randen langs de twee schuine zijden. */
function flapPath() {
  const chord = Math.hypot(50, FLAP_H) / SCALLOPS;
  const r = (chord * 0.56).toFixed(2);
  const along = (from: [number, number], to: [number, number]) =>
    Array.from({ length: SCALLOPS }, (_, i) => {
      const t = (i + 1) / SCALLOPS;
      return `A${r} ${r} 0 0 1 ${(from[0] + (to[0] - from[0]) * t).toFixed(2)} ${(from[1] + (to[1] - from[1]) * t).toFixed(2)}`;
    }).join(" ");
  return `M0 0H100 ${along([100, 0], [50, FLAP_H])} ${along([50, FLAP_H], [0, 0])}Z`;
}
const FLAP_D = flapPath();

const HEART =
  "M50 88C18 62 4 44 4 28C4 14 15 5 28 5C38 5 46 10 50 18C54 10 62 5 72 5C85 5 96 14 96 28C96 44 82 62 50 88Z";

/** Gipsachtige penseelstreken in crème en beige, met reliëf. */
function PlasterBackground({ id }: { id: string }) {
  const strokes = [
    { d: "M-30 128C80 68 190 158 350 78", w: 62, c: "#ece4d5" },
    { d: "M-30 206C110 166 230 236 350 176", w: 44, c: "#fcfaf5" },
    { d: "M-30 468C100 424 230 500 350 436", w: 70, c: "#e9e0d0" },
    { d: "M-30 528C110 494 240 548 350 508", w: 40, c: "#fdfbf7" },
  ];
  return (
    <svg
      aria-hidden="true"
      className="absolute inset-0 h-full w-full"
      viewBox="0 0 320 560"
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <filter id={`rough${id}`} x="-10%" y="-10%" width="120%" height="120%">
          <feTurbulence type="fractalNoise" baseFrequency="0.03 0.14" numOctaves="3" seed="5" result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale="10" xChannelSelector="R" yChannelSelector="G" />
        </filter>
        <filter id={`relief${id}`} x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.018 0.05" numOctaves="4" seed="9" result="t" />
          <feDiffuseLighting in="t" lightingColor="#ffffff" surfaceScale="2.4" diffuseConstant="1.05">
            <feDistantLight azimuth="235" elevation="68" />
          </feDiffuseLighting>
        </filter>
      </defs>
      <rect width="320" height="560" style={{ fill: col("background") }} />
      <g filter={`url(#rough${id})`} fill="none" strokeLinecap="round">
        {strokes.map((s, i) => (
          <g key={i}>
            <path d={s.d} stroke="#a89c86" strokeOpacity=".16" strokeWidth={s.w + 3} transform="translate(0 5)" />
            <path d={s.d} stroke={s.c} strokeWidth={s.w} />
          </g>
        ))}
      </g>
      <rect
        width="320"
        height="560"
        filter={`url(#relief${id})`}
        opacity=".4"
        style={{ mixBlendMode: "multiply" }}
      />
    </svg>
  );
}

/** Calla-lelie die als zegel op de punt van de flap ligt. */
function Lily({ id }: { id: string }) {
  return (
    <svg viewBox="0 0 40 66" className="block w-full" aria-hidden="true">
      <defs>
        <linearGradient id={`lily${id}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fffdf7" />
          <stop offset="1" stopColor="#e6dcc2" />
        </linearGradient>
      </defs>
      <path d="M21 56C18 58 20 62 19 65" fill="none" stroke="#8b9267" strokeWidth="1.4" strokeLinecap="round" />
      <path
        d="M21 56C19 45 8 37 6 21C5 13 9 6 13 4C14 11 20 15 26 13C32 11 34 7 34 5C38 15 36 29 30 39C26 46 22 50 21 56Z"
        fill={`url(#lily${id})`}
        stroke="#cdbf9f"
        strokeWidth=".6"
        strokeLinejoin="round"
      />
      <path d="M13 4C16 17 22 25 26 37" fill="none" stroke="#d8cdb0" strokeWidth=".6" />
      <ellipse cx="23.5" cy="19" rx="2.1" ry="8" fill="#e4c158" transform="rotate(10 23.5 19)" />
    </svg>
  );
}

export function NatureEnvelope({
  config,
  opening,
  onOpen,
}: {
  config: InvitationConfig;
  opening: boolean;
  onOpen: () => void;
}) {
  const id = useId().replace(/:/g, "");
  const short = monogram(config.partner1, config.partner2, " ");
  const pair = monogram(config.partner1, config.partner2, " & ");
  const move = (delay: number) => `transform 700ms ${ease} ${delay}ms`;

  return (
    <div
      className="absolute inset-0 z-30 flex flex-col items-center overflow-hidden px-6 py-10 text-center"
      style={{
        opacity: opening ? 0 : 1,
        transition: `opacity 600ms ${ease} ${opening ? "850ms" : "0ms"}`,
        pointerEvents: opening ? "none" : "auto",
      }}
    >
      <PlasterBackground id={id} />

      <div className="relative">
        <p className="text-[0.52rem] tracking-[0.3em] uppercase" style={{ color: col("muted") }}>
          Een liefdesbrief van
        </p>
        <p className="mt-1.5 text-[1.8rem] leading-[1.1]" style={{ ...script, color: col("text") }}>
          {config.partner1} &amp; {config.partner2}
        </p>
      </div>

      <button
        type="button"
        onClick={onOpen}
        aria-label="Open de uitnodiging"
        className="relative my-auto w-[78%] max-w-sm"
        style={{ perspective: "900px", aspectRatio: `100 / ${ENV_H}` }}
      >
        {/* Achterkant van de envelop */}
        <span
          className="absolute inset-0"
          style={{
            background: `color-mix(in srgb, ${col("envelope")} 78%, black)`,
            borderRadius: "3px",
            boxShadow: "0 24px 40px -22px rgb(40 36 20 / 0.55)",
          }}
        />

        {/* Fotostrips */}
        {[
          { left: "15%", rot: -7, tone: "warm" as const, delay: 420 },
          { left: "60%", rot: 6, tone: "soft" as const, delay: 480 },
        ].map((s, i) => (
          <span
            key={i}
            className="absolute flex flex-col gap-[3%] p-[1.6%]"
            style={{
              left: s.left,
              top: "13%",
              width: "25%",
              height: "64%",
              background: "#fbf9f4",
              zIndex: 2,
              boxShadow: "0 3px 8px -3px rgb(0 0 0 / 0.35)",
              transform: opening ? `translateY(-62%) rotate(${s.rot}deg)` : "translateY(0) rotate(0deg)",
              transition: move(s.delay),
            }}
          >
            {[0, 1].map((n) => (
              <span key={n} className="relative flex-1 overflow-hidden">
                <NaturePhoto tone={n === 0 ? s.tone : s.tone === "warm" ? "soft" : "warm"} />
              </span>
            ))}
          </span>
        ))}

        {/* Hartvormige kaart */}
        <span
          className="absolute left-1/2 grid place-items-center text-center"
          style={{
            top: "22%",
            width: "46%",
            aspectRatio: "100 / 92",
            zIndex: 3,
            transform: opening
              ? "translate(-50%, -80%) scale(1.06) rotate(-3deg)"
              : "translate(-50%, 0) scale(1) rotate(0deg)",
            transition: move(opening ? 350 : 0),
          }}
        >
          <svg viewBox="0 0 100 92" className="absolute inset-0 h-full w-full overflow-visible" aria-hidden="true">
            <path
              d={HEART}
              fill="none"
              strokeWidth="5"
              strokeDasharray="0 6.3"
              strokeLinecap="round"
              style={{ stroke: col("envelopeCard") }}
            />
            <path d={HEART} style={{ fill: col("envelopeCard") }} />
            <path
              d={HEART}
              transform="translate(50 46) scale(.84) translate(-50 -46)"
              fill="none"
              strokeWidth=".6"
              strokeDasharray="1.6 1.8"
              opacity=".7"
              style={{ stroke: col("accent") }}
            />
          </svg>
          <span className="relative -mt-1">
            <span className="block text-[1.5rem] leading-none" style={{ ...script, color: col("envelope") }}>
              {pair}
            </span>
            <span className="mt-1.5 block text-[0.42rem] tracking-[0.24em]" style={{ color: col("muted") }}>
              {formatDateDots(config.date)}
            </span>
          </span>
        </span>

        {/* Voorkant (zak) met V-vormige rand */}
        <span
          className="absolute inset-0"
          style={{
            zIndex: 4,
            background: col("envelope"),
            backgroundImage: PAPER_NOISE,
            clipPath: "polygon(0 0, 50% 52%, 100% 0, 100% 100%, 0 100%)",
            borderRadius: "3px",
          }}
        />
        <svg
          className="absolute inset-0 h-full w-full"
          style={{ zIndex: 4 }}
          viewBox={`0 0 100 ${ENV_H}`}
          preserveAspectRatio="none"
          fill="none"
          aria-hidden="true"
        >
          <path d={`M0 ${ENV_H}L36 30M100 ${ENV_H}L64 30`} stroke="rgb(0 0 0 / .13)" strokeWidth=".4" />
          <path d="M0 0L50 33.5L100 0" stroke="rgb(255 255 255 / .22)" strokeWidth=".5" />
        </svg>

        {/* Flap met geschulpte rand, monogram en lelie */}
        <span
          className="absolute inset-x-0 top-0"
          style={{
            height: `${((FLAP_H / ENV_H) * 100).toFixed(2)}%`,
            zIndex: opening ? 1 : 5,
            transformOrigin: "top",
            transformStyle: "preserve-3d",
            transform: opening ? "rotateX(180deg)" : "rotateX(0deg)",
            // De flap valt halverwege het openen achter de kaart.
            transition: `transform 700ms ${ease}, z-index 0s linear 320ms`,
          }}
        >
          <svg
            viewBox={`0 0 100 ${FLAP_H}`}
            preserveAspectRatio="none"
            className="absolute inset-0 h-full w-full overflow-visible"
            style={{ filter: "drop-shadow(0 3px 3px rgb(30 30 10 / 0.3))" }}
            aria-hidden="true"
          >
            <path d={FLAP_D} style={{ fill: `color-mix(in srgb, ${col("envelope")} 90%, white)` }} />
          </svg>
          <span
            className="absolute top-[22%] left-1/2 -translate-x-1/2 text-[2rem] leading-none tracking-[0.06em] whitespace-nowrap"
            style={{
              ...script,
              backfaceVisibility: "hidden",
              color: `color-mix(in srgb, ${col("envelopeCard")} 78%, ${col("envelope")})`,
              textShadow: "0 1px 0 rgb(255 255 255 / .3), 0 -1px 0 rgb(0 0 0 / .28)",
            }}
          >
            {short}
          </span>
          <span
            className="absolute"
            style={{
              left: "50%",
              bottom: "-18%",
              width: "15%",
              transform: "translateX(-35%) rotate(-18deg)",
              backfaceVisibility: "hidden",
              filter: "drop-shadow(0 2px 2px rgb(0 0 0 / .25))",
            }}
          >
            <Lily id={id} />
          </span>
        </span>
      </button>

      <div className="relative flex flex-col items-center gap-2.5">
        <span style={{ color: col("accent") }}>
          <Sprig size={26} />
        </span>
        <button
          type="button"
          onClick={onOpen}
          className="text-[0.56rem] tracking-[0.32em] uppercase"
          style={{ color: col("muted") }}
        >
          Open de uitnodiging
        </button>
      </div>
    </div>
  );
}
