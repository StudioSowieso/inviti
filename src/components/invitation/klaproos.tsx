"use client";

import type { CSSProperties, ReactNode } from "react";
import type { Block, InvitationConfig, ThemeColors } from "@/lib/invitation/types";
import { StoryImg } from "./story-photo";
import { useCountdown } from "./use-countdown";
import { blockKey, mapsHref } from "@/lib/invitation/format";
import { Poppy, PoppyStem, Sprig } from "./klaproos-art";

/**
 * Stijl "klaproos": rustig gedrukt papier met klaprozen en takjes in één dunne lijn, naamletters in fijne hoofdletters
 * en veel witruimte, zoals een botanische drukwerkkaart.
 * Kleuren: background = papier, surfaceAlt = zandkleurig vlak, text = inkt, accent = lijnkleur van de tekeningen,
 * footerBackground = donkere afsluiting. Alle maten staan in cqw; de padding staat steeds op een kind van de container.
 */

const col = (key: keyof ThemeColors) => `var(--inv-${key})`;
const heading = { fontFamily: "var(--inv-heading)" } satisfies CSSProperties;
const script = { fontFamily: "var(--inv-script)" } satisfies CSSProperties;
const body = { fontFamily: "var(--inv-body)" } satisfies CSSProperties;

const CONTAINER: CSSProperties = { containerType: "inline-size" };

type Tone = "paper" | "sand" | "dark";
const BG: Record<Tone, string> = { paper: col("background"), sand: col("surfaceAlt"), dark: col("footerBackground") };
const ink = (t: Tone) => (t === "dark" ? col("footerText") : col("text"));
const soft = (t: Tone) => (t === "dark" ? "color-mix(in srgb, var(--inv-footerText) 80%, transparent)" : col("muted"));
const line = (t: Tone) => (t === "dark" ? "color-mix(in srgb, var(--inv-footerText) 70%, transparent)" : col("accent"));
/** Variabele waarmee de tekeningen hun overlappende delen vullen. */
const fillOf = (t: Tone) => ({ "--inv-fill": BG[t] }) as CSSProperties;

/** Kleine hoofdletters met letterruimte. */
const caps = (size: number, spacing = 0.2): CSSProperties => ({ ...body, textTransform: "uppercase", fontSize: `${size}cqw`, letterSpacing: `${spacing}em`, lineHeight: 1.55 });

/** Datum als 12.04.2026. */
function numericDate(date: string) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(date);
  return m ? `${m[3]}.${m[2]}.${m[1]}` : "";
}

/** Lettergrootte (in cqw) van de namen, zodat de langste naam in de linker kolom van het beginscherm past. */
export function nameSize(...names: string[]) {
  const longest = Math.max(4, ...names.map((n) => n.length));
  return Math.min(11.5, 42 / (longest * 0.66));
}

function Wrap({ type, tone, children, className = "", pad = "14cqw 9cqw" }: { type: string; tone: Tone; children: ReactNode; className?: string; pad?: string }) {
  return (
    <section data-block={type} className={`relative overflow-hidden text-center ${className}`} style={{ background: BG[tone], color: ink(tone), ...fillOf(tone), ...CONTAINER }}>
      <div className="relative" style={{ padding: pad }}>
        {children}
      </div>
    </section>
  );
}

function Title({ title, eyebrow, tone, size = 9.5 }: { title: string; eyebrow?: string; tone: Tone; size?: number }) {
  return (
    <header className="text-center">
      {eyebrow && <p style={{ ...caps(3, 0.26), color: soft(tone), marginBottom: "3.5cqw" }}>{eyebrow}</p>}
      <h2 className="uppercase" style={{ ...heading, color: ink(tone), fontSize: `${size}cqw`, lineHeight: 1.1, letterSpacing: "0.04em" }}>
        {title}
      </h2>
    </header>
  );
}

function Text({ children, tone, className = "" }: { children: ReactNode; tone: Tone; className?: string }) {
  return (
    <p className={`mx-auto whitespace-pre-line ${className}`} style={{ ...body, color: soft(tone), fontSize: "4cqw", lineHeight: 1.8, maxWidth: "72cqw" }}>
      {children}
    </p>
  );
}

function Button({ children, href, tone }: { children: ReactNode; href?: string; tone: Tone }) {
  const c = ink(tone);
  const style: CSSProperties = { ...caps(3, 0.26), color: c, border: `0.3cqw solid ${c}`, borderRadius: "var(--inv-radius)", padding: "3.6cqw 8cqw" };
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

/** Korte horizontale lijn tussen onderdelen. */
function Dash({ tone = "paper" as Tone }) {
  return <div aria-hidden="true" className="mx-auto" style={{ width: "10cqw", height: "0.3cqw", background: line(tone) }} />;
}

function Countdown({ date, time }: { date: string; time: string }) {
  const cells = useCountdown(date, time);
  return (
    <div className="grid grid-cols-4 text-center" style={{ marginTop: "9cqw", gap: "2cqw" }}>
      {cells.map(([value, label]) => (
        <div key={label}>
          <p className="tabular-nums" style={{ ...heading, fontSize: "10cqw", lineHeight: 1 }}>
            {value}
          </p>
          <p style={{ ...caps(2.4, 0.18), color: soft("sand"), marginTop: "2.4cqw" }}>{label}</p>
        </div>
      ))}
    </div>
  );
}

export function KlaproosBlockSection({ block, config }: { block: Block; config: InvitationConfig; index?: number }) {
  const date = numericDate(config.date);
  const names = `${config.partner1} & ${config.partner2}`;

  switch (block.type) {
    case "hero": {
      const size = nameSize(config.partner1, config.partner2);
      const nameStyle: CSSProperties = { ...heading, fontSize: `${size}cqw`, lineHeight: 1.08, letterSpacing: "0.03em", textTransform: "uppercase" };
      return (
        <section data-block="hero" className="relative overflow-hidden" style={{ background: col("background"), color: col("text"), ...fillOf("paper"), ...CONTAINER }}>
          <div className="relative" style={{ aspectRatio: "100 / 150" }}>
            {/* Vage grote klaprozen achter de tekst, linksonder */}
            <Poppy className="absolute inv-sway-soft" style={{ left: "-16cqw", top: "96cqw", width: "74cqw", color: col("accent"), opacity: 0.14 }} />
            {/* Kleine klaproos linksboven */}
            <Poppy className="absolute inv-sway-soft" style={{ left: "-7cqw", top: "-3cqw", width: "34cqw", color: col("accent"), transform: "rotate(8deg)" }} />
            {/* Twee klaprozen aan een lange steel, rechts in beeld */}
            <PoppyStem className="inv-pour absolute" style={{ left: "52cqw", top: "36cqw", width: "60cqw", color: col("accent") }} />

            <div className="absolute" style={{ left: "11cqw", top: "58cqw", right: "46cqw" }}>
              {block.eyebrow && <p style={{ ...caps(3, 0.22), color: soft("paper"), marginBottom: "7cqw", whiteSpace: "nowrap" }}>{block.eyebrow}</p>}
              <h1 aria-label={names} style={{ whiteSpace: "nowrap" }}>
                <span className="block" style={nameStyle}>
                  {config.partner1}
                  <span style={{ fontSize: "0.5em", marginLeft: "0.35em" }}>&amp;</span>
                </span>
                <span className="block" style={nameStyle}>
                  {config.partner2}
                </span>
              </h1>
              <div style={{ marginTop: "8cqw" }}>
                {date && <p style={{ ...caps(3.8, 0.14), color: col("text") }}>{date}</p>}
                {(config.time || config.city) && <p style={{ ...caps(3.2, 0.14), color: col("text") }}>{[config.time && `${config.time} uur`, config.city].filter(Boolean).join(" · ")}</p>}
              </div>
            </div>
          </div>
        </section>
      );
    }

    case "countdown":
      return (
        <Wrap type="countdown" tone="sand" pad="16cqw 7cqw">
          <Sprig className="absolute" style={{ left: "3cqw", top: "3cqw", width: "18cqw", color: col("accent") }} />
          <Sprig className="absolute" style={{ right: "3cqw", top: "3cqw", width: "18cqw", color: col("accent"), transform: "scaleX(-1)" }} />
          <Title title={block.title} eyebrow={block.eyebrow} tone="sand" size={8.5} />
          <Countdown date={config.date} time={config.time} />
        </Wrap>
      );

    case "story":
      return (
        <Wrap type="story" tone="paper" pad="16cqw 9cqw 8cqw">
          <div className="relative mx-auto" style={{ width: "62cqw" }}>
            <div aria-hidden="true" className="absolute" style={{ inset: "-3cqw 3cqw 3cqw -3cqw", border: `0.3cqw solid ${line("paper")}`, borderRadius: "31cqw 31cqw 0 0" }} />
            <div className="relative overflow-hidden" style={{ aspectRatio: "4 / 5", background: col("surfaceAlt"), borderRadius: "31cqw 31cqw 0 0" }}>
              {block.photo ? (
                <StoryImg src={block.photo} />
              ) : (
                <span className="absolute inset-0 grid place-items-center" aria-hidden="true" style={{ ...script, color: col("muted"), fontSize: "9cqw" }}>
                  foto
                </span>
              )}
            </div>
            <Sprig className="absolute" style={{ right: "-8cqw", bottom: "-6cqw", width: "30cqw", color: col("accent"), transform: "rotate(14deg)" }} />
          </div>
          <div style={{ marginTop: "14cqw" }}>
            <Title title={block.title} eyebrow={block.eyebrow} tone="paper" />
          </div>
          <Text tone="paper" className="mt-[6cqw]">
            {block.text}
          </Text>
        </Wrap>
      );

    case "text":
      return (
        <Wrap type={blockKey(block)} tone="paper" pad="8cqw 9cqw 12cqw">
          <Sprig className="mx-auto" style={{ width: "15cqw", color: col("accent"), transform: "rotate(-8deg)" }} />
          {block.title && (
            <h2 className="uppercase" style={{ ...heading, fontSize: "8cqw", lineHeight: 1.12, letterSpacing: "0.04em", marginTop: "6cqw" }}>
              {block.title}
            </h2>
          )}
          {block.text && <Text tone="paper" className="mt-[5cqw]">{block.text}</Text>}
        </Wrap>
      );

    case "program":
      return (
        <Wrap type="program" tone="paper" pad="11cqw 9cqw 10cqw">
          <Title title={block.title} eyebrow={block.eyebrow} tone="paper" />
          <ul style={{ marginTop: "10cqw" }}>
            {block.items.map((item, i) => (
              <li key={i} style={{ padding: "5.5cqw 0" }}>
                {i > 0 && <div style={{ marginBottom: "8cqw" }}><Dash /></div>}
                <p style={{ ...caps(3.4, 0.24), color: col("accent") }}>{item.time}</p>
                <p className="uppercase" style={{ ...heading, fontSize: "6.8cqw", lineHeight: 1.15, letterSpacing: "0.05em", marginTop: "1.6cqw" }}>
                  {item.title}
                </p>
                {item.subtitle && <p style={{ ...body, color: col("muted"), fontSize: "3.8cqw", lineHeight: 1.5, marginTop: "1.6cqw" }}>{item.subtitle}</p>}
              </li>
            ))}
          </ul>
        </Wrap>
      );

    case "location":
      return (
        <Wrap type="location" tone="paper" pad="10cqw 9cqw 22cqw">
          <Title title={block.title} eyebrow={block.eyebrow} tone="paper" />
          <p className="mx-auto whitespace-pre-line" style={{ ...caps(3.5, 0.16), lineHeight: 1.9, marginTop: "8cqw", maxWidth: "70cqw" }}>
            {block.address}
          </p>
          <div style={{ marginTop: "9cqw" }}>
            <Button tone="paper" href={mapsHref(block.mapsUrl, block.title, config.city)}>
              Bekijk route
            </Button>
          </div>
          <Poppy className="absolute inv-sway-soft" style={{ right: "4cqw", bottom: "-4cqw", width: "20cqw", color: col("accent") }} />
        </Wrap>
      );

    case "dresscode":
      return (
        <Wrap type="dresscode" tone="paper" pad="8cqw 9cqw 16cqw">
          <Sprig className="mx-auto" style={{ width: "15cqw", color: col("accent"), transform: "rotate(8deg) scaleX(-1)", marginBottom: "6cqw" }} />
          <Title title={block.title} eyebrow={block.eyebrow} tone="paper" size={8.5} />
          <Text tone="paper" className="mt-[6cqw]">{block.text}</Text>
          {block.colors.length > 0 && (
            <div className="flex justify-center" style={{ gap: "3.4cqw", marginTop: "8cqw" }}>
              {block.colors.map((c, i) => (
                <span key={i} className="block rounded-full" style={{ width: "10cqw", height: "10cqw", background: c, boxShadow: `0 0 0 0.5cqw ${col("background")}, 0 0 0 0.8cqw ${col("accent")}` }} />
              ))}
            </div>
          )}
        </Wrap>
      );

    case "rsvp":
      return (
        <Wrap type="rsvp" tone="sand" pad="15cqw 8cqw 14cqw">
          <Title title={block.title} eyebrow={block.eyebrow} tone="sand" size={9.5} />
          <Text tone="sand" className="mt-[6cqw]">{block.text}</Text>
          <div style={{ marginTop: "9cqw" }}>
            <Button tone="sand">{block.buttonLabel}</Button>
          </div>
          <Poppy className="mx-auto inv-sway-soft" style={{ width: "22cqw", height: "34cqw", marginTop: "10cqw", color: col("accent") }} />
        </Wrap>
      );

    case "footer":
      return (
        <section data-block="footer" className="relative overflow-hidden text-center" style={{ background: col("footerBackground"), color: col("footerText"), ...fillOf("dark"), ...CONTAINER }}>
          <Sprig className="absolute" style={{ left: "5cqw", top: "14cqw", width: "24cqw", color: line("dark") }} />
          <Sprig className="absolute" style={{ right: "5cqw", top: "14cqw", width: "24cqw", color: line("dark"), transform: "scaleX(-1)" }} />
          <div style={{ padding: "18cqw 8cqw 30cqw" }}>
            <p style={{ ...script, fontSize: "17cqw", lineHeight: 1 }}>{block.closing || "Tot dan"}</p>
            <p className="uppercase" style={{ ...heading, fontSize: "6cqw", letterSpacing: "0.08em", marginTop: "7cqw" }}>{names}</p>
            {block.contactEmail && <p style={{ ...body, fontSize: "3.8cqw", marginTop: "8cqw", opacity: 0.85 }}>Vragen? mail naar {block.contactEmail}</p>}
            {(date || config.city) && <p style={{ ...caps(2.8, 0.24), marginTop: "4cqw", opacity: 0.7 }}>{[date, config.city].filter(Boolean).join("  ·  ")}</p>}
          </div>
        </section>
      );
  }
}
