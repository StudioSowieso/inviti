"use client";

import { useId, type CSSProperties, type ReactNode } from "react";
import type { Block, InvitationConfig, ThemeColors } from "@/lib/invitation/types";
import { StoryImg } from "./story-photo";
import { useCountdown } from "./use-countdown";
import { blockKey, mapsHref } from "@/lib/invitation/format";

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

/** Verticale brede strepen in blauw met een dun crème randje; het patroon past altijd een heel aantal keer in de breedte, met gele buitenranden. */
export const LEMON_STRIPES: CSSProperties = {
  backgroundColor: col("background"),
  backgroundImage: `linear-gradient(90deg,
    transparent 0 0.6rem,
    ${col("surface")} 0.6rem 0.68rem,
    ${BLUE} 0.68rem 1.72rem,
    ${col("surface")} 1.72rem 1.8rem,
    transparent 1.8rem 100%)`,
  // "round": de tegel wordt een beetje opgerekt of ingekrompen, zodat er altijd een heel aantal strepen
  // precies in de breedte past: gelijk verdeeld, met gele randen links en rechts.
  backgroundSize: "2.4rem 100%",
  backgroundPosition: "0 0",
  backgroundRepeat: "round no-repeat",
};

/** Smalle strepen voor de boven- en onderrand van een kaart. */
const BAND: CSSProperties = {
  backgroundImage: `repeating-linear-gradient(90deg, ${BLUE} 0 0.32rem, ${col("surface")} 0.32rem 0.52rem)`,
};

// ---------- Illustraties ----------

/** Filter voor een licht onregelmatige, met de hand geschilderde rand. */
function Defs({ id }: { id: string }) {
  return (
    <defs>
      <filter id={`${id}p`} x="-8%" y="-8%" width="116%" height="116%">
        <feTurbulence type="fractalNoise" baseFrequency="0.07" numOctaves="2" seed="4" result="n" />
        <feDisplacementMap in="SourceGraphic" in2="n" scale="2.4" xChannelSelector="R" yChannelSelector="G" />
      </filter>
    </defs>
  );
}

/** Een geschilderd blad: egaal groen met een lichtere helft en een donkere hoofdnerf. */
function Leaf({ x, y, r = 0, s = 1 }: { id?: string; x: number; y: number; r?: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${r}) scale(${s})`}>
      <path d="M0 0C8-12 28-14 44 -1C28 12 9 11 0 0Z" fill="#4f7d34" />
      <path d="M2 -1C10-9 26-11 40 -1C26-3 12-2 2 -1Z" fill="#7aa648" opacity=".85" />
      <path d="M3 0C16 .5 30-.5 41-1" stroke="#2f5a24" strokeWidth=".9" fill="none" strokeLinecap="round" opacity=".7" />
    </g>
  );
}

/** Een geschilderde citroen: egaal geel met penseelstreken, een puntje rechts en een nopje links. */
function Fruit({ x, y, r = 0, s = 1 }: { id?: string; x: number; y: number; r?: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${r}) scale(${s})`}>
      <path
        d="M-26 -1C-27-12-14-20 -1-19C11-19 20-14 26-5L33 -1L26 4C20 14 11 20 -1 19C-15 19-26 11-26 -1Z"
        fill="#f4c60f"
      />
      <path d="M-22 5C-17 15-6 18 4 17C14 16 22 10 26 3C18 11 6 12-4 11C-13 10-19 8-22 5Z" fill="#e0a30c" opacity=".7" />
      <path d="M-18 -8C-12-15-3-16 6-15C-2-12-10-10-15-4C-17-3-19-5-18-8Z" fill="#ffe55a" opacity=".85" />
      <path d="M6 -2C10 -4 15 -3 19 0" stroke="#e9b413" strokeWidth="1.6" fill="none" strokeLinecap="round" opacity=".6" />
      <path d="M-26 -1C-29-1-30 2-27 3" stroke="#c98f12" strokeWidth="1.6" fill="none" strokeLinecap="round" opacity=".7" />
    </g>
  );
}

function Blossom({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {[0, 72, 144, 216, 288].map((a) => (
        <ellipse key={a} cx="0" cy="-7" rx="4.8" ry="8" transform={`rotate(${a})`} fill="#fffaec" stroke="#e6dcb8" strokeWidth=".6" />
      ))}
      <circle r="3.3" fill="#f0b81a" />
      <circle cx="-.8" cy="-.8" r="1.3" fill="#d98f12" opacity=".7" />
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
      <g filter={`url(#${id}p)`}>
      <g fill="none" stroke="#6b5a2f" strokeWidth="2.6" strokeLinecap="round">
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
      </g>
    </svg>
  );
}

/** Eén grote citroen met twee blaadjes, bijvoorbeeld als zegel op de envelop. */
export function BigLemon({ className = "", style, leaves = true }: { className?: string; style?: CSSProperties; leaves?: boolean }) {
  const id = useId();
  return (
    <svg viewBox={leaves ? "-46 -36 100 72" : "-40 -30 90 62"} aria-hidden="true" className={className} style={{ overflow: "visible", ...style }}>
      <Defs id={id} />
      <g filter={`url(#${id}p)`}>
      {leaves && <Leaf id={id} x={4} y={-16} r={-128} s={1.15} />}
      {leaves && <Leaf id={id} x={8} y={-14} r={-52} s={1.3} />}
      <Fruit id={id} x={0} y={2} r={-14} s={1.5} />
      {leaves && <Blossom x={26} y={-24} s={0.9} />}
      </g>
    </svg>
  );
}

/** Een kleine citroen met twee blaadjes en bloesem, als sierelement bij kopjes. */
export function LemonSprig({ className = "", width = 76 }: { className?: string; width?: number }) {
  const id = useId();
  return (
    <svg viewBox="6 -15 97 74" width={width} height={(width * 74) / 97} aria-hidden="true" className={className} style={{ overflow: "visible" }}>
      <Defs id={id} />
      <g filter={`url(#${id}p)`}>
      <path d="M14 30C34 22 52 24 66 30" fill="none" stroke="#6b5a2f" strokeWidth="1.8" strokeLinecap="round" />
      <Leaf id={id} x={14} y={30} r={-32} s={0.8} />
      <Leaf id={id} x={34} y={26} r={28} s={0.7} />
      <Fruit id={id} x={66} y={32} r={-14} s={0.95} />
      <Blossom x={84} y={16} s={0.8} />
      <Leaf id={id} x={68} y={14} r={-60} s={0.6} />
      </g>
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

function Card({ type, children, className = "" }: { type: string; children: ReactNode; className?: string }) {
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

/** Fotovervanger: een waterverf-achtig vlak met een gestreepte rand en een citroentak; met een echte foto vult die het kader. */
function LemonPhoto({ src }: { src?: string }) {
  return (
    <div
      className="relative mx-auto mt-7 aspect-[4/5] w-[72%] overflow-hidden"
      style={{
        background: `radial-gradient(120% 90% at 30% 20%, color-mix(in srgb, ${col("background")} 70%, white), ${col("background")})`,
        boxShadow: `0 0 0 0.3rem ${col("surface")}, 0 0 0 0.4rem ${BLUE}`,
      }}
      aria-hidden={src ? undefined : true}
    >
      {src ? (
        <StoryImg src={src} />
      ) : (
        <>
          <LemonBranch className="absolute -top-[4%] -left-[6%] w-[118%]" />
          <LemonBranch className="absolute -right-[8%] -bottom-[6%] w-[70%]" flip />
        </>
      )}
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
            <LemonBranch className="absolute -right-9 -bottom-4 w-[56%]" flip />
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
          <LemonPhoto src={block.photo} />
          <Body className="mt-8">{block.text}</Body>
        </Card>
      );

    case "text":
      return (
        <Card type={blockKey(block)}>
          {block.title ? <Head title={block.title} /> : <LemonSprig className="mx-auto" />}
          {block.text && <Body className="mt-5">{block.text}</Body>}
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
      return (
        <Card type="location">
          <Head eyebrow={block.eyebrow} title={block.title} />
          <Body className="mt-5">{block.address}</Body>
          <div className="mt-6">
            <PillButton href={mapsHref(block.mapsUrl, block.title, config.city)}>Bekijk route</PillButton>
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
