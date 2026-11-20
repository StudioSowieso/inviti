import { PageIntro } from "@/components/landing/bits";
import { MarketingShell } from "@/components/landing/marketing-shell";
import { LEGAL_UPDATED } from "@/lib/company";

/** Gedeelde opmaak van de juridische pagina's (voorwaarden, privacy). */
export function LegalPage({
  eyebrow,
  title,
  intro,
  children,
}: {
  eyebrow: string;
  title: string;
  intro: string;
  children: React.ReactNode;
}) {
  return (
    <MarketingShell>
      <PageIntro eyebrow={eyebrow} title={title}>
        {intro}
      </PageIntro>
      <section className="mx-auto max-w-3xl px-6 pb-28 lg:px-10 lg:pb-40">
        <p className="text-sm text-muted">Laatst bijgewerkt: {LEGAL_UPDATED}</p>
        <div className="mt-8 space-y-10 text-[0.95rem] leading-relaxed text-ink/80">{children}</div>
      </section>
    </MarketingShell>
  );
}

export function LegalSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="font-serif text-3xl font-medium text-ink">{title}</h2>
      <div className="mt-3 space-y-3">{children}</div>
    </section>
  );
}

export function LegalList({ children }: { children: React.ReactNode }) {
  return <ul className="list-disc space-y-1.5 pl-5">{children}</ul>;
}

export function MailLink({ email }: { email: string }) {
  return (
    <a href={`mailto:${email}`} className="text-forest underline underline-offset-4">
      {email}
    </a>
  );
}
