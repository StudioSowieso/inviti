"use client";

import Link from "next/link";
import { memo, useCallback, useEffect, useRef, useState } from "react";
import { ChevronRightIcon, Sparkle } from "@/components/icons";
import { PhoneFrame, ScreenCard } from "./phone";

type Card = { slug: string; label: string };

/** Voorbeelden in de rij: uitnodigingsontwerpen en schermen uit de backoffice, om en om. */
const CARDS: Card[] = [
  { slug: "leaf", label: "Leaf" },
  { slug: "dashboard", label: "Dashboard" },
  { slug: "lemon", label: "Lemon" },
  { slug: "versturen", label: "Versturen" },
  { slug: "flowers", label: "Flowers" },
  { slug: "todo", label: "To-do's" },
  { slug: "modern", label: "Modern" },
  { slug: "gastenlijst", label: "Gastenlijst" },
  { slug: "sweet", label: "Sweet" },
];
const N = CARDS.length;
/** Afstand tussen twee items, in stage-eenheden (u). */
const STEP = 16.5;

const Phone = memo(function Phone({ slug }: { slug: string }) {
  return <PhoneFrame slugs={[slug]} className="w-full" />;
});

const Shot = memo(function Shot({ slug, label }: { slug: string; label: string }) {
  return (
    <div className="relative">
      <ScreenCard slug={slug} className="w-full border border-line/70 shadow-[0_24px_40px_-20px_rgb(31_36_32/0.4)]" />
      <span className="absolute bottom-3 left-3 rounded-full bg-paper px-3 py-1 text-[11px] font-medium whitespace-nowrap text-forest shadow">
        {label}
      </span>
    </div>
  );
});

/** Handgetekende pijl, voor de notities. */
function Arrow({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 44"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className={className}
    >
      <path d="M3 30C16 10 36 8 54 26" />
      <path d="M44 24l11 3 1-12" />
    </svg>
  );
}

/** Kortste afstand van item i tot positie pos, in een lus van N items. */
function wrap(i: number, pos: number) {
  let d = (((i - pos) % N) + N) % N;
  if (d > N / 2) d -= N;
  return d;
}

/**
 * Hero zonder scroll-effecten: een lus met voorbeelden die je kunt slepen of met pijltjes bedient.
 * Het item in het midden wordt de telefoon; de rest staat als kaart naar het midden gedraaid.
 */
export function PhoneHero() {
  const [pos, setPos] = useState(0);
  const posRef = useRef(0);
  const raf = useRef(0);
  const stage = useRef<HTMLDivElement>(null);
  const drag = useRef<{ x: number; start: number; moved: boolean; lastX: number; lastT: number; v: number } | null>(null);

  const set = useCallback((v: number) => {
    posRef.current = v;
    setPos(v);
  }, []);

  const animateTo = useCallback(
    (target: number) => {
      cancelAnimationFrame(raf.current);
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return set(target);
      const from = posRef.current;
      const t0 = performance.now();
      const dur = 450;
      const tick = (now: number) => {
        const k = Math.min(1, (now - t0) / dur);
        set(from + (target - from) * (1 - Math.pow(1 - k, 3)));
        if (k < 1) raf.current = requestAnimationFrame(tick);
      };
      raf.current = requestAnimationFrame(tick);
    },
    [set],
  );

  useEffect(() => () => cancelAnimationFrame(raf.current), []);

  const stepPx = () => {
    const u = parseFloat(getComputedStyle(stage.current!).fontSize);
    return u * STEP;
  };

  const go = (dir: number) => animateTo(Math.round(posRef.current) + dir);

  const onDown = (e: React.PointerEvent) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    cancelAnimationFrame(raf.current);
    drag.current = { x: e.clientX, start: posRef.current, moved: false, lastX: e.clientX, lastT: performance.now(), v: 0 };
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };
  const onMove = (e: React.PointerEvent) => {
    const g = drag.current;
    if (!g) return;
    const dx = e.clientX - g.x;
    if (Math.abs(dx) > 5) g.moved = true;
    if (!g.moved) return;
    const sp = stepPx();
    const now = performance.now();
    const dt = Math.max(1, now - g.lastT);
    g.v = (-(e.clientX - g.lastX) / sp / dt) * 0.4 + g.v * 0.6;
    g.lastX = e.clientX;
    g.lastT = now;
    set(g.start - dx / sp);
  };
  const onUp = () => {
    const g = drag.current;
    drag.current = null;
    if (!g || !g.moved) return;
    animateTo(Math.round(posRef.current + g.v * 220));
  };

  return (
    <section
      id="hero"
      aria-label="Proost Mee"
      className="overflow-hidden bg-gradient-to-b from-blush/70 to-cream px-4 pt-28 pb-12 text-center md:pt-32"
    >
      <p className="mx-auto inline-flex items-center gap-2 rounded-full bg-blush px-4 py-1.5 text-sm text-forest">
        <Sparkle width={11} height={11} className="text-clay" />
        Digitale bruiloftsuitnodigingen
      </p>

      <div className="relative mx-auto max-w-5xl">
        <h1 className="mt-5 font-serif text-[clamp(3.25rem,8.5vw,7.5rem)] leading-[0.98] font-medium tracking-tight text-forest">
          Jullie dag,
          <br />
          <span className="italic">mooi geregeld.</span>
        </h1>

        <p className="mx-auto mt-6 max-w-xl leading-relaxed text-ink/70">
          Ontwerp een persoonlijke digitale uitnodiging, beheer jullie gastenlijst en houd alle RSVP&apos;s bij op één rustige plek.
        </p>

        {/* Notitie rechts van de kop */}
        <div
          aria-hidden
          className="pointer-events-none absolute top-[2.5rem] right-0 hidden -rotate-6 text-clay lg:block"
        >
          <p className="font-hand text-3xl leading-none">Sleep door de voorbeelden</p>
          <Arrow className="mt-1 ml-16 h-12 w-16 rotate-[20deg]" />
        </div>
      </div>

      {/* Sleepbare rij met voorbeelden */}
      <div
        ref={stage}
        role="group"
        aria-roledescription="carrousel"
        aria-label="Voorbeelden van uitnodigingen en schermen"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") go(1);
          if (e.key === "ArrowLeft") go(-1);
        }}
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerCancel={onUp}
        className="relative mt-10 h-[37em] cursor-grab touch-pan-y text-[clamp(0.6rem,1.05vw,0.9rem)] select-none active:cursor-grabbing md:mt-14"
      >
        {CARDS.map((c, i) => {
          const d = wrap(i, pos);
          const ad = Math.abs(d);
          const t = Math.max(0, 1 - ad * 1.6); // 1 = telefoon, 0 = kaart
          const tilt = Math.max(-27, Math.min(27, -d * 9));
          return (
            <div
              key={c.slug}
              onClick={() => {
                if (drag.current?.moved) return;
                const target = Math.round(posRef.current + d);
                if (Math.round(posRef.current) !== target) animateTo(target);
              }}
              className="absolute top-0 left-1/2 h-full w-[17em]"
              style={{
                transform: `translateX(calc(-50% + ${d * STEP}em)) perspective(1100px) rotateY(${tilt}deg)`,
                zIndex: 20 - Math.round(ad * 2),
                opacity: Math.max(0, Math.min(1, 4.4 - ad)),
              }}
            >
              <div className="absolute inset-x-0 top-1/2 -translate-y-1/2" style={{ opacity: t }}>
                <Phone slug={c.slug} />
              </div>
              <div
                className="absolute top-1/2 left-1/2 w-[15em] -translate-x-1/2 -translate-y-1/2"
                style={{ opacity: 1 - t, transform: `translate(-50%, -50%) scale(${1 - t * 0.1})` }}
              >
                <Shot slug={c.slug} label={c.label} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Pijltjes */}
      <div className="mt-6 flex items-center justify-center gap-3">
        <button
          type="button"
          onClick={() => go(-1)}
          aria-label="Vorige"
          className="grid h-11 w-11 place-items-center rounded-full border border-forest/25 bg-paper text-forest transition hover:bg-forest hover:text-paper"
        >
          <ChevronRightIcon width={18} height={18} className="rotate-180" />
        </button>
        <button
          type="button"
          onClick={() => go(1)}
          aria-label="Volgende"
          className="grid h-11 w-11 place-items-center rounded-full border border-forest/25 bg-paper text-forest transition hover:bg-forest hover:text-paper"
        >
          <ChevronRightIcon width={18} height={18} />
        </button>
      </div>

      {/* Knoppen */}
      <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center sm:gap-6">
        <span className="inline-block rounded-full border-2 border-dashed border-forest/35 p-1.5">
          <Link
            href="/account-aanmaken"
            className="inline-flex items-center gap-2 rounded-full bg-forest px-7 py-3.5 font-medium text-paper transition hover:bg-forest-deep"
          >
            Begin met jullie uitnodiging <ChevronRightIcon width={16} height={16} />
          </Link>
        </span>
        <Link href="/zo-werkt-het" className="font-medium text-forest hover:underline">
          Zo werkt het
        </Link>
      </div>
      <p className="mt-4 text-sm text-ink/60">Gratis uitproberen, je betaalt pas als je gaat versturen.</p>
    </section>
  );
}
