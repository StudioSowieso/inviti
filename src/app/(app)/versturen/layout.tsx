import { requirePaid } from "@/lib/billing";

export default async function SendLayout({ children }: { children: React.ReactNode }) {
  await requirePaid();
  return children;
}
