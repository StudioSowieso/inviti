"use client";

import type { CSSProperties, ReactNode } from "react";
import type { Block, InvitationConfig, ThemeColors } from "@/lib/invitation/types";
import { StoryImg } from "./story-photo";
import { useCountdown } from "./use-countdown";
import { blockKey, mapsHref } from "@/lib/invitation/format";
import { BourgCard, BourgStripes, Doodle, WOBBLE, type DoodleKind } from "./bourgondisch-art";

/**
 * Stijl "bourgondisch": een kaart met wiebelige, handgetekende rand op gestreept papier, omringd door
 * olijfgroene lijntekeningen van het goede leven (kreeft, oesters, druiven, glazen, fles, kandelaar en vulpen).
 * Namen en titels staan in een penseelhandschrift; kleuren komen allemaal uit het thema.
 */

const col = (key: keyof ThemeColors) => `var(--inv-${key})`;
const heading = { fontFamily: "var(--inv-heading)" } satisfies CSSProperties;
const script = { fontFamily: "var(--inv-script)" } satisfies CSSProperties;

/** Elke sectie is een container, zodat het decor met `cqw` meeschaalt met de breedte van de uitnodiging. */
const CONTAINER: CSSProperties = { containerType: "inline-size" };

type Place = {
  kind: DoodleKind;
  w: string;
  rotate?: number;
  /** Alleen de opgegeven zijden worden gebruikt; negatieve waarden laten het plaatje over de rand steken. */
  left?: string;
  right?: string;
  top?: string;
  bottom?: string;
};

function Scatter({ items }: { items: Place[] }) {
  return (
    <>
      {items.map((p, i) => (
        <Doodle
          key={i}
          kind={p.kind}
          w={p.w}
          style={{
            position: "absolute",
            zIndex: 1,
            left: p.left,
            right: p.right,
            top: p.top,
            bottom: p.bottom,
            transform: p.rotate ? `rotate(${p.rotate}deg)` : undefined,
          }}
        />
      ))}
    </>
  );
}

/** Het decor rond de beginkaart: boven en onder een rij tekeningen, en een paar die achter de kaart wegsteken. */
const HERO_DECOR: Place[] = [
  { kind: "lobster", w: "25cqw", left: "5cqw", top: "5cqw", rotate: -18 },
  { kind: "oyster", w: "13cqw", left: "41cqw", top: "9cqw", rotate: 8 },
  { kind: "grapes", w: "14cqw", left: "62cqw", top: "4cqw", rotate: 6 },
  { kind: "pen", w: "8cqw", right: "2cqw", top: "3cqw", rotate: 38 },
  { kind: "candle", w: "9cqw", left: "-1cqw", top: "33cqw", rotate: -6 },
  { kind: "glass", w: "10cqw", right: "0cqw", top: "42cqw", rotate: 12 },
  { kind: "flutes", w: "24cqw", left: "5cqw", bottom: "3cqw" },
  { kind: "grapes", w: "13cqw", left: "33cqw", bottom: "2cqw", rotate: -10 },
  { kind: "bottle", w: "9cqw", left: "49cqw", bottom: "-6cqw", rotate: -8 },
  { kind: "oyster", w: "12cqw", left: "62cqw", bottom: "9cqw", rotate: -6 },
  { kind: "glass", w: "9cqw", right: "5cqw", bottom: "2cqw", rotate: -8 },
];

/** Per sectie wisselt het decor, zodat de uitnodiging niet steeds dezelfde twee plaatjes herhaalt. */
const SECTION_DECOR: Place[][] = [
  [
    { kind: "grapes", w: "17cqw", left: "-6cqw", top: "-16cqw", rotate: -12 },
    { kind: "oyster", w: "14cqw", right: "-5cqw", bottom: "-9cqw", rotate: 10 },
  ],
  [
    { kind: "flutes", w: "24cqw", right: "-4cqw", top: "-18cqw" },
    { kind: "heart", w: "7cqw", left: "6cqw", bottom: "-8cqw", rotate: -10 },
  ],
  [
    { kind: "glass", w: "11cqw", left: "-3cqw", top: "-22cqw", rotate: -8 },
    { kind: "grapes", w: "14cqw", right: "-4cqw", bottom: "-14cqw", rotate: 8 },
  ],
  [
    { kind: "candle", w: "9cqw", right: "-2cqw", top: "-24cqw", rotate: 6 },
    { kind: "oyster", w: "14cqw", left: "-4cqw", bottom: "-8cqw", rotate: -8 },
  ],
  [
    { kind: "bottle", w: "9cqw", left: "-5cqw", top: "-22cqw", rotate: -22 },
    { kind: "lobster", w: "19cqw", right: "-6cqw", bottom: "-22cqw", rotate: 22 },
  ],
];

const SECTION = "relative mx-[9%] mt-[5.5rem]";

function Section({
  type,
  index,
  children,
  className = "",
}: {
  type: string;
  index: number;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section data-block={type} className={SECTION} style={CONTAINER}>
      <Scatter items={SECTION_DECOR[index % SECTION_DECOR.length]} />
      <BourgCard className={`px-6 py-10 text-center ${className}`} style={{ zIndex: 2 }}>
        {children}
      </BourgCard>
    </section>
  );
}

function Caps({ children, className = "", style }: { children: ReactNode; className?: string; style?: CSSProperties }) {
  return (
    <p className={`text-[0.6rem] tracking-[0.28em] uppercase ${className}`} style={{ ...heading, color: col("text"), ...style }}>
      {children}
    </p>
  );
}

function Head({ eyebrow, title }: { eyebrow?: string; title: string }) {
  return (
    <header>
      <div className="flex justify-center">
        <Doodle kind="heart" w="1.1rem" />
      </div>
      {eyebrow && <Caps className="mt-3">{eyebrow}</Caps>}
      <h2 className="mt-2 text-[2.3rem] leading-[1.1]" style={{ ...script, color: col("text") }}>
        {title}
      </h2>
    </header>
  );
}

function Body({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <p className={`mx-auto text-[0.86rem] leading-[1.75] whitespace-pre-line ${className}`} style={{ color: col("muted"), maxWidth: "16rem" }}>
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

/** Fotovervanger: een wiebelig kader op het streeppapier met druiven; met een echte foto vult die het kader. */
function BourgPhoto({ src }: { src?: string }) {
  return (
    <div
      className="relative mx-auto mt-7 aspect-[4/5] w-[72%] overflow-hidden"
      style={{ borderRadius: WOBBLE, border: `2.5px solid ${col("accent")}`, background: col("surfaceAlt") }}
      aria-hidden={src ? undefined : true}
    >
      {src ? (
        <StoryImg src={src} />
      ) : (
        <>
          <BourgStripes className="absolute inset-0 h-full w-full" />
          <span className="absolute inset-0 grid place-items-center">
            <span className="grid size-[4.2rem] place-items-center rounded-full" style={{ background: col("surface") }}>
              <Doodle kind="grapes" w="2.3rem" />
            </span>
          </span>
        </>
      )}
    </div>
  );
}

function BourgCountdown({ date, time }: { date: string; time: string }) {
  const cells = useCountdown(date, time);
  return (
    <div className="mt-7 grid grid-cols-4 gap-1 text-center">
      {cells.map(([value, label]) => (
        <div key={label}>
          <p className="text-[2.1rem] leading-none tabular-nums" style={{ ...heading, fontWeight: 500, color: col("accent") }}>
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

export function BourgBlockSection({ block, config, index = 0 }: { block: Block; config: InvitationConfig; index?: number }) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(config.date);
  const dateDots = m ? `${m[3]}.${m[2]}.${m[1]}` : "";
  const names = `${config.partner1} & ${config.partner2}`;

  switch (block.type) {
    case "hero":
      return (
        <section data-block="hero" className="relative" style={CONTAINER}>
          <div className="relative px-[8cqw]" style={{ paddingTop: "34cqw", paddingBottom: "34cqw" }}>
            <Scatter items={HERO_DECOR} />
            <BourgCard className="text-center" style={{ zIndex: 2, padding: "11cqw 5cqw" }}>
              {dateDots && (
                <p className="text-[0.82rem] tracking-[0.24em]" style={{ ...heading, color: col("text") }}>
                  {dateDots}
                </p>
              )}
              <h1
                className="mt-3 leading-[1.1] text-balance"
                style={{ ...script, color: col("text"), fontSize: "min(12cqw, 3.4rem)" }}
                aria-label={names}
              >
                {config.partner1} <span style={{ color: col("accent") }}>&amp;</span> {config.partner2}
              </h1>
              <p className="mt-5 text-[0.62rem] tracking-[0.28em] uppercase" style={{ ...heading, color: col("text") }}>
                {block.eyebrow}
              </p>
              {config.city && (
                <p className="mt-3 text-[0.56rem] tracking-[0.28em] uppercase" style={{ color: col("muted") }}>
                  {config.city}
                </p>
              )}
            </BourgCard>
          </div>
        </section>
      );

    case "countdown":
      return (
        <Section type="countdown" index={index}>
          <Head eyebrow={block.eyebrow} title={block.title} />
          <BourgCountdown date={config.date} time={config.time} />
        </Section>
      );

    case "story":
      return (
        <Section type="story" index={index}>
          <Head eyebrow={block.eyebrow} title={block.title} />
          <BourgPhoto src={block.photo} />
          <Body className="mt-8">{block.text}</Body>
        </Section>
      );

    case "text":
      return (
        <Section type={blockKey(block)} index={index}>
          {block.title && <Head title={block.title} />}
          {block.text && <Body className="mt-5">{block.text}</Body>}
        </Section>
      );

    case "program":
      return (
        <Section type="program" index={index}>
          <Head eyebrow={block.eyebrow} title={block.title} />
          <ul className="mx-auto mt-7 max-w-[17rem] text-left">
            {block.items.map((item, i) => (
              <li
                key={i}
                className="grid grid-cols-[4.2rem_1fr] items-baseline gap-x-3 py-3.5"
                style={{ borderTop: i === 0 ? undefined : `1.5px dashed color-mix(in srgb, ${col("accent")} 45%, transparent)` }}
              >
                <span className="text-[1.5rem] leading-none tabular-nums" style={{ ...heading, fontWeight: 500, color: col("accent") }}>
                  {item.time}
                </span>
                <span>
                  <span className="block text-[0.68rem] tracking-[0.2em] uppercase" style={{ ...heading, fontWeight: 600, color: col("text") }}>
                    {item.title}
                  </span>
                  {item.subtitle && (
                    <span className="mt-1 block text-[0.78rem]" style={{ color: col("muted") }}>
                      {item.subtitle}
                    </span>
                  )}
                </span>
              </li>
            ))}
          </ul>
        </Section>
      );

    case "location":
      return (
        <Section type="location" index={index}>
          <Head eyebrow={block.eyebrow} title={block.title} />
          <Body className="mt-5">{block.address}</Body>
          <div className="mt-6">
            <PillButton href={mapsHref(block.mapsUrl, block.title, config.city)}>Bekijk route</PillButton>
          </div>
        </Section>
      );

    case "dresscode":
      return (
        <Section type="dresscode" index={index}>
          <Head eyebrow={block.eyebrow} title={block.title} />
          <Body className="mt-5">{block.text}</Body>
          {block.colors.length > 0 && (
            <div className="mt-7 flex justify-center gap-3">
              {block.colors.map((c, i) => (
                <span
                  key={i}
                  className="block size-9 rounded-full"
                  style={{ background: c, boxShadow: `0 0 0 0.2rem ${col("surface")}, 0 0 0 0.3rem ${col("accent")}` }}
                />
              ))}
            </div>
          )}
        </Section>
      );

    case "rsvp":
      return (
        <Section type="rsvp" index={index}>
          <Head eyebrow={block.eyebrow} title={block.title} />
          <Body className="mt-5">{block.text}</Body>
          <div className="mt-6">
            <PillButton>{block.buttonLabel}</PillButton>
          </div>
        </Section>
      );

    case "footer":
      return (
        <section data-block="footer" className="relative mx-[9%] mt-[5.5rem] mb-14" style={CONTAINER}>
          <Scatter
            items={[
              { kind: "bottle", w: "9cqw", left: "-4cqw", top: "-20cqw", rotate: -20 },
              { kind: "flutes", w: "22cqw", right: "-3cqw", top: "-18cqw" },
            ]}
          />
          <BourgCard tone="olive" className="px-6 py-12 text-center" style={{ zIndex: 2 }}>
            <div className="flex justify-center">
              <Doodle kind="grapes" w="2.4rem" color="currentColor" />
            </div>
            <p className="mt-4 text-[2.5rem] leading-[1.1]" style={script}>
              {block.closing || "Tot dan"}
            </p>
            <p className="mt-3 text-[0.82rem] tracking-[0.26em] uppercase" style={heading}>
              {names}
            </p>
            {block.contactEmail && <p className="mt-5 text-[0.72rem] opacity-80">Vragen? mail naar {block.contactEmail}</p>}
            <p className="mt-3 text-[0.58rem] tracking-[0.24em] uppercase opacity-70">
              {[dateDots, config.city].filter(Boolean).join(" · ")}
            </p>
          </BourgCard>
        </section>
      );
  }
}
