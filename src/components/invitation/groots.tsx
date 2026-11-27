"use client";

import type { CSSProperties, ReactNode } from "react";
import type { Block, InvitationConfig, ThemeColors } from "@/lib/invitation/types";
import { StoryImg } from "./story-photo";
import { useCountdown } from "./use-countdown";
import { blockKey, mapsHref } from "@/lib/invitation/format";

/**
 * Stijl "groots": enorme, sierlijke handschriftnamen die tot aan de rand lopen, kleine hoofdletters met veel
 * letterruimte en dunne lijnen, in één diepe inktkleur op gebroken wit papier.
 * Kleuren: background = papier, text = inkt, footerBackground = diepste inkt, surface = lichter papier.
 * Alle maten staan in cqw; de padding staat steeds op een kind van de container (anders telt cqw niet mee).
 */

const col = (key: keyof ThemeColors) => `var(--inv-${key})`;
const heading = { fontFamily: "var(--inv-heading)" } satisfies CSSProperties;
const script = { fontFamily: "var(--inv-script)" } satisfies CSSProperties;
const body = { fontFamily: "var(--inv-body)" } satisfies CSSProperties;

const CONTAINER: CSSProperties = { containerType: "inline-size" };

type Tone = "paper" | "ink";
const BG: Record<Tone, string> = { paper: col("background"), ink: col("footerBackground") };
const ink = (t: Tone) => (t === "ink" ? col("footerText") : col("text"));
const soft = (t: Tone) => (t === "ink" ? "color-mix(in srgb, var(--inv-footerText) 80%, transparent)" : col("muted"));

/** Kleine hoofdletters met veel letterruimte. */
const caps = (size: number, spacing = 0.22): CSSProperties => ({ ...body, textTransform: "uppercase", fontSize: `${size}cqw`, letterSpacing: `${spacing}em`, lineHeight: 1.5 });

/** Datum als 12.04.2026. */
function numericDate(date: string) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(date);
  return m ? `${m[3]}.${m[2]}.${m[1]}` : "";
}

/** Lettergrootte (in cqw) van een handschriftnaam, zodat de langste naam net binnen het blad blijft. */
export function scriptSize(...names: string[]) {
  const longest = Math.max(4, ...names.map((n) => n.length));
  return Math.min(31, 98 / (longest * 0.44));
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

/** Dunne verticale lijn, zoals op de gedrukte kaart. */
function Rule({ h = 12, tone = "paper" as Tone }: { h?: number; tone?: Tone }) {
  return <div aria-hidden="true" className="mx-auto" style={{ width: "0.3cqw", height: `${h}cqw`, background: ink(tone) }} />;
}

function Title({ title, eyebrow, tone, size = 17 }: { title: string; eyebrow?: string; tone: Tone; size?: number }) {
  return (
    <header className="text-center">
      {eyebrow && <p style={{ ...caps(3.2, 0.26), color: soft(tone), marginBottom: "3cqw" }}>{eyebrow}</p>}
      <h2 style={{ ...script, color: ink(tone), fontSize: `${size}cqw`, lineHeight: 1.05 }}>{title}</h2>
    </header>
  );
}

function Text({ children, tone, className = "" }: { children: ReactNode; tone: Tone; className?: string }) {
  return (
    <p className={`mx-auto whitespace-pre-line ${className}`} style={{ ...body, color: soft(tone), fontSize: "4.1cqw", lineHeight: 1.75, maxWidth: "72cqw" }}>
      {children}
    </p>
  );
}

function Button({ children, href, tone }: { children: ReactNode; href?: string; tone: Tone }) {
  const c = ink(tone);
  const style: CSSProperties = { ...caps(3.2, 0.26), color: c, border: `0.3cqw solid ${c}`, borderRadius: "var(--inv-radius)", padding: "3.6cqw 8cqw" };
  const cls = "inline-flex items-center justify-center";
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
          <p className="tabular-nums" style={{ ...heading, color: col("footerText"), fontSize: "10cqw", lineHeight: 1 }}>
            {value}
          </p>
          <p style={{ ...caps(2.4, 0.18), color: soft("ink"), marginTop: "2.4cqw" }}>{label}</p>
        </div>
      ))}
    </div>
  );
}

export function GrootsBlockSection({ block, config }: { block: Block; config: InvitationConfig; index?: number }) {
  const date = numericDate(config.date);
  const names = `${config.partner1} & ${config.partner2}`;

  switch (block.type) {
    case "hero": {
      const size = scriptSize(config.partner1, config.partner2);
      return (
        <section data-block="hero" className="relative overflow-hidden" style={{ background: col("background"), color: col("text"), ...CONTAINER }}>
          <div className="relative" style={{ aspectRatio: "100 / 128" }}>
            {block.eyebrow && (
              <p className="absolute inset-x-0 text-center" style={{ ...caps(3.4, 0.24), top: "10cqw" }}>
                {block.eyebrow}
              </p>
            )}
            <h1 className="absolute inset-x-0" aria-label={names} style={{ top: "17cqw" }}>
              <span className="block" style={{ ...script, fontSize: `${size}cqw`, lineHeight: 0.95, marginLeft: "-1.5cqw", paddingLeft: "3cqw", whiteSpace: "nowrap" }}>
                {config.partner1}
              </span>
              <span className="flex items-end justify-between" style={{ marginTop: "-2cqw", padding: "0 3cqw 0 6cqw" }}>
                <span style={{ ...heading, fontSize: "7.4cqw", lineHeight: 1, textTransform: "uppercase", marginBottom: "6cqw", letterSpacing: "0.04em" }}>en</span>
                <span style={{ ...script, fontSize: `${size}cqw`, lineHeight: 0.95, whiteSpace: "nowrap", marginRight: "-6cqw" }}>{config.partner2}</span>
              </span>
            </h1>
            <div className="absolute inset-x-0 text-center" style={{ top: "78cqw" }}>
              <Rule h={11} />
              {date && (
                <p className="tabular-nums" style={{ ...heading, fontSize: "9cqw", lineHeight: 1, marginTop: "6cqw", letterSpacing: "0.06em" }}>
                  {date}
                </p>
              )}
              {(config.time || config.city) && (
                <p style={{ ...caps(3, 0.24), marginTop: "4cqw" }}>{[config.city, config.time && `${config.time} uur`].filter(Boolean).join("  ·  ")}</p>
              )}
            </div>
          </div>
        </section>
      );
    }

    case "countdown":
      return (
        <Wrap type="countdown" tone="ink" pad="16cqw 7cqw">
          <Title title={block.title} eyebrow={block.eyebrow} tone="ink" size={13} />
          <Countdown date={config.date} time={config.time} />
        </Wrap>
      );

    case "story":
      return (
        <Wrap type="story" tone="paper" pad="16cqw 9cqw 8cqw">
          <div className="relative mx-auto" style={{ width: "66cqw" }}>
            <div aria-hidden="true" className="absolute" style={{ inset: "-2.6cqw 2.6cqw 2.6cqw -2.6cqw", border: `0.3cqw solid ${col("text")}` }} />
            <div className="relative overflow-hidden" style={{ aspectRatio: "4 / 5", background: col("surfaceAlt") }}>
              {block.photo ? (
                <StoryImg src={block.photo} />
              ) : (
                <span className="absolute inset-0 grid place-items-center" aria-hidden="true" style={{ ...script, color: col("muted"), fontSize: "11cqw" }}>
                  foto
                </span>
              )}
            </div>
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
        <Wrap type={blockKey(block)} tone="paper" pad="8cqw 9cqw">
          <Rule h={10} />
          {block.title && (
            <h2 style={{ ...script, fontSize: "14cqw", lineHeight: 1.1, marginTop: "7cqw" }}>{block.title}</h2>
          )}
          {block.text && <Text tone="paper" className="mt-[5cqw]">{block.text}</Text>}
        </Wrap>
      );

    case "program":
      return (
        <Wrap type="program" tone="paper" pad="12cqw 9cqw 10cqw">
          <Title title={block.title} eyebrow={block.eyebrow} tone="paper" />
          <ul className="text-left" style={{ marginTop: "10cqw" }}>
            {block.items.map((item, i) => (
              <li key={i} className="grid" style={{ gridTemplateColumns: "21cqw 0.3cqw 1fr", columnGap: "6cqw", padding: "5cqw 0" }}>
                <span style={{ ...heading, fontSize: "7cqw", lineHeight: 1.1, letterSpacing: "0.04em" }}>{item.time}</span>
                <span aria-hidden="true" style={{ background: col("text") }} />
                <span>
                  <span className="block" style={caps(3.8, 0.16)}>
                    {item.title}
                  </span>
                  {item.subtitle && (
                    <span className="block" style={{ ...body, color: col("muted"), fontSize: "3.8cqw", lineHeight: 1.5, marginTop: "1.4cqw" }}>
                      {item.subtitle}
                    </span>
                  )}
                </span>
              </li>
            ))}
          </ul>
        </Wrap>
      );

    case "location":
      return (
        <Wrap type="location" tone="paper" pad="10cqw 9cqw 16cqw">
          <Title title={block.title} eyebrow={block.eyebrow} tone="paper" />
          <p className="mx-auto whitespace-pre-line" style={{ ...caps(3.6, 0.16), lineHeight: 1.9, marginTop: "8cqw", maxWidth: "70cqw" }}>
            {block.address}
          </p>
          <div style={{ marginTop: "9cqw" }}>
            <Button tone="paper" href={mapsHref(block.mapsUrl, block.title, config.city)}>
              Bekijk route
            </Button>
          </div>
        </Wrap>
      );

    case "dresscode":
      return (
        <Wrap type="dresscode" tone="paper" pad="8cqw 9cqw 16cqw">
          <Title title={block.title} eyebrow={block.eyebrow} tone="paper" />
          <Text tone="paper" className="mt-[6cqw]">{block.text}</Text>
          {block.colors.length > 0 && (
            <div className="flex justify-center" style={{ gap: "3.4cqw", marginTop: "8cqw" }}>
              {block.colors.map((c, i) => (
                <span key={i} className="block rounded-full" style={{ width: "10cqw", height: "10cqw", background: c, boxShadow: `0 0 0 0.5cqw ${col("background")}, 0 0 0 0.8cqw ${col("text")}` }} />
              ))}
            </div>
          )}
        </Wrap>
      );

    case "rsvp":
      return (
        <Wrap type="rsvp" tone="ink" pad="16cqw 8cqw 16cqw">
          <Title title={block.title} eyebrow={block.eyebrow} tone="ink" size={15} />
          <Text tone="ink" className="mt-[6cqw]">{block.text}</Text>
          <div style={{ marginTop: "9cqw" }}>
            <Button tone="ink">{block.buttonLabel}</Button>
          </div>
        </Wrap>
      );

    case "footer":
      return (
        <section data-block="footer" className="relative overflow-hidden text-center" style={{ background: col("footerBackground"), color: col("footerText"), ...CONTAINER }}>
          <div style={{ padding: "16cqw 8cqw 30cqw" }}>
            <p style={{ ...script, fontSize: "20cqw", lineHeight: 1 }}>{block.closing || "Tot dan"}</p>
            <p style={{ ...caps(3.8, 0.26), marginTop: "7cqw" }}>{names}</p>
            {block.contactEmail && <p style={{ ...body, fontSize: "3.8cqw", marginTop: "8cqw", opacity: 0.85 }}>Vragen? mail naar {block.contactEmail}</p>}
            {(date || config.city) && <p style={{ ...caps(2.8, 0.24), marginTop: "4cqw", opacity: 0.7 }}>{[date, config.city].filter(Boolean).join("  ·  ")}</p>}
          </div>
        </section>
      );
  }
}
