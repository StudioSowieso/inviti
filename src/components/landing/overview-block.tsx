"use client";

import { useEffect, useState } from "react";
import { Sparkle } from "@/components/icons";

/** Wisselende stand van de reacties (altijd samen 48), zodat de balkjes af en toe bewegen. */
const SCENES: [number, number, number][] = [
  [36, 9, 3],
  [30, 13, 5],
  [41, 5, 2],
  [33, 11, 4],
];
const BARS = [
  { label: "Ja", color: "bg-forest" },
  { label: "Nog niet", color: "bg-coral" },
  { label: "Nee", color: "bg-ink/55" },
];
const GUESTS = ["Familie Jansen · 4 gasten", "Sanne & Tim · vegetarisch", "Oma & Opa de Vries", "Lotte Bakker · +1"];

const LABEL = "text-[0.62rem] font-semibold tracking-[0.24em] uppercase";

/** Blok "Dit regel je met Proost Mee": drie kaarten die laten zien wat er achter de uitnodiging zit. */
export function OverviewBlock() {
  const [scene, setScene] = useState(0);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(() => setScene((v) => (v + 1) % SCENES.length), 3200);
    return () => window.clearInterval(id);
  }, []);
  const counts = SCENES[scene];

  return (
    <section aria-labelledby="regel-je" className="bg-sage px-6 py-20 sm:py-28">
      <div className="mx-auto max-w-5xl text-center">
        <p className="inline-flex items-center gap-2 text-[0.68rem] tracking-[0.28em] text-forest/80 uppercase">
          Alles op één plek <Sparkle width={9} height={9} />
        </p>
        <h2 id="regel-je" className="mt-4 font-serif text-4xl leading-tight text-forest sm:text-5xl">
          Dit regel je met Proost Mee
        </h2>

        <div className="mt-14 grid items-start gap-6 text-left md:grid-cols-3">
          {/* 1. RSVP's */}
          <div className="flex min-h-[19rem] flex-col rounded-[1.75rem] bg-paper p-7 shadow-[0_20px_40px_-28px_rgb(90_65_54/0.5)]">
            <p className={`${LABEL} text-forest`}>1 · RSVP&apos;s bijhouden</p>
            <p className="mt-5 flex items-baseline gap-2 text-forest">
              <span className="font-serif text-6xl leading-none">48</span>
              <span className="text-sm">gasten reageerden</span>
            </p>
            <div className="mt-6 space-y-3">
              {BARS.map((r, i) => (
                <div key={r.label}>
                  <div className="flex justify-between text-xs text-forest">
                    <span>{r.label}</span>
                    <span className="tabular-nums">{counts[i]}</span>
                  </div>
                  <div className="mt-1 h-2 overflow-hidden rounded-full bg-sage">
                    <div
                      className={`h-full rounded-full transition-[width] duration-1000 ease-in-out ${r.color}`}
                      style={{ width: `${(counts[i] / 48) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-auto pt-6 text-xs text-forest">Zie in één oogopslag wie er komt.</p>
          </div>

          {/* 2. Gastenlijst */}
          <div className="flex min-h-[19rem] flex-col rounded-[1.75rem] bg-olive p-7 text-paper md:mt-7">
            <p className={`${LABEL} text-paper`}>2 · Gastenlijst beheren</p>
            <ul className="mt-6 space-y-4">
              {GUESTS.map((g) => (
                <li key={g} className="flex items-center gap-3 text-sm">
                  <span aria-hidden className="h-6 w-6 shrink-0 rounded-full border-2 border-paper/80" />
                  {g}
                </li>
              ))}
            </ul>
            <p className="mt-auto pt-6 text-xs text-paper/90">Groepen, dieetwensen en reacties bij elkaar.</p>
          </div>

          {/* 3. Uitnodiging */}
          <div className="flex min-h-[19rem] flex-col rounded-[1.75rem] bg-paper p-7 shadow-[0_20px_40px_-28px_rgb(90_65_54/0.5)]">
            <p className={`${LABEL} text-forest`}>3 · Uitnodiging maken</p>
            <div aria-hidden className="relative mt-5 min-h-[11rem] flex-1">
              <div className="absolute inset-x-0 inset-y-0 mx-auto w-full max-w-[17rem]">
                <span className="float-a absolute top-[14%] left-[4%] h-[76%] w-[46%] -rotate-12 rounded-2xl bg-sage" />
                <span className="float-b absolute top-[8%] right-[4%] h-[82%] w-[46%] rotate-6 rounded-2xl bg-coral" />
                <span className="float-c absolute top-[2%] left-1/2 flex h-[94%] w-[48%] -translate-x-1/2 flex-col items-center justify-center rounded-2xl bg-olive text-center text-paper shadow-[0_14px_30px_-16px_rgb(0_0_0/0.5)]">
                  <span className="text-[0.5rem] tracking-[0.2em] uppercase">Wij gaan trouwen</span>
                  <span className="mt-2 text-lg leading-tight">
                    Emma
                    <br />&amp; Mats
                  </span>
                  <Sparkle width={11} height={11} className="mt-3 text-coral" />
                </span>
              </div>
            </div>
            <p className="mt-auto pt-6 text-xs text-forest">Kies een thema, vul jullie gegevens in en verstuur.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
