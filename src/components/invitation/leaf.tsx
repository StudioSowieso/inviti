"use client";

import { StoryImg } from "./story-photo";
import { useId, type CSSProperties, type ReactNode } from "react";
import { formatDateDots, formatDateLong } from "@/lib/invitation/format";
import type { Block, BlockType, InvitationConfig, ThemeColors } from "@/lib/invitation/types";
import { ChapelIcon, EnvelopeIcon, NatureCountdown, programIcon } from "./nature";
import { mapsHref } from "@/lib/invitation/format";

/**
 * Stijl "leaf": rustig en elegant. Gladde vlakken zonder gescheurde randen, een boogvormige foto,
 * dunne lijnen en sierlijke olijftakken als scheiding. Alle kleuren komen uit het thema.
 */

const col = (key: keyof ThemeColors) => `var(--inv-${key})`;
const heading = { fontFamily: "var(--inv-heading)" } satisfies CSSProperties;
const script = { fontFamily: "var(--inv-script)" } satisfies CSSProperties;

// ---------- Getekende olijftakken ----------

/**
 * Takken worden procedureel "getekend": een lichtjes onregelmatige stengel, bladeren van wisselende
 * grootte en hoek met een eigen vorm en nerf, en hier en daar een olijf. Elke tak heeft een vaste
 * `seed`, dus server en browser tekenen exact hetzelfde.
 */

export type BranchOpts = { len: number; bow: number; leaves: number; leafLen: number; olives?: number };
export type BranchArtData = {
  stem: string;
  leaves: { transform: string; d: string; vein: string }[];
  olives: { stalk: string; cx: number; cy: number; rot: number }[];
};

const r1 = (n: number) => Math.round(n * 10) / 10;

export function makeBranch(seed: number, { len, bow, leaves, leafLen, olives = 0 }: BranchOpts): BranchArtData {
  let st = (seed * 9301 + 49297) % 233280;
  const rand = () => {
    st = (st * 9301 + 49297) % 233280;
    return st / 233280;
  };

  const N = 26;
  const pts: [number, number][] = [];
  for (let i = 0; i <= N; i++) {
    const t = i / N;
    const wobble = Math.sin(t * 8 + seed) * len * 0.006 + (rand() - 0.5) * len * 0.007;
    pts.push([t * len, -bow * Math.sin(t * Math.PI * 0.85) + wobble]);
  }
  const mid = (a: [number, number], b: [number, number]) => `${r1((a[0] + b[0]) / 2)} ${r1((a[1] + b[1]) / 2)}`;
  let stem = `M${r1(pts[0][0])} ${r1(pts[0][1])}`;
  for (let i = 1; i < N; i++) stem += `Q${r1(pts[i][0])} ${r1(pts[i][1])} ${mid(pts[i], pts[i + 1])}`;
  stem += `L${r1(pts[N][0])} ${r1(pts[N][1])}`;

  const at = (t: number) => {
    const f = Math.min(N - 0.001, Math.max(0, t * N));
    const i = Math.floor(f);
    const k = f - i;
    const x = pts[i][0] + (pts[i + 1][0] - pts[i][0]) * k;
    const y = pts[i][1] + (pts[i + 1][1] - pts[i][1]) * k;
    const angle = (Math.atan2(pts[i + 1][1] - pts[i][1], pts[i + 1][0] - pts[i][0]) * 180) / Math.PI;
    return { x, y, angle };
  };

  const leaf = (L: number) => {
    const W = L * (0.26 + rand() * 0.08);
    const j = () => (rand() - 0.5) * 0.35;
    const d =
      `M0 0C${r1(L * 0.2)} ${r1(-W * (1.05 + j()))} ${r1(L * 0.66)} ${r1(-W * (0.95 + j()))} ${r1(L)} ${r1(j() * W * 0.5)}` +
      `C${r1(L * 0.7)} ${r1(W * (0.75 + j()))} ${r1(L * 0.24)} ${r1(W * (1.05 + j()))} 0 0Z`;
    const vein = `M0 0Q${r1(L * 0.5)} ${r1((rand() - 0.5) * W * 0.5)} ${r1(L * 0.9)} ${r1((rand() - 0.5) * W * 0.3)}`;
    return { d, vein };
  };

  const out: BranchArtData["leaves"] = [];
  let side = rand() > 0.5 ? 1 : -1;
  for (let k = 0; k < leaves; k++) {
    const t = Math.min(0.93, 0.08 + (0.86 * (k + rand() * 0.55)) / leaves);
    const p = at(t);
    side = rand() > 0.22 ? -side : side;
    const size = (1.08 - 0.5 * t) * (0.82 + rand() * 0.34);
    const angle = p.angle + side * (36 + rand() * 32);
    out.push({ transform: `translate(${r1(p.x)} ${r1(p.y)}) rotate(${r1(angle)})`, ...leaf(leafLen * size) });
  }
  const tip = at(1);
  out.push({ transform: `translate(${r1(tip.x)} ${r1(tip.y)}) rotate(${r1(tip.angle - 6)})`, ...leaf(leafLen * 0.78) });

  const oliveList: BranchArtData["olives"] = [];
  for (let k = 0; k < olives; k++) {
    const t = 0.22 + (0.55 * (k + 0.3 + rand() * 0.4)) / Math.max(1, olives);
    const p = at(t);
    const dir = k % 2 === 0 ? 1 : -1;
    const a = ((p.angle + dir * 78) * Math.PI) / 180;
    const sx = p.x + Math.cos(a) * leafLen * 0.34;
    const sy = p.y + Math.sin(a) * leafLen * 0.34;
    oliveList.push({
      stalk: `M${r1(p.x)} ${r1(p.y)}Q${r1((p.x + sx) / 2 + 1.5)} ${r1((p.y + sy) / 2)} ${r1(sx)} ${r1(sy)}`,
      cx: r1(sx + Math.cos(a) * leafLen * 0.1),
      cy: r1(sy + Math.sin(a) * leafLen * 0.1),
      rot: r1((a * 180) / Math.PI + 90),
    });
  }
  return { stem, leaves: out, olives: oliveList };
}

const SMALL = makeBranch(3, { len: 120, bow: 13, leaves: 9, leafLen: 13 });
const BIG = makeBranch(7, { len: 292, bow: 62, leaves: 16, leafLen: 34, olives: 3 });
const BIG_SIDE = makeBranch(12, { len: 210, bow: 34, leaves: 11, leafLen: 27, olives: 2 });
const PHOTO_A = makeBranch(21, { len: 310, bow: 44, leaves: 14, leafLen: 32 });
const PHOTO_B = makeBranch(34, { len: 280, bow: 38, leaves: 12, leafLen: 30, olives: 2 });

/** Tekent een tak; kleur en bladvulling volgen `currentColor`. */
export function BranchArt({
  data,
  stemWidth = 1,
  leafWidth = 0.7,
  leafFill = 22,
  oliveSize = 4.4,
}: {
  data: BranchArtData;
  stemWidth?: number;
  leafWidth?: number;
  leafFill?: number;
  oliveSize?: number;
}) {
  const fill = { fill: `color-mix(in srgb, currentColor ${leafFill}%, transparent)` };
  return (
    <g strokeLinecap="round" strokeLinejoin="round" fill="none" stroke="currentColor">
      <path d={data.stem} strokeWidth={stemWidth} />
      {data.olives.map((o, i) => (
        <g key={i}>
          <path d={o.stalk} strokeWidth={stemWidth * 0.7} />
          <ellipse
            cx={o.cx}
            cy={o.cy}
            rx={oliveSize * 0.62}
            ry={oliveSize}
            transform={`rotate(${o.rot} ${o.cx} ${o.cy})`}
            strokeWidth={leafWidth}
            style={{ fill: `color-mix(in srgb, currentColor ${leafFill + 28}%, transparent)` }}
          />
        </g>
      ))}
      {data.leaves.map((l, i) => (
        <g key={i} transform={l.transform}>
          <path d={l.d} strokeWidth={leafWidth} style={fill} />
          <path d={l.vein} strokeWidth={leafWidth * 0.7} opacity=".7" />
        </g>
      ))}
    </g>
  );
}

/** Een kleine getekende tak. Met `flip` wijst hij naar links. */
export function Branch({ size = 64, flip = false, className = "" }: { size?: number; flip?: boolean; className?: string }) {
  return (
    <svg
      viewBox="-6 -34 138 62"
      width={size}
      height={(size * 62) / 138}
      aria-hidden="true"
      className={className}
      style={{ transform: flip ? "scaleX(-1)" : undefined, color: col("accent") }}
    >
      <BranchArt data={SMALL} />
    </svg>
  );
}

/** Twee takken die naar elkaar toe buigen, als sierlijke scheiding. */
export function BranchPair({ size = 190, className = "" }: { size?: number; className?: string }) {
  return (
    <svg
      viewBox="-4 -34 284 62"
      width={size}
      height={(size * 62) / 284}
      aria-hidden="true"
      className={`mx-auto block ${className}`}
      style={{ color: col("accent") }}
    >
      <g transform="translate(2 4)">
        <BranchArt data={SMALL} />
      </g>
      <g transform="translate(274 4) scale(-1 1)">
        <BranchArt data={SMALL} />
      </g>
    </svg>
  );
}

/** De grote tak bovenaan de uitnodiging: een sierlijke, getekende olijftak met een kleinere ernaast. */
export function HeroBranch({ className = "", style }: { className?: string; style?: CSSProperties }) {
  return (
    <svg
      viewBox="0 0 320 235"
      aria-hidden="true"
      className={`block w-full ${className}`}
      style={{ color: col("accent"), ...style }}
    >
      <g transform="translate(6 108) rotate(10)">
        <BranchArt data={BIG} stemWidth={1.5} leafWidth={0.9} leafFill={24} oliveSize={6} />
      </g>
      <g transform="translate(334 214) scale(-1 1) rotate(-4)">
        <BranchArt data={BIG_SIDE} stemWidth={1.2} leafWidth={0.8} leafFill={20} oliveSize={5} />
      </g>
    </svg>
  );
}

/**
 * Fotovervanger voor Leaf: een zachte, getinte vlakte met getekende olijftakken. Net als de rest van het
 * thema bevat hij alleen takken en bladeren, geen landschap. Kleuren volgen het gekozen palet.
 */
export function LeafPhoto({ className = "" }: { className?: string }) {
  const id = useId().replace(/:/g, "");
  const bg = "var(--inv-background)";
  const acc = "var(--inv-accent)";
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 300 400"
      preserveAspectRatio="xMidYMid slice"
      className={`absolute inset-0 h-full w-full ${className}`}
    >
      <defs>
        <linearGradient id={`lp${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" style={{ stopColor: `color-mix(in srgb, ${bg} 80%, ${acc} 20%)` }} />
          <stop offset="1" style={{ stopColor: `color-mix(in srgb, ${bg} 52%, ${acc} 48%)` }} />
        </linearGradient>
        <radialGradient id={`lg${id}`} cx=".5" cy=".3" r=".6">
          <stop offset="0" stopColor="#fff" stopOpacity=".55" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="300" height="400" fill={`url(#lp${id})`} />
      <rect width="300" height="400" fill={`url(#lg${id})`} />
      <g style={{ color: `color-mix(in srgb, ${acc} 80%, black)` }}>
        <g transform="translate(70 420) rotate(-96)" opacity=".85">
          <BranchArt data={PHOTO_A} stemWidth={1.4} leafWidth={0.9} leafFill={30} oliveSize={6} />
        </g>
        <g transform="translate(236 420) scale(-1 1) rotate(-100)" opacity=".7">
          <BranchArt data={PHOTO_B} stemWidth={1.3} leafWidth={0.9} leafFill={26} oliveSize={6} />
        </g>
      </g>
    </svg>
  );
}

// ---------- Opbouw ----------

function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <p className="text-[0.58rem] tracking-[0.3em] uppercase" style={{ color: col("muted") }}>
      {children}
    </p>
  );
}

/** Kop met takjes aan beide kanten van het label, titel in cursief en een dunne lijn. */
function SectionHead({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <header className="text-center">
      {eyebrow && (
        <div className="flex items-center justify-center gap-2.5">
          <Branch size={50} flip />
          <Eyebrow>{eyebrow}</Eyebrow>
          <Branch size={50} />
        </div>
      )}
      <h2 className="mt-3.5 text-[2rem] leading-[1.1] font-medium italic" style={heading}>
        {title}
      </h2>
      <span className="mx-auto mt-4 block h-px w-10" style={{ background: col("accent") }} />
    </header>
  );
}

function PillButton({ children, href }: { children: ReactNode; href?: string }) {
  const cls =
    "inline-flex items-center justify-center px-9 py-3 text-[0.6rem] font-medium tracking-[0.22em] uppercase";
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

function LSection({
  type,
  bg,
  className = "",
  children,
}: {
  type: BlockType;
  bg: keyof ThemeColors;
  className?: string;
  children: ReactNode;
}) {
  return (
    <section data-block={type} className={`relative px-7 py-14 ${className}`} style={{ background: col(bg) }}>
      {children}
    </section>
  );
}

export function LeafBlockSection({ block, config }: { block: Block; config: InvitationConfig; index: number }) {
  const body = "text-[0.84rem] leading-[1.75] whitespace-pre-line";

  switch (block.type) {
    case "hero":
      return (
        <section data-block="hero" className="relative px-6 pt-10 pb-14 text-center" style={{ background: col("surface") }}>
          <Eyebrow>{block.eyebrow}</Eyebrow>
          <HeroBranch className="-mx-2 mt-2" style={{ width: "calc(100% + 1rem)" }} />
          <div className="-mt-2">
            <div className="flex flex-wrap items-baseline justify-center gap-x-2.5">
              <span className="text-[2.8rem] leading-[1.15]" style={script}>
                {config.partner1}
              </span>
              <span className="text-[1.35rem] italic" style={{ ...heading, color: col("accent") }}>
                &amp;
              </span>
              <span className="text-[2.8rem] leading-[1.15]" style={script}>
                {config.partner2}
              </span>
            </div>
            <p className="mt-3 text-[0.82rem] tracking-[0.22em]" style={{ color: col("muted") }}>
              {formatDateDots(config.date)}
              {config.city ? ` · ${config.city}` : ""}
            </p>
            <BranchPair size={200} className="mt-5" />
          </div>
        </section>
      );

    case "countdown":
      return (
        <LSection type="countdown" bg="background">
          <div className="text-center">
            {block.eyebrow && <Eyebrow>{block.eyebrow}</Eyebrow>}
            <h2 className="mt-2 text-[1.35rem] leading-tight italic" style={heading}>
              {block.title}
            </h2>
          </div>
          <NatureCountdown date={config.date} time={config.time} />
          <BranchPair size={170} className="mt-10" />
        </LSection>
      );

    case "story":
      return (
        <LSection type="story" bg="surface">
          <SectionHead eyebrow={block.eyebrow} title={block.title} />
          <div className="relative mx-auto mt-9 w-full max-w-[17rem]">
            <span
              aria-hidden="true"
              className="pointer-events-none absolute -inset-2 rounded-[1.4rem]"
              style={{ border: "1px solid color-mix(in srgb, var(--inv-accent) 50%, transparent)" }}
            />
            <div className="relative h-[13rem] overflow-hidden rounded-[1.1rem]">
              {block.photo ? <StoryImg src={block.photo} /> : <LeafPhoto />}
            </div>
          </div>
          <p className={`mt-9 text-center ${body}`} style={{ color: col("muted") }}>
            {block.text}
          </p>
        </LSection>
      );

    case "program":
      return (
        <LSection type="program" bg="background">
          <SectionHead eyebrow={block.eyebrow} title={block.title} />
          <ul className="relative mt-8">
            <span
              aria-hidden="true"
              className="absolute top-5 bottom-5 left-[0.2rem] w-px"
              style={{ background: "color-mix(in srgb, var(--inv-accent) 65%, transparent)" }}
            />
            {block.items.map((item, i) => {
              const Icon = programIcon(item.title);
              return (
                <li key={i} className="grid grid-cols-[0.5rem_2.8rem_1fr] items-center gap-x-3.5 py-3">
                  <span className="size-[0.45rem] rounded-full" style={{ background: col("accent") }} />
                  <span style={{ color: col("accent") }}>
                    <Icon size={42} />
                  </span>
                  <span>
                    <span className="block text-[0.78rem] tracking-[0.1em]" style={{ color: col("muted") }}>
                      {item.time}
                    </span>
                    <span className="block text-[1.05rem] leading-tight" style={heading}>
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
        </LSection>
      );

    case "location": {
      return (
        <LSection type="location" bg="surface" className="text-center">
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
            <PillButton href={mapsHref(block.mapsUrl, block.title, config.city)}>Bekijk route</PillButton>
          </div>
        </LSection>
      );
    }

    case "dresscode":
      return (
        <LSection type="dresscode" bg="surfaceAlt" className="text-center">
          <div
            className="rounded-[1.5rem] px-5 py-9"
            style={{ border: "1px solid color-mix(in srgb, var(--inv-accent) 55%, transparent)" }}
          >
            <SectionHead eyebrow={block.eyebrow} title={block.title} />
            <p className={`mx-auto mt-5 max-w-[16rem] ${body}`} style={{ color: col("text") }}>
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
          </div>
        </LSection>
      );

    case "rsvp":
      return (
        <LSection type="rsvp" bg="background" className="text-center">
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
        </LSection>
      );

    case "footer":
      return (
        <section
          data-block="footer"
          className="relative px-7 pt-14 pb-24 text-center"
          style={{ background: col("footerBackground"), color: col("footerText") }}
        >
          <BranchPair size={190} />
          <p className="mt-4 text-[2.2rem] leading-[1.2] text-balance" style={script}>
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
