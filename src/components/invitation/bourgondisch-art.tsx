"use client";

import { useId, type CSSProperties, type ReactNode } from "react";
import type { ThemeColors } from "@/lib/invitation/types";

/**
 * Getekend decor voor het thema "bourgondisch": olijfgroene lijntekeningen (kreeft, oester, druiven, glazen,
 * fles, kandelaar, vulpen) op een gestreept papier, plus een kaart met een wiebelige, handgetekende rand.
 * Alle kleuren komen uit het thema (accent voor de lijnen, surface en background voor het papier).
 */

const col = (key: keyof ThemeColors) => `var(--inv-${key})`;

export type DoodleKind = "lobster" | "oyster" | "grapes" | "glass" | "flutes" | "bottle" | "candle" | "pen" | "heart";

const ART: Record<DoodleKind, { vb: string; body: ReactNode }> = {
  lobster: {
    vb: "0 0 100 120",
    body: (
      <>
        {/* kop en borststuk */}
        <path d="M38 40C38 26 44 18 50 18C56 18 62 26 62 40C62 50 58 58 50 60C42 58 38 50 38 40Z" />
        <path d="M42 37C46 41 54 41 58 37" />
        <circle cx={44} cy={21} r={1.6} />
        <circle cx={56} cy={21} r={1.6} />
        {/* voelsprieten */}
        <path d="M46 18C38 10 28 6 16 5" />
        <path d="M54 18C62 10 72 6 84 5" />
        <path d="M48 17C46 10 44 6 42 1M52 17C54 10 56 6 58 1" />
        {/* scharen */}
        <path d="M39 36C30 34 23 31 19 25" />
        <path d="M21 28C10 25 5 14 10 5C14 12 20 12 23 8C28 14 28 23 21 28Z" />
        <path d="M61 36C70 34 77 31 81 25" />
        <path d="M79 28C90 25 95 14 90 5C86 12 80 12 77 8C72 14 72 23 79 28Z" />
        {/* pootjes */}
        <path d="M39 46 29 50 24 59M40 53 31 59 28 68" />
        <path d="M61 46 71 50 76 59M60 53 69 59 72 68" />
        {/* staart met geledingen en waaier */}
        <path d="M42 60C40 72 40 84 44 94" />
        <path d="M58 60C60 72 60 84 56 94" />
        <path d="M42 67H58M41 74H59M41 81H59M43 88H57" />
        <path d="M44 94C40 104 46 112 50 112C54 112 60 104 56 94" />
        <path d="M44 95C36 99 34 109 40 111M56 95C64 99 66 109 60 111" />
        <path d="M50 96V111" />
      </>
    ),
  },
  oyster: {
    vb: "0 0 64 52",
    body: (
      <>
        <path d="M6 30C4 14 20 4 34 6C50 8 58 20 52 34C46 46 24 48 12 42C8 40 6 36 6 30Z" />
        <path d="M14 28C16 18 26 12 36 14" />
        <path d="M18 37C24 41 36 39 45 31" />
        <path d="M22 23C28 19 36 21 40 25" />
        <path d="M44 14C47 17 49 21 49 25" />
      </>
    ),
  },
  grapes: {
    vb: "0 0 60 74",
    body: (
      <>
        <path d="M30 8C30 12 28 16 24 18" />
        <path d="M30 9C36 1 48 3 50 9C44 13 36 13 30 9Z" />
        <path d="M33 9C38 7 44 8 47 9" />
        {[12, 24, 36, 48].map((x) => (
          <circle key={`a${x}`} cx={x} cy={22} r={6} />
        ))}
        {[18, 30, 42].map((x) => (
          <circle key={`b${x}`} cx={x} cy={34} r={6} />
        ))}
        {[24, 36].map((x) => (
          <circle key={`c${x}`} cx={x} cy={46} r={6} />
        ))}
        <circle cx={30} cy={58} r={6} />
        <path d="M9 20C10 18 12 17 14 18M21 32C22 30 24 29 26 30M33 44C34 42 36 41 38 42" />
      </>
    ),
  },
  glass: {
    vb: "0 0 52 100",
    body: (
      <>
        <path d="M10 4H42C44 28 40 48 26 52C12 48 8 28 10 4Z" />
        <path d="M10.8 20C18 24 34 16 41.2 20" />
        <path d="M13 31C20 34 32 30 39 31" />
        <path d="M26 52V86" />
        <path d="M12 94C18 88 34 88 40 94Z" />
      </>
    ),
  },
  flutes: {
    vb: "0 -10 96 112",
    body: (
      <>
        <g transform="rotate(-14 35 92)">
          <path d="M26 8H44L42 46C41 56 29 56 28 46Z" />
          <path d="M26.6 24H43.4" />
          <path d="M35 54V86" />
          <path d="M26 92Q35 86 44 92Z" />
        </g>
        <g transform="rotate(14 62 92)">
          <path d="M53 8H71L69 46C68 56 56 56 55 46Z" />
          <path d="M53.6 24H70.4" />
          <path d="M62 54V86" />
          <path d="M53 92Q62 86 71 92Z" />
        </g>
        <path d="M49 -2V5M43 1 39 -3M55 1 59 -3M47 -8 49 -6" />
      </>
    ),
  },
  bottle: {
    vb: "0 0 44 124",
    body: (
      <>
        <path d="M17 6H27V36C27 46 36 54 36 68V118H8V68C8 54 17 46 17 36Z" />
        <path d="M14 4H30" />
        <path d="M17 16H27M17 26H27" />
        <path d="M8 78H36V104H8" />
        <circle cx={22} cy={90} r={6} /><path d="M22 85V95M17 90H27" />
        <path d="M12 112H32" />
      </>
    ),
  },
  candle: {
    vb: "0 0 40 100",
    body: (
      <>
        <path d="M20 3C27 12 27 19 20 24C13 19 13 12 20 3Z" />
        <path d="M16 26H24V48H16Z" />
        <path d="M10 48H30L26 56H14Z" />
        <path d="M20 56V82M15 68H25" />
        <path d="M8 94C10 84 30 84 32 94Z" />
      </>
    ),
  },
  pen: {
    vb: "0 0 40 124",
    body: (
      <>
        {/* punt */}
        <path d="M20 121 12 98H28Z" />
        <path d="M20 121V106" />
        <circle cx={20} cy={104} r={1.8} />
        {/* greep en huls */}
        <path d="M12 98V90H28V98" />
        <path d="M11 90V34C11 22 29 22 29 34V90Z" />
        <path d="M11 44H29" />
        {/* clip */}
        <path d="M31 38V70" />
        <path d="M16 56V78" />
      </>
    ),
  },
  heart: {
    vb: "0 0 26 24",
    body: <path d="M13 21C3 13 1 7 6 4C9 2.5 12 4 13 7C14 4 17 2.5 20 4C25 7 23 13 13 21Z" />,
  },
};

/** Een enkele lijntekening. `w` is een CSS-breedte (bijvoorbeeld "30cqw"); de hoogte volgt vanzelf. */
export function Doodle({
  kind,
  w,
  color,
  className = "",
  style,
}: {
  kind: DoodleKind;
  w: string;
  color?: string;
  className?: string;
  style?: CSSProperties;
}) {
  const art = ART[kind];
  return (
    <svg
      viewBox={art.vb}
      aria-hidden="true"
      className={className}
      fill="none"
      stroke={color ?? col("accent")}
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ width: w, height: "auto", overflow: "visible", ...style }}
    >
      {art.body}
    </svg>
  );
}

/**
 * Het gestreepte papier: onregelmatige, wat verwassen strepen in de oppervlaktekleur op de achtergrond.
 * Een SVG-patroon, zodat de strepen niet strak lopen maar handgeschilderd ogen.
 */
export function BourgStripes({ className = "", style }: { className?: string; style?: CSSProperties }) {
  const id = useId();
  return (
    <svg aria-hidden="true" className={className} style={{ background: col("background"), ...style }} width="100%" height="100%">
      <defs>
        <pattern id={id} width="86" height="420" patternUnits="userSpaceOnUse">
          <path d="M8 0C11 80 5 160 9 240C12 320 6 370 8 420L30 420C27 370 33 320 29 240C26 160 32 80 30 0Z" fill={col("surface")} opacity=".82" />
          <path d="M35 0C37 120 33 250 35 420L40 420C38 250 41 120 40 0Z" fill={col("surfaceAlt")} opacity=".7" />
          <path d="M52 0C55 70 49 150 53 230C57 310 51 370 52 420L68 420C69 370 72 310 69 230C66 150 70 70 68 0Z" fill={col("surface")} opacity=".7" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  );
}

/** Een krul die uit de hoek van de rand komt; `corner` bepaalt de spiegeling. */
function Curl({ corner }: { corner: "tl" | "tr" | "bl" | "br" }) {
  const pos: CSSProperties =
    corner === "tl"
      ? { left: "-1.15rem", top: "-1.15rem" }
      : corner === "tr"
        ? { right: "-1.15rem", top: "-1.15rem", transform: "scaleX(-1)" }
        : corner === "bl"
          ? { left: "-1.15rem", bottom: "-1.15rem", transform: "scaleY(-1)" }
          : { right: "-1.15rem", bottom: "-1.15rem", transform: "scale(-1,-1)" };
  return (
    <svg
      viewBox="0 0 40 40"
      aria-hidden="true"
      fill="none"
      stroke={col("accent")}
      strokeWidth={1.9}
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ position: "absolute", pointerEvents: "none", width: "2.1rem", height: "2.1rem", overflow: "visible", ...pos }}
    >
      <path d="M2 38C2 20 14 10 26 12C34 14 36 24 28 26C20 28 18 18 24 14C30 10 38 8 40 2" />
    </svg>
  );
}

/** Onregelmatige hoeken: de kaart ziet er met de hand getekend uit in plaats van met een liniaal. */
export const WOBBLE = "1.7rem 1.1rem 1.9rem 1.2rem / 1.2rem 1.8rem 1.1rem 1.7rem";

/** De kaart met wiebelige olijfgroene rand, een lichte halo en krulletjes in de hoeken. */
export function BourgCard({
  children,
  className = "",
  style,
  tone = "light",
  curls = true,
}: {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  /** "light" = crème kaart met groene rand; "olive" = groene kaart (afsluiting). */
  tone?: "light" | "olive";
  curls?: boolean;
}) {
  const olive = tone === "olive";
  return (
    <div
      className={className}
      style={{
        position: "relative",
        background: olive ? col("footerBackground") : col("surface"),
        color: olive ? col("footerText") : col("text"),
        border: `2.5px solid ${olive ? col("footerText") : col("accent")}`,
        borderRadius: WOBBLE,
        boxShadow: `0 0 0 0.42rem ${col("surface")}`,
        ...style,
      }}
    >
      {curls && (
        <>
          <Curl corner="tl" />
          <Curl corner="tr" />
          <Curl corner="bl" />
          <Curl corner="br" />
        </>
      )}
      {children}
    </div>
  );
}
