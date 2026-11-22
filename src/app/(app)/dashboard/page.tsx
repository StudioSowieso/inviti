import { UpgradeTrigger } from "@/components/trial-banner";
import type { Metadata } from "next";
import Link from "next/link";
import {
  CheckIcon,
  ChevronRightIcon,
  ClockIcon,
  PenIcon,
  SendIcon,
  Sparkle,
  UsersIcon,
  XIcon,
} from "@/components/icons";
import { PageHeader } from "@/components/page-header";
import { firstName, greeting, coupleInitials } from "@/lib/format";
import { getHasPaid } from "@/lib/billing";
import { createClient, getUser } from "@/lib/supabase/server";
import { syncSystemTodos } from "@/lib/system-todos";
import { TodoItem } from "./todo-item";

export const metadata: Metadata = { title: "Dashboard — Proost Mee" };

export default async function DashboardPage({ searchParams }: { searchParams: Promise<{ betaald?: string }> }) {
  const [supabase, user, hasPaid, sp] = await Promise.all([createClient(), getUser(), getHasPaid(), searchParams]);

  await syncSystemTodos(supabase, user!.id);

  const [{ data: profile }, { data: guests }, { data: todos }] = await Promise.all([
    supabase.from("profiles").select("full_name, partner_name").eq("id", user!.id).maybeSingle(),
    supabase.from("guests").select("rsvp_status"),
    supabase
      .from("todos")
      .select("id, title, due_date, done")
      .order("done", { ascending: true })
      .order("due_date", { ascending: true, nullsFirst: false })
      .order("created_at", { ascending: true }),
  ]);

  const name = profile?.full_name ?? user?.user_metadata?.full_name ?? "";
  const list = guests ?? [];
  const total = list.length;
  const yes = list.filter((g) => g.rsvp_status === "attending").length;
  const no = list.filter((g) => g.rsvp_status === "declined").length;
  const pending = total - yes - no;

  const todoList = todos ?? [];
  const todoTotal = todoList.length;
  const doneCount = todoList.filter((t) => t.done).length;
  const openCount = todoTotal - doneCount;
  const todoPct = todoTotal ? Math.round((doneCount / todoTotal) * 100) : 0;

  const stats = [
    { label: "Ja", value: yes, hint: "gasten komen", icon: CheckIcon, tone: "bg-forest text-paper", ring: "stroke-forest", dot: "bg-forest" },
    { label: "Nog niet", value: pending, hint: "wachten nog", icon: ClockIcon, tone: "bg-clay text-paper", ring: "stroke-clay", dot: "bg-clay" },
    { label: "Nee", value: no, hint: "komen niet", icon: XIcon, tone: "bg-ink/45 text-paper", ring: "stroke-ink/45", dot: "bg-ink/45" },
  ];

  const quick = [
    {
      title: "Maak jouw bruiloftsuitnodiging",
      text: "Configureer helemaal naar jouw smaak",
      icon: PenIcon,
      href: "/uitnodiging",
    },
    {
      title: "Gastenlijst beheren",
      text: "Voeg gasten toe en maak groepen",
      icon: UsersIcon,
      href: "/gasten",
    },
    {
      title: "Uitnodigingen versturen",
      text: "Stuur via mail, link of WhatsApp",
      icon: SendIcon,
      href: hasPaid ? "/versturen" : undefined,
      lockedLabel: "Na aankoop",
    },
  ];

  return (
    <div className="space-y-8">
      <PageHeader
        greetingText={`${greeting()}, ${firstName(name)}`}
        title="Welkom terug"
        initials={coupleInitials(name, profile?.partner_name)}
      />

      {sp.betaald && hasPaid && (
        <p role="status" className="rounded-2xl bg-sage px-5 py-4 text-sm text-forest">
          Bedankt! Je betaling is gelukt. Je kunt nu je uitnodigingen versturen.
        </p>
      )}

      <div className="grid gap-8 lg:grid-cols-[1.25fr_1fr] 2xl:grid-cols-[1.6fr_1fr] 2xl:gap-12">
        <div className="space-y-8">
          {/* RSVP-overzicht */}
          <section className="relative overflow-hidden rounded-[1.5rem] bg-sage p-5 text-ink shadow-[0_18px_40px_-26px_rgb(90_65_54/0.45)] sm:p-6 xl:p-8">
            <div className="relative grid gap-5 sm:grid-cols-[minmax(0,17rem)_1fr] sm:gap-8">
              {/* Ringen zoals in het ontwerp: brede bogen die links en rechts buiten beeld lopen.
                  Bovenste ring Ja, middelste Nog niet, onderste Nee; elk toont zijn aandeel van alle gasten. */}
              <div className="relative flex min-h-[15rem] flex-col justify-center overflow-hidden rounded-[1.25rem] bg-paper py-6 text-center shadow-[0_10px_30px_-20px_rgb(90_65_54/0.5)]">
                <p className="font-serif text-[2.6rem] leading-none">{total}</p>
                <p className="mt-1.5 px-4 text-xs text-muted">Totaal uitgenodigde gasten</p>
                <svg viewBox="0 0 240 118" role="img" aria-label={`${yes} ja, ${pending} nog niet, ${no} nee, van ${total} gasten`} className="mt-3 block w-full">
                  {stats.map(({ label, value, ring }, i) => {
                    const R = 260 - i * 24;
                    const cy = 280;
                    const A = 40; // halve boog in graden
                    const rad = (deg: number) => (deg * Math.PI) / 180;
                    const x1 = 120 - R * Math.sin(rad(A));
                    const x2 = 120 + R * Math.sin(rad(A));
                    const y = cy - R * Math.cos(rad(A));
                    const d = `M ${x1} ${y} A ${R} ${R} 0 0 1 ${x2} ${y}`;
                    const visible = Math.asin(120 / R) * (180 / Math.PI); // deel van de boog dat in beeld is
                    const hidden = (A - visible) / (2 * A);
                    const share = total ? value / total : 0;
                    const len = hidden + share * 0.9 * ((visible * 2) / (2 * A)); // 0.9: einde blijft net in beeld
                    return (
                      <g key={label} fill="none" strokeWidth="12" strokeLinecap="round">
                        <path d={d} className="stroke-line" />
                        {share > 0 && (
                          <path
                            d={d}
                            pathLength={100}
                            strokeDasharray="100"
                            className={`${ring} ring-in`}
                            style={{ strokeDashoffset: 100 - len * 100, animationDelay: `${i * 120}ms` }}
                          />
                        )}
                      </g>
                    );
                  })}
                </svg>
                <ul className="mt-1 flex flex-wrap justify-center gap-x-4 gap-y-1 px-3 text-xs">
                  {stats.map(({ label, value, dot }) => (
                    <li key={label} className="flex items-center gap-1.5">
                      <span className={`size-2.5 rounded-full ${dot}`} />
                      <span className="text-ink/75">{label}</span>
                      <span className="text-sm font-semibold">{value}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex flex-col justify-center">
              <h2 className="eyebrow text-ink/80">RSVP-overzicht</h2>
              <p className="mt-1 mb-5 text-sm text-ink/75 sm:mb-6">
                Totaal uitgenodigde gasten: <span className="font-semibold text-ink">{total}</span>
              </p>
              <ul className="grid grid-cols-3 gap-3 sm:mt-0 sm:grid-cols-1 sm:gap-5">
                {stats.map(({ label, value, hint, icon: Icon, tone }) => (
                  <li key={label} className="sm:flex sm:items-center sm:gap-4">
                    <p className="grid h-16 w-full place-items-center rounded-2xl bg-paper font-serif text-[2.2rem] leading-none sm:order-2 sm:ml-auto sm:w-20">{value}</p>
                    <div className="mt-2 sm:mt-0">
                      <div className="flex items-center gap-2">
                        <span className={`grid size-6 place-items-center rounded-full ${tone}`}>
                          <Icon width={13} height={13} />
                        </span>
                        <span className="text-sm font-medium">{label}</span>
                      </div>
                      <p className="mt-0.5 text-xs text-ink/70 sm:pl-8">{hint}</p>
                    </div>
                  </li>
                ))}
              </ul>
              </div>
            </div>
          </section>

          {/* Snel starten */}
          <section>
            <h2 className="font-serif text-2xl font-medium">Snel starten</h2>
            <ul className="mt-4 grid gap-3 xl:grid-cols-2 2xl:grid-cols-3">
              {quick.map(({ title, text, icon: Icon, href, lockedLabel }) => {
                const inner = (
                  <>
                    <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-cream text-forest">
                      <Icon />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block font-medium">{title}</span>
                      <span className="block text-sm text-muted">{text}</span>
                    </span>
                    {href ? (
                      <ChevronRightIcon className="text-muted" />
                    ) : (
                      <span className="eyebrow shrink-0 rounded-full bg-cream px-2.5 py-1 text-[0.55rem] text-muted">
                        {lockedLabel ?? "Binnenkort"}
                      </span>
                    )}
                  </>
                );
                return (
                  <li key={title}>
                    {href ? (
                      <Link
                        href={href}
                        className="card flex items-center gap-4 p-4 transition hover:border-clay/40 hover:shadow-[0_8px_30px_-16px_rgb(31_36_32/0.3)]"
                      >
                        {inner}
                      </Link>
                    ) : (
                      <UpgradeTrigger className="card flex w-full cursor-pointer items-center gap-4 p-4 text-left transition hover:border-clay/40">
                        {inner}
                      </UpgradeTrigger>
                    )}
                  </li>
                );
              })}
            </ul>
          </section>
        </div>

        {/* To Do: een echt lijstje, bewust anders dan de kaarten bij Snel starten */}
        <section className="self-start overflow-hidden rounded-[1.5rem] border border-line bg-paper shadow-[0_10px_40px_-24px_rgb(31_36_32/0.35)]">
          <div className="border-b border-line bg-cream/70 px-5 pt-5 pb-4">
            <div className="flex items-center justify-between gap-3">
              <h2 className="font-serif text-2xl font-medium">To Do</h2>
              <span className="rounded-full bg-forest px-3 py-1 text-xs font-medium text-paper">
                {openCount} open
              </span>
            </div>
            <div
              className="mt-3 h-1.5 overflow-hidden rounded-full bg-line"
              role="progressbar"
              aria-valuenow={todoPct}
              aria-valuemin={0}
              aria-valuemax={100}
            >
              <div className="h-full rounded-full bg-forest" style={{ width: `${todoPct}%` }} />
            </div>
            <p className="mt-2 text-xs text-muted">
              {doneCount} van {todoTotal} afgevinkt
            </p>
          </div>

          {todos && todos.length > 0 ? (
            <ul>
              {todos.slice(0, 8).map((t) => (
                <TodoItem key={t.id} id={t.id} title={t.title} dueDate={t.due_date} done={t.done} />
              ))}
            </ul>
          ) : (
            <div className="flex flex-col items-center px-6 py-10 text-center">
              <Sparkle className="text-clay" />
              <p className="mt-3 font-serif text-xl">Alles is afgevinkt</p>
              <p className="mt-1 text-sm text-muted">Geniet even van het moment.</p>
            </div>
          )}

          <Link
            href="/todo"
            className="flex items-center justify-between border-t border-line bg-cream/70 px-5 py-3 text-sm font-medium text-forest transition hover:bg-sage/50"
          >
            Hele lijst bekijken{todoTotal > 8 ? ` (${todoTotal - 8} meer)` : ""}
            <ChevronRightIcon width={16} height={16} />
          </Link>
        </section>
      </div>
    </div>
  );
}
