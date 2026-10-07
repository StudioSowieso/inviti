"use client";

import { useOptimistic, useTransition } from "react";
import { CheckIcon } from "@/components/icons";
import { dueLabel } from "@/lib/format";
import { toggleTodo } from "../actions";

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
  const [, startTransition] = useTransition();

  function onToggle() {
    startTransition(async () => {
      setOptimisticDone(!optimisticDone);
      await toggleTodo(id, !optimisticDone);
    });
  }

  return (
    <li>
      <button
        type="button"
        onClick={onToggle}
        aria-pressed={optimisticDone}
        className="card flex w-full items-center gap-4 p-4 text-left transition hover:border-clay/40"
      >
        <span
          className={`grid size-7 shrink-0 place-items-center rounded-full border transition ${
            optimisticDone
              ? "border-forest bg-forest text-paper"
              : "border-line bg-cream text-muted/60"
          }`}
        >
          <CheckIcon width={14} height={14} />
        </span>
        <span className="min-w-0 flex-1">
          <span
            className={`block font-medium ${optimisticDone ? "text-muted line-through decoration-clay/60" : ""}`}
          >
            {title}
          </span>
          <span className="block text-sm text-muted">
            {optimisticDone ? "Afgerond" : dueLabel(dueDate)}
          </span>
        </span>
      </button>
    </li>
  );
}
