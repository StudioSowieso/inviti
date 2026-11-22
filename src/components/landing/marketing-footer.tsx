import Link from "next/link";
import { Logo } from "@/components/logo";
import { COMPANY } from "@/lib/company";

const COLUMNS = [
  {
    title: "Proost Mee",
    links: [
      { href: "/zo-werkt-het", label: "Zo werkt het" },
      { href: "/themas", label: "Thema's" },
      { href: "/prijzen", label: "Prijzen" },
    ],
  },
  {
    title: "Account",
    links: [
      { href: "/account-aanmaken", label: "Aan de slag" },
      { href: "/inloggen", label: "Inloggen" },
    ],
  },
  {
    title: "Juridisch",
    links: [
      { href: "/voorwaarden", label: "Algemene voorwaarden" },
      { href: "/privacy", label: "Privacyverklaring" },
    ],
  },
];

export function MarketingFooter({ brand = "classic" }: { brand?: "classic" | "wine" }) {
  return (
    <footer className="bg-forest text-paper/80">
      <div className="mx-auto grid max-w-6xl gap-12 px-6 py-14 sm:grid-cols-[1.4fr_1fr_1fr_1fr] lg:px-10">
        <div>
          <Logo className="w-44 text-paper" />
          <p className="mt-5 max-w-xs text-sm leading-relaxed">
            Digitale bruiloftsuitnodigingen en RSVP, mooi geregeld op één plek.
          </p>
        </div>
        {COLUMNS.map((c) => (
          <nav key={c.title} aria-label={c.title}>
            <p className="font-serif text-xl font-medium text-paper">{c.title}</p>
            <ul className="mt-4 space-y-2.5 text-sm">
              {c.links.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="underline-offset-4 hover:text-paper hover:underline">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>
      <div className="mx-auto max-w-6xl space-y-2 border-t border-paper/15 px-6 py-6 text-sm lg:px-10">
        <p>© {new Date().getFullYear()} {COMPANY.tradeName}. Jullie dag, mooi geregeld.</p>
        <p className="text-paper/60">
          {COMPANY.tradeName} is een handelsnaam van {COMPANY.legalName} · KvK {COMPANY.kvk} · btw {COMPANY.vat} ·{" "}
          {COMPANY.street}, {COMPANY.postalCode} {COMPANY.city} ·{" "}
          <a href={`mailto:${COMPANY.email}`} className="underline underline-offset-4 hover:text-paper">
            {COMPANY.email}
          </a>
        </p>
      </div>
    </footer>
  );
}
