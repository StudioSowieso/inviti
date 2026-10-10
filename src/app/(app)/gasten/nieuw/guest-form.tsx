"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { addGuest, updateGuest, type GuestFormState } from "../../actions";

export type GuestDefaults = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  plusOne: string;
  group: string;
  dietary: string;
};

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
  defaultValue,
}: {
  label: string;
  name: string;
  placeholder: string;
  type?: string;
  required?: boolean;
  autoComplete?: string;
  list?: string;
  hint?: string;
  defaultValue?: string;
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
        defaultValue={defaultValue}
        className="field"
      />
    </div>
  );
}

const NEW = "__new__";

/** Kies een bestaande groep, geen groep, of maak een nieuwe aan. */
function GroupField({ groups, initial }: { groups: string[]; initial: string }) {
  const [choice, setChoice] = useState(initial === "" ? "" : groups.includes(initial) ? initial : NEW);
  const [newName, setNewName] = useState(initial !== "" && !groups.includes(initial) ? initial : "");
  const value = choice === NEW ? newName.trim() : choice;

  return (
    <div>
      <label htmlFor="group-choice" className="mb-2 flex items-baseline justify-between text-sm font-medium">
        Gasten groep
        <span className="text-xs font-normal text-muted">Optioneel</span>
      </label>
      <select id="group-choice" className="field" value={choice} onChange={(e) => setChoice(e.target.value)}>
        <option value="">Geen groep</option>
        {groups.map((g) => (
          <option key={g} value={g}>
            {g}
          </option>
        ))}
        <option value={NEW}>+ Nieuwe groep maken…</option>
      </select>
      {choice === NEW && (
        <input
          aria-label="Naam van de nieuwe groep"
          className="field mt-3"
          placeholder="Bijvoorbeeld Avondgasten"
          maxLength={60}
          autoFocus
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
        />
      )}
      <input type="hidden" name="group" value={value} />
    </div>
  );
}

export function GuestForm({ groups, guest }: { groups: string[]; guest?: GuestDefaults }) {
  const [state, formAction, pending] = useActionState(guest ? updateGuest.bind(null, guest.id) : addGuest, initialState);

  return (
    <form action={formAction} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Voornaam" name="first_name" defaultValue={guest?.firstName} placeholder="Jasmijn" required autoComplete="off" />
        <Field label="Achternaam" name="last_name" defaultValue={guest?.lastName} placeholder="Smit" autoComplete="off" />
      </div>
      <Field label="E-mailadres" name="email" defaultValue={guest?.email} type="email" placeholder="jasmijn@voorbeeld.nl" autoComplete="off" />
      <Field label="Mobiel nummer" name="phone" defaultValue={guest?.phone} type="tel" placeholder="06 12345678" autoComplete="off" />
      <Field label="Introducée" name="plus_one_name" defaultValue={guest?.plusOne} placeholder="Joost" hint="Optioneel" />
      <GroupField groups={groups} initial={guest?.group ?? ""} />
      <Field label="Dieetwensen" name="dietary" defaultValue={guest?.dietary} placeholder="Geen" />

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
          {pending ? "Opslaan…" : guest ? "Wijzigingen opslaan" : "Gast opslaan"}
        </button>
      </div>
    </form>
  );
}
