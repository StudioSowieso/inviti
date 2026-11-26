"use client";

import { useId, type CSSProperties, type ReactNode } from "react";
import type { ThemeColors } from "@/lib/invitation/types";

/**
 * Decor voor het thema "burgundy": poederblauw papier met bordeaux strepen, een kaart met golvende rand
 * (zoals een ouderwets etiket) en typemachinetekst. Alle kleuren komen uit het thema:
 * text = bordeaux, background = poederblauw, surface = crème, footerBackground = diepste bordeaux.
 */

const col = (key: keyof ThemeColors) => `var(--inv-${key})`;

/** Verticale strepen in bordeaux en poederblauw; `drift` laat ze heel rustig opzij schuiven. */
export function BurgStripes({ className = "", style, drift = false }: { className?: string; style?: CSSProperties; drift?: boolean }) {
  return (
    <div
      aria-hidden="true"
      className={`${drift ? "burg-drift" : ""} ${className}`}
      style={{
        backgroundColor: col("background"),
        backgroundImage: `repeating-linear-gradient(90deg, ${col("text")} 0, ${col("text")} 1.5rem, transparent 1.5rem, transparent 3rem)`,
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
