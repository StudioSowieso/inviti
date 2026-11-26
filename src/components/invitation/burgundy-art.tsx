"use client";

import { useId, type CSSProperties, type ReactNode } from "react";
import type { ThemeColors } from "@/lib/invitation/types";

/**
 * Decor voor het thema "burgundy": poederblauw papier met bordeaux strepen, een kaart met golvende rand
 * (zoals een ouderwets etiket) en typemachinetekst. Alle kleuren komen uit het thema:
 * text = bordeaux, background = poederblauw, surface = crème, footerBackground = diepste bordeaux.
 */

const col = (key: keyof ThemeColors) => `var(--inv-${key})`;

/** Verticale strepen in bordeaux en poederblauw (stilstaand). Breedte van een streep is 1/13 van het vlak zelf. */
export function BurgStripes({ className = "", style }: { className?: string; style?: CSSProperties }) {
  return (
    <div
      aria-hidden="true"
      className={className}
      style={{
        backgroundColor: col("background"),
        // Altijd 13 strepen over de breedte (begint en eindigt met bordeaux), dus op elk scherm even breed en in dezelfde kleur aan de randen.
        backgroundImage: `repeating-linear-gradient(90deg, ${col("text")} 0, ${col("text")} calc(100% / 13), transparent calc(100% / 13), transparent calc(200% / 13))`,
        ...style,
      }}
    />
  );
}

/** Golvende rechthoek als SVG-pad (viewBox 0 0 100 100): de rand golft, de hoeken blijven zacht rond. */
function wavyPath(amp: number, waves: [number, number]) {
  const pts: string[] = [];
  const N = 40;
  const [wx, wy] = waves;
  const r = 7; // afronding van de hoeken
  const edge = (t: number, w: number, phase: number) => amp * Math.sin(t * Math.PI * 2 * w + phase);
  const at = (x: number, y: number) => pts.push(`${x.toFixed(2)} ${y.toFixed(2)}`);
  for (let i = 0; i <= N; i++) at(r + ((100 - 2 * r) * i) / N, 2.6 + edge(i / N, wx, 0));
  for (let i = 1; i <= N; i++) at(97.4 + edge(i / N, wy, 1.2), r + ((100 - 2 * r) * i) / N);
  for (let i = 1; i <= N; i++) at(100 - r - ((100 - 2 * r) * i) / N, 97.4 + edge(i / N, wx, 2.4));
  for (let i = 1; i < N; i++) at(2.6 + edge(i / N, wy, 3.6), 100 - r - ((100 - 2 * r) * i) / N);
  return `M${pts.join("L")}Z`;
}

const WAVY = wavyPath(1.6, [2, 3]);

/** Kaart met golvende rand: crème vlak met een rand in de kleur van het papier eromheen. */
export function WavyCard({
  children,
  className = "",
  style,
  fill = "surface",
  stroke = "background",
}: {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  fill?: keyof ThemeColors;
  stroke?: keyof ThemeColors;
}) {
  return (
    <div className={`relative ${className}`} style={style}>
      <svg
        aria-hidden="true"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="pointer-events-none absolute inset-0 h-full w-full overflow-visible"
      >
        <path d={WAVY} fill={col(fill)} stroke={col(stroke)} strokeWidth={5} vectorEffect="non-scaling-stroke" strokeLinejoin="round" />
      </svg>
      <div className="relative">{children}</div>
    </div>
  );
}

/** Golvend fotokader: de foto (of een vervanger) wordt in dezelfde golfvorm bijgesneden. */
export function WavyFrame({ children, className = "" }: { children: ReactNode; className?: string }) {
  const id = useId().replace(/:/g, "");
  return (
    <div className={`relative ${className}`}>
      <svg aria-hidden="true" width="0" height="0" className="absolute">
        <defs>
          <clipPath id={`wf${id}`} clipPathUnits="objectBoundingBox">
            <path d={WAVY} transform="scale(0.01)" />
          </clipPath>
        </defs>
      </svg>
      <div className="absolute inset-0 overflow-hidden" style={{ clipPath: `url(#wf${id})` }}>
        {children}
      </div>
      <svg
        aria-hidden="true"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="pointer-events-none absolute inset-0 h-full w-full overflow-visible"
      >
        <path d={WAVY} fill="none" stroke={col("surface")} strokeWidth={2.5} vectorEffect="non-scaling-stroke" />
      </svg>
    </div>
  );
}

/** Twee kersen aan een steeltje, met een crème rand zodat ze loskomen van de bordeaux strepen. */
export function Cherries({ className = "", style }: { className?: string; style?: CSSProperties }) {
  return (
    <svg viewBox="0 0 80 90" aria-hidden="true" className={className} style={{ overflow: "visible", ...style }}>
      <g strokeLinecap="round" strokeLinejoin="round">
        <path d="M30 56C32 38 40 20 54 6M52 60C52 40 52 24 54 6" fill="none" stroke={col("surface")} strokeWidth={6} />
        <path d="M30 56C32 38 40 20 54 6M52 60C52 40 52 24 54 6" fill="none" stroke={col("footerBackground")} strokeWidth={2.4} />
        <path d="M54 6C62 0 72 2 76 10C68 14 60 12 54 6Z" fill={col("accent")} stroke={col("surface")} strokeWidth={3} />
        <circle cx="26" cy="64" r="17" fill={col("footerBackground")} stroke={col("surface")} strokeWidth={3.5} />
        <circle cx="54" cy="68" r="17" fill={col("footerBackground")} stroke={col("surface")} strokeWidth={3.5} />
        <path d="M18 58C19 54 22 52 25 52" fill="none" stroke={col("surface")} strokeWidth={2.6} opacity={0.85} />
        <path d="M46 62C47 58 50 56 53 56" fill="none" stroke={col("surface")} strokeWidth={2.6} opacity={0.85} />
      </g>
    </svg>
  );
}
