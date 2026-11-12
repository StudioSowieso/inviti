import { redirect } from "next/navigation";
import { SideNav } from "@/components/side-nav";
import { getIsAdmin } from "@/lib/admin";
import { getHasPaid } from "@/lib/billing";
import { getUser } from "@/lib/supabase/server";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const user = await getUser();
  if (!user) redirect("/inloggen");
  const [isAdmin, hasPaid] = await Promise.all([getIsAdmin(), getHasPaid()]);

  return (
    <div className="mx-auto flex w-full max-w-[100rem] gap-6 px-4 py-4 sm:px-6 lg:gap-8 lg:px-8 2xl:px-12">
      <SideNav isAdmin={isAdmin} hasPaid={hasPaid} />
      <div className="min-w-0 flex-1 pb-10">{children}</div>
    </div>
  );
}
