"use client";

import type { CSSProperties, ReactNode } from "react";
import type { Block, InvitationConfig, ThemeColors } from "@/lib/invitation/types";
import { StoryImg } from "./story-photo";
import { useCountdown } from "./use-countdown";
import { blockKey, mapsHref, formatDateLong } from "@/lib/invitation/format";
import { Flourish, LaceHeart, OvalFrame, Vine } from "./landgoed-art";

/**
 * Stijl "landgoed": een diep olijfgroene pagina met crème, hoge boogpanelen (ovaal boven en onder) met getekende
 * rankenkransen, sierlijk schrift voor de titels, een hart met kanten rand en kleine sierstreepjes.
 * Kleuren: background = olijfgroen, surface = crème, text = donker olijf (op crème), footerBackground = diepste groen.
 * Alle maten staan in cqw, zodat de uitnodiging meeschaalt met zijn breedte.
 */

const col = (key: keyof ThemeColors) => `var(--inv-${key})`;
const heading = { fontFamily: "var(--inv-heading)" } satisfies CSSProperties;
const script = { fontFamily: "var(--inv-script)" } satisfies CSSProperties;
const body = { fontFamily: "var(--inv-body)" } satisfies CSSProperties;

const CONTAINER: CSSProperties = { containerType: "inline-size" };

type Tone = "cream" | "green";
const ink = (t: Tone) => (t === "cream" ? col("text") : col("surface"));
const soft = (t: Tone) => (t === "cream" ? col("muted") : "color-mix(in srgb, var(--inv-surface) 78%, transparent)");

function Title({ eyebrow, title, tone }: { eyebrow?: string; title: string; tone: Tone }) {
  return (
    <header className="text-center">
      {eyebrow && (
        <p className="uppercase" style={{ ...heading, color: soft(tone), fontSize: "2.9cqw", letterSpacing: "0.24em", marginBottom: "1.6cqw" }}>
          {eyebrow}
        </p>
      )}
      <h2 style={{ ...script, color: ink(tone), fontSize: "11.5cqw", lineHeight: 1.1 }}>{title}</h2>
    </header>
  );
}

function Text({ children, tone, className = "" }: { children: ReactNode; tone: Tone; className?: string }) {
  return (
    <p className={`mx-auto whitespace-pre-line ${className}`} style={{ ...body, color: soft(tone), fontSize: "3.6cqw", lineHeight: 1.75, maxWidth: "66cqw" }}>
      {children}
    </p>
  );
}

function PillButton({ children, href, tone }: { children: ReactNode; href?: string; tone: Tone }) {
  const style: CSSProperties = {
    ...heading,
    background: tone === "cream" ? col("buttonBackground") : col("surface"),
    color: tone === "cream" ? col("buttonText") : col("text"),
    borderRadius: "var(--inv-radius)",
    fontSize: "3cqw",
    letterSpacing: "0.18em",
    padding: "3cqw 8cqw",
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

/** Olijfgroen vlak met crème tekst. */
function Green({ type, children }: { type: string; children: ReactNode }) {
  return (
    <section data-block={type} className="relative text-center" style={{ background: col("background"), padding: "13cqw 10cqw", ...CONTAINER }}>
      {children}
    </section>
  );
}

/** Crème boogpaneel (ovaal boven en onder) met een rankenkrans boven en onder, op het groene vlak. */
function Arch({ type, children }: { type: string; children: ReactNode }) {
  return (
    <section data-block={type} className="relative" style={{ background: col("background"), padding: "6cqw 7cqw", ...CONTAINER }}>
      <div className="relative text-center" style={{ background: col("surface"), borderRadius: "999px", padding: "34cqw 9cqw" }}>
        <Vine className="absolute left-1/2 -translate-x-1/2" style={{ top: "6cqw", width: "76cqw" }} />
        <Vine flip className="absolute left-1/2 -translate-x-1/2" style={{ bottom: "6cqw", width: "76cqw" }} />
        <div className="relative">{children}</div>
      </div>
    </section>
  );
}

function CountdownCircles({ date, time }: { date: string; time: string }) {
  const cells = useCountdown(date, time);
  return (
    <div className="flex justify-center" style={{ gap: "2.6cqw", marginTop: "7cqw" }}>
      {cells.map(([value, label]) => (
        <div key={label} className="text-center">
          <p
            className="grid place-items-center rounded-full tabular-nums"
            style={{ ...heading, width: "14cqw", height: "14cqw", background: col("surfaceAlt"), color: col("text"), fontSize: "6cqw", fontWeight: 600 }}
          >
            {value}
          </p>
          <p className="uppercase" style={{ ...heading, color: col("muted"), fontSize: "2.2cqw", letterSpacing: "0.14em", marginTop: "1.8cqw" }}>
            {label}
          </p>
        </div>
      ))}
    </div>
  );
}

export function LandgoedBlockSection({ block, config }: { block: Block; config: InvitationConfig; index?: number }) {
  const names = `${config.partner1} & ${config.partner2}`;
  const date = formatDateLong(config.date);

  switch (block.type) {
    case "hero":
      return (
        <section
          data-block="hero"
          className="relative flex items-center justify-center overflow-hidden"
          style={{
            minHeight: "150cqw",
            background: `radial-gradient(70% 50% at 50% 42%, color-mix(in srgb, ${col("background")} 82%, white), ${col("background")})`,
            ...CONTAINER,
          }}
        >
          <Vine className="absolute left-1/2 -translate-x-1/2" style={{ top: "6cqw", width: "88cqw", opacity: 0.55 }} />
          <Vine flip className="absolute left-1/2 -translate-x-1/2" style={{ bottom: "6cqw", width: "88cqw", opacity: 0.55 }} />
          <LaceHeart className="inv-float-soft" style={{ width: "82cqw" }}>
            <p className="uppercase" style={{ ...heading, color: col("surface"), fontSize: "2.7cqw", letterSpacing: "0.26em", opacity: 0.85 }}>
              {block.eyebrow}
            </p>
            <h1 aria-label={names} style={{ ...script, color: col("surface"), fontSize: "10.5cqw", lineHeight: 1.12, marginTop: "2.4cqw" }}>
              {config.partner1}
              <span className="block" style={{ fontSize: "7cqw", lineHeight: 1 }}>
                &amp;
              </span>
              {config.partner2}
            </h1>
            {date && (
              <p style={{ ...heading, color: col("surface"), fontSize: "3.3cqw", letterSpacing: "0.14em", marginTop: "3cqw", opacity: 0.9 }}>{date}</p>
            )}
          </LaceHeart>
        </section>
      );

    case "countdown":
      return (
        <Arch type="countdown">
          <Title eyebrow={block.eyebrow} title={block.title} tone="cream" />
          <CountdownCircles date={config.date} time={config.time} />
        </Arch>
      );

    case "story":
      return (
        <Arch type="story">
          <OvalFrame className="mx-auto" >
            {block.photo ? (
              <StoryImg src={block.photo} />
            ) : (
              <div className="grid h-full w-full place-items-center" aria-hidden="true">
                <span style={{ ...script, color: col("muted"), fontSize: "9cqw" }}>foto</span>
              </div>
            )}
          </OvalFrame>
          <div style={{ marginTop: "7cqw" }}>
            <Title eyebrow={block.eyebrow} title={block.title} tone="cream" />
          </div>
          <Flourish className="mx-auto" color={col("accent")} />
          <Text tone="cream" className="mt-[4cqw]">
            {block.text}
          </Text>
        </Arch>
      );

    case "text":
      return (
        <Green type={blockKey(block)}>
          {block.title && <Title title={block.title} tone="green" />}
          <Flourish className="mx-auto mt-[4cqw] w-[30cqw]" color={col("surface")} />
          {block.text && <Text tone="green" className="mt-[4cqw]">{block.text}</Text>}
        </Green>
      );

    case "program":
      return (
        <Arch type="program">
          <Title eyebrow={block.eyebrow} title={block.title} tone="cream" />
          <ul className="mx-auto" style={{ marginTop: "6cqw", maxWidth: "62cqw" }}>
            {block.items.map((item, i) => (
              <li key={i} className="text-center" style={{ paddingBottom: "4cqw" }}>
                <p style={{ ...heading, color: col("text"), fontSize: "6.4cqw", fontWeight: 600, lineHeight: 1.1 }}>{item.time}</p>
                <p className="uppercase" style={{ ...heading, color: col("text"), fontSize: "3.1cqw", letterSpacing: "0.16em", marginTop: "1cqw" }}>
                  {item.title}
                </p>
                {item.subtitle && <p style={{ ...body, color: col("muted"), fontSize: "3.3cqw", marginTop: "0.6cqw" }}>{item.subtitle}</p>}
                {i < block.items.length - 1 && <Flourish className="mx-auto mt-[3.4cqw] w-[20cqw]" color={col("accent")} />}
              </li>
            ))}
          </ul>
        </Arch>
      );

    case "location":
      return (
        <Green type="location">
          <Title eyebrow={block.eyebrow} title={block.title} tone="green" />
          <Flourish className="mx-auto mt-[4cqw] w-[30cqw]" color={col("surface")} />
          <Text tone="green" className="mt-[4cqw]">{block.address}</Text>
          <div style={{ marginTop: "7cqw" }}>
            <PillButton tone="green" href={mapsHref(block.mapsUrl, block.title, config.city)}>
              Bekijk route
            </PillButton>
          </div>
        </Green>
      );

    case "dresscode":
      return (
        <Green type="dresscode">
          <Title eyebrow={block.eyebrow} title={block.title} tone="green" />
          <Flourish className="mx-auto mt-[4cqw] w-[30cqw]" color={col("surface")} />
          <Text tone="green" className="mt-[4cqw]">{block.text}</Text>
          {block.colors.length > 0 && (
            <div className="flex justify-center" style={{ gap: "3.4cqw", marginTop: "7cqw" }}>
              {block.colors.map((c, i) => (
                <span
                  key={i}
                  className="block rounded-full"
                  style={{ width: "10cqw", height: "10cqw", background: c, boxShadow: `0 0 0 0.9cqw ${col("background")}, 0 0 0 1.5cqw ${col("surface")}` }}
                />
              ))}
            </div>
          )}
        </Green>
      );

    case "rsvp":
      return (
        <Arch type="rsvp">
          <Title eyebrow={block.eyebrow} title={block.title} tone="cream" />
          <Flourish className="mx-auto mt-[3cqw] w-[26cqw]" color={col("accent")} />
          <Text tone="cream" className="mt-[4cqw]">{block.text}</Text>
          <div style={{ marginTop: "6cqw" }}>
            <PillButton tone="cream">{block.buttonLabel}</PillButton>
          </div>
        </Arch>
      );

    case "footer":
      return (
        <section
          data-block="footer"
          className="text-center"
          style={{ background: col("footerBackground"), color: col("footerText"), padding: "13cqw 9cqw 24cqw", ...CONTAINER }}
        >
          <div className="relative mx-auto" style={{ border: `0.5cqw solid ${col("footerText")}`, borderRadius: "6cqw", padding: "3cqw" }}>
            <div style={{ border: `0.3cqw solid color-mix(in srgb, ${col("footerText")} 60%, transparent)`, borderRadius: "4.4cqw", padding: "10cqw 6cqw" }}>
              <p style={{ ...script, fontSize: "10cqw", lineHeight: 1.1 }}>{block.closing || "Tot dan"}</p>
              <Flourish className="mx-auto mt-[3cqw] w-[26cqw]" color={col("footerText")} />
              <p className="uppercase" style={{ ...heading, fontSize: "4cqw", letterSpacing: "0.18em", marginTop: "4cqw" }}>
                {names}
              </p>
              {block.contactEmail && <p style={{ ...body, fontSize: "3cqw", marginTop: "5cqw", opacity: 0.8 }}>Vragen? mail naar {block.contactEmail}</p>}
              <p className="uppercase" style={{ ...heading, fontSize: "2.6cqw", letterSpacing: "0.18em", marginTop: "3cqw", opacity: 0.7 }}>
                {[date, config.city].filter(Boolean).join(" · ")}
              </p>
            </div>
          </div>
        </section>
      );
  }
}
