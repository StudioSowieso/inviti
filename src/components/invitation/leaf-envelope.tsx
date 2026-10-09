"use client";

import type { CSSProperties } from "react";
import type { InvitationConfig, ThemeColors } from "@/lib/invitation/types";
import { BranchArt, makeBranch } from "./leaf";

/**
 * Envelop voor het thema "leaf": de vouwen van de envelop zijn olijftakken. Vier takken lopen vanaf de
 * hoeken naar het midden en vormen samen de klep en de voorkant; in het midden zit een krans met de
 * initialen als zegel. Tik: de krans verdwijnt, de klep klapt open (met zijn takken) en de envelop
 * schuift omlaag.
 */

const col = (key: keyof ThemeColors) => `var(--inv-${key})`;
const heading = { fontFamily: "var(--inv-heading)" } satisfies CSSProperties;
const script = { fontFamily: "var(--inv-script)" } satisfies CSSProperties;

const FLAP = 52; // hoogte van de klep in % van het scherm
const EASE = "cubic-bezier(.6,0,.2,1)";

// Rechte, lange takken met bladeren aan beide kanten (viewBox -4 -40 320 80)
const EDGE_A = makeBranch(41, { len: 300, bow: 5, leaves: 20, leafLen: 27, olives: 3 });
const EDGE_B = makeBranch(58, { len: 300, bow: 4, leaves: 20, leafLen: 27, olives: 2 });
const EDGE_C = makeBranch(73, { len: 300, bow: 5, leaves: 20, leafLen: 27, olives: 3 });
const EDGE_D = makeBranch(86, { len: 300, bow: 4, leaves: 20, leafLen: 27, olives: 2 });
const WREATH = makeBranch(12, { len: 120, bow: 40, leaves: 11, leafLen: 17 });

type Corner = { x: "l" | "r"; y: "t" | "b"; data: typeof EDGE_A };

/** Een tak vanaf een hoek naar het midden van de envelop (het zegel). */
function Edge({ x, y, data }: Corner) {
  const dx = "50cqw";
  const dy = y === "t" ? `${FLAP}cqh` : `${100 - FLAP}cqh`;
  const sy = y === "t" ? 1 : -1;
  const angle = `atan2(${sy} * ${dy}, ${dx})`;
  const rot = x === "l" ? `calc(${angle})` : `calc(180deg - ${angle})`;
  return (
    <svg
      aria-hidden="true"
      viewBox="-4 -40 320 80"
      className="pointer-events-none absolute block"
      style={
        {
          "--d": `hypot(${dx}, ${dy})`,
          width: "calc(var(--d) * 1.04)",
          left: `calc(${x === "l" ? "0cqw" : "100cqw"} - var(--d) * 0.0125)`,
          top: `calc(${y === "t" ? "0cqh" : "100cqh"} - var(--d) * 0.13)`,
          transformOrigin: "1.2% 50%",
          transform: `rotate(${rot})`,
          color: `color-mix(in srgb, ${col("surface")} 92%, ${col("accent")})`,
          overflow: "visible",
        } as CSSProperties
      }
    >
      <BranchArt data={data} stemWidth={1.6} leafWidth={0.9} leafFill={26} oliveSize={6} />
    </svg>
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

type Props = { config: InvitationConfig; opening: boolean; onOpen: () => void };

export function LeafEnvelope({ config, opening, onOpen }: Props) {
  const base = col("envelope");
  const hair = "color-mix(in srgb, var(--inv-accent) 35%, transparent)";
  const initials = `${config.partner1.trim()[0] ?? ""}${config.partner2.trim()[0] ?? ""}`.toUpperCase();

  return (
    <div
      className="absolute inset-0 z-30 overflow-hidden"
      style={{ perspective: "1600px", containerType: "size", pointerEvents: opening ? "none" : "auto" }}
    >
      <div
        className="absolute inset-0"
        style={{
          transform: opening ? "translateY(165%)" : "none",
          transition: `transform 800ms ${EASE} ${opening ? "800ms" : "0ms"}`,
        }}
      >
        {/* Achterkant */}
        <div className="absolute inset-0" style={{ background: `color-mix(in srgb, ${base} 86%, black)` }} />

        {/* Voorkant */}
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(180deg, color-mix(in srgb, ${base} 92%, white), ${base} 50%, color-mix(in srgb, ${base} 93%, black))`,
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
          <path d={`M0 100 L50 ${FLAP - 2} L100 100`} vectorEffect="non-scaling-stroke" />
        </svg>

        {/* Takken langs de onderste vouwen */}
        <div className="pointer-events-none absolute inset-0 z-[1]">
          <Edge x="l" y="b" data={EDGE_C} />
          <Edge x="r" y="b" data={EDGE_D} />
        </div>

        {/* Namen op de voorkant, op een effen kaartje zodat ze goed leesbaar zijn */}
        <div
          className="pointer-events-none absolute inset-x-0 z-[2] flex flex-col items-center px-6 text-center"
          style={{ top: `${FLAP + 12}%`, opacity: opening ? 0 : 1, transition: "opacity 250ms ease" }}
        >
          <div
            className="flex w-full max-w-[17rem] flex-col items-center px-5 py-5"
            style={{
              background: col("surface"),
              borderRadius: "1.25rem",
              boxShadow: `0 0 0 1px ${hair}, 0 10px 24px rgb(0 0 0 / .16)`,
            }}
          >
            <p className="text-[1.9rem] leading-tight" style={{ ...script, color: col("text") }}>
              {config.partner1} &amp; {config.partner2}
            </p>
            <div className="mt-4">
              <Hint opening={opening} label="Tik om te openen" />
            </div>
          </div>
        </div>

        {/* Klep met zijn takken */}
        <div
          className="absolute inset-x-0 top-0"
          style={{
            height: `${FLAP}%`,
            transformStyle: "preserve-3d",
            transformOrigin: "top",
            transform: opening ? "rotateX(180deg)" : "rotateX(0deg)",
            zIndex: opening ? 1 : 3,
            transition: `transform 650ms ${EASE} ${opening ? "450ms" : "0ms"}, z-index 0s linear ${opening ? "800ms" : "0ms"}`,
          }}
        >
          <div
            className="absolute inset-0"
            style={{
              backfaceVisibility: "hidden",
              clipPath: "polygon(0 0, 100% 0, 50% 100%)",
              background: `linear-gradient(180deg, color-mix(in srgb, ${base} 84%, white), ${base})`,
            }}
          />
          <div className="absolute inset-0" style={{ backfaceVisibility: "hidden" }}>
            <svg
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 h-full w-full"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              fill="none"
              style={{ stroke: hair }}
            >
              <path d="M0 0 L50 100 L100 0" strokeWidth="1" vectorEffect="non-scaling-stroke" />
            </svg>
            <Edge x="l" y="t" data={EDGE_A} />
            <Edge x="r" y="t" data={EDGE_B} />
          </div>
          {/* binnenkant van de klep */}
          <div
            className="absolute inset-0"
            style={{
              transform: "rotateX(180deg)",
              backfaceVisibility: "hidden",
              clipPath: "polygon(0 100%, 100% 100%, 50% 0)",
              background: `color-mix(in srgb, ${base} 80%, black)`,
            }}
          />
        </div>
      </div>

      {/* Zegel: krans van twee takken om de initialen */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 z-[4]"
        style={{
          top: `${FLAP - 2}%`,
          width: "9.6rem",
          height: "9.6rem",
          marginLeft: "-4.8rem",
          marginTop: "-4.8rem",
          opacity: opening ? 0 : 1,
          transform: opening ? "scale(1.5)" : "none",
          transition: "opacity 420ms ease, transform 520ms ease",
          color: col("buttonBackground"),
        }}
      >
        <div
          className="absolute inset-[1.9rem] flex items-center justify-center rounded-full text-[1.3rem]"
          style={{
            ...heading,
            background: col("surface"),
            color: col("text"),
            boxShadow: `0 0 0 1px ${hair}, 0 8px 18px rgb(0 0 0 / .18)`,
          }}
        >
          {initials}
        </div>
        <svg viewBox="-20 -52 160 104" className="absolute inset-0 h-full w-full" style={{ overflow: "visible" }}>
          <g transform="translate(8 30) rotate(-70) scale(.95)">
            <BranchArt data={WREATH} stemWidth={2} leafWidth={1.1} leafFill={30} oliveSize={7} />
          </g>
          <g transform="translate(112 30) scale(-1 1) rotate(-70) scale(.95)">
            <BranchArt data={WREATH} stemWidth={2} leafWidth={1.1} leafFill={30} oliveSize={7} />
          </g>
        </svg>
      </div>

      <button
        type="button"
        onClick={onOpen}
        aria-label="Open de uitnodiging"
        className="absolute inset-0 z-[6] cursor-pointer"
        tabIndex={opening ? -1 : 0}
      />
    </div>
  );
}
