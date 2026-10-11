"use client";

import { useMemo, type CSSProperties, type ReactNode } from "react";
import { blockKey, formatDateLong, mapsHref } from "@/lib/invitation/format";
import type { Block, InvitationConfig, ThemeColors } from "@/lib/invitation/types";
import { StoryImg } from "./story-photo";
import { useCountdown } from "./use-countdown";

/**
 * Stijl "flowers": crèmekleurig papier met aquarel-achtige wildbloemtakken in de hoeken, naamregels in
 * gespatieerde hoofdletters en cijfers tussen dunne verticale lijnen. Bloemen volgen het accent, bladeren
 * en stelen de envelopkleur; alle kleuren komen uit het thema.
 */

const col = (key: keyof ThemeColors) => `var(--inv-${key})`;
const heading = { fontFamily: "var(--inv-heading)" } satisfies CSSProperties;
const script = { fontFamily: "var(--inv-script)" } satisfies CSSProperties;

const CAPS = "uppercase tracking-[0.2em]";

// ---------- Takken met bloemetjes ----------

function rng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

type SprigOpts = { len: number; bow: number; leaves: number; flowers: number };

type SprigData = {
  stem: string;
  leaves: { x: number; y: number; deg: number; len: number }[];
  twigs: { x1: number; y1: number; x2: number; y2: number }[];
  blossoms: { x: number; y: number; r: number; rot: number }[];
};

function buildSprig(seed: number, { len, bow, leaves, flowers }: SprigOpts): SprigData {
  const r = rng(seed);
  // Kwadratische Bézier van (0,0) via (len/2, -bow) naar (len, 0).
  const point = (t: number) => ({ x: (1 - t) * t * len + t * t * len, y: -2 * (1 - t) * t * bow });
  const angle = (t: number) => Math.atan2(2 * bow * (2 * t - 1), len);
  const out: SprigData = { stem: `M0 0Q${len / 2} ${-bow} ${len} 0`, leaves: [], twigs: [], blossoms: [] };

  for (let i = 0; i < leaves; i++) {
    const t = 0.1 + (0.82 * i) / Math.max(1, leaves - 1);
    const side = i % 2 ? 1 : -1;
    const p = point(t);
    out.leaves.push({
      x: p.x,
      y: p.y,
      deg: ((angle(t) + side * (0.7 + r() * 0.5)) * 180) / Math.PI,
      len: (7 + r() * 6) * (1.15 - t * 0.5),
    });
  }
  for (let k = 0; k < flowers; k++) {
    const t = 0.42 + (0.5 * k) / Math.max(1, flowers - 1);
    const side = k % 2 ? 1 : -1;
    const p = point(t);
    const a = angle(t) + side * (0.55 + r() * 0.3);
    const l = 9 + r() * 9;
    const e = { x: p.x + Math.cos(a) * l, y: p.y + Math.sin(a) * l };
    out.twigs.push({ x1: p.x, y1: p.y, x2: e.x, y2: e.y });
    out.blossoms.push({ x: e.x, y: e.y, r: 3.6 + r() * 2.4, rot: r() * 72 });
  }
  const tip = point(1);
  out.blossoms.push({ x: tip.x, y: tip.y, r: 4.6, rot: r() * 72 });
  return out;
}

function Blossom({ x, y, r, rot }: { x: number; y: number; r: number; rot: number }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot})`}>
      {[0, 1, 2, 3, 4].map((i) => (
        <ellipse
          key={i}
          cx={0}
          cy={-r * 0.62}
          rx={r * 0.52}
          ry={r * 0.82}
          transform={`rotate(${i * 72})`}
          style={{ fill: col("accent"), opacity: 0.82, stroke: `color-mix(in srgb, ${col("accent")} 70%, black)`, strokeOpacity: 0.25 }}
          strokeWidth={0.35}
        />
      ))}
      <circle r={r * 0.27} fill="#f1d98a" />
    </g>
  );
}

function SprigArt({ data }: { data: SprigData }) {
  const stem = `color-mix(in srgb, ${col("envelope")} 80%, ${col("text")})`;
  return (
    <g>
      <path d={data.stem} fill="none" strokeLinecap="round" strokeWidth={0.9} style={{ stroke: stem }} />
      {data.twigs.map((t, i) => (
        <line key={i} x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2} strokeWidth={0.7} strokeLinecap="round" style={{ stroke: stem }} />
      ))}
      {data.leaves.map((l, i) => (
        <g key={i} transform={`translate(${l.x} ${l.y}) rotate(${l.deg})`}>
          <ellipse cx={l.len / 2} cy={0} rx={l.len / 2} ry={l.len * 0.27} style={{ fill: col("envelope"), fillOpacity: 0.62, stroke: stem, strokeOpacity: 0.55 }} strokeWidth={0.4} />
        </g>
      ))}
      {data.blossoms.map((b, i) => (
        <Blossom key={i} {...b} />
      ))}
    </g>
  );
}

type Corner = "tl" | "tr" | "bl" | "br";

const FLIP: Record<Corner, string> = { tl: "none", tr: "scaleX(-1)", bl: "scaleY(-1)", br: "scale(-1,-1)" };

/** Drie takken die vanuit een hoek de kaart in groeien. */
export function CornerSprigs({ corner, seed = 7, size = "11rem", className = "" }: { corner: Corner; seed?: number; size?: string; className?: string }) {
  const sprigs = useMemo(
    () => [
      { d: buildSprig(seed, { len: 150, bow: 16, leaves: 11, flowers: 5 }), t: "translate(8 12) rotate(9)" },
      { d: buildSprig(seed + 3, { len: 118, bow: -13, leaves: 8, flowers: 3 }), t: "translate(10 14) rotate(76)" },
      { d: buildSprig(seed + 8, { len: 78, bow: 9, leaves: 6, flowers: 2 }), t: "translate(9 11) rotate(42)" },
    ],
    [seed],
  );
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 190 190"
      className={`pointer-events-none absolute ${className}`}
      style={{
        width: size,
        height: size,
        top: corner[0] === "t" ? 0 : undefined,
        bottom: corner[0] === "b" ? 0 : undefined,
        left: corner[1] === "l" ? 0 : undefined,
        right: corner[1] === "r" ? 0 : undefined,
        transform: FLIP[corner],
      }}
    >
      {sprigs.map((s, i) => (
        <g key={i} transform={s.t}>
          <SprigArt data={s.d} />
        </g>
      ))}
    </svg>
  );
}

/** Een los takje als scheiding tussen tekstdelen. */
function SprigDivider({ className = "" }: { className?: string }) {
  const data = useMemo(() => buildSprig(21, { len: 70, bow: 0, leaves: 6, flowers: 0 }), []);
  return (
    <svg aria-hidden="true" viewBox="-6 -16 82 32" width={72} className={`mx-auto ${className}`}>
      <SprigArt data={data} />
    </svg>
  );
}

// ---------- Opbouw ----------

function FSection({
  type,
  bg,
  corners,
  seed,
  className = "",
  children,
}: {
  type: string;
  bg: keyof ThemeColors;
  corners: Corner[];
  seed: number;
  className?: string;
  children: ReactNode;
}) {
  return (
    <section data-block={type} className={`relative overflow-hidden px-9 py-14 ${className}`} style={{ background: col(bg) }}>
      {corners.map((c) => (
        <CornerSprigs key={c} corner={c} seed={seed} size="7.5rem" className="opacity-90" />
      ))}
      <div className="relative">{children}</div>
    </section>
  );
}

function SectionHead({ eyebrow, title }: { eyebrow?: string; title: string }) {
  return (
    <div className="text-center">
      {eyebrow && (
        <p className={`text-[0.5rem] ${CAPS}`} style={{ color: col("muted") }}>
          {eyebrow}
        </p>
      )}
      <h2 className="mt-3 text-[1.45rem] leading-tight tracking-[0.14em] uppercase" style={heading}>
        {title}
      </h2>
    </div>
  );
}

function PillButton({ children, href }: { children: ReactNode; href?: string }) {
  const cls = "inline-block px-6 py-2.5 text-[0.55rem] tracking-[0.2em] uppercase";
  const style = { background: col("buttonBackground"), color: col("buttonText"), borderRadius: "var(--inv-radius)" } satisfies CSSProperties;
  return href ? (
    <a href={href} target="_blank" rel="noreferrer" className={cls} style={style}>
      {children}
    </a>
  ) : (
    <span className={cls} style={style}>
      {children}
    </span>
  );
}

function dateParts(date: string) {
  const d = new Date(`${date}T12:00:00Z`);
  if (Number.isNaN(d.getTime())) return null;
  const f = (o: Intl.DateTimeFormatOptions) => new Intl.DateTimeFormat("nl-NL", { timeZone: "UTC", ...o }).format(d);
  return { weekday: f({ weekday: "long" }), month: f({ month: "long" }), day: f({ day: "numeric" }), year: f({ year: "numeric" }) };
}

function FlowerPlaceholder() {
  return (
    <div className="relative h-full w-full overflow-hidden" style={{ background: `color-mix(in srgb, ${col("surfaceAlt")} 80%, ${col("accent")})` }}>
      <CornerSprigs corner="tl" seed={31} size="9rem" />
      <CornerSprigs corner="br" seed={37} size="9rem" />
    </div>
  );
}

export function FlowersBlockSection({ block, config, index }: { block: Block; config: InvitationConfig; index: number }) {
  const body = "text-[0.8rem] leading-[1.75] whitespace-pre-line";
  const corners: Corner[] = index % 2 ? ["tl"] : ["br"];

  switch (block.type) {
    case "hero": {
      const p = dateParts(config.date);
      return (
        <section data-block="hero" className="relative flex min-h-[36rem] flex-col justify-center overflow-hidden px-8 py-16 text-center" style={{ background: col("background") }}>
          <CornerSprigs corner="tl" seed={7} size="12.5rem" />
          <CornerSprigs corner="br" seed={13} size="12.5rem" />
          <div className="relative">
            <p className={`mx-auto max-w-[12rem] text-[0.5rem] leading-relaxed ${CAPS}`} style={{ color: col("muted") }}>
              {block.eyebrow}
            </p>
            <div className="mt-7 text-[2.1rem] leading-[1.15] tracking-[0.16em] uppercase" style={heading}>
              <p>{config.partner1}</p>
              <p className="my-0.5 text-[1.9rem] leading-none tracking-normal normal-case italic" style={{ ...script, color: col("accent") }}>
                en
              </p>
              <p>{config.partner2}</p>
            </div>
            <p className={`mx-auto mt-7 max-w-[13rem] text-[0.5rem] leading-relaxed ${CAPS}`}>
              Nodigen je uit om hun bruiloft te vieren
            </p>
            {p && (
              <div className="mt-6">
                <p className={`text-[0.5rem] ${CAPS}`} style={{ color: col("muted") }}>
                  {p.weekday}
                </p>
                <div className="mt-2 flex items-center justify-center gap-4">
                  <span className={`text-[0.55rem] ${CAPS}`}>{p.month}</span>
                  <span className="h-8 w-px" style={{ background: col("line") }} />
                  <span className="text-[2.2rem] leading-none" style={heading}>
                    {p.day}
                  </span>
                  <span className="h-8 w-px" style={{ background: col("line") }} />
                  <span className={`text-[0.55rem] ${CAPS}`}>{p.year}</span>
                </div>
              </div>
            )}
            <p className={`mt-6 text-[0.5rem] ${CAPS}`}>Om {config.time} uur</p>
            {config.city && (
              <p className={`mt-1.5 text-[0.55rem] ${CAPS}`} style={{ color: col("muted") }}>
                {config.city}
              </p>
            )}
          </div>
        </section>
      );
    }

    case "countdown":
      return (
        <FSection type="countdown" bg="surface" corners={corners} seed={index * 5 + 2}>
          <SectionHead eyebrow={block.eyebrow} title={block.title} />
          <FlowersCountdown date={config.date} time={config.time} />
        </FSection>
      );

    case "story":
      return (
        <FSection type="story" bg="background" corners={corners} seed={index * 5 + 2}>
          <SectionHead eyebrow={block.eyebrow} title={block.title} />
          <div className="mx-auto mt-8 w-[78%] overflow-hidden" style={{ aspectRatio: "0.82", borderRadius: "999px 999px 0.4rem 0.4rem", boxShadow: `0 0 0 0.3rem ${col("background")}, 0 0 0 0.36rem ${col("line")}` }}>
            {block.photo ? (
              <div className="relative h-full w-full">
                <StoryImg src={block.photo} />
              </div>
            ) : (
              <FlowerPlaceholder />
            )}
          </div>
          <p className={`mt-8 text-center ${body}`} style={{ color: col("muted") }}>
            {block.text}
          </p>
        </FSection>
      );

    case "text":
      return (
        <FSection type={blockKey(block)} bg="surface" corners={corners} seed={index * 5 + 2}>
          {block.title && <SectionHead title={block.title} />}
          {block.text && (
            <p className={`mt-6 text-center ${body}`} style={{ color: col("muted") }}>
              {block.text}
            </p>
          )}
          <SprigDivider className="mt-8" />
        </FSection>
      );

    case "program":
      return (
        <FSection type="program" bg="surface" corners={corners} seed={index * 5 + 2}>
          <SectionHead eyebrow={block.eyebrow} title={block.title} />
          <ul className="mt-8 text-center">
            {block.items.map((item, i) => (
              <li key={i} className="py-3.5" style={i > 0 ? { borderTop: `1px solid ${col("line")}` } : undefined}>
                <p className="text-[0.95rem] tracking-[0.1em]" style={{ ...heading, color: col("accent") }}>
                  {item.time}
                </p>
                <p className="mt-1 text-[0.72rem] tracking-[0.18em] uppercase">{item.title}</p>
                {item.subtitle && (
                  <p className="mt-1 text-[0.72rem] italic" style={{ color: col("muted") }}>
                    {item.subtitle}
                  </p>
                )}
              </li>
            ))}
          </ul>
        </FSection>
      );

    case "location":
      return (
        <FSection type="location" bg="background" corners={corners} seed={index * 5 + 2} className="text-center">
          <SectionHead eyebrow={block.eyebrow} title={block.title} />
          <p className={`mx-auto mt-5 max-w-[16rem] ${body}`} style={{ color: col("muted") }}>
            {block.address}
          </p>
          <div className="mt-6">
            <PillButton href={mapsHref(block.mapsUrl, block.title, config.city)}>Bekijk route</PillButton>
          </div>
        </FSection>
      );

    case "dresscode":
      return (
        <FSection type="dresscode" bg="surface" corners={corners} seed={index * 5 + 2} className="text-center">
          <SectionHead eyebrow={block.eyebrow} title={block.title} />
          <p className={`mx-auto mt-5 max-w-[16rem] ${body}`} style={{ color: col("muted") }}>
            {block.text}
          </p>
          {block.colors.length > 0 && (
            <div className="mt-6 flex justify-center gap-3">
              {block.colors.map((c, i) => (
                <span key={i} className="size-6 rounded-full" style={{ background: c, boxShadow: `0 0 0 2px ${col("surface")}, 0 0 0 3px ${col("line")}` }} />
              ))}
            </div>
          )}
        </FSection>
      );

    case "rsvp":
      return (
        <FSection type="rsvp" bg="background" corners={corners} seed={index * 5 + 2} className="text-center">
          <SectionHead eyebrow={block.eyebrow} title={block.title} />
          <p className={`mx-auto mt-5 max-w-[16rem] ${body}`} style={{ color: col("muted") }}>
            {block.text}
          </p>
          <div className="mt-6">
            <PillButton>{block.buttonLabel}</PillButton>
          </div>
        </FSection>
      );

    case "footer":
      return (
        <section data-block="footer" className="relative overflow-hidden px-8 pt-14 pb-24 text-center" style={{ background: col("footerBackground"), color: col("footerText") }}>
          <CornerSprigs corner="tl" seed={43} size="8rem" className="opacity-80" />
          <CornerSprigs corner="br" seed={47} size="8rem" className="opacity-80" />
          <div className="relative">
            <p className="text-[2.1rem] leading-[1.25] text-balance" style={script}>
              {block.closing ? `${block.closing} ` : ""}
              {config.partner1} <span className="whitespace-nowrap">&amp; {config.partner2}</span>
            </p>
            {block.contactEmail && <p className="mt-4 text-[0.7rem] opacity-75">Vragen? mail naar {block.contactEmail}</p>}
            <p className={`mt-3 text-[0.5rem] opacity-65 ${CAPS}`}>{[formatDateLong(config.date), config.city].filter(Boolean).join(" · ")}</p>
          </div>
        </section>
      );
  }
}

function FlowersCountdown({ date, time }: { date: string; time: string }) {
  const cells = useCountdown(date, time);
  return (
    <div className="mt-8 grid grid-cols-4 text-center">
      {cells.map(([value, label], i) => (
        <div key={label} style={i > 0 ? { borderLeft: `1px solid ${col("line")}` } : undefined}>
          <p className="text-[1.9rem] leading-none tabular-nums" style={heading}>
            {value}
          </p>
          <p className={`mt-2 text-[0.42rem] ${CAPS}`} style={{ color: col("muted") }}>
            {label}
          </p>
        </div>
      ))}
    </div>
  );
}
