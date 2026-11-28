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
    {/* achterste kroonbladen */}
    <path d="M12 34 C0 22 6 6 24 8 C30 9 36 12 42 18 C48 10 72 10 78 18 C84 12 90 9 96 8 C114 6 120 22 108 34Z" fill={FILL} />
    {/* kelk: breed bovenaan, smal onderaan */}
    <path d="M8 32 C6 58 34 84 60 94 C86 84 114 58 112 32 C100 40 88 34 78 38 C70 42 66 36 60 38 C54 36 50 42 42 38 C32 34 20 40 8 32Z" fill={FILL} />
    {/* uitstaande voorste kroonbladen */}
    <path d="M8 32 C-4 28 -2 12 10 12 C16 12 20 18 22 26" fill={FILL} />
    <path d="M112 32 C124 28 122 12 110 12 C104 12 100 18 98 26" fill={FILL} />
    {/* plooien naar de voet */}
    <path d="M24 36 C28 58 44 78 60 92" />
    <path d="M42 40 C46 60 54 78 60 92" />
    <path d="M96 36 C92 58 76 78 60 92" />
    <path d="M78 40 C74 60 66 78 60 92" />
    <path d="M60 40 C60 58 60 76 60 92" />
    {/* arcering */}
    <path d="M14 42 C16 52 22 62 30 70 M30 44 C32 54 38 64 46 72 M106 42 C104 52 98 62 90 70 M90 44 C88 54 82 64 74 72" strokeWidth={0.8} />
    <path d="M52 48 C54 58 56 68 58 78 M68 48 C66 58 64 68 62 78" strokeWidth={0.7} />
    {/* hart met meeldraden */}
    <path d="M42 22 C46 28 50 30 54 30 M60 16 C60 22 60 27 60 30 M78 22 C74 28 70 30 66 30" strokeWidth={0.8} />
    <circle cx="42" cy="20" r="1.8" fill="currentColor" stroke="none" />
    <circle cx="60" cy="14" r="1.8" fill="currentColor" stroke="none" />
    <circle cx="78" cy="20" r="1.8" fill="currentColor" stroke="none" />
    <path d="M52 24 C54 18 66 18 68 24 C66 30 54 30 52 24Z" strokeWidth={0.9} />
    {/* rimpel in de achterste bladen */}
    <path d="M18 24 C22 28 28 28 34 24 M102 24 C98 28 92 28 86 24" strokeWidth={0.8} />
  </g>
);

/** Knop met twee kelkblaadjes. */
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

/** Twee klaprozen aan een lange steel met blad en knop. Past in 140 × 300. */
export function PoppyStem({ className, style }: ArtProps) {
  return (
    <Svg viewBox="0 0 140 300" className={className} style={style}>
      {/* steel en zijsteel */}
      <path d="M74 91 C80 130 62 168 60 198 C58 240 66 270 62 300" />
      <path d="M61 244 C72 230 98 220 110 200" />
      <g transform="translate(110 192)">{BUD}</g>
      {/* bladeren */}
      <g transform="translate(62 230) rotate(-24)">{LEAF}</g>
      <g transform="translate(62 214) scale(-1 1) rotate(-30)">{LEAF}</g>
      <g transform="translate(64 262) rotate(-40) scale(0.8)">{LEAF}</g>
      {/* onderste bloem, schuin */}
      <g transform="translate(0 112) rotate(-12) scale(0.9)">{BLOOM}</g>
      {/* bovenste bloem */}
      <g transform="translate(14 0) scale(0.95)">{BLOOM}</g>
    </Svg>
  );
}

/** Eén klaproos met steel en blad, voor kleine plekken. Past in 120 × 190. */
export function Poppy({ className, style }: ArtProps) {
  return (
    <Svg viewBox="0 0 120 190" className={className} style={style}>
      <path d="M60 90 C58 120 64 150 56 190" />
      <g transform="translate(58 150) rotate(-28)">{LEAF}</g>
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
