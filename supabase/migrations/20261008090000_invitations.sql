-- Uitnodiging per gebruiker (één bruiloft = één uitnodiging).
-- `config` bevat namen, datum, blokken en teksten; `theme_slug` verwijst naar een thema in Sanity.
create table public.invitations (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  theme_slug text not null,
  config jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint invitations_owner_unique unique (owner_id)
);

alter table public.invitations enable row level security;

create policy "own invitations" on public.invitations
  for all to authenticated
  using (owner_id = (select auth.uid()))
  with check (owner_id = (select auth.uid()));

create or replace function public.invitations_set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger invitations_set_updated_at
  before update on public.invitations
  for each row execute function public.invitations_set_updated_at();
