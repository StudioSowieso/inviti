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
        <p className="uppercase" style={{ ...heading, color: soft(tone), fontSize: "3.6cqw", letterSpacing: "0.24em", marginBottom: "2cqw" }}>
          {eyebrow}
        </p>
      )}
      <h2 style={{ ...script, color: ink(tone), fontSize: "15cqw", lineHeight: 1.05 }}>{title}</h2>
    </header>
  );
}

function Text({ children, tone, className = "" }: { children: ReactNode; tone: Tone; className?: string }) {
  return (
    <p className={`mx-auto whitespace-pre-line ${className}`} style={{ ...body, color: soft(tone), fontSize: "4.4cqw", lineHeight: 1.7, maxWidth: "78cqw" }}>
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
    fontSize: "3.8cqw",
    letterSpacing: "0.18em",
    padding: "3.8cqw 10cqw",
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

/** Olijfgroen vlak met crème tekst en zachte rankenkransen boven en onder. */
function Green({ type, children }: { type: string; children: ReactNode }) {
  return (
    <section data-block={type} className="relative overflow-hidden text-center" style={{ background: col("background"), ...CONTAINER }}>
      <Vine className="pointer-events-none absolute left-1/2 -translate-x-1/2" style={{ top: "3cqw", width: "92cqw", opacity: 0.35 }} />
      <Vine flip className="pointer-events-none absolute left-1/2 -translate-x-1/2" style={{ bottom: "3cqw", width: "92cqw", opacity: 0.35 }} />
      {/* De padding staat op een kind: cqw in de eigen stijl van de container zou naar de buitenste container verwijzen. */}
      <div className="relative" style={{ padding: "30cqw 9cqw" }}>
        {children}
      </div>
    </section>
  );
}

/** Crème boogpaneel (ovaal boven en onder) met een dunne binnenlijn en rankenkransen, op het groene vlak. */
function Arch({ type, children }: { type: string; children: ReactNode }) {
  return (
    <section data-block={type} className="relative" style={{ background: col("background"), ...CONTAINER }}>
      <div style={{ padding: "6cqw 5cqw" }}>
        <div className="relative text-center" style={{ background: col("surface"), borderRadius: "999px" }}>
          <div
            aria-hidden="true"
            className="pointer-events-none absolute"
            style={{ inset: "2.4cqw", borderRadius: "999px", border: `0.35cqw solid color-mix(in srgb, ${col("accent")} 45%, transparent)` }}
          />
          <Vine className="absolute left-1/2 -translate-x-1/2" style={{ top: "6cqw", width: "80cqw" }} />
          <Vine flip className="absolute left-1/2 -translate-x-1/2" style={{ bottom: "6cqw", width: "80cqw" }} />
          <div className="relative" style={{ padding: "36cqw 10cqw" }}>
            {children}
          </div>
        </div>
      </div>
    </section>
  );
}

function CountdownCircles({ date, time }: { date: string; time: string }) {
  const cells = useCountdown(date, time);
  return (
    <div className="flex justify-center" style={{ gap: "2.4cqw", marginTop: "8cqw" }}>
      {cells.map(([value, label]) => (
        <div key={label} className="text-center">
          <p
            className="grid place-items-center rounded-full tabular-nums"
            style={{ ...heading, width: "17cqw", height: "17cqw", background: col("surfaceAlt"), color: col("text"), fontSize: "7.4cqw", fontWeight: 600 }}
          >
            {value}
          </p>
          <p className="uppercase" style={{ ...heading, color: col("muted"), fontSize: "2.8cqw", letterSpacing: "0.12em", marginTop: "2cqw" }}>
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
          className="relative overflow-hidden"
          style={{ background: `radial-gradient(75% 45% at 50% 46%, color-mix(in srgb, ${col("background")} 80%, white), ${col("background")})`, ...CONTAINER }}
        >
          <div className="relative flex flex-col items-center justify-center" style={{ minHeight: "175cqw", padding: "10cqw 0" }}>
            {/* Boogkader met dunne lijn rond het hart */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute"
              style={{ inset: "5cqw", borderRadius: "999px 999px 9cqw 9cqw", border: `0.4cqw solid color-mix(in srgb, ${col("surface")} 55%, transparent)` }}
            />
            <Vine className="pointer-events-none absolute left-1/2 -translate-x-1/2" style={{ top: "12cqw", width: "78cqw", opacity: 0.8 }} />
            <Vine flip className="pointer-events-none absolute left-1/2 -translate-x-1/2" style={{ bottom: "12cqw", width: "78cqw", opacity: 0.8 }} />
            <LaceHeart className="inv-float-soft" style={{ width: "84cqw" }}>
              <p className="uppercase" style={{ ...heading, color: col("surface"), fontSize: "3.3cqw", letterSpacing: "0.24em", opacity: 0.9 }}>
                {block.eyebrow}
              </p>
              <h1 aria-label={names} style={{ ...script, color: col("surface"), fontSize: "13.5cqw", lineHeight: 1.08, marginTop: "2.6cqw" }}>
                {config.partner1}
                <span className="block" style={{ fontSize: "8cqw", lineHeight: 1 }}>
                  &amp;
                </span>
                {config.partner2}
              </h1>
              {date && <p style={{ ...heading, color: col("surface"), fontSize: "4.2cqw", letterSpacing: "0.12em", marginTop: "3.4cqw" }}>{date}</p>}
            </LaceHeart>
            {config.city && (
              <p className="uppercase" style={{ ...heading, color: col("surface"), fontSize: "3.6cqw", letterSpacing: "0.3em", marginTop: "9cqw", opacity: 0.85 }}>
                {config.city}
              </p>
            )}
          </div>
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
          <OvalFrame className="mx-auto w-[52cqw]">
            {block.photo ? (
              <StoryImg src={block.photo} />
            ) : (
              <div className="grid h-full w-full place-items-center" aria-hidden="true">
                <span style={{ ...script, color: col("muted"), fontSize: "12cqw" }}>foto</span>
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
          <ul className="mx-auto" style={{ marginTop: "6cqw", maxWidth: "76cqw" }}>
            {block.items.map((item, i) => (
              <li key={i} className="text-center" style={{ paddingBottom: "5cqw" }}>
                <p style={{ ...heading, color: col("text"), fontSize: "8.5cqw", fontWeight: 600, lineHeight: 1.1 }}>{item.time}</p>
                <p className="uppercase" style={{ ...heading, color: col("text"), fontSize: "3.8cqw", letterSpacing: "0.14em", marginTop: "1.2cqw" }}>
                  {item.title}
                </p>
                {item.subtitle && <p style={{ ...body, color: col("muted"), fontSize: "4cqw", marginTop: "0.8cqw" }}>{item.subtitle}</p>}
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
        <section data-block="footer" className="relative overflow-hidden text-center" style={{ background: col("footerBackground"), color: col("footerText"), ...CONTAINER }}>
          <Vine className="pointer-events-none absolute left-1/2 -translate-x-1/2" style={{ top: "3cqw", width: "92cqw", opacity: 0.3 }} />
          <div style={{ padding: "14cqw 8cqw 28cqw" }}>
            <div className="relative" style={{ border: `0.6cqw solid ${col("footerText")}`, borderRadius: "7cqw", padding: "3cqw" }}>
              <div style={{ border: `0.35cqw solid color-mix(in srgb, ${col("footerText")} 60%, transparent)`, borderRadius: "5cqw", padding: "13cqw 6cqw" }}>
                <p style={{ ...script, fontSize: "14cqw", lineHeight: 1.05 }}>{block.closing || "Tot dan"}</p>
                <Flourish className="mx-auto w-[34cqw]" color={col("footerText")} />
                <p className="uppercase" style={{ ...heading, fontSize: "5.2cqw", letterSpacing: "0.16em", marginTop: "5cqw", lineHeight: 1.4 }}>
                  {names}
                </p>
                {block.contactEmail && <p style={{ ...body, fontSize: "3.8cqw", marginTop: "6cqw", opacity: 0.85 }}>Vragen? mail naar {block.contactEmail}</p>}
                <p className="uppercase" style={{ ...heading, fontSize: "3.2cqw", letterSpacing: "0.16em", marginTop: "4cqw", opacity: 0.75 }}>
                  {[date, config.city].filter(Boolean).join(" · ")}
                </p>
              </div>
            </div>
          </div>
        </section>
      );
  }
}
