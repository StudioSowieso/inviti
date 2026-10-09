"use client";

import { useEffect, useId, useMemo, useState, type CSSProperties, type ReactNode } from "react";
import { formatDateDots, formatDateLong, targetTimestamp } from "@/lib/invitation/format";
import type { Block, BlockType, InvitationConfig, ThemeColors } from "@/lib/invitation/types";

/**
 * Stijl "nature": papieren textuur, gescheurde randen tussen de secties, botanische
 * lijntekeningen en sierlijk handschrift. Alle kleuren komen uit het thema.
 */

const col = (key: keyof ThemeColors) => `var(--inv-${key})`;
const heading = { fontFamily: "var(--inv-heading)" } satisfies CSSProperties;
const script = { fontFamily: "var(--inv-script)" } satisfies CSSProperties;

/** Fijne papiertextuur, als overlay over de hele uitnodiging gelegd. */
export const PAPER_NOISE = `url("data:image/svg+xml;utf8,${encodeURIComponent(
  "<svg xmlns='http://www.w3.org/2000/svg' width='220' height='220'><filter id='n' x='0' y='0' width='100%' height='100%'><feTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='3' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 .36  0 0 0 0 .3  0 0 0 0 .2  0 0 0 .13 0'/></filter><rect width='100%' height='100%' filter='url(#n)'/></svg>",
)}")`;

// ---------- Gescheurde rand ----------

const TEAR_W = 400;
const TEAR_H = 28;

export function tearPaths(seed: number) {
  let s = (seed * 9301 + 49297) % 4294967296;
  const rand = () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
  const pts: [number, number][] = [];
  for (let x = 0; x <= TEAR_W; x += 4) {
    const wave = Math.sin(x / 41 + seed) * 4 + Math.sin(x / 13 + seed * 2) * 2;
    const y = Math.min(TEAR_H - 5, Math.max(5, TEAR_H * 0.55 + wave + (rand() - 0.5) * 7));
    pts.push([x, Math.round(y * 10) / 10]);
  }
  const line = (dy: number) =>
    `M0 ${TEAR_H} ` +
    pts.map(([x, y]) => `L${x} ${Math.max(0, Math.round((y + dy) * 10) / 10)}`).join(" ") +
    ` L${TEAR_W} ${TEAR_H} Z`;
  return { main: line(0), rim: line(-2.6) };
}

/**
 * Gescheurde papierrand. Het gekleurde vlak onder de rand heeft kleur `fill`; de lichtere
 * rand erboven lijkt op de vezels van gescheurd papier. Plaats hem met `style`/`className`.
 */
export function TornEdge({
  fill,
  seed = 1,
  flip = false,
  className = "",
  style,
}: {
  fill: string;
  seed?: number;
  flip?: boolean;
  className?: string;
  style?: CSSProperties;
}) {
  const { main, rim } = useMemo(() => tearPaths(seed), [seed]);
  return (
    <svg
      aria-hidden="true"
      viewBox={`0 0 ${TEAR_W} ${TEAR_H}`}
      preserveAspectRatio="none"
      className={`pointer-events-none absolute inset-x-0 block w-full ${className}`}
      style={{ height: "1.15rem", transform: flip ? "scaleY(-1)" : undefined, ...style }}
    >
      <path d={rim} style={{ fill: `color-mix(in srgb, ${fill} 40%, white)` }} />
      <path d={main} style={{ fill }} />
    </svg>
  );
}

/** Gescheurde rand bovenaan een sectie, over het einde van de vorige sectie heen. */
function TopTear({ fill, seed }: { fill: string; seed: number }) {
  return <TornEdge fill={fill} seed={seed} style={{ bottom: "calc(100% - 1px)" }} />;
}

// ---------- Botanische sierelementen ----------

function SprigShape() {
  return (
    <>
      <path d="M2 8c7 .4 14 .4 20 0" />
      <ellipse cx="7" cy="5" rx="3" ry="1.3" transform="rotate(-35 7 5)" />
      <ellipse cx="7" cy="11" rx="3" ry="1.3" transform="rotate(35 7 11)" />
      <ellipse cx="13" cy="4.6" rx="3" ry="1.3" transform="rotate(-35 13 4.6)" />
      <ellipse cx="13" cy="11.4" rx="3" ry="1.3" transform="rotate(35 13 11.4)" />
      <ellipse cx="19" cy="5.4" rx="2.6" ry="1.2" transform="rotate(-30 19 5.4)" />
      <ellipse cx="19" cy="10.6" rx="2.6" ry="1.2" transform="rotate(30 19 10.6)" />
    </>
  );
}

export function Sprig({ size = 28, className = "" }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={(size * 16) / 24}
      viewBox="0 0 24 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="0.8"
      strokeLinecap="round"
      aria-hidden="true"
      className={className}
    >
      <SprigShape />
    </svg>
  );
}

/** Lijn, takje, lijn: scheidt een kop van de inhoud. */
export function SprigDivider({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 160 16"
      width="150"
      height="15"
      fill="none"
      stroke="currentColor"
      strokeWidth="0.8"
      strokeLinecap="round"
      aria-hidden="true"
      className={`mx-auto block ${className}`}
      style={{ color: col("accent") }}
    >
      <path d="M0 8H62M98 8H160" strokeWidth="0.6" opacity="0.7" />
      <g transform="translate(68 0)">
        <SprigShape />
      </g>
    </svg>
  );
}

function LineIcon({ children, size = 44, className = "" }: { children: ReactNode; size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.1"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      {children}
    </svg>
  );
}

export function ChapelIcon(p: { size?: number; className?: string }) {
  return (
    <LineIcon {...p}>
      <path d="M24 3v7M21.5 5.5h5" />
      <path d="m18 18 6-7 6 7" />
      <path d="M18 18v22M30 18v22" />
      <path d="m18 28-7 3.5V40M30 28l7 3.5V40" />
      <path d="M6 40h36" />
      <path d="M21.5 40v-6.5a2.5 2.5 0 0 1 5 0V40" />
      <circle cx="24" cy="23.5" r="2.2" />
      <path d="M4.5 40v-5M43.5 40v-5" />
      <ellipse cx="4.5" cy="30.5" rx="3" ry="5" />
      <ellipse cx="43.5" cy="30.5" rx="3" ry="5" />
    </LineIcon>
  );
}

function VenueIcon(p: { size?: number; className?: string }) {
  return (
    <LineIcon {...p}>
      <path d="M7 41V24l17-13 17 13v17" />
      <path d="M4 41h40" />
      <path d="M20.5 41v-8a3.5 3.5 0 0 1 7 0v8" />
      <path d="M12 36v-5a2 2 0 0 1 4 0v5M32 36v-5a2 2 0 0 1 4 0v5" />
      <circle cx="24" cy="21" r="2.4" />
    </LineIcon>
  );
}

function GlassesIcon(p: { size?: number; className?: string }) {
  return (
    <LineIcon {...p}>
      <g transform="rotate(-14 17 24)">
        <path d="M13 9h8l-1 14a3 3 0 0 1-6 0z" />
        <path d="M17 26v12M13 38h8" />
      </g>
      <g transform="rotate(14 31 24)">
        <path d="M27 9h8l-1 14a3 3 0 0 1-6 0z" />
        <path d="M31 26v12M27 38h8" />
      </g>
      <path d="M22.5 8.5 24 6M24 5V2.5M25.5 8.5 24 6" />
      <circle cx="19" cy="14" r=".7" />
      <circle cx="31" cy="14" r=".7" />
    </LineIcon>
  );
}

function PlateIcon(p: { size?: number; className?: string }) {
  return (
    <LineIcon {...p}>
      <circle cx="24" cy="24" r="11" />
      <circle cx="24" cy="24" r="7" />
      <path d="M8 9v8a2.5 2.5 0 0 0 5 0V9M10.5 19.5V40" />
      <path d="M40 9c-3.2 3.5-3.8 9-3.4 15H40zM40 24v16" />
    </LineIcon>
  );
}

function DiscoIcon(p: { size?: number; className?: string }) {
  return (
    <LineIcon {...p}>
      <path d="M24 3v11" />
      <circle cx="24" cy="27" r="12" />
      <path d="M12 27h24M14.2 20.5h19.6M14.2 33.5h19.6" />
      <ellipse cx="24" cy="27" rx="5.5" ry="12" />
      <path d="M24 15v24" />
      <path d="M6 13v5M3.5 15.5h5M41 8v4M39 10h4M40 36v4M38 38h4" />
    </LineIcon>
  );
}

export function EnvelopeIcon(p: { size?: number; className?: string }) {
  return (
    <LineIcon {...p}>
      <rect x="6" y="12" width="36" height="25" rx="2.5" />
      <path d="m7 14 17 13 17-13" />
      <path d="M24 5.5c-1.5 1.6-1.5 3.4 0 5 1.5-1.6 1.5-3.4 0-5Z" />
    </LineIcon>
  );
}

/** Kiest een lijnicoon bij een programma-onderdeel op basis van de titel. */
export function programIcon(title: string) {
  const t = title.toLowerCase();
  if (/(ceremon|huwelijk|trouw|jawoord|kerk|kapel)/.test(t)) return ChapelIcon;
  if (/(borrel|toast|proost|receptie|drink|bubbel|cocktail|taart)/.test(t)) return GlassesIcon;
  if (/(diner|dinner|eten|lunch|brunch|maaltijd|buffet|ontbijt)/.test(t)) return PlateIcon;
  if (/(feest|party|dans|disco|dj|band|muziek)/.test(t)) return DiscoIcon;
  return VenueIcon;
}

// ---------- Fotovervanger: heuvels bij zonsondergang ----------

/** Zolang er geen foto is: een zacht heuvellandschap in de kleuren van het thema. */
export function NaturePhoto({ tone = "warm", className = "" }: { tone?: "warm" | "soft"; className?: string }) {
  const id = useId().replace(/:/g, "");
  // Alle kleuren volgen het gekozen kleurenpalet via de --inv-variabelen van de uitnodiging.
  const bg = "var(--inv-background)";
  const acc = "var(--inv-accent)";
  const sky =
    tone === "warm"
      ? [`color-mix(in srgb, ${bg} 82%, ${acc} 18%)`, `color-mix(in srgb, ${bg} 55%, ${acc} 45%)`]
      : [`color-mix(in srgb, ${bg} 90%, ${acc} 10%)`, `color-mix(in srgb, ${bg} 68%, ${acc} 32%)`];
  const hill = (pct: number, dark = 0) =>
    `color-mix(in srgb, color-mix(in srgb, ${acc} ${pct}%, white) ${100 - dark}%, black ${dark}%)`;
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 400 300"
      preserveAspectRatio="xMidYMid slice"
      className={`absolute inset-0 h-full w-full ${className}`}
    >
      <defs>
        <linearGradient id={`sky${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" style={{ stopColor: sky[0] }} />
          <stop offset="1" style={{ stopColor: sky[1] }} />
        </linearGradient>
        <radialGradient id={`sun${id}`} cx=".7" cy=".36" r=".5">
          <stop offset="0" stopColor="#fff7dd" stopOpacity=".95" />
          <stop offset="1" stopColor="#fff7dd" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="400" height="300" fill={`url(#sky${id})`} />
      <rect width="400" height="300" fill={`url(#sun${id})`} />
      <path d="M0 168C60 138 112 150 172 165S300 128 400 150V300H0Z" style={{ fill: hill(70) }} />
      <path d="M0 200C70 170 140 190 212 205S340 184 400 196V300H0Z" style={{ fill: hill(100) }} />
      <path d="M0 246C80 220 160 240 250 250S360 232 400 240V300H0Z" style={{ fill: hill(100, 22) }} />
      <g style={{ fill: hill(100, 38) }} opacity=".85">
        <ellipse cx="58" cy="222" rx="7" ry="17" />
        <ellipse cx="74" cy="226" rx="5" ry="12" />
        <ellipse cx="338" cy="214" rx="6" ry="15" />
      </g>
    </svg>
  );
}

// ---------- Opbouw ----------

function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <p className="text-[0.56rem] tracking-[0.28em] uppercase" style={{ color: col("muted") }}>
      {children}
    </p>
  );
}

function SectionHead({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <header className="text-center">
      {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
      <h2 className="mt-2.5 text-[2rem] leading-[1.1] font-medium italic" style={heading}>
        {title}
      </h2>
      <SprigDivider className="mt-4" />
    </header>
  );
}

function PillButton({ children, href }: { children: ReactNode; href?: string }) {
  const cls =
    "inline-flex items-center justify-center px-8 py-3 text-[0.6rem] font-medium tracking-[0.2em] uppercase";
  const style = { background: col("buttonBackground"), color: col("buttonText"), borderRadius: "var(--inv-radius)" };
  return href ? (
    <a href={href} target="_blank" rel="noopener noreferrer" className={cls} style={style}>
      {children}
    </a>
  ) : (
    <button type="button" className={cls} style={style}>
      {children}
    </button>
  );
}

function NSection({
  type,
  bg,
  index,
  className = "",
  children,
}: {
  type: BlockType;
  bg: keyof ThemeColors;
  index: number;
  className?: string;
  children: ReactNode;
}) {
  return (
    <section data-block={type} className={`relative px-7 py-14 ${className}`} style={{ background: col(bg) }}>
      {index > 0 && <TopTear fill={col(bg)} seed={index * 3 + 2} />}
      {children}
    </section>
  );
}

export function NatureCountdown({ date, time }: { date: string; time: string }) {
  const target = useMemo(() => targetTimestamp(date, time), [date, time]);
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  let cells: [string, string][] = [
    ["--", "Dagen"],
    ["--", "Uren"],
    ["--", "Minuten"],
    ["--", "Seconden"],
  ];
  if (target !== null && now !== null) {
    const s = Math.floor(Math.max(0, target - now) / 1000);
    const pad = (n: number) => String(n).padStart(2, "0");
    cells = [
      [String(Math.floor(s / 86400)), "Dagen"],
      [pad(Math.floor((s % 86400) / 3600)), "Uren"],
      [pad(Math.floor((s % 3600) / 60)), "Minuten"],
      [pad(s % 60), "Seconden"],
    ];
  }

  return (
    <div className="mt-7 grid grid-cols-4 text-center">
      {cells.map(([value, label], i) => (
        <div
          key={label}
          className="px-0.5"
          style={i > 0 ? { borderLeft: "1px solid color-mix(in srgb, var(--inv-text) 20%, transparent)" } : undefined}
        >
          <p className="text-[2.1rem] leading-none tabular-nums" style={heading}>
            {value}
          </p>
          <p className="mt-2 text-[0.62rem]" style={{ color: col("muted") }}>
            {label}
          </p>
        </div>
      ))}
    </div>
  );
}

export function NatureBlockSection({
  block,
  config,
  index,
}: {
  block: Block;
  config: InvitationConfig;
  index: number;
}) {
  const body = "text-[0.82rem] leading-[1.7] whitespace-pre-line";

  switch (block.type) {
    case "hero":
      return (
        <section data-block="hero" className="relative">
          <div className="relative flex h-[29rem] flex-col items-center justify-end overflow-hidden px-6 pb-16 text-center text-white">
            <NaturePhoto tone="warm" />
            <div
              className="absolute inset-0"
              style={{ background: "linear-gradient(to top, rgb(34 38 22 / .66), rgb(34 38 22 / .14) 58%, transparent)" }}
            />
            <span className="absolute top-3.5 right-4 flex items-center gap-1.5 text-[0.45rem] tracking-[0.2em] uppercase opacity-70">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect x="3" y="4" width="18" height="16" rx="2" />
                <circle cx="9" cy="10" r="1.6" />
                <path d="m21 16-5-5-9 9" />
              </svg>
              Editorial portret
            </span>
            <div className="relative" style={{ textShadow: "0 1px 16px rgb(0 0 0 / .35)" }}>
              <p className="text-[0.58rem] tracking-[0.32em] uppercase opacity-90">{block.eyebrow}</p>
              <div className="mt-3 flex flex-wrap items-baseline justify-center gap-x-2.5">
                <span className="text-[2.9rem] leading-[1.15]" style={script}>
                  {config.partner1}
                </span>
                <span className="text-[1.4rem] italic opacity-90" style={heading}>
                  &amp;
                </span>
                <span className="text-[2.9rem] leading-[1.15]" style={script}>
                  {config.partner2}
                </span>
              </div>
              <p className="mt-3 text-[0.82rem] tracking-[0.22em]">
                {formatDateDots(config.date)}
                {config.city ? ` · ${config.city}` : ""}
              </p>
              <Sprig size={34} className="mx-auto mt-3 opacity-90" />
            </div>
          </div>
        </section>
      );

    case "countdown":
      return (
        <NSection type="countdown" bg="background" index={index}>
          <div className="text-center">
            {block.eyebrow && <Eyebrow>{block.eyebrow}</Eyebrow>}
            <h2 className="mt-2 text-[1.35rem] leading-tight italic" style={heading}>
              {block.title}
            </h2>
          </div>
          <NatureCountdown date={config.date} time={config.time} />
          <SprigDivider className="mt-9" />
        </NSection>
      );

    case "story":
      return (
        <NSection type="story" bg="background" index={index}>
          <SectionHead eyebrow={block.eyebrow} title={block.title} />
          <div className="relative -mx-7 mt-8 h-[13.5rem] overflow-hidden">
            <NaturePhoto tone="soft" />
            <TornEdge fill={col("background")} seed={index * 3 + 5} flip className="top-0" />
            <TornEdge fill={col("background")} seed={index * 3 + 7} className="bottom-0" />
          </div>
          <p className={`mt-7 text-center ${body}`} style={{ color: col("muted") }}>
            {block.text}
          </p>
        </NSection>
      );

    case "program":
      return (
        <NSection type="program" bg="surface" index={index}>
          <SectionHead eyebrow={block.eyebrow} title={block.title} />
          <ul className="relative mt-8">
            <span
              aria-hidden="true"
              className="absolute top-4 bottom-4 left-[0.2rem] w-px"
              style={{ background: "color-mix(in srgb, var(--inv-accent) 70%, transparent)" }}
            />
            {block.items.map((item, i) => {
              const Icon = programIcon(item.title);
              return (
                <li key={i} className="grid grid-cols-[0.5rem_2.8rem_1fr] items-center gap-x-3.5 py-3">
                  <span className="size-[0.45rem] rounded-full" style={{ background: col("accent") }} />
                  <Icon size={42} className="opacity-90" />
                  <span>
                    <span className="block text-[0.8rem] tracking-[0.08em]" style={{ color: col("text") }}>
                      {item.time}
                    </span>
                    <span className="block text-[1rem] leading-tight" style={heading}>
                      {item.title}
                    </span>
                    {item.subtitle && (
                      <span className="mt-0.5 block text-[0.72rem] italic" style={{ color: col("muted") }}>
                        {item.subtitle}
                      </span>
                    )}
                  </span>
                </li>
              );
            })}
          </ul>
        </NSection>
      );

    case "location": {
      const query = encodeURIComponent([block.title, config.city].filter(Boolean).join(" "));
      return (
        <NSection type="location" bg="background" index={index} className="text-center">
          <div className="flex justify-center" style={{ color: col("accent") }}>
            <ChapelIcon size={58} />
          </div>
          <div className="mt-5">
            <SectionHead eyebrow={block.eyebrow} title={block.title} />
          </div>
          <p className={`mx-auto mt-5 max-w-[17rem] ${body}`} style={{ color: col("muted") }}>
            {block.address}
          </p>
          <div className="mt-6">
            <PillButton href={`https://www.google.com/maps/search/?api=1&query=${query}`}>Bekijk route</PillButton>
          </div>
        </NSection>
      );
    }

    case "dresscode":
      return (
        <NSection type="dresscode" bg="surfaceAlt" index={index} className="text-center">
          <SectionHead eyebrow={block.eyebrow} title={block.title} />
          <p className={`mx-auto mt-5 max-w-[17rem] ${body}`} style={{ color: col("text") }}>
            {block.text}
          </p>
          {block.colors.length > 0 && (
            <div className="mt-6 flex justify-center gap-3">
              {block.colors.map((c, i) => (
                <span
                  key={i}
                  className="size-6 rounded-full"
                  style={{ background: c, boxShadow: "0 0 0 2px rgb(255 255 255 / .7), 0 1px 4px rgb(0 0 0 / .12)" }}
                />
              ))}
            </div>
          )}
        </NSection>
      );

    case "rsvp":
      return (
        <NSection type="rsvp" bg="background" index={index} className="text-center">
          <div className="flex justify-center" style={{ color: col("accent") }}>
            <EnvelopeIcon size={50} />
          </div>
          <div className="mt-5">
            <SectionHead eyebrow={block.eyebrow} title={block.title} />
          </div>
          <p className={`mx-auto mt-5 max-w-[17rem] ${body}`} style={{ color: col("muted") }}>
            {block.text}
          </p>
          <div className="mt-6">
            <PillButton>{block.buttonLabel}</PillButton>
          </div>
        </NSection>
      );

    case "footer":
      return (
        <section
          data-block="footer"
          className="relative px-7 pt-14 pb-24 text-center"
          style={{ background: col("footerBackground"), color: col("footerText") }}
        >
          {index > 0 && <TopTear fill={col("footerBackground")} seed={index * 3 + 2} />}
          <Sprig size={34} className="mx-auto opacity-80" />
          <p className="mt-3 text-[2.2rem] leading-[1.2] text-balance" style={script}>
            {block.closing ? `${block.closing} ` : ""}
            {config.partner1}{" "}
            <span className="whitespace-nowrap">&amp; {config.partner2}</span>
          </p>
          {block.contactEmail && <p className="mt-4 text-[0.7rem] opacity-75">Vragen? mail naar {block.contactEmail}</p>}
          <p className="mt-2 text-[0.64rem] tracking-[0.12em] uppercase opacity-60">
            {[formatDateLong(config.date), config.city].filter(Boolean).join(" · ")}
          </p>
        </section>
      );
  }
}
