"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { InvitationView } from "@/components/invitation/invitation-view";
import { defaultConfig } from "@/lib/invitation/defaults";
import { FALLBACK_THEMES } from "@/lib/invitation/fallback-themes";
import { DashboardMock, TodoMock, VersturenMock } from "./backoffice-mocks";
import { GuestMock } from "./guest-mock";
import { applyPalette } from "@/lib/invitation/palettes";
import type { ThemeColors } from "@/lib/invitation/types";

/** Kleurtoon van de voorbeelden: "olive" zet de uitnodigingen om naar bruin en olijfgroen. */
export type Tone = "olive";

const OLIVE_SETS: Record<string, ThemeColors> = {
  cream: {
    background: "#f2f0eb", surface: "#faf8f4", surfaceAlt: "#e4e9dc", text: "#5a4136", muted: "#8a7a6e",
    line: "#e3dfd4", accent: "#6b7a52", buttonBackground: "#5a4136", buttonText: "#faf8f4",
    footerBackground: "#4c5b3c", footerText: "#eef2e8", envelope: "#e6ebde", envelopeCard: "#faf8f4",
  },
  sage: {
    background: "#dde6d5", surface: "#eef2e8", surfaceAlt: "#cbd7bf", text: "#4c5b3c", muted: "#76866a",
    line: "#c3d0b6", accent: "#4c5b3c", buttonBackground: "#4c5b3c", buttonText: "#eef2e8",
    footerBackground: "#5a4136", footerText: "#f2ede4", envelope: "#cbd7bf", envelopeCard: "#eef2e8",
  },
  olive: {
    background: "#4c5b3c", surface: "#5f6f4e", surfaceAlt: "#566746", text: "#eef2e8", muted: "#c3cfb4",
    line: "#6d7d5c", accent: "#dde6d5", buttonBackground: "#eef2e8", buttonText: "#4c5b3c",
    footerBackground: "#3d4a30", footerText: "#eef2e8", envelope: "#566746", envelopeCard: "#eef2e8",
  },
  brown: {
    background: "#5a4136", surface: "#6b5044", surfaceAlt: "#634a3e", text: "#f2ede4", muted: "#cdbfb2",
    line: "#7a6054", accent: "#c9d6b8", buttonBackground: "#f2ede4", buttonText: "#5a4136",
    footerBackground: "#44312a", footerText: "#f2ede4", envelope: "#6b5044", envelopeCard: "#f2ede4",
  },
};
const OLIVE_BY_SLUG: Record<string, keyof typeof OLIVE_SETS> = {
  leaf: "cream",
  sweet: "sage",
  lemon: "cream",
  modern: "brown",
  flowers: "sage",
  nature: "olive",
};

const SCREEN_W = 340;

/** Backoffice-schermen (statische voorbeelden) en anders een echte uitnodiging. */
function renderScreen(slug: string, config: ReturnType<typeof defaultConfig>, theme: ReturnType<typeof applyPalette>) {
  if (slug === "gastenlijst") return <GuestMock />;
  if (slug === "dashboard") return <DashboardMock />;
  if (slug === "versturen") return <VersturenMock />;
  if (slug === "todo") return <TodoMock />;
  return <InvitationView config={config} theme={theme} startOpen className="h-full" />;
}

/** Een echte uitnodiging, op vaste breedte gerenderd en geschaald naar de ruimte. */
export function PhoneScreen({ slug, tone }: { slug: string; tone?: Tone }) {
  const box = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState<{ k: number; h: number } | null>(null);

  const config = useMemo(() => ({ ...defaultConfig({ partner1: "Emma", partner2: "Mats" }), animation: "none" as const }), []);
  const theme = useMemo(() => {
    const t = FALLBACK_THEMES.find((x) => x.slug === slug) ?? FALLBACK_THEMES[0];
    const themed = applyPalette(t, "standaard");
    return tone === "olive" ? { ...themed, colors: OLIVE_SETS[OLIVE_BY_SLUG[slug] ?? "cream"] } : themed;
  }, [slug, tone]);

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const measure = () => {
      const k = el.clientWidth / SCREEN_W;
      if (k > 0) setSize({ k, h: el.clientHeight / k });
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div ref={box} className="no-scrollbar absolute inset-0 overflow-hidden">
      {size && (
        <div style={{ width: SCREEN_W, height: size.h, transform: `scale(${size.k})`, transformOrigin: "top left" }}>
          {renderScreen(slug, config, theme)}
        </div>
      )}
    </div>
  );
}

/** Telefoonframe met één uitnodiging of scherm erin (themagalerij en inlogpagina's). */
export function PhoneFrame({ slugs, className = "", tone }: { slugs: string[]; className?: string; tone?: Tone }) {
  return (
    <div
      className={`relative aspect-[340/720] rounded-[15%/7%] bg-ink p-[2.6%] shadow-[0_60px_90px_-40px_rgb(0_0_0/0.65),0_0_0_1.5px_rgb(255_255_255/0.08)_inset] ${className}`}
    >
      <div className="relative h-full w-full overflow-hidden rounded-[12%/5.6%] bg-paper">
        {slugs.map((slug, i) => (
          <div
            key={slug}
            className="pointer-events-none absolute inset-0"
            style={i === 0 ? undefined : { opacity: 0, visibility: "hidden" }}
          >
            <PhoneScreen slug={slug} tone={tone} />
          </div>
        ))}
      </div>
      <span className="absolute top-[2.4%] left-1/2 z-10 h-[1.9%] w-[26%] -translate-x-1/2 rounded-full bg-ink" />
      <span className="pointer-events-none absolute inset-0 rounded-[inherit] bg-gradient-to-br from-white/10 via-transparent to-transparent" />
    </div>
  );
}

/** Een scherm als losse staande kaart (3:4), zonder telefoonrand. Voor rijen met voorbeelden. */
export function ScreenCard({ slug, className = "", tone }: { slug: string; className?: string; tone?: Tone }) {
  return (
    <div className={`relative aspect-[3/4] overflow-hidden rounded-[1.5rem] bg-paper ${className}`}>
      <PhoneScreen slug={slug} tone={tone} />
    </div>
  );
}
