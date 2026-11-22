import { PRICE_LABEL } from "@/lib/stripe";
import { redirect } from "next/navigation";
import type { CSSProperties } from "react";
import { SideNav } from "@/components/side-nav";
import { getIsAdmin } from "@/lib/admin";
import { getHasPaid } from "@/lib/billing";
import { TRIAL_BANNER_HEIGHT, TrialBanner } from "@/components/trial-banner";
import { ClinkLoader } from "@/components/clink-loader";
import { getUser } from "@/lib/supabase/server";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const user = await getUser();
  if (!user) redirect("/inloggen");
  const [isAdmin, hasPaid] = await Promise.all([getIsAdmin(), getHasPaid()]);

  return (
    <div className="brand-back min-h-dvh" style={{ "--banner-h": hasPaid ? "0px" : TRIAL_BANNER_HEIGHT } as CSSProperties}>
      <ClinkLoader name="app" />
      {!hasPaid && <TrialBanner price={PRICE_LABEL} />}
      <div className="mx-auto flex w-full max-w-[100rem] gap-6 px-4 py-4 sm:px-6 lg:gap-8 lg:px-8 2xl:px-12">
        <SideNav isAdmin={isAdmin} hasPaid={hasPaid} />
        <div className="min-w-0 flex-1 pb-10">{children}</div>
      </div>
    </div>
  );
}
