import { Sparkle } from "@/components/icons";

const REPLIES = [
  { label: "Ja", n: 36 },
  { label: "Nog niet", n: 9 },
  { label: "Nee", n: 3 },
];
const GUESTS = ["Familie Jansen · 4 gasten", "Sanne & Tim · vegetarisch", "Oma & Opa de Vries", "Lotte Bakker · +1"];

const LABEL = "text-[0.62rem] font-semibold tracking-[0.24em] uppercase";

/** Blok "Dit regel je met Proost Mee": drie kaarten die laten zien wat er achter de uitnodiging zit. */
export function OverviewBlock() {
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
              {REPLIES.map((r) => (
                <div key={r.label}>
                  <div className="flex justify-between text-xs text-forest">
                    <span>{r.label}</span>
                    <span>{r.n}</span>
                  </div>
                  <div className="mt-1 h-2 overflow-hidden rounded-full bg-sage">
                    <div className="h-full rounded-full bg-olive-mid" style={{ width: `${(r.n / 48) * 100}%` }} />
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
            <div aria-hidden className="relative mx-auto mt-6 h-32 w-44">
              <span className="absolute top-3 left-0 h-24 w-24 -rotate-12 rounded-2xl bg-sage" />
              <span className="absolute top-0 right-0 h-28 w-24 rotate-6 rounded-2xl bg-coral" />
              <span className="absolute top-2 left-1/2 flex h-28 w-24 -translate-x-1/2 flex-col items-center justify-center rounded-2xl bg-olive text-center text-paper">
                <span className="text-[0.38rem] tracking-[0.2em] uppercase">Wij gaan trouwen</span>
                <span className="mt-1 text-sm">Emma &amp; Mats</span>
              </span>
            </div>
            <p className="mt-auto pt-6 text-xs text-forest">Kies een thema, vul jullie gegevens in en verstuur.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
