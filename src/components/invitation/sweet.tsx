"use client";

import type { CSSProperties, ReactNode } from "react";
import type { Block, InvitationConfig, ThemeColors } from "@/lib/invitation/types";
import { useCountdown } from "./use-countdown";

/**
 * Stijl "sweet": een gestreept behang in twee kleuren met witte boogkaarten, een dubbele rand, een
 * strikje als sierelement en cijfers met een verloop in de accentkleur. Alle kleuren komen uit het thema.
 */

const col = (key: keyof ThemeColors) => `var(--inv-${key})`;
const heading = { fontFamily: "var(--inv-heading)", fontWeight: 400 } satisfies CSSProperties;
const script = { fontFamily: "var(--inv-script)" } satisfies CSSProperties;

const MONTHS = ["JAN", "FEB", "MRT", "APR", "MEI", "JUN", "JUL", "AUG", "SEP", "OKT", "NOV", "DEC"];

/** Verticale strepen: groepen van drie lijnen in het accent met crème ertussen, op de achtergrondkleur. */
export const SWEET_STRIPES: CSSProperties = {
  backgroundColor: col("background"),
  backgroundImage: `linear-gradient(90deg,
    transparent 0 1.3rem,
    ${col("surface")} 1.3rem 1.42rem,
    ${col("accent")} 1.42rem 1.7rem,
    ${col("surface")} 1.7rem 1.82rem,
    ${col("accent")} 1.82rem 2.2rem,
    ${col("surface")} 2.2rem 2.32rem,
    ${col("accent")} 2.32rem 2.6rem,
    ${col("surface")} 2.6rem 2.72rem,
    transparent 2.72rem 100%)`,
  backgroundSize: "3.9rem 100%",
};

/** Tekstvulling met een verloop van donker naar licht accent, zoals het gesatineerde cijferwerk in het ontwerp. */
const GRADIENT: CSSProperties = {
  backgroundImage: `linear-gradient(175deg, color-mix(in srgb, ${col("accent")} 78%, black) 0%, ${col("accent")} 42%, color-mix(in srgb, ${col("accent")} 52%, white) 66%, color-mix(in srgb, ${col("accent")} 84%, black) 100%)`,
  WebkitBackgroundClip: "text",
  backgroundClip: "text",
  color: "transparent",
};

/** Een strikje. Kleur via `currentColor`. */
export function Bow({ size = 44, className = "" }: { size?: number; className?: string }) {
  return (
    <svg viewBox="0 0 60 56" width={size} height={(size * 56) / 60} aria-hidden="true" className={className} style={{ color: col("accent") }}>
      <g fill="currentColor" stroke="currentColor" strokeWidth=".8" strokeLinejoin="round" strokeLinecap="round">
        <path d="M30 22C21 7 5 5 3.5 15.5C2.2 26.5 19 28.5 30 22Z" fillOpacity=".9" />
        <path d="M30 22C39 7 55 5 56.5 15.5C57.8 26.5 41 28.5 30 22Z" fillOpacity=".9" />
        <path d="M28.5 26C25 36 23.5 43 17 53L23 49.5L26 55C28.5 45 30.5 35 31 27Z" fillOpacity=".8" />
        <path d="M31.5 26C35 36 36.5 43 43 53L37 49.5L34 55C31.5 45 29.5 35 29 27Z" fillOpacity=".8" />
        <ellipse cx="30" cy="22.5" rx="4.4" ry="5.4" />
      </g>
      <g fill="none" stroke={col("surface")} strokeWidth=".6" strokeLinecap="round" opacity=".7">
        <path d="M27 21C20 14 12 13 8 15.5M33 21C40 14 48 13 52 15.5" />
      </g>
    </svg>
  );
}

const ARCH = "50% 50% 1.3rem 1.3rem / 9.5rem 9.5rem 1.3rem 1.3rem";
const ARCH_IN = "50% 50% 1rem 1rem / 9rem 9rem 1rem 1rem";

/** Witte boogkaart met dubbele rand. */
function ArchCard({ type, children, className = "" }: { type: Block["type"]; children: ReactNode; className?: string }) {
  return (
    <section data-block={type} className="relative mx-4 mt-4">
      <div style={{ background: col("surface"), padding: "0.5rem", borderRadius: ARCH }}>
        <div
          className={`px-5 pt-14 pb-10 text-center ${className}`}
          style={{ border: `0.28rem solid ${col("surfaceAlt")}`, borderRadius: ARCH_IN, background: col("surface") }}
        >
          {children}
        </div>
      </div>
    </section>
  );
}

function Caps({ children, className = "", style }: { children: ReactNode; className?: string; style?: CSSProperties }) {
  return (
    <p className={`text-[0.62rem] tracking-[0.3em] uppercase ${className}`} style={{ color: col("text"), ...style }}>
      {children}
    </p>
  );
}

function Head({ eyebrow, title }: { eyebrow?: string; title: string }) {
  return (
    <header>
      <Bow size={38} className="mx-auto" />
      {eyebrow && <Caps className="mt-4">{eyebrow}</Caps>}
      <h2 className="mt-2 text-[2.15rem] leading-[1.1]" style={{ ...heading, ...GRADIENT }}>
        {title}
      </h2>
    </header>
  );
}

function Body({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <p className={`mx-auto text-[0.8rem] leading-[1.8] whitespace-pre-line ${className}`} style={{ color: col("muted"), maxWidth: "16rem" }}>
      {children}
    </p>
  );
}

function PillButton({ children, href }: { children: ReactNode; href?: string }) {
  const cls = "inline-flex items-center justify-center px-8 py-3 text-[0.62rem] font-medium tracking-[0.24em] uppercase";
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

/** Fotovervanger: een boog met het streeppatroon en een strikje. */
function SweetPhoto() {
  return (
    <div
      className="relative mx-auto mt-7 aspect-[4/5] w-[68%] overflow-hidden"
      style={{
        ...SWEET_STRIPES,
        borderRadius: "999px 999px 0.8rem 0.8rem / 100% 100% 0.8rem 0.8rem",
        boxShadow: `0 0 0 0.3rem ${col("surface")}, 0 0 0 0.45rem ${col("surfaceAlt")}`,
      }}
      aria-hidden="true"
    >
      <span className="absolute inset-0 grid place-items-center">
        <span className="rounded-full p-3" style={{ background: col("surface") }}>
          <Bow size={34} />
        </span>
      </span>
    </div>
  );
}

function SweetCountdown({ date, time }: { date: string; time: string }) {
  const cells = useCountdown(date, time);
  return (
    <div className="mt-7 grid grid-cols-4 gap-1 text-center">
      {cells.map(([value, label]) => (
        <div key={label}>
          <p className="text-[2.1rem] leading-none tabular-nums" style={{ ...heading, ...GRADIENT }}>
            {value}
          </p>
          <p className="mt-2 text-[0.52rem] tracking-[0.2em] uppercase" style={{ color: col("muted") }}>
            {label}
          </p>
        </div>
      ))}
    </div>
  );
}

export function SweetBlockSection({ block, config }: { block: Block; config: InvitationConfig }) {
  const names = `${config.partner1} & ${config.partner2}`.toUpperCase();
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(config.date);
  const day = m ? String(Number(m[3])) : "--";
  const month = m ? MONTHS[Number(m[2]) - 1] : "---";
  const yy = m ? m[1].slice(2) : "--";

  switch (block.type) {
    case "hero":
      return (
        <section data-block="hero" className="relative mx-4 mt-4">
          <div style={{ background: col("surface"), padding: "0.55rem", borderRadius: ARCH }}>
            <div
              className="px-5 pt-[4.6rem] pb-10 text-center"
              style={{ border: `0.3rem solid ${col("surfaceAlt")}`, borderRadius: ARCH_IN, background: col("surface") }}
            >
              <h1 className="select-none" style={{ ...heading, ...GRADIENT }} aria-label={`${day} ${month} ${yy}`}>
                <span className="block text-[4.6rem] leading-[0.98]">{day}</span>
                <span className="block text-[4.6rem] leading-[0.98] tracking-[0.02em]">{month}</span>
                <span className="block text-[4.6rem] leading-[0.98]">{yy}</span>
              </h1>
              <Bow size={52} className="mx-auto mt-5" />
              <p className="mt-6 text-[0.85rem] tracking-[0.3em]" style={{ color: col("text") }}>
                {names}
              </p>
              <p className="mt-1 text-[2rem] leading-none" style={{ ...script, color: col("text") }}>
                {block.eyebrow}
              </p>
              {config.city && (
                <p className="mt-4 text-[0.58rem] tracking-[0.3em] uppercase" style={{ color: col("muted") }}>
                  {config.city}
                </p>
              )}
            </div>
          </div>
        </section>
      );

    case "countdown":
      return (
        <ArchCard type="countdown">
          <Head eyebrow={block.eyebrow} title={block.title} />
          <SweetCountdown date={config.date} time={config.time} />
        </ArchCard>
      );

    case "story":
      return (
        <ArchCard type="story">
          <Head eyebrow={block.eyebrow} title={block.title} />
          <SweetPhoto />
          <Body className="mt-8">{block.text}</Body>
        </ArchCard>
      );

    case "program":
      return (
        <ArchCard type="program">
          <Head eyebrow={block.eyebrow} title={block.title} />
          <ul className="mx-auto mt-7 max-w-[17rem] text-left">
            {block.items.map((item, i) => (
              <li
                key={i}
                className="grid grid-cols-[4.4rem_1fr] items-baseline gap-x-3 py-3.5"
                style={{ borderTop: i === 0 ? undefined : `1px dashed ${col("line")}` }}
              >
                <span className="text-[1.6rem] leading-none tabular-nums" style={{ ...heading, ...GRADIENT }}>
                  {item.time}
                </span>
                <span>
                  <span className="block text-[0.68rem] tracking-[0.2em] uppercase" style={{ color: col("text") }}>
                    {item.title}
                  </span>
                  {item.subtitle && (
                    <span className="mt-1 block text-[0.74rem]" style={{ color: col("muted") }}>
                      {item.subtitle}
                    </span>
                  )}
                </span>
              </li>
            ))}
          </ul>
        </ArchCard>
      );

    case "location": {
      const query = encodeURIComponent([block.title, config.city].filter(Boolean).join(" "));
      return (
        <ArchCard type="location">
          <Head eyebrow={block.eyebrow} title={block.title} />
          <Body className="mt-5">{block.address}</Body>
          <div className="mt-6">
            <PillButton href={`https://www.google.com/maps/search/?api=1&query=${query}`}>Bekijk route</PillButton>
          </div>
        </ArchCard>
      );
    }

    case "dresscode":
      return (
        <ArchCard type="dresscode">
          <Head eyebrow={block.eyebrow} title={block.title} />
          <Body className="mt-5">{block.text}</Body>
          {block.colors.length > 0 && (
            <div className="mt-7 flex justify-center gap-2.5">
              {block.colors.map((c, i) => (
                <span
                  key={i}
                  className="block aspect-[3/4] w-11"
                  style={{ background: c, borderRadius: "999px 999px 0.3rem 0.3rem", boxShadow: `0 0 0 0.18rem ${col("surfaceAlt")}` }}
                />
              ))}
            </div>
          )}
        </ArchCard>
      );

    case "rsvp":
      return (
        <ArchCard type="rsvp">
          <Head eyebrow={block.eyebrow} title={block.title} />
          <Body className="mt-5">{block.text}</Body>
          <div className="mt-6">
            <PillButton>{block.buttonLabel}</PillButton>
          </div>
        </ArchCard>
      );

    case "footer":
      return (
        <section
          data-block="footer"
          className="relative mx-4 mt-4 mb-4 px-6 pt-16 pb-24 text-center"
          style={{ background: col("footerBackground"), color: col("footerText"), borderRadius: ARCH }}
        >
          <Bow size={44} className="mx-auto" />
          <p className="mt-5 text-[2.3rem] leading-[1.15]" style={script}>
            {block.closing || "Tot dan"}
          </p>
          <p className="mt-3 text-[0.8rem] tracking-[0.3em]">{names}</p>
          {block.contactEmail && <p className="mt-5 text-[0.7rem] opacity-75">Vragen? mail naar {block.contactEmail}</p>}
          <p className="mt-3 text-[0.58rem] tracking-[0.24em] uppercase opacity-60">
            {[`${day} ${month} ${yy}`, config.city].filter(Boolean).join(" · ")}
          </p>
        </section>
      );
  }
}
