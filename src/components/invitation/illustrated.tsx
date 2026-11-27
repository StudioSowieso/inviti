"use client";

import type { CSSProperties, ReactNode } from "react";
import type { Block, InvitationConfig, ThemeColors } from "@/lib/invitation/types";
import { StoryImg } from "./story-photo";
import { useCountdown } from "./use-countdown";
import { blockKey, mapsHref } from "@/lib/invitation/format";
import { Bottle, Bow, Coupe, Curl, DiscoBall, ProgramIcon, River, SignPost, Sparkle } from "./illustrated-art";

/**
 * Stijl "illustrated": kobaltblauw op boterkleurig papier, dikke retro-letters in kleine letters en getekende
 * glazen, strikken en een rivier van wijn, zoals een drukwerkkaart met één kleur inkt en een lichtblauwe tweede kleur.
 * Kleuren: background = papier, surface = lichter papier, text = kobalt, accent = poederblauw, footerBackground = kobalt.
 * Alle maten staan in cqw; de padding staat steeds op een kind van de container (anders telt cqw niet mee).
 */

const col = (key: keyof ThemeColors) => `var(--inv-${key})`;
const heading = { fontFamily: "var(--inv-heading)" } satisfies CSSProperties;
const body = { fontFamily: "var(--inv-body)" } satisfies CSSProperties;

const CONTAINER: CSSProperties = { containerType: "inline-size" };

type Tone = "paper" | "blue" | "sky";
const BG: Record<Tone, string> = { paper: col("background"), blue: col("footerBackground"), sky: col("accent") };
const ink = (t: Tone) => (t === "blue" ? col("footerText") : col("text"));
const soft = (t: Tone) => (t === "blue" ? "color-mix(in srgb, var(--inv-footerText) 82%, transparent)" : t === "sky" ? col("text") : col("muted"));

/** Datum als 22.08.2026; leeg als de datum ongeldig is. */
function numericDate(date: string) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(date);
  return m ? `${m[3]}.${m[2]}.${m[1]}` : "";
}

/** Lettergrootte (in cqw) waarmee de langste regel van de namen net op de pagina past. */
export function nameSize(...lines: string[]) {
  const longest = Math.max(3, ...lines.map((l) => l.length));
  return Math.min(25, 84 / (longest * 0.56));
}

function Wrap({ type, tone, children, className = "", pad = "14cqw 9cqw" }: { type: string; tone: Tone; children: ReactNode; className?: string; pad?: string }) {
  return (
    <section data-block={type} className={`relative overflow-hidden text-center ${className}`} style={{ background: BG[tone], color: ink(tone), ...CONTAINER }}>
      <div className="relative" style={{ padding: pad }}>
        {children}
      </div>
    </section>
  );
}

function Title({ title, eyebrow, tone, size = 13 }: { title: string; eyebrow?: string; tone: Tone; size?: number }) {
  return (
    <header className="text-center">
      <h2 className="lowercase" style={{ ...heading, color: ink(tone), fontSize: `${size}cqw`, lineHeight: 1.02, letterSpacing: "-0.01em" }}>
        {title}
      </h2>
      {eyebrow && (
        <p className="lowercase" style={{ ...body, color: soft(tone), fontSize: "4.2cqw", lineHeight: 1.4, marginTop: "3cqw" }}>
          {eyebrow}
        </p>
      )}
    </header>
  );
}

function Text({ children, tone, className = "" }: { children: ReactNode; tone: Tone; className?: string }) {
  return (
    <p className={`mx-auto whitespace-pre-line ${className}`} style={{ ...body, color: soft(tone), fontSize: "4.2cqw", lineHeight: 1.7, maxWidth: "74cqw" }}>
      {children}
    </p>
  );
}

function Button({ children, href, tone }: { children: ReactNode; href?: string; tone: Tone }) {
  const style: CSSProperties = {
    ...heading,
    background: tone === "blue" ? col("footerText") : col("text"),
    color: tone === "blue" ? col("footerBackground") : col("background"),
    borderRadius: "var(--inv-radius)",
    fontSize: "4.4cqw",
    padding: "3.2cqw 9cqw",
  };
  const cls = "inline-flex items-center justify-center lowercase";
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

function Countdown({ date, time }: { date: string; time: string }) {
  const cells = useCountdown(date, time);
  return (
    <div className="grid grid-cols-4 text-center" style={{ marginTop: "10cqw", gap: "2cqw" }}>
      {cells.map(([value, label]) => (
        <div key={label}>
          <p className="tabular-nums" style={{ ...heading, color: col("footerText"), fontSize: "9.5cqw", lineHeight: 1 }}>
            {value}
          </p>
          <p className="lowercase" style={{ ...body, color: soft("blue"), fontSize: "3cqw", marginTop: "2cqw" }}>
            {label}
          </p>
        </div>
      ))}
    </div>
  );
}

/** Een coupeglas, schuin gehouden, met een strik om de steel. `bow` = strik tonen. */
function Glass({ w, rotate, style, className = "" }: { w: number; rotate: number; style?: CSSProperties; className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={`absolute ${className}`}
      style={{ width: `${w}cqw`, aspectRatio: "100 / 130", transform: `rotate(${rotate}deg)`, color: col("text"), ...style }}
    >
      <Coupe className="absolute inset-0 h-full w-full" />
      <Bow className="absolute" style={{ left: "22%", top: "66%", width: "56%" }} />
    </div>
  );
}

/** Twee glazen die tegen elkaar klinken, met spetters en een sterretje. */
function Toast({ tone = "paper" }: { tone?: Tone }) {
  return (
    <div className="relative mx-auto" aria-hidden="true" style={{ width: "46cqw", height: "30cqw", marginTop: "9cqw", color: tone === "blue" ? col("footerText") : col("text") }}>
      <Glass w={19} rotate={24} className="inv-float" style={{ left: "1cqw", top: "2cqw" }} />
      <Glass w={19} rotate={-24} className="inv-float" style={{ right: "1cqw", top: "2cqw" }} />
      <Sparkle className="absolute inv-pulse" style={{ left: "21cqw", top: "-2cqw", width: "5cqw" }} />
    </div>
  );
}

export function IllustratedBlockSection({ block, config }: { block: Block; config: InvitationConfig; index?: number }) {
  const date = numericDate(config.date);
  const names = `${config.partner1} & ${config.partner2}`;
  const second = `& ${config.partner2}`;

  switch (block.type) {
    case "hero": {
      const size = nameSize(config.partner1, second);
      return (
        <section data-block="hero" className="relative overflow-hidden" style={{ background: col("background"), color: col("text"), ...CONTAINER }}>
          <div className="relative" style={{ aspectRatio: "100 / 165" }}>
            {/* De rivier slingert van de fles naar beneden en waaiert uit; hij loopt bij het openen van boven naar beneden in beeld. */}
            <River className="inv-pour absolute inset-0 h-full w-full" />

            {/* Fles die inschenkt, linksboven */}
            <Bottle className="inv-float absolute" style={{ left: "3.5cqw", top: "-7.4cqw", width: "15cqw", transform: "rotate(125deg)" }} />
            {/* Glas met strik, rechtsboven */}
            <Glass w={20} rotate={-22} className="inv-float" style={{ left: "71cqw", top: "12cqw" }} />

            {block.eyebrow && (
              <p className="absolute lowercase" style={{ ...body, left: "27cqw", right: "31cqw", top: "7cqw", textAlign: "center", fontSize: "4.2cqw", lineHeight: 1.3 }}>
                {block.eyebrow}
              </p>
            )}

            <h1 className="absolute inset-x-0 text-center lowercase" aria-label={names} style={{ ...heading, top: "47cqw", fontSize: `${size}cqw`, lineHeight: 0.92, letterSpacing: "-0.02em" }}>
              <span className="block">{config.partner1}</span>
              <span className="block">{second}</span>
            </h1>

            <Sparkle className="inv-pulse absolute" style={{ left: "4cqw", top: "47cqw", width: "5cqw" }} />
            <Sparkle className="inv-pulse absolute" style={{ left: "88cqw", top: "92cqw", width: "4cqw" }} />

            {/* Twee glazen onderin klinken tegen de rivier aan */}
            <Glass w={20} rotate={22} className="inv-float" style={{ left: "1cqw", top: "126cqw" }} />
            <Glass w={20} rotate={-26} className="inv-float" style={{ left: "79cqw", top: "122cqw" }} />

            <div className="absolute inset-x-0 text-center" style={{ top: "132cqw" }}>
              {date && (
                <p style={{ ...heading, fontSize: "8.8cqw", lineHeight: 1 }} className="tabular-nums">
                  {date}
                </p>
              )}
              {(config.time || config.city) && (
                <p className="lowercase" style={{ ...body, fontSize: "4cqw", marginTop: "3cqw" }}>
                  {[config.time && `${config.time} uur`, config.city].filter(Boolean).join(" · ")}
                </p>
              )}
            </div>
          </div>
        </section>
      );
    }

    case "countdown":
      return (
        <Wrap type="countdown" tone="blue" pad="16cqw 7cqw">
          <DiscoBall className="inv-sway absolute" style={{ right: "6cqw", top: "-2cqw", width: "20cqw", color: col("footerText") }} />
          <Title title={block.title} eyebrow={block.eyebrow} tone="blue" size={11} />
          <Countdown date={config.date} time={config.time} />
        </Wrap>
      );

    case "story":
      return (
        <Wrap type="story" tone="paper" pad="16cqw 9cqw 8cqw">
          <div className="relative mx-auto" style={{ width: "64cqw" }}>
            <div aria-hidden="true" className="absolute inset-0" style={{ background: col("accent"), borderRadius: "4cqw", transform: "rotate(4deg) translate(2.5cqw, 2cqw)" }} />
            <div className="relative overflow-hidden" style={{ aspectRatio: "4 / 5", background: col("surfaceAlt"), borderRadius: "4cqw", border: `0.7cqw solid ${col("text")}` }}>
              {block.photo ? (
                <StoryImg src={block.photo} />
              ) : (
                <span className="absolute inset-0 grid place-items-center lowercase" aria-hidden="true" style={{ ...heading, color: col("muted"), fontSize: "9cqw" }}>
                  foto
                </span>
              )}
            </div>
            <Bow className="inv-sway absolute" style={{ left: "-9cqw", top: "-7cqw", width: "24cqw", transform: "rotate(-16deg)" }} />
          </div>
          <div style={{ marginTop: "13cqw" }}>
            <Title title={block.title} eyebrow={block.eyebrow} tone="paper" />
          </div>
          <Text tone="paper" className="mt-[6cqw]">
            {block.text}
          </Text>
        </Wrap>
      );

    case "text":
      return (
        <Wrap type={blockKey(block)} tone="paper" pad="6cqw 7cqw 10cqw">
          <div className="relative" style={{ background: col("surface"), borderRadius: "3cqw", border: `0.6cqw solid ${col("text")}`, padding: "13cqw 8cqw" }}>
            <Curl className="absolute" style={{ left: "-1.5cqw", top: "-1.5cqw", width: "17cqw" }} />
            <Curl className="absolute" style={{ right: "-1.5cqw", bottom: "-1.5cqw", width: "17cqw", transform: "rotate(180deg)" }} />
            {block.title && (
              <h2 className="lowercase" style={{ ...heading, fontSize: "9.6cqw", lineHeight: 1.05 }}>
                {block.title}
              </h2>
            )}
            {block.text && <Text tone="paper" className="mt-[5cqw]">{block.text}</Text>}
          </div>
        </Wrap>
      );

    case "program":
      return (
        <Wrap type="program" tone="paper" pad="11cqw 5cqw 8cqw">
          <Title title={block.title} eyebrow={block.eyebrow} tone="paper" />
          <ul style={{ marginTop: "8cqw" }}>
            {block.items.map((item, i) => (
              <li key={i} className="relative" style={{ padding: "6cqw 0" }}>
                <ProgramIcon
                  index={i}
                  className="absolute"
                  style={{ top: "50%", [i % 2 === 0 ? "left" : "right"]: "3cqw", width: "17cqw", height: "17cqw", transform: "translateY(-50%)", color: col("text") } as CSSProperties}
                />
                <div className="mx-auto" style={{ maxWidth: "52cqw" }}>
                  <p className="lowercase" style={{ ...heading, fontSize: "7.6cqw", lineHeight: 1.08 }}>
                    {item.title}
                  </p>
                  <p style={{ ...body, color: col("muted"), fontSize: "3.9cqw", lineHeight: 1.5, marginTop: "1.6cqw" }}>
                    {[item.time, item.subtitle].filter(Boolean).join("  ·  ")}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </Wrap>
      );

    case "location":
      return (
        <Wrap type="location" tone="paper" pad="10cqw 9cqw 16cqw">
          <Title title={block.title} eyebrow={block.eyebrow} tone="paper" />
          <Text tone="paper" className="mt-[7cqw]">{block.address}</Text>
          <div style={{ marginTop: "9cqw" }}>
            <Button tone="paper" href={mapsHref(block.mapsUrl, block.title, config.city)}>
              bekijk route
            </Button>
          </div>
          <SignPost className="inv-sway-soft absolute" style={{ right: "5cqw", bottom: "3cqw", width: "14cqw", color: col("text") }} />
        </Wrap>
      );

    case "dresscode":
      return (
        <Wrap type="dresscode" tone="paper" pad="8cqw 9cqw 16cqw">
          <Bow className="mx-auto inv-sway-soft" style={{ width: "22cqw", color: col("text"), marginBottom: "6cqw" }} />
          <Title title={block.title} eyebrow={block.eyebrow} tone="paper" size={11} />
          <Text tone="paper" className="mt-[6cqw]">{block.text}</Text>
          {block.colors.length > 0 && (
            <div className="flex justify-center" style={{ gap: "3.4cqw", marginTop: "8cqw" }}>
              {block.colors.map((c, i) => (
                <span key={i} className="block rounded-full" style={{ width: "11cqw", height: "11cqw", background: c, boxShadow: `0 0 0 0.6cqw ${col("text")}` }} />
              ))}
            </div>
          )}
        </Wrap>
      );

    case "rsvp":
      return (
        <Wrap type="rsvp" tone="sky" pad="15cqw 8cqw 14cqw">
          <Title title={block.title} eyebrow={block.eyebrow} tone="sky" size={12} />
          <p className="mx-auto whitespace-pre-line" style={{ ...body, color: col("text"), fontSize: "4.2cqw", lineHeight: 1.7, maxWidth: "74cqw", marginTop: "6cqw" }}>
            {block.text}
          </p>
          <div style={{ marginTop: "9cqw" }}>
            <Button tone="sky">{block.buttonLabel}</Button>
          </div>
          <Toast />
        </Wrap>
      );

    case "footer":
      return (
        <section data-block="footer" className="relative overflow-hidden text-center" style={{ background: col("footerBackground"), color: col("footerText"), ...CONTAINER }}>
          <div style={{ padding: "16cqw 8cqw 30cqw" }}>
            <Bow className="inv-sway mx-auto" style={{ width: "24cqw", color: col("footerText") }} />
            <p className="lowercase" style={{ ...heading, fontSize: "15cqw", lineHeight: 1.02, marginTop: "8cqw" }}>
              {block.closing || "Tot dan"}
            </p>
            <p className="lowercase" style={{ ...heading, fontSize: "7.4cqw", lineHeight: 1.1, marginTop: "5cqw", opacity: 0.9 }}>
              {names}
            </p>
            {block.contactEmail && <p style={{ ...body, fontSize: "3.8cqw", marginTop: "8cqw", opacity: 0.85 }}>Vragen? mail naar {block.contactEmail}</p>}
            {(date || config.city) && (
              <p className="lowercase" style={{ ...body, fontSize: "3.6cqw", marginTop: "4cqw", opacity: 0.75 }}>
                {[date, config.city].filter(Boolean).join(" · ")}
              </p>
            )}
          </div>
        </section>
      );
  }
}
