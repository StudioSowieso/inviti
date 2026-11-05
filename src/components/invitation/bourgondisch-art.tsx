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

/** Dunne arceringen en highlights: geven de lijntekeningen de schaduw van een pen-en-inkt schets. */
const Hatch = ({ children }: { children: ReactNode }) => (
  <g style={{ strokeWidth: "calc(var(--sw) * 0.6)" }} opacity={0.85}>
    {children}
  </g>
);

const ART: Record<DoodleKind, { vb: string; body: ReactNode }> = {
  lobster: {
    vb: "0 0 100 120",
    body: (
      <>
        {/* kop en borststuk */}
        <path d="M38 40C37 27 43 17 50 17C57 17 63 27 62 40C62 51 58 58 50 61C42 58 39 51 38 40Z" />
        <path d="M41 36C45 42 55 42 59 36" />
        <path d="M43 28C47 31 53 31 57 28" />
        <circle cx={44} cy={21} r={1.7} />
        <circle cx={56} cy={21} r={1.7} />
        {/* voelsprieten */}
        <path d="M46 17C38 9 27 6 15 5" />
        <path d="M54 17C62 9 73 6 85 5" />
        <path d="M48 16C46 10 44 6 41 1M52 16C54 10 56 6 59 1" />
        {/* scharen */}
        <path d="M39 36C30 34 23 31 19 25" />
        <path d="M22 29C10 26 4 14 10 4C14 11 19 12 23 8C29 14 29 24 22 29Z" />
        <path d="M18 24C14 20 12 14 14 9" />
        <path d="M61 36C70 34 77 31 81 25" />
        <path d="M78 29C90 26 96 14 90 4C86 11 81 12 77 8C71 14 71 24 78 29Z" />
        <path d="M82 24C86 20 88 14 86 9" />
        {/* pootjes */}
        <path d="M39 46 29 49 23 59 21 62M40 53 31 59 27 69 26 72" />
        <path d="M61 46 71 49 77 59 79 62M60 53 69 59 73 69 74 72" />
        {/* staart met geledingen en waaier */}
        <path d="M42 61C39 73 40 85 44 95" />
        <path d="M58 61C61 73 60 85 56 95" />
        <path d="M41 67C47 69 53 69 59 67M40 74C47 76 53 76 60 74M41 81C47 83 53 83 59 81M43 88C48 90 52 90 57 88" />
        <path d="M44 95C39 104 46 113 50 113C54 113 61 104 56 95" />
        <path d="M44 96C35 100 33 110 40 112M56 96C65 100 67 110 60 112" />
        <path d="M50 96V112" />
        <Hatch>
          <path d="M40 24 43 26M39 31 42 33M60 24 57 26M61 31 58 33" />
          <path d="M44 46 47 49M48 50 51 53M53 46 56 49M46 55 49 58" />
          <path d="M42 70 45 72M55 72 58 70M42 77 45 79M55 79 58 77M44 84 47 86M53 86 56 84" />
          <path d="M8 12 12 16M12 8 16 13M92 12 88 16M88 8 84 13" />
          <path d="M45 100 47 106M53 100 55 106" />
        </Hatch>
      </>
    ),
  },
  oyster: {
    vb: "0 0 64 52",
    body: (
      <>
        <path d="M7 31C3 17 14 5 29 5C37 4 45 7 50 13C57 20 58 30 51 37C45 46 30 49 19 45C13 43 8 38 7 31Z" />
        <path d="M11 29C12 19 21 12 31 12C39 12 45 17 47 24" />
        <path d="M14 34C18 29 24 26 32 27C38 28 43 31 46 34" />
        <path d="M19 40C25 36 33 35 41 37" />
        <path d="M20 22C24 18 30 18 35 20" />
        <path d="M45 14C48 17 50 21 50 26" />
        <path d="M7 31C9 36 12 39 16 41" />
        <Hatch>
          <path d="M41 40 44 37M38 43 42 39M34 45 39 41M30 46 35 42M46 33 49 30M49 28 52 25" />
          <path d="M15 17 18 15M12 22 15 19M26 9 30 8" />
        </Hatch>
      </>
    ),
  },
  grapes: {
    vb: "0 0 60 74",
    body: (
      <>
        <path d="M30 9C30 13 28 17 23 20" />
        <path d="M30 10C36 1 49 3 51 9C45 14 36 14 30 10Z" />
        <path d="M33 10C38 8 44 8 48 9M39 7C41 9 41 11 40 12" />
        {[[11, 23, 6.3], [23, 22, 6], [35, 22, 6.2], [47, 23, 6]].map(([x, y, r]) => (
          <circle key={`a${x}`} cx={x} cy={y} r={r} />
        ))}
        {[[17, 34, 6.2], [29, 34, 6.3], [41, 34, 6]].map(([x, y, r]) => (
          <circle key={`b${x}`} cx={x} cy={y} r={r} />
        ))}
        {[[23, 46, 6], [35, 46, 6.2]].map(([x, y, r]) => (
          <circle key={`c${x}`} cx={x} cy={y} r={r} />
        ))}
        <circle cx={29} cy={58} r={6} />
        <Hatch>
          <path d="M8 21C9 19 11 18 13 19M20 20C21 18 23 17 25 18M32 20C33 18 35 17 37 18M44 21C45 19 47 18 49 19" />
          <path d="M14 32C15 30 17 29 19 30M26 32C27 30 29 29 31 30M38 32C39 30 41 29 43 30M20 44C21 42 23 41 25 42M32 44C33 42 35 41 37 42M26 56C27 54 29 53 31 54" />
          <path d="M14 27 16 29M26 26 28 28M38 26 40 28M50 27 52 29M20 39 22 41M32 39 34 41M44 39 46 41M26 51 28 53M38 51 40 53M32 62 34 64" />
        </Hatch>
      </>
    ),
  },
  glass: {
    vb: "0 0 52 100",
    body: (
      <>
        <ellipse cx={26} cy={5} rx={16} ry={3.2} />
        <path d="M10 5C8 28 12 48 26 52C40 48 44 28 42 5" />
        <path d="M10.6 22C18 27 34 18 41.4 22" />
        <path d="M26 52V86" />
        <path d="M11 94C17 88 35 88 41 94C35 98 17 98 11 94Z" />
        <Hatch>
          <path d="M13 26 17 33M15 24 21 35M18 28 23 38M22 32 26 40M30 32 33 38M34 28 37 35M36 24 40 31M38 26 41 31M16 40 20 44M32 40 36 44M24 44 28 48" />
          <path d="M14 8C13 14 13 18 14 21" />
          <path d="M26 60V82" />
        </Hatch>
      </>
    ),
  },
  flutes: {
    vb: "0 -10 96 112",
    body: (
      <>
        <g transform="rotate(-14 35 92)">
          <path d="M26 8H44L42 46C41 56 29 56 28 46Z" />
          <path d="M26.6 22C31 25 39 19 43.4 22" />
          <path d="M35 54V86" />
          <path d="M26 92Q35 86 44 92Z" />
          <circle cx={34} cy={34} r={1.3} />
          <circle cx={38} cy={40} r={1} />
          <circle cx={33} cy={44} r={1.2} />
          <Hatch>
            <path d="M28 30 31 34M28 38 32 43M40 30 38 33M41 38 39 41" />
          </Hatch>
        </g>
        <g transform="rotate(14 62 92)">
          <path d="M53 8H71L69 46C68 56 56 56 55 46Z" />
          <path d="M53.6 22C58 25 66 19 70.4 22" />
          <path d="M62 54V86" />
          <path d="M53 92Q62 86 71 92Z" />
          <circle cx={61} cy={34} r={1.3} />
          <circle cx={65} cy={41} r={1} />
          <circle cx={60} cy={44} r={1.2} />
          <Hatch>
            <path d="M55 30 58 34M55 38 59 43M67 30 65 33M68 38 66 41" />
          </Hatch>
        </g>
        <path d="M49 -2V5M43 1 39 -3M55 1 59 -3M47 -8 49 -6M51 -8 53 -6" />
      </>
    ),
  },
  bottle: {
    vb: "0 0 44 124",
    body: (
      <>
        <path d="M17 6H27V36C27 46 36 54 36 68V118H8V68C8 54 17 46 17 36Z" />
        <path d="M14 4H30M15 8H29" />
        <path d="M17 16H27M17 26H27" />
        <path d="M9 78H35V104H9Z" />
        <circle cx={22} cy={90} r={6} />
        <path d="M22 85V95M17 90H27" />
        <path d="M12 112H32" />
        <Hatch>
          <path d="M18 10 20 14M22 10 24 14M18 19 20 23M22 19 24 23M18 29 20 34M22 29 24 34" />
          <path d="M29 56 32 62M30 66 33 72M12 58 11 66" />
          <path d="M11 82 14 80M11 87 14 85M30 82 33 80M30 98 33 96" />
          <path d="M31 108V114M26 108V114" />
        </Hatch>
      </>
    ),
  },
  candle: {
    vb: "0 0 40 100",
    body: (
      <>
        <path d="M20 3C27 12 27 19 20 24C13 19 13 12 20 3Z" />
        <path d="M20 8C23 12 23 16 20 19" />
        <path d="M16 26H24V48H16Z" />
        <path d="M24 30C26 33 26 36 24 38" />
        <path d="M10 48H30L26 56H14Z" />
        <path d="M20 56V82M15 68H25" />
        <path d="M17 74C17 78 23 78 23 74" />
        <path d="M8 94C10 84 30 84 32 94Z" />
        <Hatch>
          <path d="M17 28 19 31M17 35 19 38M17 42 19 45" />
          <path d="M12 50 14 54M16 50 18 54M22 50 24 54M26 50 28 54" />
          <path d="M12 92C14 88 26 88 28 92" />
        </Hatch>
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
        <path d="M15 100 20 110 25 100" />
        {/* greep en huls */}
        <path d="M12 98V90H28V98" />
        <path d="M11 90V34C11 22 29 22 29 34V90Z" />
        <path d="M11 44H29M11 48H29" />
        {/* clip */}
        <path d="M31 38V70" />
        <path d="M16 56V78" />
        <Hatch>
          <path d="M24 30V86M26 34V84" />
          <path d="M13 92 15 96M17 92 19 96M21 92 23 96M25 92 27 96" />
          <path d="M14 26C16 24 22 24 24 26" />
        </Hatch>
      </>
    ),
  },
  heart: {
    vb: "0 0 26 24",
    body: (
      <>
        <path d="M13 21C3 13 1 7 6 4C9 2.5 12 4 13 7C14 4 17 2.5 20 4C25 7 23 13 13 21Z" />
        <Hatch>
          <path d="M7 8 9 10M6 12 9 14M18 8 16 10" />
        </Hatch>
      </>
    ),
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
  const fid = useId();
  // Alle tekeningen krijgen op het scherm ongeveer dezelfde lijndikte, ongeacht hun eigen kijkvenster.
  const vbW = Number(art.vb.split(" ")[2]);
  const k = vbW / 100;
  return (
    <svg
      viewBox={art.vb}
      aria-hidden="true"
      className={className}
      fill="none"
      stroke={color ?? col("accent")}
      strokeWidth={+(1.55 * k).toFixed(2)}
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ width: w, height: "auto", overflow: "visible", ["--sw" as string]: +(1.55 * k).toFixed(2), ...style }}
    >
      {/* Pen-en-inkt: de lijnen trillen (turbulentie) en elke tekening wordt tweemaal getrokken, de tweede
          keer dunner en een tikje verschoven, zoals bij een snelle schets met de hand. */}
      <defs>
        <filter id={fid + "a"} x="-10%" y="-10%" width="120%" height="120%">
          <feTurbulence type="fractalNoise" baseFrequency={+(0.05 / k).toFixed(3)} numOctaves="3" seed="4" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale={+(3.4 * k).toFixed(2)} xChannelSelector="R" yChannelSelector="G" />
        </filter>
        <filter id={fid + "b"} x="-10%" y="-10%" width="120%" height="120%">
          <feTurbulence type="fractalNoise" baseFrequency={+(0.06 / k).toFixed(3)} numOctaves="3" seed="11" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale={+(3 * k).toFixed(2)} xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </defs>
      <g filter={`url(#${fid}a)`}>{art.body}</g>
      <g
        filter={`url(#${fid}b)`}
        opacity={0.5}
        transform={`translate(${+(0.5 * k).toFixed(2)} ${+(0.4 * k).toFixed(2)})`}
        style={{ ["--sw" as string]: +(0.9 * k).toFixed(2), strokeWidth: +(0.9 * k).toFixed(2) }}
      >
        {art.body}
      </g>
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
