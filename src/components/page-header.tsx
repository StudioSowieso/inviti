import Link from "next/link";
import { signOut } from "@/app/(app)/actions";
import { ChevronLeftIcon, LogOutIcon, SettingsIcon } from "./icons";

export function PageHeader({
  greetingText,
  title,
  initials,
  backHref,
}: {
  greetingText: string;
  title: string;
  initials: string;
  backHref?: string;
}) {
  return (
    <header className="flex items-center gap-3.5">
      {backHref ? (
        <Link
          href={backHref}
          aria-label="Terug"
          className="grid size-12 shrink-0 place-items-center rounded-full border border-line bg-paper text-ink hover:bg-sage/60"
        >
          <ChevronLeftIcon />
        </Link>
      ) : (
        <div className="grid size-12 shrink-0 place-items-center rounded-full bg-blush font-serif text-lg font-semibold text-clay">
          {initials}
        </div>
      )}

      <div className="min-w-0 flex-1">
        <p className="truncate text-[0.8rem] text-muted">{greetingText}</p>
        <h1 className="truncate font-serif text-[1.75rem] leading-tight font-medium">{title}</h1>
      </div>

      <details className="relative">
        <summary
          aria-label="Instellingen"
          className="grid size-11 cursor-pointer list-none place-items-center rounded-full border border-line bg-paper text-ink hover:bg-sage/60"
        >
          <SettingsIcon width={19} height={19} />
        </summary>
        <div className="absolute right-0 z-20 mt-2 w-52 overflow-hidden rounded-2xl border border-line bg-paper py-1.5 shadow-[0_12px_40px_-12px_rgb(31_36_32/0.25)]">
          <Link href="/dashboard" className="block px-4 py-2.5 text-sm hover:bg-cream">
            Dashboard
          </Link>
          <Link href="/gasten" className="block px-4 py-2.5 text-sm hover:bg-cream">
            Gastenlijst
          </Link>
          <Link href="/todo" className="block px-4 py-2.5 text-sm hover:bg-cream">
            To do lijst
          </Link>
          <Link href="/instellingen" className="block px-4 py-2.5 text-sm hover:bg-cream">
            Account
          </Link>
          <form action={signOut} className="border-t border-line">
            <button
              type="submit"
              className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm text-clay hover:bg-cream"
            >
              <LogOutIcon width={16} height={16} /> Uitloggen
            </button>
          </form>
        </div>
      </details>
    </header>
  );
}
