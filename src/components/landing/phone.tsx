"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { InvitationView } from "@/components/invitation/invitation-view";
import { defaultConfig } from "@/lib/invitation/defaults";
import { FALLBACK_THEMES } from "@/lib/invitation/fallback-themes";
import { GuestMock } from "./guest-mock";
import { applyPalette } from "@/lib/invitation/palettes";

const SCREEN_W = 340;

/** Een echte uitnodiging, op vaste breedte gerenderd en geschaald naar de ruimte. */
function PhoneScreen({ slug }: { slug: string }) {
  const box = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState<{ k: number; h: number } | null>(null);

  const config = useMemo(() => ({ ...defaultConfig({ partner1: "Emma", partner2: "Mats" }), animation: "none" as const }), []);
  const theme = useMemo(() => {
    const t = FALLBACK_THEMES.find((x) => x.slug === slug) ?? FALLBACK_THEMES[0];
    return applyPalette(t, "standaard");
  }, [slug]);

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
    <div ref={box} className="absolute inset-0 overflow-hidden">
      {size && (
        <div style={{ width: SCREEN_W, height: size.h, transform: `scale(${size.k})`, transformOrigin: "top left" }}>
          {slug === "gastenlijst" ? <GuestMock /> : <InvitationView config={config} theme={theme} startOpen className="h-full" />}
        </div>
      )}
    </div>
  );
}

/** Telefoonframe; `slugs` zijn de uitnodigingen die erin gestapeld staan (de hero wisselt ze). */
export function PhoneFrame({ slugs, className = "" }: { slugs: string[]; className?: string }) {
  return (
    <div
      className={`relative aspect-[340/720] rounded-[15%/7%] bg-ink p-[2.6%] shadow-[0_60px_90px_-40px_rgb(0_0_0/0.65),0_0_0_1.5px_rgb(255_255_255/0.08)_inset] ${className}`}
      style={{ transformStyle: "preserve-3d" }}
    >
      <div className="relative h-full w-full overflow-hidden rounded-[12%/5.6%] bg-paper">
        {slugs.map((slug, i) => (
          <div
            key={slug}
            data-screen
            className="pointer-events-none absolute inset-0"
            style={i === 0 ? undefined : { opacity: 0, visibility: "hidden" }}
          >
            <PhoneScreen slug={slug} />
          </div>
        ))}
      </div>
      <span className="absolute top-[2.4%] left-1/2 z-10 h-[1.9%] w-[26%] -translate-x-1/2 rounded-full bg-ink" />
      <span className="pointer-events-none absolute inset-0 rounded-[inherit] bg-gradient-to-br from-white/10 via-transparent to-transparent" />
    </div>
  );
}
