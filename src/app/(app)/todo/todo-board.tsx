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
    <li className={`card flex items-center gap-3 p-4 transition ${pending ? "opacity-70" : ""}`}>
      <button
        type="button"
        onClick={onToggle}
        aria-pressed={optimisticDone}
        aria-label={optimisticDone ? `${todo.title} weer openzetten` : `${todo.title} afvinken`}
        className="grid size-8 shrink-0 place-items-center"
      >
        <span
          className={`grid size-7 place-items-center rounded-full border transition ${
            optimisticDone
              ? "border-forest bg-forest text-paper"
              : "border-line bg-cream text-muted/60 hover:border-forest/40"
          }`}
        >
          <CheckIcon width={14} height={14} />
        </span>
      </button>

      <div className="min-w-0 flex-1">
        <p
          className={`truncate font-medium ${
            optimisticDone ? "text-muted line-through decoration-clay/60" : ""
          }`}
        >
          {todo.title}
        </p>
        <p className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted">
          <span>{optimisticDone ? "Afgerond" : dueLabel(todo.dueDate)}</span>
          {todo.assignee && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-blush/70 px-2.5 py-0.5 text-xs font-medium text-clay">
              <UserIcon width={12} height={12} />
              {todo.assignee}
            </span>
          )}
          {todo.system && (
            <span className="eyebrow rounded-full bg-cream px-2.5 py-0.5 text-[0.55rem] text-muted">
              Automatisch
            </span>
          )}
        </p>
      </div>

      {!todo.system && (
        <button
          type="button"
          onClick={onDelete}
          disabled={pending}
          aria-label={`${todo.title} verwijderen`}
          className="grid size-9 shrink-0 place-items-center rounded-full text-muted transition hover:bg-blush/60 hover:text-clay"
        >
          <TrashIcon width={16} height={16} />
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

  useEffect(() => {
    if (state.saved > 0 && !state.error) formRef.current?.reset();
  }, [state.saved, state.error]);

  const open = todos.filter((t) => !t.done);
  const done = todos
    .filter((t) => t.done)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  return (
    <>
      {/* Nieuwe to-do */}
      <section>
        <h2 className="font-serif text-2xl font-medium">Nieuwe to-do</h2>
        <form ref={formRef} action={formAction} className="card mt-4 space-y-3 p-4 sm:p-5">
          <div>
            <label htmlFor="todo-title" className="eyebrow mb-1.5 block text-muted">
              Wat moet er gebeuren?
            </label>
            <input
              id="todo-title"
              name="title"
              required
              maxLength={160}
              placeholder="Bijvoorbeeld: Fotograaf boeken"
              className="field"
            />
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label htmlFor="todo-assignee" className="eyebrow mb-1.5 block text-muted">
                Wie pakt het op?
              </label>
              <input
                id="todo-assignee"
                name="assignee"
                maxLength={80}
                placeholder="Naam (optioneel)"
                className="field"
              />
            </div>
            <div>
              <label htmlFor="todo-due" className="eyebrow mb-1.5 block text-muted">
                Deadline
              </label>
              <input id="todo-due" name="due_date" type="date" className="field" />
            </div>
          </div>

          {state.error && (
            <p role="alert" className="rounded-xl bg-blush/60 px-4 py-2.5 text-sm text-clay">
              {state.error}
            </p>
          )}

          <button type="submit" disabled={adding} className="btn-primary sm:w-auto sm:px-7">
            <PlusIcon width={18} height={18} />
            {adding ? "Toevoegen…" : "To-do toevoegen"}
          </button>
        </form>
      </section>

      {/* Open */}
      <section>
        <div className="flex items-baseline justify-between">
          <h2 className="font-serif text-2xl font-medium">Te doen</h2>
          <span className="text-sm text-muted">{open.length} open</span>
        </div>

        {open.length > 0 ? (
          <ul className="mt-4 grid items-start gap-3 xl:grid-cols-2">
            {open.map((t) => (
              <TodoRow key={t.id} todo={t} />
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

      {/* Afgevinkt */}
      {done.length > 0 && (
        <section>
          <button
            type="button"
            onClick={() => setShowDone((v) => !v)}
            aria-expanded={showDone}
            className="flex w-full items-baseline justify-between text-left"
          >
            <h2 className="font-serif text-2xl font-medium">Afgevinkt</h2>
            <span className="flex items-center gap-2 text-sm text-muted">
              {done.length}
              <ChevronDownIcon
                width={16}
                height={16}
                className={`transition ${showDone ? "rotate-180" : ""}`}
              />
            </span>
          </button>

          {showDone && (
            <ul className="mt-4 grid items-start gap-3 xl:grid-cols-2">
              {done.map((t) => (
                <TodoRow key={t.id} todo={t} />
              ))}
            </ul>
          )}
        </section>
      )}
    </>
  );
}
