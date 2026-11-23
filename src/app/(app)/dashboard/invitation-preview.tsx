"use client";

import Link from "next/link";
import { useState } from "react";
import { InvitationView } from "@/components/invitation/invitation-view";
import { formatDateLong } from "@/lib/invitation/format";
import type { InvitationConfig, InvitationTheme } from "@/lib/invitation/types";

export type PreviewVariant = { id: string; name: string; config: InvitationConfig; theme: InvitationTheme };

// De uitnodiging is ontworpen voor een telefoon van 21 x 42 rem. Hier tonen we hem verkleind (0,643x)
// in een vaste maat, zodat hij er precies zo uitziet als bij de gast.
const SCALE = 0.643;

/** Telefoon met een live voorbeeld van de uitnodiging, met een keuze per groep als er meer zijn. */
export function InvitationPreview({ variants }: { variants: PreviewVariant[] }) {
  const [index, setIndex] = useState(0);
  const current = variants[index] ?? variants[0];
  if (!current) return null;

  return (
    <div className="flex flex-col items-center gap-6 2xl:flex-row 2xl:gap-8">
      <div className="shrink-0">
        <div
          className="relative overflow-hidden rounded-[2rem] border-[7px] border-ink/90 bg-paper shadow-[0_24px_60px_-24px_rgb(31_36_32/0.5)]"
          style={{ width: `${21 * SCALE}rem`, height: `${42 * SCALE}rem` }}
        >
          <div
            aria-hidden
            className="pointer-events-none absolute top-0 left-0 origin-top-left"
            style={{ width: "21rem", height: "42rem", transform: `scale(${SCALE})` }}
          >
            <InvitationView key={current.id} config={current.config} theme={current.theme} startOpen className="h-full" />
          </div>
          {/* Notch */}
          <span aria-hidden className="absolute top-1.5 left-1/2 h-1.5 w-12 -translate-x-1/2 rounded-full bg-ink/80" />
        </div>
      </div>

      <div className="min-w-0 text-center 2xl:text-left">
        {variants.length > 1 && (
          <div role="tablist" aria-label="Uitnodiging per groep" className="mb-4 flex flex-wrap justify-center gap-2 2xl:justify-start">
            {variants.map((v, i) => (
              <button
                key={v.id}
                role="tab"
                aria-selected={i === index}
                onClick={() => setIndex(i)}
                className={`rounded-full border px-4 py-1.5 text-sm transition ${
                  i === index ? "border-forest bg-forest text-paper" : "border-line bg-paper hover:border-clay/50"
                }`}
              >
                {v.name}
              </button>
            ))}
          </div>
        )}
        <p className="font-serif text-2xl leading-tight">
          {current.config.partner1 || "Jullie"} &amp; {current.config.partner2 || "uitnodiging"}
        </p>
        <p className="mt-1 text-sm text-muted">
          Thema {current.theme.title}
          {current.config.date ? ` · ${formatDateLong(current.config.date)}` : ""}
        </p>
        <Link
          href={`/uitnodiging?v=${current.id}`}
          className="mt-5 inline-flex rounded-full bg-forest px-6 py-3 text-sm font-medium text-paper transition hover:bg-forest-deep"
        >
          Uitnodiging bewerken
        </Link>
      </div>
    </div>
  );
}
