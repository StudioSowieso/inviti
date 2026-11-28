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
    {/* uitwaaierend kroonblad links, golvend */}
    <path d="M32 52 C18 50 4 40 6 28 C8 20 16 24 20 20 C24 14 32 18 36 24 C42 20 48 26 50 32" fill={FILL} />
    <path d="M30.0 48 Q18.0 38.0 10.0 28.0 M30.8 48 Q19.8 38.3 12.8 28.6 M31.6 48 Q21.6 38.6 15.6 29.2 M32.4 48 Q23.4 38.9 18.4 29.8 M33.2 48 Q25.2 39.2 21.2 30.4 M34.0 48 Q27.0 39.5 24.0 31.0" strokeWidth={0.55} />
    {/* kroonblad rechts achter */}
    <path d="M70 26 C84 8 106 14 112 34 C114 48 104 58 92 60" fill={FILL} />
    <path d="M92.0 54 Q98.0 42.0 100.0 30.0 M91.2 54 Q98.4 43.0 101.6 32.0 M90.4 54 Q98.8 44.0 103.2 34.0 M89.6 54 Q99.2 45.0 104.8 36.0 M88.8 54 Q99.6 46.0 106.4 38.0 M88.0 54 Q100.0 47.0 108.0 40.0" strokeWidth={0.55} />
    {/* groot voorste kroonblad: rond, breed bovenaan, smal naar de voet */}
    <path d="M24 46 C16 72 38 94 60 100 C84 94 104 72 96 48 C90 30 74 24 60 27 C44 25 28 32 24 46Z" fill={FILL} />
    {/* open rand met golf */}
    <path d="M24 46 C32 34 42 36 48 32 C54 28 66 28 72 32 C80 36 90 34 96 48" />
    {/* binnenste vouw */}
    <path d="M44 34 C46 46 52 58 60 66 C68 58 74 46 76 34" strokeWidth={0.8} />
    <path d="M58 31 C58 40 60 50 60 62" strokeWidth={0.7} />
    {/* fijne arcering vanaf de voet */}
    <path d="M53.4 96 Q45.4 75.5 29.9 54.9 M54.2 96 Q49.2 78.1 37.5 60.2 M55.1 96 Q49.1 72.6 37.5 49.2 M55.9 96 Q52.3 75.9 43.9 55.8 M56.7 96 Q52.7 70.2 45.0 44.4 M57.5 96 Q55.4 74.2 50.4 52.5 M58.4 96 Q56.4 68.6 52.5 41.2 M59.2 96 Q58.5 73.4 56.8 50.7 M60.0 96 Q60.0 68.0 60.0 40.1 M60.8 96 Q61.5 73.4 63.2 50.7 M61.6 96 Q63.6 68.6 67.5 41.2 M62.5 96 Q64.6 74.2 69.6 52.5 M63.3 96 Q67.3 70.2 75.0 44.4 M64.1 96 Q67.7 75.9 76.1 55.8 M64.9 96 Q70.9 72.6 82.5 49.2 M65.8 96 Q70.8 78.1 82.5 60.2 M66.6 96 Q74.6 75.5 90.1 54.9" strokeWidth={0.55} />
    {/* meeldraden */}
    <path d="M50 30 C50 24 52 20 54 18 M60 27 C60 21 60 17 60 14 M70 30 C70 24 68 20 66 18" strokeWidth={0.7} />
    <circle cx="54" cy="17" r="1.5" fill="currentColor" stroke="none" />
    <circle cx="60" cy="13" r="1.5" fill="currentColor" stroke="none" />
    <circle cx="66" cy="17" r="1.5" fill="currentColor" stroke="none" />
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
      <path d="M72 97 C80 134 62 170 60 204 C58 240 66 270 62 300" />
      <path d="M61 244 C72 230 98 220 110 200" />
      <g transform="translate(110 192)">{BUD}</g>
      {/* bladeren */}
      <g transform="translate(62 230) rotate(-24)">{LEAF}</g>
      <g transform="translate(62 214) scale(-1 1) rotate(-30)">{LEAF}</g>
      <g transform="translate(64 262) rotate(-40) scale(0.8)">{LEAF}</g>
      {/* onderste bloem, schuin */}
      <g transform="translate(2 112) scale(0.92) rotate(9 60 100)">{BLOOM}</g>
      {/* bovenste bloem */}
      <g transform="translate(14 -2) scale(0.95) rotate(-13 60 100)">{BLOOM}</g>
    </Svg>
  );
}

/** Eén klaproos met steel en blad, voor kleine plekken. Past in 120 × 190. */
export function Poppy({ className, style }: ArtProps) {
  return (
    <Svg viewBox="0 0 120 190" className={className} style={style}>
      <path d="M60 100 C58 128 64 156 56 190" />
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
