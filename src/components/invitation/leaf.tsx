"use client";

import { useId, type CSSProperties, type ReactNode } from "react";
import { formatDateDots, formatDateLong } from "@/lib/invitation/format";
import type { Block, BlockType, InvitationConfig, ThemeColors } from "@/lib/invitation/types";
import { ChapelIcon, EnvelopeIcon, NatureCountdown, programIcon } from "./nature";

/**
 * Stijl "leaf": rustig en elegant. Gladde vlakken zonder gescheurde randen, een boogvormige foto,
 * dunne lijnen en sierlijke olijftakken als scheiding. Alle kleuren komen uit het thema.
 */

const col = (key: keyof ThemeColors) => `var(--inv-${key})`;
const heading = { fontFamily: "var(--inv-heading)" } satisfies CSSProperties;
const script = { fontFamily: "var(--inv-script)" } satisfies CSSProperties;

// ---------- Olijftak ----------

/** Een tak met bladeren links en rechts langs een zachte boog; berekend zodat de bladeren de stengel volgen. */
const BRANCH = (() => {
  const P0 = [2, 33] as const;
  const P1 = [58, 35] as const;
  const P2 = [118, 7] as const;
  const at = (t: number) => ({
    x: (1 - t) ** 2 * P0[0] + 2 * (1 - t) * t * P1[0] + t ** 2 * P2[0],
    y: (1 - t) ** 2 * P0[1] + 2 * (1 - t) * t * P1[1] + t ** 2 * P2[1],
    angle:
      (Math.atan2(2 * (1 - t) * (P1[1] - P0[1]) + 2 * t * (P2[1] - P1[1]), 2 * (1 - t) * (P1[0] - P0[0]) + 2 * t * (P2[0] - P1[0])) *
        180) /
      Math.PI,
  });
  const leaves = [0.12, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9].map((t, i) => {
    const pt = at(t);
    const side = i % 2 === 0 ? -1 : 1;
    const scale = Math.round((1.05 - t * 0.35) * 100) / 100;
    const r = (n: number) => Math.round(n * 10) / 10;
    return { transform: `translate(${r(pt.x)} ${r(pt.y)}) rotate(${r(pt.angle + side * 48)}) scale(${scale})` };
  });
  const tip = at(1);
  const tipLeaf = {
    transform: `translate(${Math.round(tip.x * 10) / 10} ${Math.round(tip.y * 10) / 10}) rotate(${Math.round(tip.angle * 10) / 10}) scale(.9)`,
  };
  return { leaves, tipLeaf, stem: `M${P0[0]} ${P0[1]}Q${P1[0]} ${P1[1]} ${P2[0]} ${P2[1]}` };
})();

const LEAF = "M0 0C3.4-3.4 9.8-3.4 13.5 0C9.8 3.4 3.4 3.4 0 0Z";

function BranchShape({ leafFill = 22 }: { leafFill?: number }) {
  const fill = { fill: `color-mix(in srgb, currentColor ${leafFill}%, transparent)` };
  return (
    <>
      <path d={BRANCH.stem} />
      {BRANCH.leaves.map((l, i) => (
        <path key={i} d={LEAF} transform={l.transform} style={fill} />
      ))}
      <path d={LEAF} transform={BRANCH.tipLeaf.transform} style={fill} />
    </>
  );
}

/**
 * Fotovervanger voor Leaf: een zachte, getinte vlakte met grote olijftakken. Net als de rest van het
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
      <g fill="none" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" style={{ color: `color-mix(in srgb, ${acc} 80%, black)`, stroke: "currentColor" }}>
        <g transform="translate(104 414) rotate(-104) scale(2.9)" opacity=".85">
          <BranchShape leafFill={34} />
        </g>
        <g transform="translate(196 414) scale(-1 1) rotate(-104) scale(2.9)" opacity=".85">
          <BranchShape leafFill={34} />
        </g>
      </g>
    </svg>
  );
}

/** Een enkele tak. Met `flip` wijst hij naar links. */
export function Branch({ size = 64, flip = false, className = "" }: { size?: number; flip?: boolean; className?: string }) {
  return (
    <svg
      viewBox="0 0 128 40"
      width={size}
      height={(size * 40) / 128}
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
      style={{ transform: flip ? "scaleX(-1)" : undefined, color: col("accent") }}
    >
      <BranchShape />
    </svg>
  );
}

/** Twee takken die naar elkaar toe buigen, als sierlijke scheiding. */
export function BranchPair({ size = 190, className = "" }: { size?: number; className?: string }) {
  return (
    <svg
      viewBox="0 0 264 40"
      width={size}
      height={(size * 40) / 264}
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={`mx-auto block ${className}`}
      style={{ color: col("accent") }}
    >
      <g>
        <BranchShape />
      </g>
      <g transform="translate(264 0) scale(-1 1)">
        <BranchShape />
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
        <section data-block="hero" className="relative px-7 pt-12 pb-14 text-center" style={{ background: col("surface") }}>
          <Eyebrow>{block.eyebrow}</Eyebrow>
          <div className="relative mx-auto mt-7 w-[14.5rem]">
            <span
              aria-hidden="true"
              className="pointer-events-none absolute -inset-2"
              style={{
                border: "1px solid color-mix(in srgb, var(--inv-accent) 55%, transparent)",
                borderRadius: "999px 999px 0.5rem 0.5rem",
              }}
            />
            <div className="relative h-[20rem] overflow-hidden" style={{ borderRadius: "999px 999px 0.4rem 0.4rem" }}>
              <LeafPhoto />
            </div>
          </div>
          <div className="mt-9">
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
            <BranchPair size={200} className="mt-4" />
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
              <LeafPhoto />
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
      const query = encodeURIComponent([block.title, config.city].filter(Boolean).join(" "));
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
            <PillButton href={`https://www.google.com/maps/search/?api=1&query=${query}`}>Bekijk route</PillButton>
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
