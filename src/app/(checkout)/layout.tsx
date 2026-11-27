import Link from "next/link";
import { redirect } from "next/navigation";
import { ClinkLoader } from "@/components/clink-loader";
import { Logo } from "@/components/logo";
import { getUser } from "@/lib/supabase/server";

/** Kale omgeving voor afrekenen: alleen het logo, zonder menu of bovenbalk, zodat de klant zich op betalen richt. */
export default async function CheckoutLayout({ children }: { children: React.ReactNode }) {
  const user = await getUser();
  if (!user) redirect("/inloggen");

  return (
    <div className="brand-back min-h-dvh">
      <ClinkLoader name="app" />
      <header className="flex justify-center px-4 pt-8 pb-2">
        <Link href="/" aria-label="Proost Mee, naar de startpagina" className="block text-forest">
          <Logo stacked className="w-28 sm:w-32" />
        </Link>
      </header>
      <main className="px-4 pb-12 sm:px-6">{children}</main>
    </div>
  );
}
