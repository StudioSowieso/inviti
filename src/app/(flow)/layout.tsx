import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

// Eigen flow zonder dashboard-navigatie: schermvullend en gefocust.
export default async function FlowLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/inloggen");

  return <div className="min-h-dvh">{children}</div>;
}
