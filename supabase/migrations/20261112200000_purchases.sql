-- Aankopen: wie heeft de volledige versie (Uitnodiging versturen) betaald?
--
-- Veiligheid: `purchases` is alleen leesbaar voor de eigenaar en heeft geen insert/update/delete-policies.
-- Alleen de server (service role, na een geverifieerde Stripe-betaling) schrijft hierin. Een gebruiker kan
-- zichzelf dus nooit "betaald" maken, ook niet via zijn eigen profiel of de API.

create table if not exists public.purchases (
  user_id uuid primary key references auth.users (id) on delete cascade,
  stripe_session_id text not null unique,
  stripe_payment_intent text,
  amount_total integer,
  currency text,
  paid_at timestamptz not null default now()
);
alter table public.purchases enable row level security;

create policy "eigen aankoop zien" on public.purchases
  for select to authenticated using (user_id = (select auth.uid()));

-- Heeft de ingelogde gebruiker toegang tot Versturen? (betaald, of admin)
create or replace function public.has_paid()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (select 1 from public.purchases p where p.user_id = (select auth.uid()))
      or exists (select 1 from public.admins a where a.user_id = (select auth.uid()));
$$;
revoke all on function public.has_paid() from public, anon;
grant execute on function public.has_paid() to authenticated;

-- Intern: heeft deze eigenaar toegang? Niet aanroepbaar via de API.
create or replace function public.owner_has_access(p_owner uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (select 1 from public.purchases p where p.user_id = p_owner)
      or exists (select 1 from public.admins a where a.user_id = p_owner);
$$;
revoke all on function public.owner_has_access(uuid) from public, anon, authenticated;

-- Uitnodigingslinks werken alleen voor betalende eigenaren.
create or replace function public.public_invitation(p_token text)
returns table (theme_slug text, config jsonb, guest_first_name text)
language sql
stable
security definer
set search_path = ''
as $$
  select t.theme_slug, t.config, t.guest_first_name from (
    select i.theme_slug, i.config, g.first_name as guest_first_name,
           (i.group_id is not distinct from g.group_id) as exact
    from public.guests g
    join public.invitations i on i.owner_id = g.owner_id
    where g.invite_token = p_token and public.owner_has_access(g.owner_id)
    union all
    select i.theme_slug, i.config, null::text, (i.group_id = gr.id) as exact
    from public.guest_groups gr
    join public.invitations i on i.owner_id = gr.owner_id
    where gr.invite_token = p_token and public.owner_has_access(gr.owner_id)
  ) t
  order by t.exact desc
  limit 1;
$$;
revoke all on function public.public_invitation(text) from public;
grant execute on function public.public_invitation(text) to anon, authenticated;
