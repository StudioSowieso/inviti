"use client";

import type { CSSProperties, ReactNode } from "react";
import { formatDateDots } from "@/lib/invitation/format";
import type { Block, InvitationConfig, ThemeColors } from "@/lib/invitation/types";
import { useCountdown } from "./use-countdown";

/**
 * Stijl "modern": editorial zwart-wit. Witte kaarten met afgeronde hoeken op een greige achtergrond,
 * zeer dun schreefletterlettertype in grote maten, een handschrift voor koppen en strakke rechthoekige
 * knoppen. Alle kleuren komen uit het thema.
 */

const col = (key: keyof ThemeColors) => `var(--inv-${key})`;
const heading = { fontFamily: "var(--inv-heading)", fontWeight: 400 } satisfies CSSProperties;
const script = { fontFamily: "var(--inv-script)" } satisfies CSSProperties;

// ---------- Fotovervangers (zwart-wit) ----------

/** Zachte grijze vlakte voor een zwart-witfoto, zolang er geen echte foto is. */
export function ModernPhoto({ className = "", style }: { className?: string; style?: CSSProperties }) {
  return (
    <div
      aria-hidden="true"
      className={`overflow-hidden ${className}`}
      style={{
        background: `radial-gradient(circle at 35% 25%, color-mix(in srgb, ${col("surfaceAlt")} 70%, white), color-mix(in srgb, ${col("muted")} 55%, ${col("surfaceAlt")}))`,
        ...style,
      }}
    >
      <svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMax slice" className="absolute inset-0 h-full w-full" fill="none">
        <path
          d="M10 100c2-22 12-36 26-40-6-4-9-10-9-17 0-10 7-17 17-17s17 7 17 17c0 7-3 13-9 17 14 4 24 18 26 40Z"
          style={{ fill: `color-mix(in srgb, ${col("text")} 22%, transparent)` }}
        />
        <path
          d="M52 100c2-18 10-30 22-34-5-3-8-8-8-14 0-8 6-14 14-14s14 6 14 14c0 6-3 11-8 14 12 4 20 16 22 34Z"
          style={{ fill: `color-mix(in srgb, ${col("text")} 32%, transparent)` }}
        />
      </svg>
    </div>
  );
}

/** Lijntekening van een statig landhuis, als vervanger van de locatiefoto. */
function Venue() {
  const c = { stroke: "currentColor" };
  return (
    <div
      className="relative overflow-hidden"
      style={{
        aspectRatio: "1.3",
        background: `linear-gradient(to bottom, color-mix(in srgb, ${col("surfaceAlt")} 80%, white), color-mix(in srgb, ${col("muted")} 40%, ${col("surfaceAlt")}))`,
        color: col("text"),
      }}
    >
      <svg viewBox="0 0 260 200" preserveAspectRatio="xMidYMax slice" className="absolute inset-0 h-full w-full" fill="none" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
        <g style={c} opacity=".72">
          <path d="M20 172V104h220v68" />
          <path d="M90 104V78h80v26" />
          <path d="m84 78 46-26 46 26Z" />
          <path d="M96 104v68M108 104v68M120 104v68M140 104v68M152 104v68M164 104v68" />
          <path d="M114 172v-24a16 16 0 0 1 32 0v24" />
          {[34, 52, 70, 182, 200, 218].map((x) => (
            <g key={x}>
              <rect x={x} y="118" width="9" height="16" />
              <rect x={x} y="144" width="9" height="16" />
            </g>
          ))}
          <path d="M0 172h260" />
          <path d="M8 172c-2-30 4-52 14-60M252 172c2-30-4-52-14-60" opacity=".7" />
        </g>
      </svg>
    </div>
  );
}

// ---------- Opbouw ----------

function Card({
  type,
  className = "",
  bg = "surface",
  last = false,
  children,
}: {
  type: Block["type"];
  className?: string;
  bg?: keyof ThemeColors;
  last?: boolean;
  children: ReactNode;
}) {
  return (
    <section
      data-block={type}
      className={`relative mx-3 mt-3 overflow-hidden rounded-[1.4rem] px-6 py-10 ${last ? "mb-3 pb-24" : ""} ${className}`}
      style={{ background: col(bg) }}
    >
      {children}
    </section>
  );
}

function Script({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <h2 className={`text-[2.6rem] leading-[1.05] ${className}`} style={script}>
      {children}
    </h2>
  );
}

function Muted({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <p className={`text-[0.78rem] leading-[1.75] whitespace-pre-line ${className}`} style={{ color: col("muted") }}>
      {children}
    </p>
  );
}

function SquareButton({ children, href }: { children: ReactNode; href?: string }) {
  const cls = "inline-flex items-center justify-center px-7 py-2.5 text-[0.68rem] tracking-[0.08em]";
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

/** Tekst die van onder naar boven (links) of van boven naar beneden (rechts) loopt. */
function Vertical({ children, flip = false, className = "", style }: { children: ReactNode; flip?: boolean; className?: string; style?: CSSProperties }) {
  return (
    <span
      className={`absolute whitespace-nowrap ${className}`}
      style={{ writingMode: "vertical-rl", transform: flip ? "rotate(180deg)" : undefined, ...script, ...style }}
    >
      {children}
    </span>
  );
}

function dateParts(date: string) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(date);
  return m ? { y: m[1], m: m[2], d: m[3] } : { y: "----", m: "--", d: "--" };
}

/** Datum in drie grote, over elkaar vallende getallen (dag, maand, jaar). */
function StackedDate({ date }: { date: string }) {
  const { d, m, y } = dateParts(date);
  const big = "block text-[7.4rem] leading-[0.82] tracking-[-0.02em]";
  return (
    <div className="mt-10 select-none" style={{ ...heading, color: col("text") }} aria-label={formatDateDots(date)}>
      <span className={big} style={{ marginLeft: "2.2rem" }}>
        {d}
      </span>
      <span className={big} style={{ marginLeft: "6.4rem", marginTop: "-1.5rem" }}>
        {m}
      </span>
      <span className={big} style={{ marginLeft: "3.4rem", marginTop: "-1.5rem" }}>
        {y.slice(2)}
      </span>
    </div>
  );
}

function ModernCountdown({ date, time }: { date: string; time: string }) {
  const cells = useCountdown(date, time);
  return (
    <div className="mt-6 flex items-start justify-center" aria-live="off">
      {cells.map(([value, label], i) => (
        <div key={label} className="flex items-start">
          {i > 0 && (
            <span className="px-[0.1rem] text-[2.2rem] leading-[1.15]" style={{ ...heading, color: col("muted") }}>
              :
            </span>
          )}
          <div className="text-center">
            <p className="text-[2.7rem] leading-none tabular-nums" style={heading}>
              {value}
            </p>
            <p className="mt-2 text-[0.55rem] tracking-[0.04em]" style={{ color: col("muted") }}>
              {label}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

export function ModernBlockSection({ block, config }: { block: Block; config: InvitationConfig }) {
  const names = `${config.partner1}&${config.partner2}`.toUpperCase();

  switch (block.type) {
    case "hero": {
      return (
        <section
          data-block="hero"
          className="relative mx-3 mt-3 overflow-hidden rounded-[1.4rem] px-6 pt-8 pb-12"
          style={{ background: col("surface") }}
        >
          <p className="text-right text-[1.05rem] tracking-[0.04em]" style={heading}>
            {names}
          </p>
          <div className="relative mt-3 h-[31rem]">
            <Vertical flip className="top-6 left-0 text-[2.3rem] leading-none" style={{ color: col("text") }}>
              {block.eyebrow}
            </Vertical>
            <div
              className="absolute top-0 right-3 flex flex-col items-start select-none"
              style={{ ...heading, color: col("text") }}
              aria-hidden="true"
            >
              <span className="block text-[9.4rem] leading-[0.84]" style={{ marginLeft: "0.2rem" }}>L</span>
              <span className="block text-[9rem] leading-[0.84]" style={{ marginLeft: "2.5rem", marginTop: "-0.4rem" }}>O</span>
              <span className="block text-[9.2rem] leading-[0.84]" style={{ marginLeft: "-1.5rem", marginTop: "-0.4rem" }}>V</span>
              <span className="block text-[8.6rem] leading-[0.84]" style={{ marginLeft: "3rem", marginTop: "-0.4rem" }}>E</span>
            </div>
          </div>
          <p className="mt-2 text-[1.7rem] tracking-[0.01em]" style={{ ...heading, color: col("text") }}>
            {formatDateDots(config.date)}
          </p>
          {config.city && (
            <p className="mt-1 text-[0.62rem] tracking-[0.24em] uppercase" style={{ color: col("muted") }}>
              {config.city}
            </p>
          )}
        </section>
      );
    }

    case "countdown":
      return (
        <Card type="countdown" className="text-center">
          {block.eyebrow && (
            <p className="text-[0.7rem] leading-relaxed" style={{ color: col("muted") }}>
              {block.eyebrow}
              {block.title && (
                <>
                  <br />
                  {block.title}
                </>
              )}
            </p>
          )}
          <ModernCountdown date={config.date} time={config.time} />
        </Card>
      );

    case "story":
      return (
        <Card type="story">
          <div className="relative -mx-6 mb-10 h-[23rem]">
            <ModernPhoto className="absolute top-0 right-[3.6rem] h-[11.4rem] w-[9.4rem]" />
            <ModernPhoto className="absolute top-[8.8rem] left-0 h-[10.8rem] w-[9.4rem]" />
            <Vertical className="top-1 right-3 text-[2.5rem] leading-none" style={{ color: col("text") }}>
              {block.eyebrow}
            </Vertical>
          </div>
          <Script>{block.title}</Script>
          <Muted className="mx-auto mt-5 max-w-[17rem] text-center">{block.text}</Muted>
          <StackedDate date={config.date} />
        </Card>
      );

    case "program":
      return (
        <Card type="program">
          <Script className="text-center">{block.title}</Script>
          {block.eyebrow && (
            <p className="mt-2 text-center text-[0.6rem] tracking-[0.24em] uppercase" style={{ color: col("muted") }}>
              {block.eyebrow}
            </p>
          )}
          <ul className="mt-8">
            {block.items.map((item, i) => (
              <li
                key={i}
                className="grid grid-cols-[4.3rem_1fr] items-baseline gap-x-4 py-4"
                style={{ borderTop: i === 0 ? undefined : `1px solid ${col("line")}` }}
              >
                <span className="text-[1.7rem] leading-none tabular-nums" style={heading}>
                  {item.time}
                </span>
                <span>
                  <span className="block text-[0.74rem] tracking-[0.16em] uppercase">{item.title}</span>
                  {item.subtitle && (
                    <span className="mt-1 block text-[0.72rem]" style={{ color: col("muted") }}>
                      {item.subtitle}
                    </span>
                  )}
                </span>
              </li>
            ))}
          </ul>
        </Card>
      );

    case "location": {
      const query = encodeURIComponent([block.title, config.city].filter(Boolean).join(" "));
      return (
        <Card type="location" className="text-center">
          <Script>{block.title}</Script>
          <Muted className="mx-auto mt-4 max-w-[16rem]">{block.address}</Muted>
          <div className="-mx-1 mt-6">
            <Venue />
          </div>
          <div className="mt-5">
            <SquareButton href={`https://www.google.com/maps/search/?api=1&query=${query}`}>Open kaart</SquareButton>
          </div>
        </Card>
      );
    }

    case "dresscode":
      return (
        <Card type="dresscode" className="text-center">
          <Script>{block.title}</Script>
          <Muted className="mx-auto mt-4 max-w-[16rem]">{block.text}</Muted>
          {block.colors.length > 0 && (
            <div className="mt-7 flex justify-center gap-2.5">
              {block.colors.map((c, i) => (
                <span key={i} className="block aspect-square max-w-[3.6rem] flex-1" style={{ background: c }} />
              ))}
            </div>
          )}
        </Card>
      );

    case "rsvp":
      return (
        <Card type="rsvp" className="text-center">
          <Script>{block.title}</Script>
          <Muted className="mx-auto mt-4 max-w-[16rem]">{block.text}</Muted>
          <div className="mt-6">
            <SquareButton>{block.buttonLabel}</SquareButton>
          </div>
        </Card>
      );

    case "footer":
      return (
        <section
          data-block="footer"
          className="relative mx-3 mt-3 mb-3 overflow-hidden rounded-[1.4rem] px-6 pt-12 pb-24 text-center"
          style={{ background: col("footerBackground"), color: col("footerText") }}
        >
          <p className="text-[2.4rem] leading-[1.2]" style={script}>
            {block.closing || "Tot dan"}
          </p>
          <p className="mt-3 text-[1.35rem] tracking-[0.06em]" style={heading}>
            {names}
          </p>
          {block.contactEmail && <p className="mt-5 text-[0.7rem] opacity-70">Vragen? mail naar {block.contactEmail}</p>}
          <p className="mt-3 text-[0.6rem] tracking-[0.2em] uppercase opacity-55">
            {[formatDateDots(config.date), config.city].filter(Boolean).join(" · ")}
          </p>
        </section>
      );
  }
}
