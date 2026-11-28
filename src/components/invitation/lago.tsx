"use client";

import type { CSSProperties, ReactNode } from "react";
import type { Block, InvitationConfig, ThemeColors } from "@/lib/invitation/types";
import { StoryImg } from "./story-photo";
import { useCountdown } from "./use-countdown";
import { blockKey, mapsHref, formatDateLong } from "@/lib/invitation/format";

/**
 * Stijl "lago": modern en Italiaans: dunne, hoge hoofdletters voor de namen, sierlijk schrift voor de accenten,
 * bosgroene vlakken op crème, een foto in een dubbel kader en een RSVP-blok met verticale strepen.
 * Kleuren: background = crème, surface = lichte crème, text = bosgroen, footerBackground = diepste groen.
 * Alle maten staan in cqw; de padding staat steeds op een kind van de container (anders telt cqw niet mee).
 */

const col = (key: keyof ThemeColors) => `var(--inv-${key})`;
const heading = { fontFamily: "var(--inv-heading)" } satisfies CSSProperties;
const script = { fontFamily: "var(--inv-script)" } satisfies CSSProperties;
const body = { fontFamily: "var(--inv-body)" } satisfies CSSProperties;

/** Standaard achtergrondfoto van de beginpagina, tot iemand een eigen foto uploadt. */
const LAGO_HERO_PHOTO = "/images/lago-hero.jpg";

const CONTAINER: CSSProperties = { containerType: "inline-size" };

type Tone = "cream" | "green";
const ink = (t: Tone) => (t === "cream" ? col("text") : col("background"));
const soft = (t: Tone) => (t === "cream" ? col("muted") : "color-mix(in srgb, var(--inv-background) 82%, transparent)");

/** Verticale strepen in groen en crème; altijd een oneven aantal, dus begin en einde hebben dezelfde kleur. */
function Stripes({ n = 9, className = "", style }: { n?: number; className?: string; style?: CSSProperties }) {
  return (
    <div
      aria-hidden="true"
      className={className}
      style={{
        backgroundColor: col("background"),
        backgroundImage: `repeating-linear-gradient(90deg, ${col("text")} 0, ${col("text")} calc(100% / ${n}), transparent calc(100% / ${n}), transparent calc(200% / ${n}))`,
        ...style,
      }}
    />
  );
}

function Wrap({ type, tone, children, className = "", pad = "14cqw 9cqw" }: { type: string; tone: Tone; children: ReactNode; className?: string; pad?: string }) {
  return (
    <section
      data-block={type}
      className={`relative text-center ${className}`}
      style={{ background: tone === "cream" ? col("background") : col("footerBackground"), ...CONTAINER }}
    >
      <div style={{ padding: pad }}>{children}</div>
    </section>
  );
}

function Title({ title, eyebrow, tone }: { title: string; eyebrow?: string; tone: Tone }) {
  return (
    <header className="text-center">
      <h2 className="uppercase" style={{ ...heading, color: ink(tone), fontSize: "11cqw", lineHeight: 1.05, letterSpacing: "0.03em" }}>
        {title}
      </h2>
      {eyebrow && (
        <p style={{ ...script, color: soft(tone), fontSize: "6.2cqw", lineHeight: 1.3, marginTop: "2.4cqw" }}>{eyebrow}</p>
      )}
    </header>
  );
}

function Text({ children, tone, className = "" }: { children: ReactNode; tone: Tone; className?: string }) {
  return (
    <p className={`mx-auto whitespace-pre-line ${className}`} style={{ ...body, color: soft(tone), fontSize: "4.3cqw", lineHeight: 1.65, maxWidth: "76cqw" }}>
      {children}
    </p>
  );
}

function Button({ children, href, tone }: { children: ReactNode; href?: string; tone: Tone }) {
  const style: CSSProperties = {
    ...heading,
    border: `0.4cqw solid ${tone === "cream" ? col("text") : col("background")}`,
    color: tone === "cream" ? col("text") : col("background"),
    borderRadius: "var(--inv-radius)",
    fontSize: "3.6cqw",
    letterSpacing: "0.2em",
    padding: "3.4cqw 9cqw",
  };
  const cls = "inline-flex items-center justify-center font-semibold uppercase";
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
    <div className="grid grid-cols-4 text-center" style={{ marginTop: "9cqw", gap: "1cqw" }}>
      {cells.map(([value, label]) => (
        <div key={label}>
          <p className="tabular-nums" style={{ ...heading, color: col("background"), fontSize: "13cqw", lineHeight: 1 }}>
            {value}
          </p>
          <p className="uppercase" style={{ ...body, color: soft("green"), fontSize: "3cqw", letterSpacing: "0.18em", marginTop: "2cqw" }}>
            {label}
          </p>
        </div>
      ))}
    </div>
  );
}

export function LagoBlockSection({ block, config }: { block: Block; config: InvitationConfig; index?: number }) {
  const names = `${config.partner1} & ${config.partner2}`;
  const date = formatDateLong(config.date);

  switch (block.type) {
    case "hero":
      return (
        <section data-block="hero" className="relative overflow-hidden" style={{ ...CONTAINER }}>
          <div className="relative flex flex-col items-center justify-center text-center" style={{ minHeight: "165cqw", padding: "16cqw 6cqw" }}>
            {/* Eigen foto (anders de standaardfoto van het thema) met een doorzichtige groene laag eroverheen, zodat de tekst leesbaar blijft */}
            <StoryImg src={block.photo || LAGO_HERO_PHOTO} />
            <div aria-hidden="true" className="absolute inset-0" style={{ background: `linear-gradient(180deg, color-mix(in srgb, ${col("footerBackground")} 58%, transparent), color-mix(in srgb, ${col("footerBackground")} 74%, transparent))` }} />
            <h1 className="relative" aria-label={names} style={{ color: col("background") }}>
              <span className="block uppercase" style={{ ...heading, fontSize: "20cqw", lineHeight: 0.98, letterSpacing: "0.02em" }}>
                {config.partner1}
              </span>
              <span className="relative block" style={{ ...script, fontSize: "15cqw", lineHeight: 1, margin: "-3cqw 0 -4cqw", zIndex: 1 }}>
                en
              </span>
              <span className="block uppercase" style={{ ...heading, fontSize: "20cqw", lineHeight: 0.98, letterSpacing: "0.02em" }}>
                {config.partner2}
              </span>
            </h1>
            <p className="relative uppercase" style={{ ...heading, color: col("background"), fontSize: "4.4cqw", letterSpacing: "0.3em", marginTop: "9cqw" }}>
              {block.eyebrow}
            </p>
            {(date || config.city) && (
              <p className="relative" style={{ ...body, color: soft("green"), fontSize: "4cqw", letterSpacing: "0.08em", marginTop: "5cqw" }}>
                {[date, config.city].filter(Boolean).join("  ·  ")}
              </p>
            )}
          </div>
        </section>
      );

    case "countdown":
      return (
        <Wrap type="countdown" tone="green" pad="16cqw 7cqw">
          <Title title={block.title} eyebrow={block.eyebrow} tone="green" />
          <Countdown date={config.date} time={config.time} />
        </Wrap>
      );

    case "story":
      return (
        <Wrap type="story" tone="cream" pad="14cqw 9cqw">
          {/* Foto in een dubbel kader */}
          <div className="mx-auto" style={{ width: "62cqw", border: `0.5cqw solid ${col("text")}`, padding: "2.4cqw" }}>
            <div style={{ border: `0.5cqw solid ${col("text")}`, padding: "2.4cqw" }}>
              <div className="relative overflow-hidden" style={{ aspectRatio: "4 / 5", background: col("surfaceAlt") }}>
                {block.photo ? (
                  <StoryImg src={block.photo} />
                ) : (
                  <span className="absolute inset-0 grid place-items-center" aria-hidden="true" style={{ ...script, color: col("muted"), fontSize: "10cqw" }}>
                    foto
                  </span>
                )}
              </div>
            </div>
          </div>
          <div style={{ marginTop: "10cqw" }}>
            <Title title={block.title} eyebrow={block.eyebrow} tone="cream" />
          </div>
          <Text tone="cream" className="mt-[6cqw]">
            {block.text}
          </Text>
        </Wrap>
      );

    case "text":
      return (
        <Wrap type={blockKey(block)} tone="cream" pad="8cqw 6cqw">
          <div style={{ border: `0.5cqw solid ${col("text")}`, padding: "2.4cqw" }}>
            <div style={{ border: `0.5cqw solid ${col("text")}`, padding: "12cqw 6cqw" }}>
              {block.title && <p style={{ ...script, color: col("text"), fontSize: "11cqw", lineHeight: 1.1 }}>{block.title}</p>}
              {block.text && <Text tone="cream" className="mt-[5cqw]">{block.text}</Text>}
            </div>
          </div>
        </Wrap>
      );

    case "program":
      return (
        <Wrap type="program" tone="cream" pad="14cqw 7cqw">
          <Title title={block.title} eyebrow={block.eyebrow} tone="cream" />
          <ul className="mx-auto" style={{ marginTop: "10cqw", maxWidth: "80cqw" }}>
            {block.items.map((item, i) => (
              <li
                key={i}
                className="grid items-baseline text-left"
                style={{ gridTemplateColumns: "22cqw 1fr", columnGap: "4cqw", padding: "4cqw 0", borderTop: i === 0 ? undefined : `0.3cqw solid color-mix(in srgb, ${col("text")} 22%, transparent)` }}
              >
                <span style={{ ...heading, color: col("text"), fontSize: "6cqw", letterSpacing: "0.04em" }}>{item.time}</span>
                <span>
                  <span className="block" style={{ ...script, color: col("text"), fontSize: "8cqw", lineHeight: 1.1 }}>
                    {item.title}
                  </span>
                  {item.subtitle && (
                    <span className="block" style={{ ...body, color: col("muted"), fontSize: "3.8cqw", marginTop: "0.8cqw" }}>
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
        <Wrap type="location" tone="cream" pad="12cqw 9cqw 16cqw">
          <Title title={block.title} eyebrow={block.eyebrow} tone="cream" />
          <Text tone="cream" className="mt-[7cqw]">{block.address}</Text>
          <div style={{ marginTop: "9cqw" }}>
            <Button tone="cream" href={mapsHref(block.mapsUrl, block.title, config.city)}>
              Bekijk route
            </Button>
          </div>
        </Wrap>
      );

    case "dresscode":
      return (
        <Wrap type="dresscode" tone="cream" pad="12cqw 9cqw 14cqw">
          <p style={{ ...script, color: col("text"), fontSize: "12cqw", lineHeight: 1.1 }}>{block.title}</p>
          {block.eyebrow && (
            <p className="uppercase" style={{ ...heading, color: col("muted"), fontSize: "3.6cqw", letterSpacing: "0.24em", marginTop: "3cqw" }}>
              {block.eyebrow}
            </p>
          )}
          <Text tone="cream" className="mt-[6cqw]">{block.text}</Text>
          {block.colors.length > 0 && (
            <div className="flex justify-center" style={{ gap: "3.4cqw", marginTop: "8cqw" }}>
              {block.colors.map((c, i) => (
                <span key={i} className="block rounded-full" style={{ width: "11cqw", height: "11cqw", background: c, boxShadow: `0 0 0 0.9cqw ${col("background")}, 0 0 0 1.4cqw ${col("text")}` }} />
              ))}
            </div>
          )}
        </Wrap>
      );

    case "rsvp":
      return (
        <section data-block="rsvp" className="relative" style={{ background: col("footerBackground"), ...CONTAINER }}>
          <div className="grid" style={{ gridTemplateColumns: "1fr 24%" }}>
            <div className="text-left" style={{ padding: "14cqw 8cqw" }}>
              <h2 className="uppercase" style={{ ...heading, color: col("background"), fontSize: "11cqw", lineHeight: 1.05 }}>
                {block.title}
              </h2>
              {block.eyebrow && <p style={{ ...script, color: soft("green"), fontSize: "6cqw", marginTop: "2cqw" }}>{block.eyebrow}</p>}
              <p className="whitespace-pre-line" style={{ ...body, color: soft("green"), fontSize: "4cqw", lineHeight: 1.65, marginTop: "6cqw" }}>
                {block.text}
              </p>
              <div style={{ marginTop: "8cqw" }}>
                <Button tone="green">{block.buttonLabel}</Button>
              </div>
            </div>
            <Stripes n={9} className="h-full" />
          </div>
        </section>
      );

    case "footer":
      return (
        <section data-block="footer" className="text-center" style={{ background: col("footerBackground"), color: col("footerText"), ...CONTAINER }}>
          <div style={{ padding: "16cqw 8cqw 28cqw" }}>
            <p style={{ ...script, fontSize: "11cqw", lineHeight: 1.1 }}>{block.closing || "Tot dan"}</p>
            <p className="uppercase" style={{ ...heading, fontSize: "9cqw", lineHeight: 1.1, marginTop: "5cqw", letterSpacing: "0.04em" }}>
              {names}
            </p>
            {block.contactEmail && <p style={{ ...body, fontSize: "3.8cqw", marginTop: "8cqw", opacity: 0.85 }}>Vragen? mail naar {block.contactEmail}</p>}
            <p className="uppercase" style={{ ...heading, fontSize: "3.2cqw", letterSpacing: "0.24em", marginTop: "4cqw", opacity: 0.7 }}>
              {[date, config.city].filter(Boolean).join(" · ")}
            </p>
          </div>
        </section>
      );
  }
}
