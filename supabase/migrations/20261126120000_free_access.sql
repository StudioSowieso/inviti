-- Gratis toegang: een beheerder kan een account (bijv. familie die wil testen) de volledige versie geven
-- zonder betaling. Bewust een aparte tabel naast `purchases`, zodat omzet, Stripe-gegevens en de
-- herroepingsmelding (die bij echte aankopen hoort) niet door cadeau-accounts vervuild raken.
--
-- Veiligheid: alleen leesbaar voor de eigenaar; schrijven kan uitsluitend via de admin_*-functies hieronder,
-- die zelf `is_admin()` controleren. Een gebruiker kan zichzelf dus nooit gratis toegang geven.

create table if not exists public.free_access (
  user_id uuid primary key references auth.users (id) on delete cascade,
  note text,
  granted_by uuid references auth.users (id) on delete set null,
  granted_at timestamptz not null default now()
);
alter table public.free_access enable row level security;

create policy "eigen gratis toegang zien" on public.free_access
  for select to authenticated using (user_id = (select auth.uid()));

create or replace function public.has_paid()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (select 1 from public.purchases p where p.user_id = (select auth.uid()))
      or exists (select 1 from public.free_access f where f.user_id = (select auth.uid()))
      or exists (select 1 from public.admins a where a.user_id = (select auth.uid()));
$$;
revoke all on function public.has_paid() from public, anon;
grant execute on function public.has_paid() to authenticated;

create or replace function public.owner_has_access(p_owner uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (select 1 from public.purchases p where p.user_id = p_owner)
      or exists (select 1 from public.free_access f where f.user_id = p_owner)
      or exists (select 1 from public.admins a where a.user_id = p_owner);
$$;
revoke all on function public.owner_has_access(uuid) from public, anon, authenticated;

-- Geef een bestaand account (op e-mailadres) gratis toegang. Geeft false terug als het account niet bestaat.
create or replace function public.admin_grant_free_access(p_email text, p_note text default null)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_id uuid;
begin
  if not (select public.is_admin()) then
    raise exception 'niet toegestaan' using errcode = '42501';
  end if;
  select u.id into v_id from auth.users u where lower(u.email) = lower(trim(p_email)) limit 1;
  if v_id is null then
    return false;
  end if;
  insert into public.free_access (user_id, note, granted_by)
  values (v_id, nullif(trim(coalesce(p_note, '')), ''), (select auth.uid()))
  on conflict (user_id) do update set note = excluded.note;
  return true;
end;
$$;
revoke all on function public.admin_grant_free_access(text, text) from public, anon;
grant execute on function public.admin_grant_free_access(text, text) to authenticated;

create or replace function public.admin_revoke_free_access(p_user uuid)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  if not (select public.is_admin()) then
    raise exception 'niet toegestaan' using errcode = '42501';
  end if;
  delete from public.free_access where user_id = p_user;
end;
$$;
revoke all on function public.admin_revoke_free_access(uuid) from public, anon;
grant execute on function public.admin_revoke_free_access(uuid) to authenticated;

-- Overzicht voor de adminpagina.
create or replace function public.admin_free_access()
returns table (user_id uuid, email text, note text, granted_at timestamptz)
language plpgsql
stable
security definer
set search_path = ''
as $$
begin
  if not (select public.is_admin()) then
    raise exception 'niet toegestaan' using errcode = '42501';
  end if;
  return query
  select f.user_id, u.email::text, f.note, f.granted_at
  from public.free_access f
  join auth.users u on u.id = f.user_id
  order by f.granted_at desc;
end;
$$;
revoke all on function public.admin_free_access() from public, anon;
grant execute on function public.admin_free_access() to authenticated;
