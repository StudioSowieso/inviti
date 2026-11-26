"use client";

import type { CSSProperties, ReactNode } from "react";
import type { Block, InvitationConfig, ThemeColors } from "@/lib/invitation/types";
import { StoryImg } from "./story-photo";
import { useCountdown } from "./use-countdown";
import { blockKey, mapsHref, formatDateLong } from "@/lib/invitation/format";
import { BurgStripes, WavyCard, WavyFrame } from "./burgundy-art";

/**
 * Stijl "burgundy": poederblauw papier met bordeaux typemachinetekst, hoge smalle hoofdletters voor de namen,
 * een sierlijk schrift voor de accenten en bordeaux strepen met een golvend kaartje voor de details.
 * Kleuren: text = bordeaux, background = poederblauw, surface = crème, footerBackground = diepste bordeaux.
 */

const col = (key: keyof ThemeColors) => `var(--inv-${key})`;
const heading = { fontFamily: "var(--inv-heading)" } satisfies CSSProperties;
const script = { fontFamily: "var(--inv-script)" } satisfies CSSProperties;
const mono = { fontFamily: "var(--inv-body)" } satisfies CSSProperties;

const CONTAINER: CSSProperties = { containerType: "inline-size" };

/** Kopje: sierlijk schrift erboven, hoofdletters eronder (zoals "The / DETAILS"). */
function Head({ eyebrow, title, light }: { eyebrow?: string; title: string; light?: boolean }) {
  const color = light ? col("surface") : col("text");
  return (
    <header className="text-center">
      {eyebrow && (
        <p className="text-[1.5rem] leading-none" style={{ ...script, color: light ? col("surface") : col("text") }}>
          {eyebrow}
        </p>
      )}
      <h2 className="mt-1 text-[2.3rem] leading-[1.05] uppercase" style={{ ...heading, color }}>
        {title}
      </h2>
    </header>
  );
}

function Body({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <p className={`mx-auto text-[0.74rem] leading-[1.8] whitespace-pre-line ${className}`} style={{ ...mono, color: col("text"), maxWidth: "17rem" }}>
      {children}
    </p>
  );
}

function Label({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <p className={`text-[0.6rem] font-bold tracking-[0.14em] uppercase ${className}`} style={{ ...mono, color: col("text") }}>
      {children}
    </p>
  );
}

function Button({ children, href }: { children: ReactNode; href?: string }) {
  const cls = "inline-flex items-center justify-center px-7 py-3 text-[0.62rem] font-bold tracking-[0.18em] uppercase";
  const style = { ...mono, background: col("buttonBackground"), color: col("buttonText"), borderRadius: "var(--inv-radius)" };
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

/** Gestreepte band met een golvend kaartje erin; de strepen schuiven heel rustig. */
function Striped({ type, children, className = "" }: { type: string; children: ReactNode; className?: string }) {
  return (
    <section data-block={type} className="relative px-[8%] py-12" style={CONTAINER}>
      <BurgStripes className="absolute inset-0" />
      <WavyCard className={`px-[1.6rem] py-12 text-center ${className}`} style={{ zIndex: 1 }}>
        {children}
      </WavyCard>
    </section>
  );
}

/** Een gewoon blauw vlak, zonder strepen. */
function Plain({ type, children, className = "" }: { type: string; children: ReactNode; className?: string }) {
  return (
    <section data-block={type} className={`relative px-[9%] py-14 text-center ${className}`} style={{ background: col("background"), ...CONTAINER }}>
      {children}
    </section>
  );
}

function BurgCountdown({ date, time }: { date: string; time: string }) {
  const cells = useCountdown(date, time);
  return (
    <div className="mt-8 grid grid-cols-4 gap-1 text-center">
      {cells.map(([value, label]) => (
        <div key={label}>
          <p className="text-[2.5rem] leading-none tabular-nums" style={{ ...heading, color: col("text") }}>
            {value}
          </p>
          <p className="mt-2 text-[0.52rem] font-bold tracking-[0.16em] uppercase" style={{ ...mono, color: col("text") }}>
            {label}
          </p>
        </div>
      ))}
    </div>
  );
}

function BurgPhoto({ src }: { src?: string }) {
  return (
    <WavyFrame className="mx-auto mt-8 aspect-[4/5] w-[78%]">
      {src ? (
        <StoryImg src={src} />
      ) : (
        <div className="grid h-full w-full place-items-center" style={{ background: col("surfaceAlt") }} aria-hidden="true">
          <span className="text-[2.6rem]" style={{ ...script, color: col("text") }}>
            foto
          </span>
        </div>
      )}
    </WavyFrame>
  );
}

export function BurgBlockSection({ block, config }: { block: Block; config: InvitationConfig; index?: number }) {
  const names = `${config.partner1} & ${config.partner2}`;
  const date = formatDateLong(config.date);

  switch (block.type) {
    case "hero":
      return (
        <section data-block="hero" className="relative" style={{ background: col("background"), ...CONTAINER }}>
          {/* Alles in cqw, zodat de tekst meeschaalt met de breedte van de uitnodiging (ook in een klein telefoonvoorbeeld). */}
          <div className="flex flex-col justify-between px-[7cqw] pt-[11cqw] pb-[9cqw]" style={{ minHeight: "150cqw" }}>
            <p
              className="mx-auto text-center font-bold uppercase"
              style={{ ...mono, color: col("text"), fontSize: "3.3cqw", lineHeight: 1.6, letterSpacing: "0.1em", maxWidth: "88cqw" }}
            >
              {block.eyebrow}
            </p>

            <h1 className="text-center break-words" aria-label={names}>
              <span className="block uppercase" style={{ ...heading, color: col("text"), fontSize: "21cqw", lineHeight: 1.02 }}>
                {config.partner1}
              </span>
              <span className="block" style={{ ...script, color: col("text"), fontSize: "11cqw", lineHeight: 1.2, margin: "1cqw 0" }}>
                en
              </span>
              <span className="block uppercase" style={{ ...heading, color: col("text"), fontSize: "21cqw", lineHeight: 1.02 }}>
                {config.partner2}
              </span>
            </h1>

            <div>
              <div className="flex items-end justify-between gap-[4cqw]" style={{ ...mono, color: col("text"), fontSize: "3.6cqw", lineHeight: 1.6 }}>
                <p>
                  {date && <span className="block font-bold tracking-[0.06em] uppercase">{date}</span>}
                  {config.time && <span className="block">om {config.time} uur</span>}
                </p>
                {config.city && <p className="text-right font-bold tracking-[0.06em] uppercase">{config.city}</p>}
              </div>
              <p className="text-center" style={{ ...script, color: col("text"), fontSize: "10cqw", lineHeight: 1, marginTop: "9cqw" }}>
                graag tot dan
              </p>
            </div>
          </div>
        </section>
      );

    case "countdown":
      return (
        <Plain type="countdown">
          <Head eyebrow={block.eyebrow} title={block.title} />
          <BurgCountdown date={config.date} time={config.time} />
        </Plain>
      );

    case "story":
      return (
        <Plain type="story">
          <Head eyebrow={block.eyebrow} title={block.title} />
          <BurgPhoto src={block.photo} />
          <Body className="mt-8">{block.text}</Body>
        </Plain>
      );

    case "text":
      return (
        <Striped type={blockKey(block)}>
          {block.title && <Head title={block.title} />}
          {block.text && <Body className="mt-5">{block.text}</Body>}
        </Striped>
      );

    case "program":
      return (
        <Striped type="program">
          <Head eyebrow={block.eyebrow} title={block.title} />
          <ul className="mx-auto mt-7 max-w-[16rem] space-y-5">
            {block.items.map((item, i) => (
              <li key={i}>
                <Label>
                  {item.time} · {item.title}
                </Label>
                {item.subtitle && (
                  <p className="mt-1 text-[0.72rem] leading-[1.6]" style={{ ...mono, color: col("text") }}>
                    {item.subtitle}
                  </p>
                )}
              </li>
            ))}
          </ul>
        </Striped>
      );

    case "location":
      return (
        <Striped type="location">
          <Head eyebrow={block.eyebrow} title={block.title} />
          <Body className="mt-5">{block.address}</Body>
          <div className="mt-6">
            <Button href={mapsHref(block.mapsUrl, block.title, config.city)}>Bekijk route</Button>
          </div>
        </Striped>
      );

    case "dresscode":
      return (
        <Striped type="dresscode">
          <Head eyebrow={block.eyebrow} title={block.title} />
          <Body className="mt-5">{block.text}</Body>
          {block.colors.length > 0 && (
            <div className="mt-7 flex justify-center gap-3">
              {block.colors.map((c, i) => (
                <span key={i} className="block size-9 rounded-full" style={{ background: c, boxShadow: `0 0 0 0.18rem ${col("surface")}, 0 0 0 0.3rem ${col("text")}` }} />
              ))}
            </div>
          )}
        </Striped>
      );

    case "rsvp":
      return (
        <Plain type="rsvp">
          <Head eyebrow={block.eyebrow} title={block.title} />
          <Body className="mt-5">{block.text}</Body>
          <div className="mt-7">
            <Button>{block.buttonLabel}</Button>
          </div>
        </Plain>
      );

    case "footer":
      return (
        <section
          data-block="footer"
          className="px-8 pt-14 pb-24 text-center"
          style={{ background: col("footerBackground"), color: col("footerText") }}
        >
          <p className="text-[2.4rem] leading-[1.1]" style={script}>
            {block.closing || "Tot dan"}
          </p>
          <p className="mt-3 text-[1.5rem] leading-tight uppercase" style={heading}>
            {names}
          </p>
          {block.contactEmail && (
            <p className="mt-5 text-[0.66rem]" style={mono}>
              Vragen? mail naar {block.contactEmail}
            </p>
          )}
          <p className="mt-2 text-[0.58rem] tracking-[0.14em] uppercase opacity-70" style={mono}>
            {[date, config.city].filter(Boolean).join(" · ")}
          </p>
        </section>
      );
  }
}
