"use client";

import { useId, type CSSProperties, type ReactNode } from "react";
import type { Block, InvitationConfig, ThemeColors } from "@/lib/invitation/types";
import { StoryImg } from "./story-photo";
import { useCountdown } from "./use-countdown";

/**
 * Stijl "sweet": een gestreept behang in twee kleuren met witte boogkaarten, een dubbele rand, een
 * strikje als sierelement en cijfers met een verloop in de accentkleur. Alle kleuren komen uit het thema.
 */

const col = (key: keyof ThemeColors) => `var(--inv-${key})`;
const heading = { fontFamily: "var(--inv-heading)", fontWeight: 400 } satisfies CSSProperties;
const script = { fontFamily: "var(--inv-script)" } satisfies CSSProperties;

const MONTHS = ["JAN", "FEB", "MRT", "APR", "MEI", "JUN", "JUL", "AUG", "SEP", "OKT", "NOV", "DEC"];

/** Verticale strepen: groepen van drie groene lijnen met crème ertussen, op de achtergrondkleur. */
export const SWEET_STRIPES: CSSProperties = {
  backgroundColor: col("background"),
  backgroundImage: `linear-gradient(90deg,
    transparent 0 1.04rem,
    ${col("surface")} 1.04rem 1.12rem,
    ${col("accent")} 1.12rem 1.32rem,
    ${col("surface")} 1.32rem 1.41rem,
    ${col("accent")} 1.41rem 1.69rem,
    ${col("surface")} 1.69rem 1.78rem,
    ${col("accent")} 1.78rem 1.98rem,
    ${col("surface")} 1.98rem 2.06rem,
    transparent 2.06rem 100%)`,
  backgroundSize: "3.1rem 100%",
  backgroundPosition: "0 0",
  backgroundRepeat: "round no-repeat",
};

/** Tekstvulling met een verloop van donker naar licht accent, zoals het gesatineerde cijferwerk in het ontwerp. */
const GRADIENT: CSSProperties = {
  backgroundImage: `linear-gradient(175deg, color-mix(in srgb, ${col("accent")} 78%, black) 0%, ${col("accent")} 42%, color-mix(in srgb, ${col("accent")} 52%, white) 66%, color-mix(in srgb, ${col("accent")} 84%, black) 100%)`,
  WebkitBackgroundClip: "text",
  backgroundClip: "text",
  color: "transparent",
};

/** Een los gestrikt lint met twee lussen en twee staarten. Kleur via het accent, met een verloop. */
export function Bow({ size = 44, className = "" }: { size?: number; className?: string }) {
  const id = useId();
  return (
    <svg viewBox="0 0 60 80" width={size} height={(size * 80) / 60} aria-hidden="true" className={className}>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0.35" y2="1">
          <stop offset="0" style={{ stopColor: `color-mix(in srgb, ${col("accent")} 80%, black)` }} />
          <stop offset="0.5" style={{ stopColor: `color-mix(in srgb, ${col("accent")} 60%, white)` }} />
          <stop offset="1" style={{ stopColor: `color-mix(in srgb, ${col("accent")} 85%, black)` }} />
        </linearGradient>
      </defs>
      <g stroke={`url(#${id})`} fill="none" strokeLinecap="round" strokeLinejoin="round">
        <g strokeWidth="2.8">
          <path d="M29 28C21 8 8 0.5 3.5 7C-0.5 14 9 27 29 29.5" />
          <path d="M31 28C39 8 52 0.5 56.5 7C60.5 14 51 27 31 29.5" />
        </g>
        <g strokeWidth="1.3" opacity=".8">
          <path d="M27.5 25C21 16 13 10.5 8.5 11M32.5 25C39 16 47 10.5 51.5 11" />
        </g>
      </g>
      <g fill={`url(#${id})`}>
        <path d="M29 30C26 42 18 52 7 73L17 68L19.5 78C26 62 31.5 46 32 31Z" />
        <path d="M31 30C34 40 44 50 53 70L43.5 66L41.5 77C35 62 30 46 28 31Z" />
        <ellipse cx="30" cy="29" rx="4.6" ry="5.6" />
      </g>
    </svg>
  );
}

/**
 * De boog is een echte halve cirkel: de verticale radius is de helft van de kaartbreedte (cqw refereert aan
 * de sectie, die de container is). Onderaan zijn de hoeken licht afgerond.
 */
const archOuter = "50% 50% 0.7rem 0.7rem / 50cqw 50cqw 0.7rem 0.7rem";
const archInner = (pad: string) => `50% 50% 0.3rem 0.3rem / calc(50cqw - ${pad}) calc(50cqw - ${pad}) 0.3rem 0.3rem`;
const CARD_PAD = "0.7rem";
const SECTION = "relative mx-[9%] mt-9";

const CONTAINER: CSSProperties = { containerType: "inline-size" };

/** Witte kaart: met `arch` een boog met dubbele rand, anders een rustig wit vlak met zachte hoeken. */
function ArchCard({
  type,
  children,
  className = "",
  arch = true,
}: {
  type: Block["type"];
  children: ReactNode;
  className?: string;
  arch?: boolean;
}) {
  return (
    <section data-block={type} className={SECTION} style={CONTAINER}>
      {arch ? (
        <div style={{ background: col("surface"), padding: CARD_PAD, borderRadius: archOuter }}>
          <div
            className={`px-5 pt-16 pb-10 text-center ${className}`}
            style={{ border: `0.4rem solid ${col("surfaceAlt")}`, borderRadius: archInner(CARD_PAD), background: col("surface") }}
          >
            {children}
          </div>
        </div>
      ) : (
        <div className={`px-6 py-10 text-center ${className}`} style={{ background: col("surface"), borderRadius: "0.9rem" }}>
          {children}
        </div>
      )}
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
      <Bow size={30} className="mx-auto" />
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

/** Fotovervanger: een boog met het streeppatroon en een strikje; met een echte foto vult die de boog. */
function SweetPhoto({ src }: { src?: string }) {
  return (
    <div
      className="relative mx-auto mt-7 aspect-[3/4] w-[68%] overflow-hidden"
      style={{
        ...(src ? { background: col("surfaceAlt") } : SWEET_STRIPES),
        borderRadius: "50% 50% 0.8rem 0.8rem / 34cqw 34cqw 0.8rem 0.8rem",
        boxShadow: `0 0 0 0.3rem ${col("surface")}, 0 0 0 0.45rem ${col("surfaceAlt")}`,
      }}
      aria-hidden={src ? undefined : true}
    >
      {src ? (
        <StoryImg src={src} />
      ) : (
        <span className="absolute inset-0 grid place-items-center">
          <span className="rounded-full p-3" style={{ background: col("surface") }}>
            <Bow size={26} />
          </span>
        </span>
      )}
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
        <section data-block="hero" className={SECTION} style={CONTAINER}>
          <div style={{ background: col("surface"), padding: CARD_PAD, borderRadius: archOuter }}>
            <div
              className="flex flex-col items-center justify-center px-4 pt-[18cqw] pb-9 text-center"
              style={{
                minHeight: `calc(150cqw - 2 * ${CARD_PAD})`,
                border: `0.4rem solid ${col("surfaceAlt")}`,
                borderRadius: archInner(CARD_PAD),
                background: col("surface"),
              }}
            >
              <h1 className="select-none" style={{ ...heading, ...GRADIENT, fontSize: "min(22cqw, 5.4rem)" }} aria-label={`${day} ${month} ${yy}`}>
                <span className="block leading-[0.98]">{day}</span>
                <span className="block leading-[0.98]">{month}</span>
                <span className="block leading-[0.98]">{yy}</span>
              </h1>
              <Bow size={46} className="mx-auto mt-4" />
              <p className="mt-4 text-[0.82rem] tracking-[0.3em]" style={{ color: col("text") }}>
                {names}
              </p>
              <p className="-mt-1 text-[2.3rem] leading-none" style={{ ...script, color: col("text") }}>
                {block.eyebrow}
              </p>
              {config.city && (
                <p className="mt-5 text-[0.58rem] tracking-[0.3em] uppercase" style={{ color: col("muted") }}>
                  {config.city}
                </p>
              )}
            </div>
          </div>
        </section>
      );

    case "countdown":
      return (
        <ArchCard type="countdown" arch={false}>
          <Head eyebrow={block.eyebrow} title={block.title} />
          <SweetCountdown date={config.date} time={config.time} />
        </ArchCard>
      );

    case "story":
      return (
        <ArchCard type="story">
          <Head eyebrow={block.eyebrow} title={block.title} />
          <SweetPhoto src={block.photo} />
          <Body className="mt-8">{block.text}</Body>
        </ArchCard>
      );

    case "program":
      return (
        <ArchCard type="program" arch={false}>
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
        <ArchCard type="location" arch={false}>
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
        <ArchCard type="dresscode" arch={false}>
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
        <section data-block="footer" className="relative mx-[9%] mt-9 mb-9" style={CONTAINER}>
          <div
            className="px-6 pt-[16cqw] pb-14 text-center"
            style={{ background: col("footerBackground"), color: col("footerText"), borderRadius: archOuter }}
          >
            <Bow size={36} className="mx-auto" />
            <p className="mt-4 text-[2.6rem] leading-[1.1]" style={script}>
              {block.closing || "Tot dan"}
            </p>
            <p className="mt-3 text-[0.8rem] tracking-[0.3em]">{names}</p>
            {block.contactEmail && <p className="mt-5 text-[0.7rem] opacity-75">Vragen? mail naar {block.contactEmail}</p>}
            <p className="mt-3 text-[0.58rem] tracking-[0.24em] uppercase opacity-60">
              {[`${day} ${month} ${yy}`, config.city].filter(Boolean).join(" · ")}
            </p>
          </div>
        </section>
      );
  }
}
