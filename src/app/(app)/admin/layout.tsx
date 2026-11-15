import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getIsAdmin } from "@/lib/admin";

export const metadata: Metadata = { title: "Admin — Proost Mee", robots: { index: false } };
export const dynamic = "force-dynamic";

const TABS = [
  { href: "/admin", label: "Overzicht" },
  { href: "/admin/gebruikers", label: "Gebruikers" },
  { href: "/admin/fouten", label: "Fouten" },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  // Geen admin? Dan doet de pagina alsof hij niet bestaat.
  if (!(await getIsAdmin())) notFound();

  return (
    <div>
      <header className="flex flex-wrap items-center gap-x-6 gap-y-3">
        <h1 className="font-serif text-[1.75rem] leading-tight font-medium">Admin</h1>
        <nav className="flex gap-1.5 text-sm">
          {TABS.map((t) => (
            <Link
              key={t.href}
              href={t.href}
              className="rounded-full border border-line bg-paper px-4 py-2 hover:bg-cream"
            >
              {t.label}
            </Link>
          ))}
        </nav>
      </header>
      <div className="mt-6">{children}</div>
    </div>
  );
}
