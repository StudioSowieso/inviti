"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { fontStack, googleFontsHref, themeFonts } from "@/lib/invitation/fonts";
import {
  formatDateDots,
  formatDateLong,
  formatDateUpper,
  monogram,
  targetTimestamp,
} from "@/lib/invitation/format";
import type {
  Block,
  BlockType,
  InvitationConfig,
  InvitationTheme,
  ThemeColors,
} from "@/lib/invitation/types";
import { LeafBlockSection } from "./leaf";
import { NatureBlockSection, PAPER_NOISE } from "./nature";
import { NatureEnvelope } from "./nature-envelope";
import { REVEAL_MS, RevealOverlay } from "./reveal";

const RADIUS = { pill: "999px", rounded: "0.9rem", square: "0.15rem" } as const;

const CHAPTER_LABEL: Partial<Record<BlockType, string>> = {
  hero: "Welkom",
  story: "Ons verhaal",
  program: "Programma",
  location: "Locatie",
  dresscode: "Dresscode",
  rsvp: "RSVP",
};

const col = (key: keyof ThemeColors) => `var(--inv-${key})`;
const heading = { fontFamily: "var(--inv-heading)" } satisfies CSSProperties;

type Stage = "closed" | "opening" | "open";

export type InvitationViewProps = {
  config: InvitationConfig;
  theme: InvitationTheme;
  /** In de configurator tonen we direct de inhoud; de animatie speel je af met replayKey. */
  startOpen?: boolean;
  replayKey?: number;
  /** Scrollt naar dit blok (bijvoorbeeld het blok dat je net bewerkt). */
  focusBlock?: BlockType | null;
  className?: string;
};

export function InvitationView({
  config,
  theme,
  startOpen = false,
  replayKey = 0,
  focusBlock = null,
  className = "",
}: InvitationViewProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const hasAnimation = config.animation !== "none";
  const [stage, setStage] = useState<Stage>(hasAnimation && !startOpen ? "closed" : "open");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const handledReplay = useRef(replayKey);

  const cssVars = useMemo(() => {
    const vars: Record<string, string> = {
      "--inv-heading": fontStack(theme.headingFont),
      "--inv-body": fontStack(theme.bodyFont),
      "--inv-script": fontStack(theme.scriptFont),
      "--inv-radius": RADIUS[theme.buttonShape],
    };
    for (const [k, v] of Object.entries(theme.colors)) vars[`--inv-${k}`] = v;
    return vars as CSSProperties;
  }, [theme]);

  useEffect(() => {
    if (!hasAnimation) setStage("open");
  }, [hasAnimation]);

  useEffect(() => {
    if (replayKey !== handledReplay.current) {
      handledReplay.current = replayKey;
      if (hasAnimation) {
        if (timer.current) clearTimeout(timer.current);
        setStage("closed");
        scrollRef.current?.scrollTo({ top: 0 });
      }
    }
  }, [replayKey, hasAnimation]);

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  function openReveal() {
    if (stage !== "closed") return;
    setStage("opening");
    timer.current = setTimeout(() => setStage("open"), config.animation === "reveal" ? REVEAL_MS : 1500);
  }

  // ---------- Hoofdstuknavigatie ----------
  const chapters = useMemo(
    () =>
      config.blocks
        .filter((b) => b.enabled && CHAPTER_LABEL[b.type])
        .map((b) => ({ type: b.type, label: CHAPTER_LABEL[b.type] as string })),
    [config.blocks],
  );
  const [active, setActive] = useState<BlockType>("hero");
  const [navOpen, setNavOpen] = useState(false);

  const sectionTop = useCallback((type: BlockType) => {
    const el = scrollRef.current?.querySelector<HTMLElement>(`[data-block="${type}"]`);
    return el ? el.offsetTop : null;
  }, []);

  const updateActive = useCallback(() => {
    const el = scrollRef.current;
    if (!el || chapters.length === 0) return;
    const y = el.scrollTop + el.clientHeight * 0.35;
    let current = chapters[0].type;
    for (const ch of chapters) {
      const top = sectionTop(ch.type);
      if (top !== null && top <= y) current = ch.type;
    }
    setActive(current);
  }, [chapters, sectionTop]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(updateActive);
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    updateActive();
    return () => {
      el.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [updateActive, config.blocks]);

  function goTo(type: BlockType) {
    const top = sectionTop(type);
    if (top !== null) scrollRef.current?.scrollTo({ top, behavior: "smooth" });
    setNavOpen(false);
  }

  useEffect(() => {
    if (!focusBlock || stage !== "open") return;
    const top = sectionTop(focusBlock);
    if (top !== null) scrollRef.current?.scrollTo({ top, behavior: "smooth" });
  }, [focusBlock, stage, sectionTop]);

  const fontsHref = googleFontsHref(...themeFonts(theme));
  const activeLabel = chapters.find((c) => c.type === active)?.label ?? "Welkom";
  const leaf = theme.style === "leaf";
  // "nature" en "leaf" delen papiertextuur en een thema-gekleurde navigatie.
  const nature = theme.style !== "classic";
  const visibleBlocks = config.blocks.filter((b) => b.enabled);
  // De navigatiebalk volgt in "nature" de knopkleuren van het thema in plaats van donkerbruin.
  const navBg = nature ? "color-mix(in srgb, var(--inv-buttonBackground) 94%, transparent)" : "rgb(58 55 51 / 0.92)";
  const navMenuBg = nature ? "color-mix(in srgb, var(--inv-buttonBackground) 97%, black)" : "rgb(58 55 51 / 0.96)";
  const navText = nature ? col("buttonText") : "#f4f0ea";

  return (
    <div
      className={`relative isolate overflow-hidden ${className}`}
      style={{ ...cssVars, background: col("background"), color: col("text"), fontFamily: "var(--inv-body)" }}
    >
      <link rel="stylesheet" href={fontsHref} precedence="inviti-fonts" />

      <div ref={scrollRef} className="relative h-full overflow-y-auto overscroll-contain">
        <div className="relative">
          {visibleBlocks.map((b, i) =>
            leaf ? (
              <LeafBlockSection key={b.type} block={b} config={config} index={i} />
            ) : nature ? (
              <NatureBlockSection key={b.type} block={b} config={config} index={i} />
            ) : (
              <BlockSection key={b.type} block={b} config={config} />
            ),
          )}
          {nature && (
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 z-10"
              style={{ backgroundImage: PAPER_NOISE, mixBlendMode: "multiply" }}
            />
          )}
        </div>
      </div>

      {stage === "open" && chapters.length > 1 && (
        <div className="pointer-events-none absolute inset-x-0 bottom-3 z-20 px-4">
          {navOpen && (
            <div
              className="pointer-events-auto mb-2 rounded-2xl p-2 shadow-xl"
              style={{ background: navMenuBg, color: navText }}
              role="menu"
            >
              <p className="px-3 pt-2 pb-1.5 text-[0.55rem] tracking-[0.2em] uppercase opacity-60">
                Ga naar hoofdstuk
              </p>
              {chapters.map((c) => (
                <button
                  key={c.type}
                  type="button"
                  role="menuitem"
                  onClick={() => goTo(c.type)}
                  className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-xs"
                  style={{ background: c.type === active ? "rgb(255 255 255 / 0.12)" : undefined }}
                >
                  {c.label}
                  {c.type === active && <span className="text-[0.5rem] tracking-[0.18em] uppercase opacity-70">Actief</span>}
                </button>
              ))}
            </div>
          )}
          <button
            type="button"
            onClick={() => setNavOpen((o) => !o)}
            aria-expanded={navOpen}
            className="pointer-events-auto flex w-full items-center justify-between rounded-full px-4 py-2.5 text-xs shadow-lg backdrop-blur"
            style={{ background: navBg, color: navText }}
          >
            <span className="flex items-center gap-2">
              <span className="size-1.5 rounded-full" style={{ background: navText }} />
              {activeLabel}
            </span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
              {navOpen ? <path d="m6 15 6-6 6 6" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
            </svg>
          </button>
        </div>
      )}

      {stage !== "open" &&
        (config.animation === "reveal" ? (
          <RevealOverlay theme={theme} config={config} opening={stage === "opening"} onOpen={openReveal} />
        ) : nature ? (
          <NatureEnvelope config={config} opening={stage === "opening"} onOpen={openReveal} />
        ) : (
          <EnvelopeOverlay config={config} opening={stage === "opening"} onOpen={openReveal} />
        ))}
    </div>
  );
}

// ---------- Envelop ----------

function EnvelopeOverlay({
  config,
  opening,
  onOpen,
}: {
  config: InvitationConfig;
  opening: boolean;
  onOpen: () => void;
}) {
  const initials = monogram(config.partner1, config.partner2, " & ");
  const short = monogram(config.partner1, config.partner2);
  const ease = "cubic-bezier(.6,0,.2,1)";

  return (
    <div
      className="absolute inset-0 z-30 flex flex-col items-center px-6 py-10 text-center"
      style={{
        background: col("background"),
        opacity: opening ? 0 : 1,
        transition: `opacity 600ms ${ease} ${opening ? "850ms" : "0ms"}`,
        pointerEvents: opening ? "none" : "auto",
      }}
    >
      <div>
        <p className="text-[0.8rem] tracking-[0.18em]" style={heading}>
          {initials}
        </p>
        <p className="mt-1.5 text-[0.5rem] tracking-[0.2em] uppercase" style={{ color: col("muted") }}>
          {formatDateUpper(config.date)}
        </p>
      </div>

      <button
        type="button"
        onClick={onOpen}
        aria-label="Open de uitnodiging"
        className="relative my-auto w-[78%] max-w-sm"
        style={{ perspective: "900px", aspectRatio: "1.55" }}
      >
        <span
          className="absolute inset-0"
          style={{ background: col("envelope"), borderRadius: "3px", boxShadow: "0 22px 40px -22px rgb(0 0 0 / 0.45)" }}
        />
        <svg
          className="absolute inset-0 h-full w-full"
          viewBox="0 0 100 64"
          preserveAspectRatio="none"
          fill="none"
          stroke="rgb(0 0 0 / 0.09)"
          strokeWidth="0.4"
          aria-hidden="true"
        >
          <path d="M0 64 L42 30 M100 64 L58 30" />
        </svg>
        <span
          className="absolute inset-x-0 top-0"
          style={{
            height: "58%",
            background: `color-mix(in srgb, ${col("envelope")} 90%, black)`,
            clipPath: "polygon(0 0, 100% 0, 50% 100%)",
            transformOrigin: "top",
            transform: opening ? "rotateX(180deg)" : "rotateX(0deg)",
            transition: `transform 700ms ${ease}`,
            zIndex: 2,
          }}
        />
        <span
          className="absolute top-1/2 left-1/2 z-[3] grid w-[46%] place-items-center py-4"
          style={{
            background: col("envelopeCard"),
            borderRadius: "2px",
            boxShadow: "0 6px 14px -8px rgb(0 0 0 / 0.35)",
            transform: `translate(-50%, ${opening ? "-90%" : "-50%"}) scale(${opening ? 1.08 : 1})`,
            transition: `transform 700ms ${ease} 150ms`,
          }}
        >
          <span
            className="grid size-9 place-items-center rounded-full text-[0.65rem] tracking-[0.1em]"
            style={{ background: col("buttonBackground"), color: col("buttonText"), ...heading }}
          >
            {short}
          </span>
        </span>
      </button>

      <div>
        <button
          type="button"
          onClick={onOpen}
          className="inline-flex items-center gap-2 px-6 py-3 text-[0.6rem] font-medium tracking-[0.16em] uppercase"
          style={{ background: col("buttonBackground"), color: col("buttonText"), borderRadius: "var(--inv-radius)" }}
        >
          Tik om te openen
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
            <path d="M12 5v14m0 0-5-5m5 5 5-5" />
          </svg>
        </button>
        <p className="mt-3 text-[0.55rem]" style={{ color: col("muted") }}>
          Klik of tik op de envelop
        </p>
      </div>
    </div>
  );
}

// ---------- Blokken ----------

function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <p className="text-[0.52rem] tracking-[0.22em] uppercase" style={{ color: col("muted") }}>
      {children}
    </p>
  );
}

function SectionHead({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <header className="text-center">
      {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
      <h2 className="mt-2 text-[1.7rem] leading-[1.1] font-medium" style={heading}>
        {title}
      </h2>
      <span className="mx-auto mt-3 block h-px w-8" style={{ background: col("accent") }} />
    </header>
  );
}

function Photo({ label, ratio }: { label: string; ratio: string }) {
  return (
    <div className="grid w-full place-items-center" style={{ aspectRatio: ratio, background: col("line") }}>
      <div className="flex flex-col items-center gap-2" style={{ color: col("muted") }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <rect x="3" y="4" width="18" height="16" rx="2" />
          <circle cx="9" cy="10" r="1.6" />
          <path d="m21 16-5-5-9 9" />
        </svg>
        <span className="text-[0.48rem] tracking-[0.18em] uppercase">{label}</span>
      </div>
    </div>
  );
}

function Section({
  type,
  bg,
  children,
  className = "",
}: {
  type: BlockType;
  bg: keyof ThemeColors;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section data-block={type} className={`px-8 py-12 ${className}`} style={{ background: col(bg) }}>
      {children}
    </section>
  );
}

function BlockSection({ block, config }: { block: Block; config: InvitationConfig }) {
  switch (block.type) {
    case "hero":
      return (
        <Section type="hero" bg="background" className="pt-14 pb-10 text-center">
          <Eyebrow>{block.eyebrow}</Eyebrow>
          <div className="mt-5 text-[2.7rem] leading-[1.05] font-normal" style={heading}>
            <p>{config.partner1}</p>
            <p className="my-1 text-xl italic" style={{ color: col("accent") }}>
              &amp;
            </p>
            <p>{config.partner2}</p>
          </div>
          <div className="mt-8">
            <Photo label="Editorial portret" ratio="1.19" />
          </div>
          <p className="mt-5 text-[0.62rem] font-semibold tracking-[0.12em] uppercase">
            {formatDateDots(config.date)}
            {config.city ? ` — ${config.city}` : ""}
          </p>
          <p className="mt-5 flex items-center justify-center gap-1.5 text-[0.5rem]" style={{ color: col("muted") }}>
            <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              <path d="M12 4v16m0-16-4 4m4-4 4 4m-4 12-4-4m4 4 4-4" />
            </svg>
            Scroll om onze uitnodiging te bekijken
          </p>
        </Section>
      );

    case "countdown":
      return (
        <Section type="countdown" bg="surfaceAlt">
          <SectionHead eyebrow={block.eyebrow} title={block.title} />
          <Countdown date={config.date} time={config.time} />
        </Section>
      );

    case "story":
      return (
        <Section type="story" bg="background">
          <SectionHead eyebrow={block.eyebrow} title={block.title} />
          <div className="mt-6">
            <Photo label="Moment uit ons verhaal" ratio="1.46" />
          </div>
          <p className="mt-5 text-center text-[0.68rem] leading-relaxed whitespace-pre-line" style={{ color: col("muted") }}>
            {block.text}
          </p>
        </Section>
      );

    case "program":
      return (
        <Section type="program" bg="surface">
          <SectionHead eyebrow={block.eyebrow} title={block.title} />
          <ul className="mt-6">
            {block.items.map((item, i) => (
              <li
                key={i}
                className="grid grid-cols-[3rem_1fr] gap-2 border-b py-3 first:pt-0"
                style={{ borderBottomColor: "color-mix(in srgb, var(--inv-text) 45%, transparent)" }}
              >
                <span className="pt-0.5 text-[0.58rem] font-semibold">{item.time}</span>
                <span>
                  <span className="block text-[0.85rem] leading-tight" style={heading}>
                    {item.title}
                  </span>
                  {item.subtitle && (
                    <span className="mt-0.5 block text-[0.55rem]" style={{ color: col("muted") }}>
                      {item.subtitle}
                    </span>
                  )}
                </span>
              </li>
            ))}
          </ul>
        </Section>
      );

    case "location": {
      const query = encodeURIComponent([block.title, config.city].filter(Boolean).join(" "));
      return (
        <Section type="location" bg="background" className="text-center">
          <SectionHead eyebrow={block.eyebrow} title={block.title} />
          <div className="mt-6">
            <Photo label="Locatie / kaart" ratio="1.5" />
          </div>
          <p className="mt-5 text-[0.68rem] leading-relaxed whitespace-pre-line" style={{ color: col("muted") }}>
            {block.address}
          </p>
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${query}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 inline-flex items-center gap-1.5 border px-4 py-2 text-[0.58rem]"
            style={{ borderColor: col("text"), borderRadius: "var(--inv-radius)" }}
          >
            Bekijk route
            <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              <path d="M7 17 17 7M8 7h9v9" />
            </svg>
          </a>
        </Section>
      );
    }

    case "dresscode":
      return (
        <Section type="dresscode" bg="surfaceAlt" className="text-center">
          <SectionHead eyebrow={block.eyebrow} title={block.title} />
          <p className="mt-5 text-[0.68rem] leading-relaxed whitespace-pre-line" style={{ color: col("muted") }}>
            {block.text}
          </p>
          {block.colors.length > 0 && (
            <div className="mt-5 flex justify-center gap-2.5">
              {block.colors.map((c, i) => (
                <span key={i} className="size-5 rounded-full" style={{ background: c }} />
              ))}
            </div>
          )}
        </Section>
      );

    case "rsvp":
      return (
        <Section type="rsvp" bg="background" className="text-center">
          <SectionHead eyebrow={block.eyebrow} title={block.title} />
          <p className="mx-auto mt-5 max-w-[16rem] text-[0.68rem] leading-relaxed whitespace-pre-line" style={{ color: col("muted") }}>
            {block.text}
          </p>
          <button
            type="button"
            className="mt-6 w-full px-6 py-3.5 text-[0.6rem] font-medium tracking-[0.16em] uppercase"
            style={{ background: col("buttonBackground"), color: col("buttonText"), borderRadius: "var(--inv-radius)" }}
          >
            {block.buttonLabel}
          </button>
        </Section>
      );

    case "footer":
      return (
        <section
          data-block="footer"
          className="px-8 pt-12 pb-24 text-center"
          style={{ background: col("footerBackground"), color: col("footerText") }}
        >
          <p className="text-[1.45rem] italic" style={heading}>
            {[block.closing, `${config.partner1} & ${config.partner2}`].filter(Boolean).join(" ")}
          </p>
          {block.contactEmail && (
            <p className="mt-3 text-[0.58rem] opacity-70">Vragen? mail naar {block.contactEmail}</p>
          )}
          <p className="mt-2 text-[0.52rem] opacity-55">
            {[formatDateLong(config.date), config.city].filter(Boolean).join(" · ")}
          </p>
        </section>
      );
  }
}

// ---------- Aftellen ----------

function Countdown({ date, time }: { date: string; time: string }) {
  const target = useMemo(() => targetTimestamp(date, time), [date, time]);
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  let cells: [string, string][] = [
    ["--", "dagen"],
    ["--", "uren"],
    ["--", "min"],
    ["--", "sec"],
  ];
  if (target !== null && now !== null) {
    const diff = Math.max(0, target - now);
    const s = Math.floor(diff / 1000);
    const pad = (n: number) => String(n).padStart(2, "0");
    cells = [
      [String(Math.floor(s / 86400)), "dagen"],
      [pad(Math.floor((s % 86400) / 3600)), "uren"],
      [pad(Math.floor((s % 3600) / 60)), "min"],
      [pad(s % 60), "sec"],
    ];
  }

  return (
    <div className="mt-6 grid grid-cols-4 text-center">
      {cells.map(([value, label]) => (
        <div key={label}>
          <p className="text-[1.5rem] leading-none tabular-nums" style={heading}>
            {value}
          </p>
          <p className="mt-1.5 text-[0.45rem] tracking-[0.16em] uppercase" style={{ color: col("muted") }}>
            {label}
          </p>
        </div>
      ))}
    </div>
  );
}
