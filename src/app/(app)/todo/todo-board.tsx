"use client";

import { useActionState, useEffect, useOptimistic, useRef, useState, useTransition } from "react";
import { CheckIcon, ChevronDownIcon, PlusIcon, Sparkle, TrashIcon, UserIcon } from "@/components/icons";
import { dueLabel } from "@/lib/format";
import { addTodo, deleteTodo, toggleTodo, type TodoFormState } from "../actions";

export type Todo = {
  id: string;
  title: string;
  dueDate: string | null;
  assignee: string | null;
  done: boolean;
  system: boolean;
  createdAt: string;
};

/** Eén regel van het lijstje: vakje om af te vinken, de tekst en rechts wie het doet en de deadline. */
function TodoRow({ todo }: { todo: Todo }) {
  const [optimisticDone, setOptimisticDone] = useOptimistic(todo.done);
  const [pending, startTransition] = useTransition();

  function onToggle() {
    startTransition(async () => {
      setOptimisticDone(!optimisticDone);
      await toggleTodo(todo.id, !optimisticDone);
    });
  }

  function onDelete() {
    if (!window.confirm(`“${todo.title}” verwijderen?`)) return;
    startTransition(async () => {
      await deleteTodo(todo.id);
    });
  }

  return (
    <li className={`group flex items-start gap-3.5 border-b border-line/80 px-4 py-3.5 transition last:border-b-0 sm:px-6 ${pending ? "opacity-60" : ""}`}>
      <button
        type="button"
        onClick={onToggle}
        aria-pressed={optimisticDone}
        aria-label={optimisticDone ? `${todo.title} weer openzetten` : `${todo.title} afvinken`}
        className="mt-0.5 shrink-0"
      >
        <span
          className={`grid size-6 place-items-center rounded-md border-2 transition ${
            optimisticDone
              ? "border-forest bg-forest text-paper"
              : "border-muted/40 bg-paper text-transparent group-hover:border-forest hover:text-forest/40"
          }`}
        >
          <CheckIcon width={15} height={15} strokeWidth={3} />
        </span>
      </button>

      <div className="min-w-0 flex-1">
        <p
          className={`leading-snug font-medium break-words transition ${
            optimisticDone ? "text-muted line-through decoration-forest/50 decoration-2" : ""
          }`}
        >
          {todo.title}
        </p>
        <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted">
          <span>{optimisticDone ? "Afgerond" : dueLabel(todo.dueDate)}</span>
          {todo.assignee && (
            <span className="inline-flex items-center gap-1 rounded-full bg-blush/70 px-2 py-0.5 font-medium text-clay">
              <UserIcon width={11} height={11} />
              {todo.assignee}
            </span>
          )}
          {todo.system && (
            <span className="eyebrow rounded-full bg-cream px-2 py-0.5 text-[0.55rem] text-muted">Automatisch</span>
          )}
        </p>
      </div>

      {!todo.system && (
        <button
          type="button"
          onClick={onDelete}
          disabled={pending}
          aria-label={`${todo.title} verwijderen`}
          className="grid size-8 shrink-0 place-items-center rounded-full text-muted/60 transition hover:bg-blush/60 hover:text-clay sm:opacity-0 sm:group-hover:opacity-100 sm:focus-visible:opacity-100"
        >
          <TrashIcon width={15} height={15} />
        </button>
      )}
    </li>
  );
}

export function TodoBoard({ todos }: { todos: Todo[] }) {
  const [state, formAction, adding] = useActionState<TodoFormState, FormData>(addTodo, {
    error: null,
    saved: 0,
  });
  const formRef = useRef<HTMLFormElement>(null);
  const [showDone, setShowDone] = useState(true);
  const [more, setMore] = useState(false);

  useEffect(() => {
    if (state.saved > 0 && !state.error) {
      formRef.current?.reset();
      formRef.current?.querySelector<HTMLInputElement>("input[name=title]")?.focus();
    }
  }, [state.saved, state.error]);

  const open = todos.filter((t) => !t.done);
  const done = todos.filter((t) => t.done).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  const pct = todos.length ? Math.round((done.length / todos.length) * 100) : 0;

  return (
    <section className="card overflow-hidden">
      {/* Kop met voortgang */}
      <div className="border-b border-line bg-cream/60 px-4 py-5 sm:px-6">
        <div className="flex items-baseline justify-between gap-3">
          <h2 className="font-serif text-2xl font-medium">Onze to-do lijst</h2>
          <span className="text-sm text-muted">
            {done.length} van {todos.length} afgevinkt
          </span>
        </div>
        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-line" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
          <div className="h-full rounded-full bg-forest transition-all duration-500" style={{ width: `${pct}%` }} />
        </div>
      </div>

      {/* Nieuwe regel onderaan de kop: typ en druk op enter */}
      <form ref={formRef} action={formAction} className="border-b border-line px-4 py-3 sm:px-6">
        <div className="flex items-center gap-3">
          <span className="grid size-6 shrink-0 place-items-center rounded-md border-2 border-dashed border-muted/40 text-muted/60">
            <PlusIcon width={14} height={14} />
          </span>
          <input
            name="title"
            required
            maxLength={160}
            aria-label="Nieuwe to-do"
            placeholder="Nieuwe to-do toevoegen, bijvoorbeeld: Fotograaf boeken"
            className="min-w-0 flex-1 bg-transparent py-1.5 outline-none placeholder:text-muted/70"
          />
          <button
            type="button"
            onClick={() => setMore((v) => !v)}
            aria-expanded={more}
            className="hidden items-center gap-1 rounded-full px-3 py-1.5 text-xs text-muted hover:bg-cream sm:flex"
          >
            Wie &amp; wanneer
            <ChevronDownIcon width={13} height={13} className={`transition ${more ? "rotate-180" : ""}`} />
          </button>
          <button type="submit" disabled={adding} className="rounded-full bg-forest px-4 py-2 text-sm font-medium text-paper transition hover:bg-forest-deep disabled:opacity-60">
            {adding ? "…" : "Toevoegen"}
          </button>
        </div>

        <button
          type="button"
          onClick={() => setMore((v) => !v)}
          aria-expanded={more}
          className="mt-2 ml-9 flex items-center gap-1 text-xs text-muted sm:hidden"
        >
          Wie &amp; wanneer
          <ChevronDownIcon width={13} height={13} className={`transition ${more ? "rotate-180" : ""}`} />
        </button>

        <div className={`${more ? "mt-3 grid" : "hidden"} gap-3 sm:ml-9 sm:grid-cols-2`}>
          <input name="assignee" maxLength={80} aria-label="Wie pakt het op?" placeholder="Wie pakt het op? (optioneel)" className="field" />
          <input name="due_date" type="date" aria-label="Deadline" className="field" />
        </div>

        {state.error && (
          <p role="alert" className="mt-3 rounded-xl bg-blush/60 px-4 py-2.5 text-sm text-clay sm:ml-9">
            {state.error}
          </p>
        )}
      </form>

      {/* Het lijstje: eerst wat nog moet, dan wat af is */}
      {open.length > 0 ? (
        <ul>
          {open.map((t) => (
            <TodoRow key={t.id} todo={t} />
          ))}
        </ul>
      ) : (
        <div className="flex flex-col items-center px-6 py-10 text-center">
          <Sparkle className="text-clay" />
          <p className="mt-3 font-serif text-xl">Alles is afgevinkt</p>
          <p className="mt-1 text-sm text-muted">Geniet even van het moment.</p>
        </div>
      )}

      {done.length > 0 && (
        <>
          <button
            type="button"
            onClick={() => setShowDone((v) => !v)}
            aria-expanded={showDone}
            className="flex w-full items-center justify-between border-y border-line bg-cream/60 px-4 py-2.5 text-left text-sm text-muted sm:px-6"
          >
            <span className="eyebrow">Afgevinkt ({done.length})</span>
            <ChevronDownIcon width={16} height={16} className={`transition ${showDone ? "rotate-180" : ""}`} />
          </button>
          {showDone && (
            <ul>
              {done.map((t) => (
                <TodoRow key={t.id} todo={t} />
              ))}
            </ul>
          )}
        </>
      )}
    </section>
  );
}
