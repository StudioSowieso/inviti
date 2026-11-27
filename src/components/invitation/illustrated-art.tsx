import type { CSSProperties, ReactNode } from "react";

/**
 * Tekeningen voor het thema "illustrated": losse lijntekeningen in kobaltblauw met een vlak in poederblauw
 * (een coupeglas, een strik, een fles, een discobal, een camera, een taart, ringen en een wegwijzer).
 * Kleuren komen uit het thema: `currentColor` is de tekstkleur (kobalt), `--inv-accent` het lichte blauw en
 * `--inv-background` de papierkleur. Elke tekening is een eigen <svg>, zodat hij los kan bewegen.
 */

type ArtProps = { className?: string; style?: CSSProperties };

const ACCENT = "var(--inv-accent)";
const PAPER = "var(--inv-background)";

function Svg({ viewBox, className, style, children }: ArtProps & { viewBox: string; children: ReactNode }) {
  return (
    <svg
      viewBox={viewBox}
      aria-hidden="true"
      focusable="false"
      className={className}
      style={style}
      fill="none"
      stroke="currentColor"
      strokeWidth={2.4}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {children}
    </svg>
  );
}

/** Coupeglas met een volle kom en een paar spetters. */
export function Coupe({ className, style }: ArtProps) {
  return (
    <Svg viewBox="0 0 100 130" className={className} style={style}>
      <path d="M7 22 C8 49 30 62 50 62 C70 62 92 49 93 22 C70 15 30 15 7 22Z" fill="currentColor" />
      <path d="M18 31 C20 41 28 48 38 51" stroke={PAPER} strokeWidth={2} opacity={0.55} />
      <path d="M50 62 V114" />
      <path d="M28 120 C36 113 64 113 72 120 C64 127 36 127 28 120Z" fill="currentColor" />
      <path d="M31 5 C28 10 28 13 31 13 C34 13 34 10 31 5Z" fill="currentColor" stroke="none" />
      <path d="M66 9 C64 12 64 14 66 14 C68 14 68 12 66 9Z" fill="currentColor" stroke="none" />
      <path d="M48 2 C46 5 46 7 48 7 C50 7 50 5 48 2Z" fill="currentColor" stroke="none" />
    </Svg>
  );
}

/** Strik in poederblauw met dunne lijntjes. */
export function Bow({ className, style }: ArtProps) {
  return (
    <Svg viewBox="0 0 100 84" className={className} style={style} >
      <g fill={ACCENT} strokeWidth={1.8}>
        <path d="M50 36 C38 10 10 6 7 22 C5 40 32 46 50 40Z" />
        <path d="M50 36 C62 10 90 6 93 22 C95 40 68 46 50 40Z" />
        <path d="M46 42 C42 56 36 68 24 80 L38 82 C44 72 50 62 52 46Z" />
        <path d="M54 42 C58 56 64 68 76 80 L62 82 C56 72 50 62 48 46Z" />
        <rect x="43" y="29" width="14" height="17" rx="6" />
      </g>
      <path d="M17 22 C26 20 34 24 41 31" strokeWidth={1.4} />
      <path d="M83 22 C74 20 66 24 59 31" strokeWidth={1.4} />
    </Svg>
  );
}

/** Wijnfles met een wit etiket. */
export function Bottle({ className, style }: ArtProps) {
  return (
    <Svg viewBox="0 0 40 130" className={className} style={style}>
      <path
        d="M8 52 C8 42 16 42 16 30 L16 12 L24 12 L24 30 C24 42 32 42 32 52 L32 118 C32 124 29 127 25 127 L15 127 C11 127 8 124 8 118Z"
        fill="currentColor"
      />
      <rect x="13" y="3" width="14" height="10" rx="2.5" fill="currentColor" />
      <rect x="8" y="76" width="24" height="26" fill={PAPER} stroke="none" />
      <path d="M13 86 H27 M13 92 H27 M13 98 H22" strokeWidth={1.4} />
      <path d="M12 56 V70" stroke={PAPER} strokeWidth={1.8} opacity={0.5} />
    </Svg>
  );
}

/** Discobal aan een draadje met twinkelende sterretjes. */
export function DiscoBall({ className, style }: ArtProps) {
  return (
    <Svg viewBox="0 0 100 110" className={className} style={style}>
      <path d="M50 0 V28" />
      <circle cx="50" cy="62" r="34" fill={ACCENT} fillOpacity={0.45} />
      <path d="M24.1 40 Q50 44.9 75.9 40 M17.8 51 Q50 60.5 82.2 51 M16.0 62 Q50 76.0 84.0 62 M17.8 73 Q50 82.5 82.2 73 M24.1 84 Q50 88.9 75.9 84" />
      <ellipse cx="50" cy="62" rx="11.6" ry="34" />
      <ellipse cx="50" cy="62" rx="23.1" ry="34" />
      <path d="M50 28 V96" />
      <path d="M90 20 C90 25 92 27 97 27 C92 27 90 29 90 34 C90 29 88 27 83 27 C88 27 90 25 90 20Z" fill="currentColor" stroke="none" />
      <path d="M10 82 C10 85 11 86 14 86 C11 86 10 87 10 90 C10 87 9 86 6 86 C9 86 10 85 10 82Z" fill="currentColor" stroke="none" />
    </Svg>
  );
}

/** Camera met een hartje als lens. */
export function Camera({ className, style }: ArtProps) {
  return (
    <Svg viewBox="0 0 100 80" className={className} style={style}>
      <rect x="8" y="22" width="84" height="52" rx="10" />
      <path d="M30 22 L36 9 H60 L66 22" />
      <circle cx="50" cy="48" r="18" />
      <path d="M50 57 C42 51 41 43 46 42 C48 41.6 50 43 50 45 C50 43 52 41.6 54 42 C59 43 58 51 50 57Z" fill={ACCENT} />
      <circle cx="79" cy="33" r="2.4" fill="currentColor" stroke="none" />
      <path d="M92 30 C99 28 100 18 93 12" />
    </Svg>
  );
}

/** Boeket van vijf bloemetjes met een strik. */
export function Bouquet({ className, style }: ArtProps) {
  return (
    <Svg viewBox="0 0 80 100" className={className} style={style}>
      <path d="M40 56 L33 94 M40 56 L47 94 M40 56 V94" />
      <g fill={PAPER} strokeWidth={1.8}>
        <g>
          <circle cx="22.0" cy="19.1" r="3.6" />
          <circle cx="26.7" cy="22.5" r="3.6" />
          <circle cx="24.9" cy="28.0" r="3.6" />
          <circle cx="19.1" cy="28.0" r="3.6" />
          <circle cx="17.3" cy="22.5" r="3.6" />
          <circle cx="22" cy="24" r="1.7" fill="currentColor" stroke="none" />
        </g>
        <g>
          <circle cx="40.0" cy="9.1" r="3.6" />
          <circle cx="44.7" cy="12.5" r="3.6" />
          <circle cx="42.9" cy="18.0" r="3.6" />
          <circle cx="37.1" cy="18.0" r="3.6" />
          <circle cx="35.3" cy="12.5" r="3.6" />
          <circle cx="40" cy="14" r="1.7" fill="currentColor" stroke="none" />
        </g>
        <g>
          <circle cx="58.0" cy="19.1" r="3.6" />
          <circle cx="62.7" cy="22.5" r="3.6" />
          <circle cx="60.9" cy="28.0" r="3.6" />
          <circle cx="55.1" cy="28.0" r="3.6" />
          <circle cx="53.3" cy="22.5" r="3.6" />
          <circle cx="58" cy="24" r="1.7" fill="currentColor" stroke="none" />
        </g>
        <g>
          <circle cx="30.0" cy="37.1" r="3.6" />
          <circle cx="34.7" cy="40.5" r="3.6" />
          <circle cx="32.9" cy="46.0" r="3.6" />
          <circle cx="27.1" cy="46.0" r="3.6" />
          <circle cx="25.3" cy="40.5" r="3.6" />
          <circle cx="30" cy="42" r="1.7" fill="currentColor" stroke="none" />
        </g>
        <g>
          <circle cx="50.0" cy="37.1" r="3.6" />
          <circle cx="54.7" cy="40.5" r="3.6" />
          <circle cx="52.9" cy="46.0" r="3.6" />
          <circle cx="47.1" cy="46.0" r="3.6" />
          <circle cx="45.3" cy="40.5" r="3.6" />
          <circle cx="50" cy="42" r="1.7" fill="currentColor" stroke="none" />
        </g>
      </g>
      <path d="M40 74 C27 64 22 77 33 80 C37 81 40 78 40 74 C40 78 43 81 47 80 C58 77 53 64 40 74Z" fill={ACCENT} strokeWidth={1.8} />
    </Svg>
  );
}

/** Taart met drie lagen en een kaarsje. */
export function Cake({ className, style }: ArtProps) {
  return (
    <Svg viewBox="0 0 90 100" className={className} style={style}>
      <rect x="8" y="64" width="74" height="28" rx="5" />
      <rect x="18" y="43" width="54" height="21" rx="5" />
      <rect x="28" y="24" width="34" height="19" rx="5" />
      <path d="M8 74 q8 9 16 0 q8 9 16 0 q8 9 16 0 q8 9 18 0" />
      <path d="M18 53 q9 8 18 0 q9 8 18 0" strokeWidth={1.8} />
      <path d="M45 24 V12" />
      <path d="M45 3 C42 7 42 10 45 10 C48 10 48 7 45 3Z" fill="currentColor" />
      <circle cx="45" cy="34" r="2.2" fill={ACCENT} strokeWidth={1.6} />
      <path d="M2 96 H88" />
    </Svg>
  );
}

/** Twee ringen in elkaar. */
export function Rings({ className, style }: ArtProps) {
  return (
    <Svg viewBox="0 0 100 70" className={className} style={style}>
      <circle cx="37" cy="40" r="24" />
      <circle cx="63" cy="40" r="24" />
      <circle cx="37" cy="40" r="17" strokeWidth={1.4} opacity={0.6} />
      <circle cx="63" cy="40" r="17" strokeWidth={1.4} opacity={0.6} />
      <path d="M37 16 L42 8 H32Z" fill={ACCENT} strokeWidth={1.8} />
      <path d="M82 8 C82 12 84 14 88 14 C84 14 82 16 82 20 C82 16 80 14 76 14 C80 14 82 12 82 8Z" fill="currentColor" stroke="none" />
    </Svg>
  );
}

/** Wegwijzer met drie bordjes. */
export function SignPost({ className, style }: ArtProps) {
  return (
    <Svg viewBox="0 0 80 110" className={className} style={style}>
      <path d="M40 6 V106 M26 106 H54" />
      <path d="M20 14 H58 L68 22 L58 30 H20Z" fill={PAPER} />
      <path d="M60 38 H22 L12 46 L22 54 H60Z" fill={ACCENT} />
      <path d="M20 62 H58 L68 70 L58 78 H20Z" fill={PAPER} />
      <path d="M27 22 H52 M28 46 H52 M27 70 H52" strokeWidth={1.5} />
    </Svg>
  );
}

/** Hartje in lijn. */
export function Heart({ className, style }: ArtProps) {
  return (
    <Svg viewBox="0 0 40 36" className={className} style={style}>
      <path d="M20 33 C4 22 2 10 10 5 C15 2 20 6 20 11 C20 6 25 2 30 5 C38 10 36 22 20 33Z" />
    </Svg>
  );
}

/** Viervoudig sterretje. */
export function Sparkle({ className, style }: ArtProps) {
  return (
    <Svg viewBox="0 0 20 20" className={className} style={style}>
      <path d="M10 0 C10 6 14 10 20 10 C14 10 10 14 10 20 C10 14 6 10 0 10 C6 10 10 6 10 0Z" fill="currentColor" stroke="none" />
    </Svg>
  );
}

/** Golvende lijn in poederblauw, om blokken van elkaar te scheiden. */
export function Wave({ className, style }: ArtProps) {
  return (
    <Svg viewBox="0 0 100 16" className={className} style={style}>
      <path d="M0 8 Q10 0 20 8 T40 8 T60 8 T80 8 T100 8" stroke={ACCENT} strokeWidth={3.2} />
    </Svg>
  );
}

/** Krullend hoekje voor kaarten (zoals het randje op een drukwerkkaart). */
export function Curl({ className, style }: ArtProps) {
  return (
    <Svg viewBox="0 0 60 44" className={className} style={style}>
      <path d="M3 42 C3 22 12 14 22 14 C30 14 30 24 22 24 C16 24 15 16 23 10 C32 3 46 4 58 6" stroke={ACCENT} strokeWidth={3} />
    </Svg>
  );
}

const PROGRAM_ICONS = [Coupe, DiscoBall, Camera, Bouquet, Cake, Rings, SignPost, Bottle];

/** Tekening bij een programma-onderdeel; de volgorde wisselt, zodat elk onderdeel een andere heeft. */
export function ProgramIcon({ index, className, style }: ArtProps & { index: number }) {
  const Icon = PROGRAM_ICONS[index % PROGRAM_ICONS.length];
  return <Icon className={className} style={style} />;
}

/** Het rivierlint van de beginpagina: een slingerende stroom wijn die onderaan uitwaaiert. Past in een vlak van 100 × 165. */
export function River({ className, style }: ArtProps) {
  return (
    <svg viewBox="0 0 100 165" preserveAspectRatio="none" aria-hidden="true" focusable="false" className={className} style={style}>
      <path
        d="M31 29.5 C35 41 40 46 36 57 C33 67 23 72 32 85 C41 97 55 98 53 114 C51 130 33 140 15 165 L86 165 C80 141 68 129 68 114 C68 98 52 94 49 82 C46 72 51 64 49 57 C48 46 38 40 33 29.5Z"
        fill={ACCENT}
      />
    </svg>
  );
}

/** Zegel van was met een schelp, voor op de envelop: de kleur van het zegel is `currentColor`, de schelp staat in de tekstkleur. */
export function Seal({ className, style }: ArtProps) {
  const edge = Array.from({ length: 160 }, (_, i) => {
    const t = (2 * Math.PI * i) / 160;
    const r = 44 + 2.6 * Math.cos(18 * t);
    return `${(50 + r * Math.cos(t)).toFixed(1)} ${(50 + r * Math.sin(t)).toFixed(1)}`;
  });
  const rib = (a: number) => `M50 72 L${(50 + 27 * Math.cos(a)).toFixed(1)} ${(72 + 27 * Math.sin(a)).toFixed(1)}`;
  const ribs = Array.from({ length: 7 }, (_, k) => rib((((-150 + 20 * k) * Math.PI) / 180))).join(" ");
  const arc = Array.from({ length: 25 }, (_, i) => {
    const a = ((-150 + (120 * i) / 24) * Math.PI) / 180;
    return `${(50 + 27 * Math.cos(a)).toFixed(1)} ${(72 + 27 * Math.sin(a)).toFixed(1)}`;
  });
  return (
    <Svg viewBox="0 0 100 100" className={className} style={style}>
      <path d={`M${edge.join("L")}Z`} fill="currentColor" stroke="none" />
      <circle cx="50" cy="50" r="33" stroke="var(--inv-text)" strokeWidth={1.6} opacity={0.5} />
      <g stroke="var(--inv-text)" strokeWidth={2}>
        <path d={ribs} />
        <path d={`M${arc.join("L")}`} />
        <path d="M30 76 H70" />
      </g>
    </Svg>
  );
}
