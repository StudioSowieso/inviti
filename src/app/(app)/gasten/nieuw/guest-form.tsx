"use client";

import Link from "next/link";
import { useActionState } from "react";
import { addGuest, type GuestFormState } from "../../actions";

const initialState: GuestFormState = { error: null };

function Field({
  label,
  name,
  placeholder,
  type = "text",
  required,
  autoComplete,
  list,
  hint,
}: {
  label: string;
  name: string;
  placeholder: string;
  type?: string;
  required?: boolean;
  autoComplete?: string;
  list?: string;
  hint?: string;
}) {
  return (
    <div>
      <label htmlFor={name} className="mb-2 flex items-baseline justify-between text-sm font-medium">
        {label}
        {hint && <span className="text-xs font-normal text-muted">{hint}</span>}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        autoComplete={autoComplete}
        list={list}
        className="field"
      />
    </div>
  );
}

export function GuestForm({ groups }: { groups: string[] }) {
  const [state, formAction, pending] = useActionState(addGuest, initialState);

  return (
    <form action={formAction} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Voornaam" name="first_name" placeholder="Jasmijn" required autoComplete="off" />
        <Field label="Achternaam" name="last_name" placeholder="Smit" autoComplete="off" />
      </div>
      <Field label="E-mailadres" name="email" type="email" placeholder="jasmijn@voorbeeld.nl" autoComplete="off" />
      <Field label="Mobiel nummer" name="phone" type="tel" placeholder="06 12345678" autoComplete="off" />
      <Field label="Introducée" name="plus_one_name" placeholder="Joost" hint="Optioneel" />
      <div>
        <Field
          label="Gasten groep"
          name="group"
          placeholder="Avondgasten"
          list="group-options"
          hint={groups.length ? "Kies of typ een nieuwe" : "Typ een groepsnaam"}
        />
        <datalist id="group-options">
          {groups.map((g) => (
            <option key={g} value={g} />
          ))}
        </datalist>
      </div>
      <Field label="Dieetwensen" name="dietary" placeholder="Geen" />

      {state.error && (
        <p role="alert" className="rounded-xl bg-blush px-4 py-3 text-sm text-[#7a3f2c]">
          {state.error}
        </p>
      )}

      <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row">
        <Link
          href="/gasten"
          className="inline-flex flex-1 items-center justify-center rounded-full border border-line bg-paper px-6 py-3.5 font-medium hover:bg-cream"
        >
          Annuleren
        </Link>
        <button type="submit" className="btn-primary flex-1" disabled={pending}>
          {pending ? "Opslaan…" : "Gast opslaan"}
        </button>
      </div>
    </form>
  );
}
