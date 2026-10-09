"use client";

import { useId, type CSSProperties, type ReactNode } from "react";
import type { Block, InvitationConfig, ThemeColors } from "@/lib/invitation/types";
import { useCountdown } from "./use-countdown";

/**
 * Stijl "lemon": blauw-geel gestreept behang, crèmekaarten met een gestreepte rand (boven en onder),
 * getekende citroentakken met bloesem en een klein amberkleurig script. De strepen volgen de knopkleur
 * van het thema; citroenen en blaadjes houden hun eigen natuurlijke kleuren.
 */

const col = (key: keyof ThemeColors) => `var(--inv-${key})`;
const heading = { fontFamily: "var(--inv-heading)", fontWeight: 500 } satisfies CSSProperties;
const script = { fontFamily: "var(--inv-script)" } satisfies CSSProperties;

/** De streepkleur: de knopkleur van het thema, wat opgelicht. */
const BLUE = `color-mix(in srgb, ${col("buttonBackground")} 78%, white)`;

const MONTHS = [
  "januari",
  "februari",
  "maart",
  "april",
  "mei",
  "juni",
  "juli",
  "augustus",
  "september",
  "oktober",
  "november",
  "december",
];

/** Verticale brede strepen in blauw met een dun crème randje; het patroon is gecentreerd en de buitenste randen zijn altijd geel, zodat het rustiger oogt. */
export const LEMON_STRIPES: CSSProperties = {
  backgroundColor: col("background"),
  backgroundImage: `linear-gradient(90deg,
      ${col("background")} 0 1.1rem,
      ${col("surface")} 1.1rem 1.18rem,
      transparent 1.18rem calc(100% - 1.18rem),
      ${col("surface")} calc(100% - 1.18rem) calc(100% - 1.1rem),
      ${col("background")} calc(100% - 1.1rem) 100%),
    linear-gradient(90deg,
      transparent 0 0.52rem,
      ${col("surface")} 0.52rem 0.6rem,
      ${BLUE} 0.6rem 1.6rem,
      ${col("surface")} 1.6rem 1.68rem,
      transparent 1.68rem 100%)`,
  backgroundSize: "100% 100%, 2.2rem 100%",
  backgroundPosition: "0 0, center top",
  backgroundRepeat: "no-repeat, repeat-x",
};

/** Smalle strepen voor de boven- en onderrand van een kaart. */
const BAND: CSSProperties = {
  backgroundImage: `repeating-linear-gradient(90deg, ${BLUE} 0 0.32rem, ${col("surface")} 0.32rem 0.52rem)`,
};

// ---------- Illustraties ----------

function Defs({ id }: { id: string }) {
  return (
    <defs>
      <radialGradient id={`${id}l`} cx="0.36" cy="0.32" r="0.85">
        <stop offset="0" stopColor="#fdf08a" />
        <stop offset="0.5" stopColor="#f3cb26" />
        <stop offset="1" stopColor="#d79c12" />
      </radialGradient>
      <linearGradient id={`${id}g`} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#a4c76a" />
        <stop offset="1" stopColor="#4d7c34" />
      </linearGradient>
    </defs>
  );
}

function Leaf({ id, x, y, r = 0, s = 1 }: { id: string; x: number; y: number; r?: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${r}) scale(${s})`}>
      <path d="M0 0C9-11 27-13 43 0C27 13 9 11 0 0Z" fill={`url(#${id}g)`} stroke="#3f6a2a" strokeWidth=".5" strokeOpacity=".5" />
      <path d="M2 0C16-1 30-1 40 0" stroke="#e5efc6" strokeWidth=".8" fill="none" opacity=".7" strokeLinecap="round" />
    </g>
  );
}

function Fruit({ id, x, y, r = 0, s = 1 }: { id: string; x: number; y: number; r?: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${r}) scale(${s})`}>
      <path
        d="M-24 0C-24-13-12-19 0-19C12-19 21-14 27-4L31 0L27 4C21 14 12 19 0 19C-12 19-24 13-24 0Z"
        fill={`url(#${id}l)`}
        stroke="#c58d10"
        strokeWidth=".6"
        strokeOpacity=".6"
      />
      <path d="M-14-9C-9-14-2-15 4-15" stroke="#fff8c8" strokeWidth="2" fill="none" strokeLinecap="round" opacity=".6" />
      <g fill="#c58d10" opacity=".35">
        <circle cx="-6" cy="4" r=".7" />
        <circle cx="4" cy="-2" r=".7" />
        <circle cx="10" cy="7" r=".7" />
        <circle cx="-12" cy="-1" r=".7" />
        <circle cx="12" cy="-8" r=".7" />
      </g>
    </g>
  );
}

function Blossom({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {[0, 72, 144, 216, 288].map((a) => (
        <ellipse key={a} cx="0" cy="-7" rx="4.6" ry="8" transform={`rotate(${a})`} fill="#fffdf4" stroke="#e3dcc0" strokeWidth=".5" />
      ))}
      <circle r="3.4" fill="#f1c51d" />
      <g fill="#c98f12">
        <circle cx="-1.2" cy="-.8" r=".5" />
        <circle cx="1.3" cy="-1" r=".5" />
        <circle cx="0" cy="1.3" r=".5" />
      </g>
    </g>
  );
}

/** Een tak met citroenen, bladeren en bloesem. Past zich aan de breedte aan; `flip` spiegelt hem. */
export function LemonBranch({ className = "", style, flip = false }: { className?: string; style?: CSSProperties; flip?: boolean }) {
  const id = useId();
  return (
    <svg
      viewBox="0 0 230 190"
      aria-hidden="true"
      className={className}
      style={{ transform: flip ? "scaleX(-1)" : undefined, ...style }}
    >
      <Defs id={id} />
      <g fill="none" stroke="#7a6a3a" strokeWidth="2.4" strokeLinecap="round">
        <path d="M2 24C52 30 104 48 150 100S206 160 224 176" />
        <path d="M92 50C108 36 128 28 150 32" strokeWidth="1.8" />
        <path d="M138 90C152 80 170 76 188 82" strokeWidth="1.6" />
      </g>
      <Leaf id={id} x={26} y={30} r={-28} s={1.15} />
      <Leaf id={id} x={56} y={38} r={24} s={1.05} />
      <Leaf id={id} x={80} y={52} r={-40} s={1.1} />
      <Leaf id={id} x={150} y={32} r={-14} s={0.9} />
      <Leaf id={id} x={110} y={68} r={34} s={1.1} />
      <Leaf id={id} x={186} y={82} r={-8} s={0.85} />
      <Leaf id={id} x={170} y={128} r={48} s={1} />
      <Leaf id={id} x={132} y={96} r={-30} s={1} />
      <Fruit id={id} x={132} y={124} r={52} s={1.45} />
      <Fruit id={id} x={92} y={92} r={-24} s={1.05} />
      <Fruit id={id} x={192} y={150} r={30} s={1.1} />
      <Blossom x={46} y={24} s={1.1} />
      <Blossom x={118} y={52} s={0.95} />
      <Blossom x={170} y={64} s={0.8} />
      <Blossom x={62} y={64} s={0.7} />
    </svg>
  );
}

/** Eén grote citroen met twee blaadjes, bijvoorbeeld als zegel op de envelop. */
export function BigLemon({ className = "", style, leaves = true }: { className?: string; style?: CSSProperties; leaves?: boolean }) {
  const id = useId();
  return (
    <svg viewBox={leaves ? "-46 -36 100 72" : "-40 -30 90 62"} aria-hidden="true" className={className} style={style}>
      <Defs id={id} />
      {leaves && <Leaf id={id} x={4} y={-16} r={-128} s={1.15} />}
      {leaves && <Leaf id={id} x={8} y={-14} r={-52} s={1.3} />}
      <Fruit id={id} x={0} y={2} r={-14} s={1.5} />
      {leaves && <Blossom x={26} y={-24} s={0.9} />}
    </svg>
  );
}

/** Een kleine citroen met twee blaadjes en bloesem, als sierelement bij kopjes. */
export function LemonSprig({ className = "", width = 76 }: { className?: string; width?: number }) {
  const id = useId();
  return (
    <svg viewBox="0 0 100 52" width={width} height={(width * 52) / 100} aria-hidden="true" className={className}>
      <Defs id={id} />
      <path d="M14 30C34 22 52 24 66 30" fill="none" stroke="#7a6a3a" strokeWidth="1.6" strokeLinecap="round" />
      <Leaf id={id} x={14} y={30} r={-32} s={0.8} />
      <Leaf id={id} x={34} y={26} r={28} s={0.7} />
      <Fruit id={id} x={66} y={32} r={-14} s={0.95} />
      <Blossom x={84} y={16} s={0.8} />
      <Leaf id={id} x={68} y={14} r={-60} s={0.6} />
    </svg>
  );
}

// ---------- Opbouw ----------

const SECTION = "relative mx-5 mt-10";

/** Crèmekaart met gestreepte boven- en onderrand, dunne zijlijnen en een fijn binnenkader. */
export function Frame({
  children,
  className = "",
  padding = "px-9 pt-14 pb-14",
  background,
  textColor,
  clip = false,
}: {
  children: ReactNode;
  className?: string;
  padding?: string;
  background?: string;
  textColor?: string;
  clip?: boolean;
}) {
  return (
    <div
      className={clip ? "relative overflow-hidden" : "relative"}
      style={{
        background: background ?? col("surface"),
        color: textColor,
        boxShadow: "0 0.7rem 1.4rem -0.9rem rgb(45 60 90 / 0.45)",
      }}
    >
      <span aria-hidden="true" className="absolute inset-x-0 top-0 h-[0.7rem]" style={BAND} />
      <span aria-hidden="true" className="absolute inset-x-0 bottom-0 h-[0.7rem]" style={BAND} />
      <span aria-hidden="true" className="absolute inset-y-[0.7rem] inset-x-0" style={{ borderInline: `1px solid ${BLUE}` }} />
      <span
        aria-hidden="true"
        className="absolute"
        style={{ inset: "1.25rem 0.85rem", border: `1px solid ${textColor ? "rgb(255 255 255 / .35)" : col("line")}` }}
      />
      <div className={`relative ${padding} text-center ${className}`}>{children}</div>
    </div>
  );
}

function Card({ type, children, className = "" }: { type: Block["type"]; children: ReactNode; className?: string }) {
  return (
    <section data-block={type} className={SECTION}>
      <Frame className={className}>{children}</Frame>
    </section>
  );
}

function Caps({ children, className = "", color }: { children: ReactNode; className?: string; color?: string }) {
  return (
    <p className={`text-[0.62rem] tracking-[0.3em] uppercase ${className}`} style={{ color: color ?? col("accent") }}>
      {children}
    </p>
  );
}

function Head({ eyebrow, title }: { eyebrow?: string; title: string }) {
  return (
    <header>
      <LemonSprig className="mx-auto" />
      {eyebrow && <Caps className="mt-3">{eyebrow}</Caps>}
      <h2 className="mt-2 text-[1.9rem] leading-[1.15] tracking-[0.04em]" style={{ ...heading, color: col("text") }}>
        {title}
      </h2>
    </header>
  );
}

function Body({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <p className={`mx-auto text-[0.8rem] leading-[1.85] whitespace-pre-line ${className}`} style={{ color: col("muted"), maxWidth: "16rem" }}>
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

/** Fotovervanger: een waterverf-achtig vlak met een gestreepte rand en een citroentak. */
function LemonPhoto() {
  return (
    <div
      className="relative mx-auto mt-7 aspect-[4/5] w-[72%] overflow-hidden"
      style={{
        background: `radial-gradient(120% 90% at 30% 20%, color-mix(in srgb, ${col("background")} 70%, white), ${col("background")})`,
        boxShadow: `0 0 0 0.3rem ${col("surface")}, 0 0 0 0.4rem ${BLUE}`,
      }}
      aria-hidden="true"
    >
      <LemonBranch className="absolute -top-[4%] -left-[6%] w-[118%]" />
      <LemonBranch className="absolute -right-[8%] -bottom-[6%] w-[70%]" flip style={{ transform: "scale(-1,-1)" }} />
    </div>
  );
}

function LemonCountdown({ date, time }: { date: string; time: string }) {
  const cells = useCountdown(date, time);
  return (
    <div className="mt-7 grid grid-cols-4 gap-1 text-center">
      {cells.map(([value, label]) => (
        <div key={label}>
          <p className="text-[2rem] leading-none tabular-nums" style={{ ...heading, color: col("accent") }}>
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

export function LemonBlockSection({ block, config }: { block: Block; config: InvitationConfig }) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(config.date);
  const dateLine = m ? `${Number(m[3])} ${MONTHS[Number(m[2]) - 1]} ${m[1]}` : "";

  switch (block.type) {
    case "hero":
      return (
        <section data-block="hero" className={SECTION}>
          <Frame clip padding="px-9 pt-[11.5rem] pb-[10.5rem]">
            <LemonBranch className="absolute -top-4 -left-9 w-[60%]" />
            <LemonBranch className="absolute -right-9 -bottom-4 w-[56%]" style={{ transform: "scale(-1,-1)" }} />
            <Caps className="relative" color={col("muted")}>
              {block.eyebrow}
            </Caps>
            <h1 className="relative mt-4 text-[2.5rem] leading-[1.05] tracking-[0.14em] uppercase" style={{ ...heading, color: col("text") }}>
              {config.partner1}
              <span className="block text-[2.6rem] leading-[0.9] tracking-normal normal-case" style={{ ...script, color: col("accent") }}>
                &amp;
              </span>
              {config.partner2}
            </h1>
            {dateLine && (
              <p className="relative mt-6 text-[0.72rem] tracking-[0.3em] uppercase" style={{ color: col("accent") }}>
                {dateLine}
              </p>
            )}
            {config.city && (
              <p className="relative mt-2 text-[0.58rem] tracking-[0.3em] uppercase" style={{ color: col("muted") }}>
                {config.city}
              </p>
            )}
          </Frame>
        </section>
      );

    case "countdown":
      return (
        <Card type="countdown">
          <Head eyebrow={block.eyebrow} title={block.title} />
          <LemonCountdown date={config.date} time={config.time} />
        </Card>
      );

    case "story":
      return (
        <Card type="story">
          <Head eyebrow={block.eyebrow} title={block.title} />
          <LemonPhoto />
          <Body className="mt-8">{block.text}</Body>
        </Card>
      );

    case "program":
      return (
        <Card type="program">
          <Head eyebrow={block.eyebrow} title={block.title} />
          <ul className="mx-auto mt-7 max-w-[17rem] text-left">
            {block.items.map((item, i) => (
              <li
                key={i}
                className="grid grid-cols-[4.2rem_1fr] items-baseline gap-x-3 py-3.5"
                style={{ borderTop: i === 0 ? undefined : `1px dashed ${col("line")}` }}
              >
                <span className="text-[1.5rem] leading-none tabular-nums" style={{ ...heading, color: col("accent") }}>
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
        </Card>
      );

    case "location": {
      const query = encodeURIComponent([block.title, config.city].filter(Boolean).join(" "));
      return (
        <Card type="location">
          <Head eyebrow={block.eyebrow} title={block.title} />
          <Body className="mt-5">{block.address}</Body>
          <div className="mt-6">
            <PillButton href={`https://www.google.com/maps/search/?api=1&query=${query}`}>Bekijk route</PillButton>
          </div>
        </Card>
      );
    }

    case "dresscode":
      return (
        <Card type="dresscode">
          <Head eyebrow={block.eyebrow} title={block.title} />
          <Body className="mt-5">{block.text}</Body>
          {block.colors.length > 0 && (
            <div className="mt-7 flex justify-center gap-2.5">
              {block.colors.map((c, i) => (
                <span key={i} className="block aspect-square w-10 rounded-full" style={{ background: c, boxShadow: `0 0 0 0.2rem ${col("surface")}, 0 0 0 0.28rem ${BLUE}` }} />
              ))}
            </div>
          )}
        </Card>
      );

    case "rsvp":
      return (
        <Card type="rsvp">
          <Head eyebrow={block.eyebrow} title={block.title} />
          <Body className="mt-5">{block.text}</Body>
          <div className="mt-6">
            <PillButton>{block.buttonLabel}</PillButton>
          </div>
        </Card>
      );

    case "footer":
      return (
        <section data-block="footer" className={`${SECTION} mb-8`}>
          <Frame background={col("footerBackground")} textColor={col("footerText")}>
            <LemonSprig className="mx-auto" />
            <p className="mt-3 text-[2.4rem] leading-[1.1]" style={script}>
              {block.closing || "Tot dan"}
            </p>
            <p className="mt-3 text-[0.78rem] tracking-[0.3em] uppercase">
              {config.partner1} &amp; {config.partner2}
            </p>
            {block.contactEmail && <p className="mt-5 text-[0.7rem] opacity-80">Vragen? mail naar {block.contactEmail}</p>}
            <p className="mt-3 text-[0.58rem] tracking-[0.24em] uppercase opacity-70">
              {[dateLine, config.city].filter(Boolean).join(" · ")}
            </p>
          </Frame>
        </section>
      );
  }
}
