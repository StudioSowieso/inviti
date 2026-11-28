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
    {/* achterste petalen links en rechts */}
    <path d="M60 124 C26 112 4 84 9 52 C12 30 34 17 54 24 C49 52 50 92 60 124Z" fill={FILL} />
    <path d="M60 124 C94 112 116 84 111 52 C108 30 86 17 66 24 C71 52 70 92 60 124Z" fill={FILL} />
    <path d="M18 60 C24 46 32 40 40 38 M102 60 C96 46 88 40 80 38" strokeWidth={0.55} />
    {/* voorste petaal met gegolfde rand */}
    <path d="M33 62 C27 38 38 20 49 17 C54 9 66 9 71 17 C83 20 93 38 87 62 C84 92 72 114 60 124 C48 114 36 92 33 62Z" fill={FILL} />
    <path d="M60 17 C57 50 58 90 60 122" strokeWidth={0.6} />
    <path d="M41 30 C47 34 52 33 56 28 M64 28 C68 33 73 34 79 30" strokeWidth={0.55} />
    <path d="M49 119 L14 101 M50 118 L15 95 M50 117 L17 88 M51 116 L19 82 M52 115 L22 76 M53 114 L26 70 M54 113 L31 65 M56 113 L37 60 M57 112 L43 56" strokeWidth={0.5} />
    <path d="M71 119 L106 101 M70 118 L105 95 M70 117 L103 88 M69 116 L101 82 M68 115 L98 76 M67 114 L94 70 M66 113 L89 65 M64 113 L83 60 M63 112 L77 56" strokeWidth={0.5} />
  </g>
);

const BUD = (
  <g>
    <path d="M0 14 C-8 0 -4 -16 0 -22 C4 -16 8 0 0 14Z" fill={FILL} />
    <path d="M-6 8 C-14 -2 -12 -14 -8 -20 M6 8 C14 -2 12 -14 8 -20" strokeWidth={0.9} />
    <path d="M0 -20 C0 -8 0 2 0 12" strokeWidth={0.8} />
  </g>
);

/** Een blad met middennerf en kleine zijnerven; wijst naar rechts, lengte 40. */
const LEAF = (
  <g>
    <path d="M0 0 C6 -10 24 -14 40 -4 C30 2 16 8 0 0Z" fill={FILL} />
    <path d="M2 -1 C14 -4 26 -5 38 -4" strokeWidth={0.8} />
    <path d="M10 -3 L14 -9 M18 -4 L23 -10 M26 -4 L31 -8 M10 -2 L14 3 M19 -2 L24 2" strokeWidth={0.7} />
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
      <g transform="translate(60 262) rotate(-26) scale(1.15)">{LEAF}</g>
      <g transform="translate(61 246) scale(-1 1) rotate(-30) scale(1.05)">{LEAF}</g>
      <g transform="translate(60 312) rotate(-38) scale(0.9)">{LEAF}</g>
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
    <Svg viewBox="0 0 60 120" className={className} style={style} sw={0.9}>
      <path d="M54 120 C50 100 40 80 32 58 C26 42 22 26 20 8" />
      {leaves.map((l, i) => (
        <g key={i} transform={`translate(${l.x} ${l.y}) rotate(${l.a}) scale(${l.s * 0.8})`}>
          {LEAF}
        </g>
      ))}
      
    </Svg>
  );
}
