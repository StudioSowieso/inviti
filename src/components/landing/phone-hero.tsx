"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { CheckIcon, ChevronRightIcon, SendIcon, Sparkle, UsersIcon } from "@/components/icons";
import { gsap, ScrollTrigger, useGSAP } from "./gsap";
import { PhoneFrame } from "./phone";

type Step = {
  slug: string;
  glow: string;
  n: string;
  eyebrow: string;
  title: string;
  text: string;
  chip: { icon: ReactNode; title: string; sub: string };
};

const ICON = { width: 18, height: 18 } as const;

const STEPS: Step[] = [
  {
    slug: "leaf",
    glow: "#8c9b78",
    n: "01",
    eyebrow: "Digitale bruiloftsuitnodigingen",
    title: "Jullie dag, mooi geregeld.",
    text: "Ontwerp een persoonlijke digitale uitnodiging, beheer jullie gastenlijst en houd alle RSVP's bij op één rustige plek. Zodat jullie aandacht naar elkaar kan gaan.",
    chip: { icon: <Sparkle {...ICON} />, title: "Opent met een animatie", sub: "Per thema een eigen envelop" },
  },
  {
    slug: "sweet",
    glow: "#e6a7b4",
    n: "02",
    eyebrow: "Website",
    title: "Eigen bruiloftswebsite",
    text: "Elke uitnodiging is meteen een website met jullie verhaal, programma, locatie en dresscode. Eén link, alles erop.",
    chip: { icon: <CheckIcon {...ICON} />, title: "Programma & locatie", sub: "Alles voor je gasten op één plek" },
  },
  {
    slug: "gastenlijst",
    glow: "#e8c764",
    n: "03",
    eyebrow: "Gastenlijst",
    title: "Makkelijk gasten beheren",
    text: "Voeg gasten toe of importeer ze, deel ze in groepen in en zie wie komt. Plus-één en dieetwensen staan bij de juiste persoon.",
    chip: { icon: <UsersIcon {...ICON} />, title: "Familie · 8 gasten", sub: "Vrienden · 11 gasten" },
  },
  {
    slug: "modern",
    glow: "#b9ae9d",
    n: "04",
    eyebrow: "Versturen",
    title: "Uitnodigingen versturen",
    text: "Stuur elke gast een persoonlijke link via WhatsApp of mail, of maak één link per groep die je zelf deelt.",
    chip: { icon: <SendIcon {...ICON} />, title: "Via WhatsApp, mail of link", sub: "Persoonlijk per gast" },
  },
];

const H = "mt-3 font-serif text-[1.9rem] leading-[1.04] font-medium sm:text-4xl md:mt-5 md:text-5xl";
const T = 3; // tijdseenheden per stap

const CTA_PRIMARY =
  "inline-flex items-center gap-2 rounded-full bg-paper px-6 py-3 font-medium text-forest transition hover:bg-blush";

export function PhoneHero() {
  const root = useRef<HTMLElement>(null);
  const [mounted, setMounted] = useState(false);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    setMounted(true);
  }, []);

  useGSAP(
    () => {
      if (!mounted || reduced || !root.current) return;
      const el = root.current;
      const q = gsap.utils.selector(el);
      const stage = q("[data-stage]")[0];
      const phone = q("[data-phone]")[0];
      const wrap = q("[data-phone-wrap]")[0];
      const arch = q("[data-arch-line]")[0];
      const hint = q("[data-hint]")[0];
      const screens = q("[data-screen]");
      const texts = q("[data-text]");
      const chips = q("[data-chip]");
      const glows = q("[data-glow]");
      const fills = q("[data-fill]");

      gsap.set([...texts.slice(1), ...chips.slice(1)], { autoAlpha: 0 });
      gsap.set(glows.slice(1), { autoAlpha: 0 });

      // Intro bij het laden
      gsap.from(wrap, { y: 70, autoAlpha: 0, duration: 1.4, ease: "power3.out", delay: 0.1 });
      gsap.from([texts[0], chips[0]], { y: 26, autoAlpha: 0, duration: 1.2, ease: "power3.out", stagger: 0.12, delay: 0.3 });

      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: stage,
          start: "top top",
          end: () => `+=${window.innerHeight * 3.8}`,
          pin: true,
          scrub: 0.8,
          anticipatePin: 1,
          refreshPriority: 10,
          invalidateOnRefresh: true,
        },
      });

      STEPS.forEach((_, s) => {
        tl.fromTo(fills[s], { scaleX: 0 }, { scaleX: 1, duration: s === STEPS.length - 1 ? 2.5 : T }, s * T);
        if (s === STEPS.length - 1) return;
        const t0 = s * T + 2;
        const out = { autoAlpha: 0, y: -30, duration: 0.4, ease: "power2.in" };
        tl.to(texts[s], out, t0);
        tl.to(chips[s], out, t0);
        tl.to(glows[s], { autoAlpha: 0, duration: 1 }, t0);
        tl.to(glows[s + 1], { autoAlpha: 1, duration: 1 }, t0);

        // de telefoon draait via de zijkant naar de volgende uitnodiging
        tl.fromTo(phone, { rotationY: 0, scale: 1 }, { rotationY: -90, scale: 0.94, duration: 0.5, ease: "power2.in" }, t0);
        tl.set(screens[s], { autoAlpha: 0 }, t0 + 0.5);
        tl.set(screens[s + 1], { autoAlpha: 1 }, t0 + 0.5);
        tl.fromTo(
          phone,
          { rotationY: 90, scale: 0.94 },
          { rotationY: 0, scale: 1, duration: 0.5, ease: "power2.out", immediateRender: false },
          t0 + 0.5,
        );

        const into = { autoAlpha: 1, y: 0, duration: 0.5, ease: "power2.out", immediateRender: false };
        tl.fromTo(texts[s + 1], { autoAlpha: 0, y: 40 }, into, t0 + 0.55);
        tl.fromTo(chips[s + 1], { autoAlpha: 0, y: 30 }, into, t0 + 0.65);
      });

      tl.to(hint, { autoAlpha: 0, duration: 0.5 }, 0.2);
      tl.fromTo(arch, { scale: 1 }, { scale: 1.12, duration: (STEPS.length - 1) * T + 2.5 }, 0);
      tl.to({}, { duration: 0.3 });

      ScrollTrigger.sort();
      requestAnimationFrame(() => ScrollTrigger.refresh());
    },
    { scope: root, dependencies: [mounted, reduced], revertOnUpdate: true },
  );

  if (mounted && reduced) return <StaticHero />;

  return (
    <section id="hero" ref={root} aria-label="Inviti in vier stappen">
      <div data-stage className="relative h-svh overflow-hidden bg-forest-deep text-paper">
        {STEPS.map((s, i) => (
          <div
            key={s.slug}
            data-glow
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{ background: `radial-gradient(55% 50% at 50% 52%, ${s.glow}59, transparent 72%)`, opacity: i === 0 ? 1 : 0 }}
          />
        ))}

        <div
          data-arch-line
          aria-hidden
          className="pointer-events-none absolute bottom-0 left-1/2 hidden h-[92svh] w-[min(44vw,34rem)] -translate-x-1/2 rounded-t-full border border-b-0 border-paper/15 md:block"
        />

        {/* Telefoon */}
        <div
          className="absolute inset-x-0 top-[10svh] flex justify-center md:inset-0 md:top-0 md:items-center"
          style={{ perspective: "1600px" }}
          aria-hidden
        >
          <div data-phone-wrap>
            <div data-phone className="will-change-transform" style={{ transformStyle: "preserve-3d" }}>
              <PhoneFrame slugs={STEPS.map((s) => s.slug)} className="h-[47svh] md:h-[min(74svh,44rem)]" />
            </div>
          </div>
        </div>

        {/* Teksten */}
        <div className="absolute inset-x-0 bottom-14 h-[33svh] px-6 md:inset-0 md:h-auto md:px-0">
          {STEPS.map((s, i) => (
            <div
              key={s.slug}
              className={`absolute inset-x-6 top-0 md:inset-x-auto md:top-1/2 md:w-[min(25rem,30vw)] md:-translate-y-1/2 ${
                i % 2 === 0 ? "md:left-[7vw]" : "md:right-[7vw]"
              }`}
            >
              <div data-text className="text-center md:text-left">
                <p className="eyebrow flex items-center justify-center gap-2 text-blush/80 md:justify-start">
                  {i === 0 ? s.eyebrow : `${s.n} · ${s.eyebrow}`} <Sparkle width={9} height={9} />
                </p>
                {i === 0 ? <h1 className={H}>{s.title}</h1> : <h2 className={H}>{s.title}</h2>}
                <p className="mx-auto mt-3 max-w-md text-[0.95rem] leading-relaxed text-paper/75 md:mx-0 md:mt-5">{s.text}</p>
                {i === 0 && (
                  <div className="mt-5 flex flex-wrap items-center justify-center gap-x-5 gap-y-3 md:mt-8 md:justify-start">
                    <Link href="/account-aanmaken" className={CTA_PRIMARY}>
                      Begin met jullie uitnodiging <ChevronRightIcon width={16} height={16} />
                    </Link>
                    <Link href="#zo-werkt-het" className="hidden text-sm font-medium text-paper/80 underline-offset-4 hover:text-paper hover:underline sm:inline">
                      Zo werkt het
                    </Link>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Zwevende details naast de telefoon */}
        {STEPS.map((s, i) => (
          <div
            key={s.slug}
            aria-hidden
            className={`pointer-events-none absolute top-[27%] hidden md:block ${
              i % 2 === 0 ? "left-[calc(50%+9rem)]" : "right-[calc(50%+9rem)]"
            }`}
          >
            <div data-chip className="flex items-center gap-3 rounded-2xl bg-paper px-4 py-3 text-ink shadow-[0_24px_50px_-20px_rgb(0_0_0/0.5)]">
              <span className="grid size-9 place-items-center rounded-full bg-blush text-clay">{s.chip.icon}</span>
              <span className="text-sm leading-tight">
                <span className="block font-medium">{s.chip.title}</span>
                <span className="block text-ink/65">{s.chip.sub}</span>
              </span>
            </div>
          </div>
        ))}

        {/* Voortgang */}
        <div aria-hidden className="absolute inset-x-0 bottom-5 flex flex-col items-center gap-3">
          <p data-hint className="eyebrow text-paper/60">
            Scroll
          </p>
          <div className="flex w-[min(20rem,70vw)] gap-2">
            {STEPS.map((s) => (
              <span key={s.slug} className="h-px flex-1 bg-paper/20">
                <span data-fill className="block h-full origin-left scale-x-0 bg-paper" />
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/** Zonder beweging: dezelfde boodschap, gewoon onder elkaar. */
function StaticHero() {
  return (
    <section id="hero" aria-label="Inviti in vier stappen" className="bg-forest-deep text-paper">
      <div className="mx-auto max-w-6xl px-6 pt-32 pb-10 lg:px-10">
        <h1 className="max-w-2xl font-serif text-5xl leading-[1.02] font-medium sm:text-7xl">Jullie dag, mooi geregeld.</h1>
        <div className="mt-8 flex flex-wrap items-center gap-5">
          <Link href="/account-aanmaken" className={CTA_PRIMARY}>
            Begin met jullie uitnodiging <ChevronRightIcon width={16} height={16} />
          </Link>
          <Link href="#zo-werkt-het" className="text-sm font-medium text-paper/80 underline-offset-4 hover:underline">
            Zo werkt het
          </Link>
        </div>
      </div>
      <div className="mx-auto max-w-6xl space-y-20 px-6 py-16 lg:px-10">
        {STEPS.map((s, i) => (
          <article key={s.slug} className={`grid items-center gap-10 md:grid-cols-2 ${i % 2 ? "md:[&>*:first-child]:order-2" : ""}`}>
            <div aria-hidden className="mx-auto">
              <PhoneFrame slugs={[s.slug]} className="h-[32rem]" />
            </div>
            <div>
              <p className="eyebrow flex items-center gap-2 text-blush/80">
                {s.n} · {s.eyebrow} <Sparkle width={9} height={9} />
              </p>
              <h2 className="mt-4 font-serif text-4xl leading-tight font-medium">{s.title}</h2>
              <p className="mt-4 max-w-md leading-relaxed text-paper/75">{s.text}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
