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
    <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-stretch sm:gap-6 xl:gap-8">
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

      <div className="flex min-w-0 flex-1 flex-col self-stretch text-center sm:text-left">
        <div>
          <p className="eyebrow text-clay">Jouw uitnodiging</p>
          <h2 className="mt-2 font-serif text-2xl leading-tight font-medium">
            {current.config.partner1 || "Jullie"} &amp; {current.config.partner2 || "uitnodiging"}
          </h2>
          <p className="mt-1 text-sm text-muted">Zo ziet je gast hem op de telefoon.</p>
        </div>

        {variants.length > 1 && (
          <div className="mt-5">
            <p className="mb-1.5 text-xs text-muted">Uitnodiging voor</p>
            <div
              role="tablist"
              aria-label="Uitnodiging per groep"
              className="inline-flex max-w-full flex-wrap gap-1 rounded-full bg-cream p-1"
            >
              {variants.map((v, i) => (
                <button
                  key={v.id}
                  role="tab"
                  aria-selected={i === index}
                  onClick={() => setIndex(i)}
                  className={`rounded-full px-3.5 py-1.5 text-sm transition ${
                    i === index ? "bg-paper font-medium text-ink shadow-sm" : "text-muted hover:text-ink"
                  }`}
                >
                  {v.name}
                </button>
              ))}
            </div>
          </div>
        )}

        <dl className="mt-5 divide-y divide-line border-y border-line text-sm">
          <div className="flex justify-between gap-4 py-2.5">
            <dt className="text-muted">Thema</dt>
            <dd className="text-right font-medium">{current.theme.title}</dd>
          </div>
          {current.config.date && (
            <div className="flex justify-between gap-4 py-2.5">
              <dt className="text-muted">Datum</dt>
              <dd className="text-right font-medium">{formatDateLong(current.config.date)}</dd>
            </div>
          )}
          {current.config.city && (
            <div className="flex justify-between gap-4 py-2.5">
              <dt className="text-muted">Plaats</dt>
              <dd className="text-right font-medium">{current.config.city}</dd>
            </div>
          )}
        </dl>

        <Link
          href={`/uitnodiging?v=${current.id}`}
          className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-forest px-6 py-3 text-sm font-medium text-paper transition hover:bg-forest-deep sm:mt-auto"
        >
          Uitnodiging bewerken
        </Link>
      </div>
    </div>
  );
}
