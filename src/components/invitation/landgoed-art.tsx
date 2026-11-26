"use client";

import type { CSSProperties } from "react";
import type { ThemeColors } from "@/lib/invitation/types";

/**
 * Decor voor het thema "landgoed": getekende rankenkransen, een hart met kanten rand, een sierlijk scheidingsteken
 * en een ovaal fotokader. Alle kleuren komen uit het thema (accent = rank, surface = crème, background = groen).
 */

const col = (key: keyof ThemeColors) => `var(--inv-${key})`;

type Pt = [number, number];

/** Punt en richting (graden) op een kubische bézier. */
function bez(p: [Pt, Pt, Pt, Pt], t: number): { x: number; y: number; a: number } {
  const [a, b, c, d] = p;
  const u = 1 - t;
  const x = u * u * u * a[0] + 3 * u * u * t * b[0] + 3 * u * t * t * c[0] + t * t * t * d[0];
  const y = u * u * u * a[1] + 3 * u * u * t * b[1] + 3 * u * t * t * c[1] + t * t * t * d[1];
  const dx = 3 * u * u * (b[0] - a[0]) + 6 * u * t * (c[0] - b[0]) + 3 * t * t * (d[0] - c[0]);
  const dy = 3 * u * u * (b[1] - a[1]) + 6 * u * t * (c[1] - b[1]) + 3 * t * t * (d[1] - c[1]);
  return { x, y, a: (Math.atan2(dy, dx) * 180) / Math.PI };
}

const LEAF = "M0 0C3 -5.5 11 -6 17 0C11 6 3 5.5 0 0Z";
const BUD = "M0 0C-3 -6 -2 -12 0 -16C2 -12 3 -6 0 0Z";

/** Eén tak met bladeren links en rechts en een knop aan het uiteinde; loopt van links boven naar beneden. */
const BRANCH: [Pt, Pt, Pt, Pt] = [
  [100, 6],
  [72, -2],
  [22, 4],
  [6, 62],
];

function branchParts() {
  const leaves: { x: number; y: number; r: number; s: number }[] = [];
  const N = 9;
  for (let i = 1; i <= N; i++) {
    const t = i / (N + 1);
    const p = bez(BRANCH, t);
    const size = 1 - Math.abs(t - 0.45) * 0.5;
    leaves.push({ x: p.x, y: p.y, r: p.a - 52, s: size });
    leaves.push({ x: p.x, y: p.y, r: p.a + 52, s: size * 0.92 });
  }
  const end = bez(BRANCH, 1);
  return { leaves, end };
}

const PARTS = branchParts();
const BRANCH_D = `M${BRANCH[0]}C${BRANCH[1]} ${BRANCH[2]} ${BRANCH[3]}`;

function Half() {
  return (
    <g>
      <path d={BRANCH_D} fill="none" strokeWidth={1.4} strokeLinecap="round" />
      {PARTS.leaves.map((l, i) => (
        <path key={i} d={LEAF} transform={`translate(${l.x.toFixed(1)} ${l.y.toFixed(1)}) rotate(${l.r.toFixed(0)}) scale(${l.s.toFixed(2)})`} style={{ fill: col("accent"), fillOpacity: 0.16 }} strokeWidth={1} />
      ))}
      <path d={BUD} transform={`translate(${PARTS.end.x.toFixed(1)} ${PARTS.end.y.toFixed(1)}) rotate(${(PARTS.end.a - 90 + 180).toFixed(0)}) scale(1.1)`} style={{ fill: col("accent"), fillOpacity: 0.28 }} strokeWidth={1.1} />
    </g>
  );
}

/** Rankenslinger: twee takken die vanuit het midden naar beide kanten omlaag vallen (boven in een boog). */
export function Vine({ className = "", style, flip = false }: { className?: string; style?: CSSProperties; flip?: boolean }) {
  return (
    <svg
      viewBox="0 0 200 74"
      aria-hidden="true"
      className={className}
      style={{ overflow: "visible", transform: flip ? "scaleY(-1)" : undefined, ...style }}
      fill="none"
      stroke={col("accent")}
      strokeLinejoin="round"
    >
      <Half />
      <g transform="translate(200 0) scale(-1 1)">
        <Half />
      </g>
    </svg>
  );
}

/** Klein scheidingsteken: lijntjes met een ruitje in het midden. */
export function Flourish({ className = "", color }: { className?: string; color?: string }) {
  const c = color ?? col("accent");
  return (
    <svg viewBox="0 0 120 12" aria-hidden="true" className={className} fill="none" stroke={c} strokeWidth={1} strokeLinecap="round">
      <path d="M2 6H46M74 6H118" />
      <path d="M52 6C55 1 58 1 60 6C62 11 65 11 68 6" />
      <path d="M60 2.5 63 6 60 9.5 57 6Z" fill={c} />
    </svg>
  );
}

const HEART = "M50 86C10 56 2 34 12 18C22 4 42 6 50 24C58 6 78 4 88 18C98 34 90 56 50 86Z";

/** Hart met kanten rand (stippen) en dunne omlijning; de inhoud staat er gecentreerd in. */
export function LaceHeart({ children, className = "", style }: { children?: React.ReactNode; className?: string; style?: CSSProperties }) {
  return (
    <div className={`relative ${className}`} style={{ aspectRatio: "100 / 92", ...style }}>
      <svg viewBox="-6 -6 112 104" aria-hidden="true" className="absolute inset-0 h-full w-full overflow-visible">
        <path d={HEART} fill={col("footerBackground")} />
        <path d={HEART} fill="none" stroke={col("surface")} strokeWidth={7} strokeLinecap="round" strokeDasharray="0.1 4.6" opacity={0.95} />
        <path d={HEART} fill="none" stroke={col("surface")} strokeWidth={1.1} opacity={0.9} transform="translate(50 46) scale(1.075) translate(-50 -46)" />
        <path d={HEART} fill="none" stroke={col("surface")} strokeWidth={0.9} opacity={0.7} transform="translate(50 46) scale(0.9) translate(-50 -46)" />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center" style={{ paddingTop: "7%" }}>
        {children}
      </div>
    </div>
  );
}

/** Ovaal fotokader met een rand van stippen (kant); met een echte foto vult die het kader. */
export function OvalFrame({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`relative ${className}`} style={{ aspectRatio: "3 / 4" }}>
      <div className="absolute inset-[6%] overflow-hidden" style={{ borderRadius: "50%", background: col("surfaceAlt") }}>
        {children}
      </div>
      <svg viewBox="0 0 100 133" aria-hidden="true" className="pointer-events-none absolute inset-0 h-full w-full overflow-visible" fill="none">
        <ellipse cx="50" cy="66.5" rx="48.5" ry="65" stroke={col("accent")} strokeWidth={3.4} strokeLinecap="round" strokeDasharray="0.1 3.2" />
        <ellipse cx="50" cy="66.5" rx="43.5" ry="60" stroke={col("accent")} strokeWidth={0.8} />
      </svg>
    </div>
  );
}
