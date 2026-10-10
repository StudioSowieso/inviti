import type { CSSProperties } from "react";

/**
 * Het Inviti-logo: het woord INVITI met een fijne boog erboven, als een deuropening.
 * Volgt de tekstkleur (`currentColor`), dus gebruik `text-forest`, `text-paper`, enz.
 * Met `tagline` komt de ondertitel eronder (alleen op grote formaten zinvol).
 */
const WORD =
  "M-0.25 0Q3.85 50 -0.25 100L10.25 100Q6.15 50 10.25 0ZM23.8 0Q28 50 23.8 100L32.2 100Q28 50 32.2 0ZM101.8 0Q106 50 101.8 100L110.2 100Q106 50 110.2 0ZM24.25 2.92Q58.52 56.61 102.25 102.92L109.75 97.08Q75.48 43.39 31.75 -2.92ZM121.68 1.99Q137.98 55.07 169.27 101.25L174.73 98.75Q160.02 44.93 130.32 -1.99ZM214.37 -1.67Q194.36 49.71 169.27 98.75L174.73 101.25Q195.64 50.29 221.63 1.67ZM232.75 0Q236.85 50 232.75 100L243.25 100Q239.15 50 243.25 0ZM258 7Q298 3.4 338 7L338 -1Q298 2.6 258 -1ZM292.75 0Q296.85 50 292.75 100L303.25 100Q299.15 50 303.25 0ZM352.75 0Q356.85 50 352.75 100L363.25 100Q359.15 50 363.25 0Z";

export function Logo({
  className = "",
  style,
  tagline = false,
  title = "Inviti",
}: {
  className?: string;
  style?: CSSProperties;
  tagline?: boolean;
  title?: string;
}) {
  const height = tagline ? 236 : 188;
  return (
    <svg
      viewBox={`-12 -84 387 ${height}`}
      role="img"
      aria-label={title}
      className={className}
      style={style}
    >{" "}
      <path d={WORD} fill="currentColor" />
      <path
        d="M-6 -14A187.5 66 0 0 1 369 -14"
        fill="none"
        stroke="currentColor"
        strokeWidth="3.6"
        strokeLinecap="round"
      />
      {tagline && (
        <text
          x="181.5"
          y="144"
          textAnchor="middle"
          fill="currentColor"
          fontSize="11"
          letterSpacing="5.2"
          style={{ fontFamily: "var(--font-sans), sans-serif" }}
        >
          JOUW BRUILOFTSUITNODIGING
        </text>
      )}
    </svg>
  );
}
