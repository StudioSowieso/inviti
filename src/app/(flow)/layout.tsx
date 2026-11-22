import type { CSSProperties } from "react";
import { redirect } from "next/navigation";
import { TRIAL_BANNER_HEIGHT, TrialBanner } from "@/components/trial-banner";
import { getHasPaid } from "@/lib/billing";
import { getUser } from "@/lib/supabase/server";

// Eigen flow zonder dashboard-navigatie: schermvullend en gefocust.
export default async function FlowLayout({ children }: { children: React.ReactNode }) {
  const user = await getUser();
  if (!user) redirect("/inloggen");
  const hasPaid = await getHasPaid();

  return (
    <div className="brand-back min-h-dvh" style={{ "--banner-h": hasPaid ? "0px" : TRIAL_BANNER_HEIGHT } as CSSProperties}>
      {!hasPaid && <TrialBanner />}
      {children}
    </div>
  );
}
