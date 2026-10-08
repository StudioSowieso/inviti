import type { Metadata } from "next";
import { PageHeader } from "@/components/page-header";
import { firstName, greeting, initials } from "@/lib/format";
import { createClient } from "@/lib/supabase/server";
import { TodoBoard, type Todo } from "./todo-board";

export const metadata: Metadata = { title: "To do — Inviti" };

export default async function TodoPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const [{ data: profile }, { data: rows }] = await Promise.all([
    supabase.from("profiles").select("full_name").eq("id", user!.id).maybeSingle(),
    supabase
      .from("todos")
      .select("id, title, due_date, assignee, done, system_key, created_at")
      .order("due_date", { ascending: true, nullsFirst: false })
      .order("created_at", { ascending: true }),
  ]);

  const name = profile?.full_name ?? user?.user_metadata?.full_name ?? "";

  const todos: Todo[] = (rows ?? []).map((r) => ({
    id: r.id as string,
    title: r.title as string,
    dueDate: r.due_date as string | null,
    assignee: r.assignee as string | null,
    done: r.done as boolean,
    system: !!r.system_key,
    createdAt: r.created_at as string,
  }));

  return (
    <div className="space-y-7">
      <PageHeader
        greetingText={`${greeting()}, ${firstName(name)}`}
        title="To do lijst"
        initials={initials(name)}
      />
      <TodoBoard todos={todos} />
    </div>
  );
}
