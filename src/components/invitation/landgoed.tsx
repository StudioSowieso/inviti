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

/** Bokeh-bloemetjes onderin de tuin: vaste posities (x, y in cqw, grootte), zodat het er elke keer hetzelfde uitziet. */
const BLOOMS: [number, number, number][] = [
  [6, 128, 5], [16, 142, 4], [4, 150, 6], [26, 154, 3.4], [12, 160, 4.6], [90, 126, 5.4], [80, 140, 4], [94, 148, 6],
  [70, 156, 3.4], [86, 160, 4.8], [40, 158, 3], [58, 162, 3.6], [34, 146, 2.6], [64, 148, 2.8],
];

function LandgoedHero({ block, config, names, date }: { block: Extract<Block, { type: "hero" }>; config: InvitationConfig; names: string; date: string }) {
  const paper = `linear-gradient(160deg, color-mix(in srgb, ${col("envelope")} 96%, white), color-mix(in srgb, ${col("envelope")} 82%, #8a8468))`;
  return (
    <section data-block="hero" className="relative overflow-hidden" style={{ ...CONTAINER }}>
      <div className="relative" style={{ height: "172cqw", background: `linear-gradient(180deg, color-mix(in srgb, ${col("background")} 55%, #c9cfbb) 0%, ${col("background")} 34%, ${col("footerBackground")} 100%)` }}>
        {/* Tuin: zuilen links en rechts, zacht licht en bokeh */}
        <div aria-hidden="true" className="absolute inset-0" style={{ background: "radial-gradient(60% 30% at 50% 6%, rgb(255 255 255 / .28), transparent 70%)" }} />
        {[0, 1].map((side) => (
          <div
            key={side}
            aria-hidden="true"
            className="absolute"
            style={{
              top: 0,
              bottom: "20cqw",
              width: "15cqw",
              [side === 0 ? "left" : "right"]: 0,
              background: `linear-gradient(${side === 0 ? 90 : 270}deg, color-mix(in srgb, ${col("footerBackground")} 80%, black), color-mix(in srgb, ${col("background")} 60%, ${col("footerBackground")}))`,
              opacity: 0.8,
            }}
          />
        ))}
        {BLOOMS.map(([x, y, d], i) => (
          <span
            key={i}
            aria-hidden="true"
            className="absolute rounded-full"
            style={{ left: `${x}cqw`, top: `${y}cqw`, width: `${d}cqw`, height: `${d}cqw`, background: col("surface"), opacity: 0.38, filter: "blur(0.5cqw)" }}
          />
        ))}

        {/* Envelop: achterkant met donkere voering */}
        <div className="absolute" style={{ left: "13cqw", top: "84cqw", width: "74cqw", height: "56cqw", background: paper, borderRadius: "1cqw", boxShadow: "0 3cqw 6cqw rgb(0 0 0 / .45)" }}>
          <div
            aria-hidden="true"
            className="absolute inset-x-[3%] top-0"
            style={{ height: "46%", clipPath: "polygon(6% 0, 94% 0, 100% 100%, 0 100%)", background: `linear-gradient(180deg, ${col("footerBackground")}, color-mix(in srgb, ${col("background")} 70%, ${col("footerBackground")}))` }}
          />
        </div>

        {/* Hart met kanten rand, half uit de envelop */}
        <LaceHeart className="absolute inv-float-soft" style={{ left: "17cqw", top: "34cqw", width: "66cqw", zIndex: 2 }}>
          <p style={{ ...script, color: col("surface"), fontSize: "13cqw", lineHeight: 1.05 }}>{block.eyebrow}</p>
          <p aria-label={names} style={{ ...heading, color: col("surface"), fontSize: "5cqw", marginTop: "2.2cqw", letterSpacing: "0.04em" }}>
            {config.partner1} &amp; {config.partner2}
          </p>
          {date && <p style={{ ...heading, color: col("surface"), fontSize: "4cqw", letterSpacing: "0.08em", marginTop: "1.2cqw", opacity: 0.9 }}>{date}</p>}
        </LaceHeart>

        {/* Voorkant van de envelop met vouwen en zegel */}
        <div
          aria-hidden="true"
          className="absolute"
          style={{
            left: "13cqw",
            top: "84cqw",
            width: "74cqw",
            height: "56cqw",
            zIndex: 3,
            borderRadius: "0 0 1cqw 1cqw",
            clipPath: "polygon(0 26%, 50% 66%, 100% 26%, 100% 100%, 0 100%)",
            background: paper,
          }}
        />
        <svg aria-hidden="true" viewBox="0 0 74 56" className="pointer-events-none absolute" style={{ left: "13cqw", top: "84cqw", width: "74cqw", height: "56cqw", zIndex: 4 }} fill="none" stroke={col("muted")} strokeWidth={0.25} opacity={0.55}>
          <path d="M0 14.5 37 37 74 14.5M0 56 28 30M74 56 46 30" />
        </svg>
        <div
          className="absolute grid place-items-center"
          style={{ left: "50cqw", top: "113cqw", width: "9cqw", height: "11cqw", transform: "translateX(-50%)", zIndex: 5, border: `0.35cqw solid ${col("muted")}`, borderRadius: "50%", color: col("muted"), ...script, fontSize: "5.2cqw", opacity: 0.8 }}
        >
          {(config.partner1[0] ?? "") + (config.partner2[0] ?? "")}
        </div>
      </div>
    </section>
  );
}

export function LandgoedBlockSection({ block, config }: { block: Block; config: InvitationConfig; index?: number }) {
  const names = `${config.partner1} & ${config.partner2}`;
  const date = formatDateLong(config.date);

  switch (block.type) {
    case "hero":
      return <LandgoedHero block={block} config={config} names={names} date={date} />;

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
