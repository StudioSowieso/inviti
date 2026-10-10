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
import { firstName, greeting, initials } from "@/lib/format";
import { createClient, getUser } from "@/lib/supabase/server";
import { TodoItem } from "./todo-item";

export const metadata: Metadata = { title: "Dashboard — Inviti" };

export default async function DashboardPage() {
  const [supabase, user] = await Promise.all([createClient(), getUser()]);

  const [{ data: profile }, { data: guests }, { data: todos }] = await Promise.all([
    supabase.from("profiles").select("full_name").eq("id", user!.id).maybeSingle(),
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

  const stats = [
    { label: "Ja", value: yes, hint: "gasten komen", icon: CheckIcon, tone: "bg-sage text-forest" },
    { label: "Nog niet", value: pending, hint: "wachten nog", icon: ClockIcon, tone: "bg-paper/15 text-paper" },
    { label: "Nee", value: no, hint: "komen niet", icon: XIcon, tone: "bg-blush text-clay" },
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
      href: null,
    },
  ];

  return (
    <div className="space-y-8">
      <PageHeader
        greetingText={`${greeting()}, ${firstName(name)}`}
        title="Welkom terug"
        initials={initials(name)}
      />

      <div className="grid gap-8 lg:grid-cols-[1.25fr_1fr] 2xl:grid-cols-[1.6fr_1fr] 2xl:gap-12">
        <div className="space-y-8">
          {/* RSVP-overzicht */}
          <section className="relative overflow-hidden rounded-[1.5rem] bg-forest p-5 text-paper sm:p-6 xl:p-8">
            <div
              className="pointer-events-none absolute -top-24 -right-16 size-64 rounded-full opacity-20"
              style={{ background: "radial-gradient(circle, #f1ded4 0%, transparent 65%)" }}
            />
            <div className="relative flex items-baseline justify-between">
              <h2 className="eyebrow text-paper/80">RSVP-overzicht</h2>
              <span className="text-sm font-medium text-paper/90">
                {total} {total === 1 ? "gast" : "gasten"}
              </span>
            </div>

            <div className="relative mt-6 grid grid-cols-3 gap-3">
              {stats.map(({ label, value, hint, icon: Icon, tone }) => (
                <div key={label}>
                  <div className="flex items-center gap-2">
                    <span className={`grid size-7 place-items-center rounded-full ${tone}`}>
                      <Icon width={15} height={15} />
                    </span>
                    <span className="text-sm font-medium">{label}</span>
                  </div>
                  <p className="mt-3 font-serif text-[2.6rem] leading-none">{value}</p>
                  <p className="mt-1 text-xs text-paper/55">{hint}</p>
                </div>
              ))}
            </div>

            {total > 0 && (
              <div className="relative mt-6 flex h-1.5 overflow-hidden rounded-full bg-paper/15">
                <span className="bg-sage" style={{ width: `${(yes / total) * 100}%` }} />
                <span className="bg-blush" style={{ width: `${(no / total) * 100}%` }} />
              </div>
            )}
          </section>

          {/* Snel starten */}
          <section>
            <h2 className="font-serif text-2xl font-medium">Snel starten</h2>
            <ul className="mt-4 grid gap-3 xl:grid-cols-2 2xl:grid-cols-3">
              {quick.map(({ title, text, icon: Icon, href }) => {
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
                        Binnenkort
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
                      <div className="card flex items-center gap-4 p-4 opacity-80">{inner}</div>
                    )}
                  </li>
                );
              })}
            </ul>
          </section>
        </div>

        {/* To Do */}
        <section>
          <div className="flex items-baseline justify-between">
            <h2 className="font-serif text-2xl font-medium">To Do</h2>
            <Link href="/todo" className="text-sm text-clay hover:underline">
              To Do lijst bewerken
            </Link>
          </div>

          {todos && todos.length > 0 ? (
            <ul className="mt-4 space-y-3">
              {todos.map((t) => (
                <TodoItem key={t.id} id={t.id} title={t.title} dueDate={t.due_date} done={t.done} />
              ))}
            </ul>
          ) : (
            <div className="card mt-4 flex flex-col items-center p-8 text-center">
              <Sparkle className="text-clay" />
              <p className="mt-3 font-serif text-xl">Alles is afgevinkt</p>
              <p className="mt-1 text-sm text-muted">Geniet even van het moment.</p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
