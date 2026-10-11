"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { createVariant, deleteVariant, renameVariant } from "./actions";

export type VariantItem = { id: string; name: string; guestCount: number };

/** Wisselen tussen de uitnodigingen per groep (Dag-gasten, Avond-gasten, ...). Groepen zijn die uit de gastenlijst. */
export function VariantSwitcher({
  variants,
  activeId,
  onOpen,
}: {
  variants: VariantItem[];
  activeId: string;
  onOpen: (id: string) => void;
}) {
  const router = useRouter();
  const [mode, setMode] = useState<"idle" | "rename" | "new">("idle");
  const [value, setValue] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, startTransition] = useTransition();

  const active = variants.find((v) => v.id === activeId);
  const canDelete = !!active && active.guestCount === 0 && variants.length > 1;

  function begin(next: "rename" | "new") {
    setMode(next);
    setValue(next === "rename" ? (active?.name ?? "") : "");
    setError(null);
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    startTransition(async () => {
      const res = mode === "new" ? await createVariant(value, activeId) : await renameVariant(activeId, value);
      if (!res.ok) return setError(res.error);
      setMode("idle");
      if (mode === "new" && res.id) onOpen(res.id);
      else router.refresh();
    });
  }

  function remove() {
    startTransition(async () => {
      const res = await deleteVariant(activeId);
      if (!res.ok) return setError(res.error);
      router.push("/uitnodiging?tab=blokken");
    });
  }

  return (
    <div className="rounded-2xl border border-line bg-cream/60 p-4">
      <p className="eyebrow text-clay">Uitnodiging voor</p>
      <div className="mt-3 flex flex-wrap gap-2" role="group" aria-label="Uitnodiging voor groep">
        {variants.map((v) => (
          <button
            key={v.id}
            type="button"
            aria-pressed={v.id === activeId}
            onClick={() => onOpen(v.id)}
            className={`rounded-full px-4 py-2 text-sm transition ${
              v.id === activeId ? "bg-forest text-paper" : "border border-line bg-paper text-ink/80 hover:border-clay/50"
            }`}
          >
            {v.name} <span className="opacity-60">· {v.guestCount}</span>
          </button>
        ))}
        <button
          type="button"
          onClick={() => begin("new")}
          className="rounded-full border border-dashed border-clay/60 px-4 py-2 text-sm text-clay transition hover:bg-blush/50"
        >
          + Nieuwe groep
        </button>
      </div>

      {mode === "idle" ? (
        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
          <button type="button" onClick={() => begin("rename")} className="text-ink/70 underline-offset-4 hover:underline">
            Naam wijzigen
          </button>
          {canDelete && (
            <button type="button" onClick={remove} disabled={busy} className="text-ink/70 underline-offset-4 hover:underline">
              Verwijderen
            </button>
          )}
          <span className="text-xs text-muted">Namen zijn gelijk aan de groepen in de gastenlijst.</span>
        </div>
      ) : (
        <form onSubmit={submit} className="mt-3 flex flex-wrap items-center gap-2">
          <input
            autoFocus
            value={value}
            onChange={(e) => setValue(e.target.value)}
            maxLength={60}
            placeholder={mode === "new" ? "Naam van de nieuwe groep" : "Naam van de groep"}
            aria-label="Naam van de groep"
            className="field min-w-0 flex-1"
          />
          <button type="submit" disabled={busy || !value.trim()} className="btn-primary">
            {mode === "new" ? "Aanmaken" : "Opslaan"}
          </button>
          <button type="button" onClick={() => setMode("idle")} className="text-sm text-ink/70 underline-offset-4 hover:underline">
            Annuleren
          </button>
        </form>
      )}
      {error && (
        <p role="alert" className="mt-2 text-sm text-clay">
          {error}
        </p>
      )}
    </div>
  );
}
