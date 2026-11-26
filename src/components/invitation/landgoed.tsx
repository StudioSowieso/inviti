"use client";

import type { CSSProperties, ReactNode } from "react";
import type { Block, InvitationConfig, ThemeColors } from "@/lib/invitation/types";
import { StoryImg } from "./story-photo";
import { useCountdown } from "./use-countdown";
import { blockKey, mapsHref, formatDateLong } from "@/lib/invitation/format";
import { Flourish, OvalFrame, Vine } from "./landgoed-art";

/**
 * Stijl "landgoed": een diep olijfgroene pagina met crème, hoge boogpanelen (ovaal boven en onder) met getekende
 * rankenkransen, sierlijk schrift voor de titels en kleine sierstreepjes.
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

const MONTHS = ["JAN", "FEB", "MRT", "APR", "MEI", "JUN", "JUL", "AUG", "SEP", "OKT", "NOV", "DEC"];
const WEEKDAYS = ["ZONDAG", "MAANDAG", "DINSDAG", "WOENSDAG", "DONDERDAG", "VRIJDAG", "ZATERDAG"];

/** Datum in delen voor de datumregel (MAAND | DAG | JAAR en de weekdag); leeg als de datum ontbreekt. */
function dateParts(date: string) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(date);
  if (!m) return null;
  const d = new Date(Date.UTC(+m[1], +m[2] - 1, +m[3]));
  return { month: MONTHS[+m[2] - 1], day: String(+m[3]), year: m[1], weekday: WEEKDAYS[d.getUTCDay()] };
}

/** Hero: crème papier met monogram, hoofdletternamen, een hartje als scheiding en een grote datumregel. */
function LandgoedHero({ block, config, names }: { block: Extract<Block, { type: "hero" }>; config: InvitationConfig; names: string }) {
  const dp = dateParts(config.date);
  const initials = [config.partner1[0], config.partner2[0]].map((x) => (x ?? "").toUpperCase());
  const line = `linear-gradient(90deg, transparent, ${col("accent")})`;
  return (
    <section data-block="hero" className="relative overflow-hidden" style={{ background: col("surface"), ...CONTAINER }}>
      {/* Takje rechts boven, goed in beeld */}
      <Vine className="pointer-events-none absolute" style={{ right: "-6cqw", top: "8cqw", width: "58cqw", rotate: "16deg" }} />

      <div className="relative text-center" style={{ padding: "22cqw 8cqw 20cqw" }}>
        {/* Monogram */}
        <div className="flex items-center justify-center" style={{ ...heading, color: col("accent"), gap: "6cqw", fontSize: "17cqw", lineHeight: 1 }}>
          <span>{initials[0]}</span>
          <span aria-hidden="true" style={{ width: "0.4cqw", height: "17cqw", background: col("accent") }} />
          <span>{initials[1]}</span>
        </div>
        <svg viewBox="0 0 60 18" aria-hidden="true" className="mx-auto" style={{ width: "22cqw", marginTop: "3cqw" }} fill="none" stroke={col("accent")} strokeWidth={0.9} strokeLinecap="round">
          <path d="M4 14C18 16 38 14 56 4" />
          {[10, 18, 26, 34, 42, 50].map((x, i) => (
            <path key={x} d={`M${x} ${14 - i * 1.6}c-2 -4 -6 -5 -8 -4c1 4 5 5 8 4z`} style={{ fill: col("accent"), fillOpacity: 0.18 }} />
          ))}
        </svg>

        <p className="mx-auto uppercase" style={{ ...heading, color: col("text"), fontSize: "4.4cqw", letterSpacing: "0.16em", lineHeight: 1.7, marginTop: "13cqw", maxWidth: "70cqw", fontWeight: 600 }}>
          {block.eyebrow}
        </p>
        <div className="mx-auto" style={{ height: "0.3cqw", width: "16cqw", marginTop: "4cqw", background: col("accent"), opacity: 0.6 }} />

        <h1 aria-label={names} style={{ marginTop: "11cqw" }}>
          <span className="block uppercase" style={{ ...heading, color: col("text"), fontSize: "15.5cqw", lineHeight: 1.05, fontWeight: 400 }}>
            {config.partner1}
          </span>
          <span className="block" style={{ ...script, color: col("accent"), fontSize: "12cqw", lineHeight: 1.1, margin: "2cqw 0" }}>
            en
          </span>
          <span className="block uppercase" style={{ ...heading, color: col("text"), fontSize: "15.5cqw", lineHeight: 1.05, fontWeight: 400 }}>
            {config.partner2}
          </span>
        </h1>

        {/* Hartje tussen twee lijnen */}
        <div className="flex items-center justify-center" style={{ gap: "3cqw", marginTop: "12cqw" }}>
          <span style={{ height: "0.3cqw", flex: 1, background: line, opacity: 0.7 }} />
          <svg viewBox="0 0 24 22" aria-hidden="true" style={{ width: "7cqw" }} fill={col("accent")}>
            <path d="M12 21C3 14 1 9 3.4 5.2C6 1.4 10.6 2.4 12 6C13.4 2.4 18 1.4 20.6 5.2C23 9 21 14 12 21Z" />
          </svg>
          <span style={{ height: "0.3cqw", flex: 1, background: `linear-gradient(270deg, transparent, ${col("accent")})`, opacity: 0.7 }} />
        </div>

        {dp && (
          <div style={{ marginTop: "10cqw" }}>
            <div className="flex items-center justify-center" style={{ ...heading, color: col("text"), gap: "5cqw" }}>
              <span style={{ fontSize: "5.4cqw", letterSpacing: "0.12em", fontWeight: 600 }}>{dp.month}</span>
              <span aria-hidden="true" style={{ width: "0.3cqw", height: "11cqw", background: col("accent"), opacity: 0.7 }} />
              <span style={{ fontSize: "15cqw", lineHeight: 1, fontWeight: 400 }}>{dp.day}</span>
              <span aria-hidden="true" style={{ width: "0.3cqw", height: "11cqw", background: col("accent"), opacity: 0.7 }} />
              <span style={{ fontSize: "5.4cqw", letterSpacing: "0.12em", fontWeight: 600 }}>{dp.year}</span>
            </div>
            <p style={{ ...heading, color: col("text"), fontSize: "4.6cqw", letterSpacing: "0.16em", fontWeight: 600, marginTop: "5cqw" }}>{dp.weekday}</p>
          </div>
        )}
        {(config.time || config.city) && (
          <p className="uppercase" style={{ ...heading, color: col("muted"), fontSize: "3.6cqw", letterSpacing: "0.2em", marginTop: "5cqw" }}>
            {[config.time ? `${config.time} uur` : "", config.city].filter(Boolean).join("  ·  ")}
          </p>
        )}
      </div>
    </section>
  );
}

export function LandgoedBlockSection({ block, config }: { block: Block; config: InvitationConfig; index?: number }) {
  const names = `${config.partner1} & ${config.partner2}`;
  const date = formatDateLong(config.date);

  switch (block.type) {
    case "hero":
      return <LandgoedHero block={block} config={config} names={names} />;

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
