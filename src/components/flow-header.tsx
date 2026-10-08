import Link from "next/link";
import type { ReactNode } from "react";
import { ChevronLeftIcon, Sparkle } from "./icons";

export function FlowHeader({ title, backHref = "/dashboard", children }: { title: string; backHref?: string; children?: ReactNode }) {
  return (
    <header className="sticky top-0 z-30 border-b border-line bg-cream/90 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-[90rem] items-center gap-3 px-4 sm:px-6 lg:px-8">
        <Link
          href={backHref}
          className="inline-flex items-center gap-1.5 rounded-full border border-line bg-paper py-2 pr-4 pl-2.5 text-sm font-medium hover:bg-sage/60"
        >
          <ChevronLeftIcon width={18} height={18} />
          <span className="hidden sm:inline">Dashboard</span>
          <span className="sm:hidden">Terug</span>
        </Link>
        <div className="flex min-w-0 flex-1 items-center gap-2.5 pl-1">
          <span className="hidden items-center gap-1.5 font-serif text-xl sm:flex">
            Inviti <Sparkle className="text-clay" width={8} height={8} />
          </span>
          <span className="hidden h-5 w-px bg-line sm:block" />
          <h1 className="truncate font-serif text-xl font-medium">{title}</h1>
        </div>
        {children}
      </div>
    </header>
  );
}
