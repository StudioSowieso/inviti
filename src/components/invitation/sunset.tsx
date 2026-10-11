"use client";

import { useMemo, type CSSProperties, type ReactNode } from "react";
import { blockKey, formatDateLong, mapsHref } from "@/lib/invitation/format";
import type { Block, InvitationConfig, ThemeColors } from "@/lib/invitation/types";
import { StoryImg } from "./story-photo";
import { useCountdown } from "./use-countdown";

/**
 * Stijl "sunset": een oranje tafel met gestapelde papieren kaartjes in perzik, rood en roze, golvende
 * zijranden, halfronde kaartjes met een paperclip en een speels handschrift. Alle kleuren komen uit het thema:
 * achtergrond = oranje, surface = perzik, surfaceAlt = roze, accent = rood.
 */

const col = (key: keyof ThemeColors) => `var(--inv-${key})`;
const heading = { fontFamily: "var(--inv-heading)" } satisfies CSSProperties;
const script = { fontFamily: "var(--inv-script)" } satisfies CSSProperties;
const CAPS = "uppercase tracking-[0.16em]";

/** Paperclip in goud. */
export function Paperclip({ className = "", style }: { className?: string; style?: CSSProperties }) {
  return (
    <svg viewBox="0 0 30 58" width="26" height="50" aria-hidden="true" className={className} style={style} fill="none" stroke="#dcb85f" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 3C7 3 5 14 9 26c3 10 5 18 5.5 23C15 55 23 54 22.5 47L17 22C15.5 14 21 13 22 19l3 13" />
    </svg>
  );
}

/** Een halfrond kaartje (platte kant onderaan) met optioneel een paperclip. */
export function HalfCard({ children, clip = true, className = "", tone = "surfaceAlt" }: { children: ReactNode; clip?: boolean; className?: string; tone?: keyof ThemeColors }) {
  return (
    <div
      className={`relative mx-auto ${className}`}
      style={{
        background: col(tone),
        borderRadius: "999px 999px 0.5rem 0.5rem / 100% 100% 0.5rem 0.5rem",
        boxShadow: "0 14px 24px -14px rgb(60 20 5 / .55)",
      }}
    >
      {children}
      {clip && <Paperclip className="absolute -bottom-2 left-[62%]" style={{ transform: "rotate(8deg)" }} />}
    </div>
  );
}

/** Een kaart met golvende linker- en rechterrand, zoals de perzikkleurige kaart in het ontwerp. */
export function WavyCard({ children, tone = "surface", className = "" }: { children: ReactNode; tone?: keyof ThemeColors; className?: string }) {
  const path = useMemo(() => {
    const pts: string[] = [];
    for (let y = 0; y <= 100; y += 1) pts.push(`${(5 + 4.2 * Math.sin((y / 100) * Math.PI * 2 * 5.5)).toFixed(2)} ${y}`);
    return `M10 0 L${pts.join(" L")} L10 100 Z`;
  }, []);
  const fill = col(tone);
  return (
    <div className={`relative ${className}`} style={{ paddingInline: "0.62rem" }}>
      <div className="absolute inset-y-0 right-[0.6rem] left-[0.6rem]" style={{ background: fill }} />
      <svg aria-hidden="true" viewBox="0 0 10 100" preserveAspectRatio="none" className="absolute inset-y-0 left-0 w-[0.65rem]" style={{ fill }}>
        <path d={path} />
      </svg>
      <svg aria-hidden="true" viewBox="0 0 10 100" preserveAspectRatio="none" className="absolute inset-y-0 right-0 w-[0.65rem] scale-x-[-1]" style={{ fill }}>
        <path d={path} />
      </svg>
      <div className="relative">{children}</div>
    </div>
  );
}

function Card({ children, tone = "surface", bg, className = "", rot = 0 }: { children: ReactNode; tone?: keyof ThemeColors; bg?: string; className?: string; rot?: number }) {
  return (
    <div
      className={`relative rounded-[1.35rem] ${className}`}
      style={{ background: bg ?? col(tone), transform: rot ? `rotate(${rot}deg)` : undefined, boxShadow: "0 14px 24px -14px rgb(60 20 5 / .55)" }}
    >
      {children}
    </div>
  );
}

function ScriptTitle({ children, color = "text", size = "2.3rem" }: { children: ReactNode; color?: keyof ThemeColors; size?: string }) {
  return (
    <h2 className="leading-[1.1]" style={{ ...script, color: col(color), fontSize: size }}>
      {children}
    </h2>
  );
}

function Button({ children, href, tone = "buttonBackground" }: { children: ReactNode; href?: string; tone?: keyof ThemeColors }) {
  const cls = "inline-block px-6 py-2.5 text-[0.55rem] font-medium tracking-[0.2em] uppercase";
  const style = { background: col(tone), color: col("buttonText"), borderRadius: "var(--inv-radius)" } satisfies CSSProperties;
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

function SunsetCountdown({ date, time }: { date: string; time: string }) {
  const cells = useCountdown(date, time);
  return (
    <div className="mt-6 grid grid-cols-4 text-center">
      {cells.map(([value, label], i) => (
        <div key={label} style={i > 0 ? { borderLeft: "1px solid rgb(255 255 255 / .35)" } : undefined}>
          <p className="text-[1.9rem] leading-none tabular-nums" style={heading}>
            {value}
          </p>
          <p className={`mt-2 text-[0.42rem] ${CAPS}`}>{label}</p>
        </div>
      ))}
    </div>
  );
}

function dateScript(date: string) {
  const d = new Date(`${date}T12:00:00Z`);
  if (Number.isNaN(d.getTime())) return "";
  return new Intl.DateTimeFormat("nl-NL", { timeZone: "UTC", day: "numeric", month: "long" }).format(d);
}

export function SunsetBlockSection({ block, config, index }: { block: Block; config: InvitationConfig; index: number }) {
  const body = "text-[0.78rem] leading-[1.7] whitespace-pre-line";
  const rot = index % 2 ? 0.8 : -0.8;
  const wrap = "relative px-5 py-4";

  switch (block.type) {
    case "hero":
      return (
        <section data-block="hero" className="relative px-5 pt-10 pb-8" style={{ background: col("background") }}>
          <Card className="px-6 pt-9 pb-24 text-center" rot={-0.6}>
            <p className="text-[0.52rem] tracking-[0.2em] uppercase" style={{ color: col("muted") }}>
              {block.eyebrow}
            </p>
            <div className="mt-5 text-[2.9rem] leading-[0.92] tracking-tight uppercase" style={{ ...heading, color: col("accent") }}>
              <p className="break-words">{config.partner1}</p>
              <p className="my-1 text-[1.9rem] leading-none normal-case" style={{ ...script, color: col("text") }}>
                &amp;
              </p>
              <p className="break-words">{config.partner2}</p>
            </div>
          </Card>
          <HalfCard className="-mt-[4.6rem] w-[72%] px-4 pt-12 pb-6 text-center">
            <p className="text-[1.9rem] leading-[1.05]" style={{ ...script, color: col("accent") }}>
              {dateScript(config.date)}
            </p>
            <p className="mt-1 text-[1.15rem] leading-none" style={{ ...heading, color: col("accent") }}>
              {config.date.slice(0, 4)}
            </p>
            {config.city && (
              <p className={`mt-3 text-[0.5rem] ${CAPS}`} style={{ color: col("text") }}>
                {config.city}
              </p>
            )}
          </HalfCard>
          <p className="mt-9 text-center text-[0.5rem] tracking-[0.18em] uppercase" style={{ color: col("buttonText"), opacity: 0.85 }}>
            Scroll voor de details
          </p>
        </section>
      );

    case "countdown":
      return (
        <section data-block="countdown" className={wrap} style={{ background: col("background") }}>
          <Card tone="accent" className="px-6 py-8 text-center" rot={rot}>
            <div style={{ color: col("buttonText") }}>
              {block.eyebrow && <p className={`text-[0.5rem] ${CAPS} opacity-80`}>{block.eyebrow}</p>}
              <h2 className="mt-2 text-[1.7rem] leading-[1.05] tracking-tight uppercase" style={heading}>
                {block.title}
              </h2>
              <SunsetCountdown date={config.date} time={config.time} />
            </div>
          </Card>
        </section>
      );

    case "story":
      return (
        <section data-block="story" className={wrap} style={{ background: col("background") }}>
          <WavyCard>
            <div className="px-5 py-8 text-center" style={{ color: col("text") }}>
              {block.eyebrow && (
                <p className="text-[0.5rem] tracking-[0.2em] uppercase" style={{ color: col("muted") }}>
                  {block.eyebrow}
                </p>
              )}
              <ScriptTitle>{block.title}</ScriptTitle>
              <div className="mt-5 overflow-hidden rounded-[1.1rem]" style={{ aspectRatio: "1.25" }}>
                {block.photo ? (
                  <div className="relative h-full w-full">
                    <StoryImg src={block.photo} />
                  </div>
                ) : (
                  <div className="relative h-full w-full" style={{ background: col("background") }}>
                    <div className="absolute bottom-0 left-[14%] h-[62%] w-[46%]" style={{ background: col("surfaceAlt"), borderRadius: "999px 999px 0 0" }} />
                    <div className="absolute right-[10%] bottom-0 h-[44%] w-[34%]" style={{ background: col("accent"), borderRadius: "999px 999px 0 0" }} />
                  </div>
                )}
              </div>
              <p className={`mt-5 ${body}`} style={{ color: col("muted") }}>
                {block.text}
              </p>
            </div>
          </WavyCard>
        </section>
      );

    case "text":
      return (
        <section data-block={blockKey(block)} className={wrap} style={{ background: col("background") }}>
          <Card className="px-6 py-8 text-center" rot={rot}>
            {block.title && <ScriptTitle>{block.title}</ScriptTitle>}
            {block.text && (
              <p className={`mt-4 ${body}`} style={{ color: col("muted") }}>
                {block.text}
              </p>
            )}
          </Card>
        </section>
      );

    case "program":
      return (
        <section data-block="program" className={wrap} style={{ background: col("background") }}>
          <Card bg={`color-mix(in srgb, ${col("accent")} 70%, black)`} className="px-6 py-8" rot={rot}>
            <div style={{ color: col("buttonText") }}>
              <div className="text-center">
                {block.eyebrow && <p className={`text-[0.5rem] ${CAPS} opacity-80`}>{block.eyebrow}</p>}
                <ScriptTitle color="surface" size="2.6rem">
                  {block.title}
                </ScriptTitle>
              </div>
              <ul className="mt-5 text-center">
                {block.items.map((item, i) => (
                  <li key={i} className="py-3" style={i > 0 ? { borderTop: "1px solid rgb(255 255 255 / .25)" } : undefined}>
                    <p className="text-[1.05rem] leading-none" style={{ ...heading, color: col("surface") }}>
                      {item.time}
                    </p>
                    <p className={`mt-1.5 text-[0.7rem] ${CAPS}`}>{item.title}</p>
                    {item.subtitle && <p className="mt-1 text-[0.7rem] italic opacity-85">{item.subtitle}</p>}
                  </li>
                ))}
              </ul>
            </div>
          </Card>
        </section>
      );

    case "location":
      return (
        <section data-block="location" className={wrap} style={{ background: col("background") }}>
          <Card className="px-6 py-8 text-center" rot={rot}>
            {block.eyebrow && (
              <p className="text-[0.5rem] tracking-[0.2em] uppercase" style={{ color: col("muted") }}>
                {block.eyebrow}
              </p>
            )}
            <h2 className="mt-2 text-[1.7rem] leading-[1.05] tracking-tight uppercase" style={{ ...heading, color: col("accent") }}>
              {block.title}
            </h2>
            <p className={`mx-auto mt-4 max-w-[16rem] ${body}`} style={{ color: col("text") }}>
              {block.address}
            </p>
            <div className="mt-5">
              <Button href={mapsHref(block.mapsUrl, block.title, config.city)}>Bekijk route</Button>
            </div>
          </Card>
        </section>
      );

    case "dresscode":
      return (
        <section data-block="dresscode" className={wrap} style={{ background: col("background") }}>
          <Card tone="surfaceAlt" className="px-6 py-8 text-center" rot={rot}>
            {block.eyebrow && (
              <p className="text-[0.5rem] tracking-[0.2em] uppercase" style={{ color: col("accent") }}>
                {block.eyebrow}
              </p>
            )}
            <ScriptTitle color="accent">{block.title}</ScriptTitle>
            <p className={`mx-auto mt-3 max-w-[16rem] ${body}`} style={{ color: col("text") }}>
              {block.text}
            </p>
            {block.colors.length > 0 && (
              <div className="mt-5 flex justify-center gap-3">
                {block.colors.map((c, i) => (
                  <span key={i} className="size-6 rounded-full" style={{ background: c, boxShadow: "0 0 0 2px rgb(255 255 255 / .75)" }} />
                ))}
              </div>
            )}
          </Card>
        </section>
      );

    case "rsvp":
      return (
        <section data-block="rsvp" className="relative px-5 pt-6 pb-10" style={{ background: col("background") }}>
          <HalfCard tone="surface" className="w-[88%] px-6 pt-[4.6rem] pb-9 text-center">
            {block.eyebrow && (
              <p className="text-[0.5rem] tracking-[0.2em] uppercase" style={{ color: col("muted") }}>
                {block.eyebrow}
              </p>
            )}
            <ScriptTitle color="accent" size="2.1rem">
              {block.title}
            </ScriptTitle>
            <p className={`mx-auto mt-3 max-w-[15rem] ${body}`} style={{ color: col("text") }}>
              {block.text}
            </p>
            <div className="mt-5">
              <Button>{block.buttonLabel}</Button>
            </div>
          </HalfCard>
        </section>
      );

    case "footer":
      return (
        <section data-block="footer" className="relative px-6 pt-12 pb-24 text-center" style={{ background: col("footerBackground"), color: col("footerText") }}>
          <p className="text-[2.2rem] leading-[1.2] text-balance" style={script}>
            {block.closing ? `${block.closing} ` : ""}
            {config.partner1} <span className="whitespace-nowrap">&amp; {config.partner2}</span>
          </p>
          {block.contactEmail && <p className="mt-4 text-[0.7rem] opacity-80">Vragen? mail naar {block.contactEmail}</p>}
          <p className={`mt-3 text-[0.5rem] opacity-75 ${CAPS}`}>{[formatDateLong(config.date), config.city].filter(Boolean).join(" · ")}</p>
        </section>
      );
  }
}
