"use client";

import { useOptimistic, useTransition } from "react";
import { CheckIcon } from "@/components/icons";
import { dueLabel } from "@/lib/format";
import { toggleTodo } from "../actions";

/** Eén regel van het to-dolijstje op het dashboard: vierkant vakje om af te vinken. */
export function TodoItem({
  id,
  title,
  dueDate,
  done,
}: {
  id: string;
  title: string;
  dueDate: string | null;
  done: boolean;
}) {
  const [optimisticDone, setOptimisticDone] = useOptimistic(done);
  const [pending, startTransition] = useTransition();

  function onToggle() {
    startTransition(async () => {
      setOptimisticDone(!optimisticDone);
      await toggleTodo(id, !optimisticDone);
    });
  }

  return (
    <li className="border-b border-line/80 last:border-b-0">
      <button
        type="button"
        onClick={onToggle}
        aria-pressed={optimisticDone}
        className={`group flex w-full items-start gap-3.5 px-5 py-3.5 text-left transition hover:bg-cream/70 ${pending ? "opacity-60" : ""}`}
      >
        <span
          className={`mt-0.5 grid size-6 shrink-0 place-items-center rounded-md border-2 transition ${
            optimisticDone
              ? "border-forest bg-forest text-paper"
              : "border-muted/40 bg-paper text-transparent group-hover:border-forest group-hover:text-forest/40"
          }`}
        >
          <CheckIcon width={15} height={15} strokeWidth={3} />
        </span>
        <span className="min-w-0 flex-1">
          <span
            className={`block leading-snug font-medium transition ${
              optimisticDone ? "text-muted line-through decoration-forest/50 decoration-2" : ""
            }`}
          >
            {title}
          </span>
          <span className="mt-0.5 block text-xs text-muted">{optimisticDone ? "Afgerond" : dueLabel(dueDate)}</span>
        </span>
      </button>
    </li>
  );
}
