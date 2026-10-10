import { redirect } from "next/navigation";
import { getUser } from "@/lib/supabase/server";

// Eigen flow zonder dashboard-navigatie: schermvullend en gefocust.
export default async function FlowLayout({ children }: { children: React.ReactNode }) {
  const user = await getUser();
  if (!user) redirect("/inloggen");

  return <div className="min-h-dvh">{children}</div>;
}
