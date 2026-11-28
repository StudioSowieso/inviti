import type { CSSProperties, ReactNode } from "react";

/**
 * Lijntekeningen voor het thema "klaproos": klaprozen op een lange steel, een knop en takjes met blaadjes,
 * getekend in één dunne lijn. De lijnkleur is `currentColor`. Delen die achter een bloem verdwijnen worden gevuld met
 * `--inv-fill` (standaard de papierkleur), zodat lijnen elkaar niet kruisen; zet die variabele op een gekleurd vlak.
 */

type ArtProps = { className?: string; style?: CSSProperties };

const FILL = "var(--inv-fill, var(--inv-background))";

function Svg({ viewBox, className, style, children, sw = 1.1 }: ArtProps & { viewBox: string; children: ReactNode; sw?: number }) {
  return (
    <svg
      viewBox={viewBox}
      aria-hidden="true"
      focusable="false"
      className={className}
      style={style}
      fill="none"
      stroke="currentColor"
      strokeWidth={sw}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {children}
    </svg>
  );
}

/** Eén klaproos van opzij gezien (past in 120 × 100), met de steel eronder op x = 60. */
const BLOOM = (
  <g>
    {/* achterste petaal rechts */}
    <path d="M62 120 C84 104 106 86 118 52 C121 36 112 22 102 22 C94 22 90 28 86 34 C80 60 70 96 62 120Z" fill={FILL} />
    <path d="M65 114 Q81 75 103 48 M68 112 Q84 80 109 53 M69 112 Q83 89 108 65 M64 118 Q80 98 96 86 M65 119 Q75 106 90 96" strokeWidth={0.5} />
    {/* gegolfd petaal links */}
    <path d="M58 120 C36 108 14 92 5 68 C1 56 8 50 16 55 C20 48 28 50 32 46 C38 44 44 50 48 56 C54 76 58 100 58 120Z" fill={FILL} />
    <path d="M55 117 Q38 87 16 71 M53 113 Q41 84 16 63 M52 111 Q45 85 21 60 M57 116 Q49 85 32 65 M56 113 Q53 85 37 61 M57 111 Q56 88 43 61 M59 117 Q58 93 49 76" strokeWidth={0.5} />
    {/* groot voorste petaal */}
    <path d="M60 123 C36 104 22 66 28 40 C32 20 50 8 70 9 C88 10 100 26 99 52 C98 80 80 108 60 123Z" fill={FILL} />
    <path d="M30 34 C36 30 40 32 46 26" strokeWidth={0.5} />
    <path d="M57 114 Q51 78 36 52 M57 109 Q54 72 39 37 M57 104 Q58 69 45 25 M59 112 Q64 67 55 31 M61 107 Q70 67 65 25 M63 103 Q76 69 77 22 M63 113 Q80 73 83 39 M65 110 Q82 80 90 44 M67 110 Q83 88 94 54 M64 117 Q82 97 90 76 M64 118 Q77 107 86 93" strokeWidth={0.5} />
    <circle cx="60" cy="122" r="2.6" fill={FILL} strokeWidth={1.1} />
  </g>
);

const BUD = (
  <g>
    <path d="M0 14 C-8 0 -4 -16 0 -22 C4 -16 8 0 0 14Z" fill={FILL} />
    <path d="M-6 8 C-14 -2 -12 -14 -8 -20 M6 8 C14 -2 12 -14 8 -20" strokeWidth={0.9} />
    <path d="M0 -20 C0 -8 0 2 0 12" strokeWidth={0.8} />
  </g>
);

/** Een blad met middennerf, zijnerven en getande rand; wijst naar rechts, lengte 60. */
const LEAF = (
  <g>
    <path d="M0 0 C6 -14 22 -19 36 -14 C46 -11 54 -6 60 0 C52 5 42 9 32 10 C20 12 8 9 0 0Z" fill={FILL} />
    <path d="M2 -1 C20 -4 42 -4 58 -1" strokeWidth={0.9} />
    <path d="M10 -2 L16 -11 M18 -3 L25 -14 M27 -3 L35 -13 M36 -3 L43 -10 M13 -1 L18 6 M22 -1 L28 6 M31 -1 L38 5 M40 -1 L46 4" strokeWidth={0.55} />
  </g>
);

/** Twee klaprozen aan een lange steel met bladeren en een knop. Past in 140 × 340. */
export function PoppyStem({ className, style }: ArtProps) {
  return (
    <Svg viewBox="0 0 140 340" className={className} style={style}>
      {/* steel van de bovenste bloem, achter de onderste langs */}
      <path d="M66 104 C88 140 84 186 62 230" />
      {/* zijsteel met knop */}
      <path d="M60 296 C74 282 100 270 112 246" />
      <g transform="translate(112 238)">{BUD}</g>
      {/* hoofdsteel en bladeren */}
      <path d="M60 224 C58 262 66 300 59 340" />
      <g transform="translate(60 262) rotate(-26) scale(1)">{LEAF}</g>
      <g transform="translate(61 246) scale(-1 1) rotate(-30) scale(0.85)">{LEAF}</g>
      <g transform="translate(60 312) rotate(-38) scale(1)">{LEAF}</g>
      {/* onderste bloem */}
      <g transform="translate(0 100) rotate(8 60 124)">{BLOOM}</g>
      {/* bovenste bloem */}
      <g transform="translate(14 -4) scale(0.88) rotate(-12 60 124)">{BLOOM}</g>
    </Svg>
  );
}

/** Eén klaproos met steel en blad, voor kleine plekken. Past in 120 × 230. */
export function Poppy({ className, style }: ArtProps) {
  return (
    <Svg viewBox="0 0 120 230" className={className} style={style}>
      <path d="M60 124 C58 156 64 190 56 230" />
      <g transform="translate(58 186) rotate(-28)">{LEAF}</g>
      <g transform="translate(0 0)">{BLOOM}</g>
    </Svg>
  );
}

/** Takje met blaadjes (breedte 60, hoogte 120), de steel loopt van rechtsonder naar linksboven. */
export function Sprig({ className, style }: ArtProps) {
  const leaves = [
    { x: 48, y: 100, a: 24, s: 1 },
    { x: 42, y: 84, a: -152, s: 0.95 },
    { x: 36, y: 68, a: 14, s: 0.9 },
    { x: 30, y: 52, a: -156, s: 0.85 },
    { x: 26, y: 36, a: 8, s: 0.75 },
    { x: 22, y: 20, a: -162, s: 0.65 },
  ];
  return (
    <Svg viewBox="-18 -6 96 128" className={className} style={{ overflow: "visible", ...style }} sw={0.9}>
      <path d="M54 120 C50 100 40 80 32 58 C26 42 22 26 20 8" />
      {leaves.map((l, i) => (
        <g key={i} transform={`translate(${l.x} ${l.y}) rotate(${l.a}) scale(${l.s * 0.55})`}>
          {LEAF}
        </g>
      ))}
      
    </Svg>
  );
}
