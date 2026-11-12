-- Adminomgeving: wie admin is, een foutenlog en overzichtsfuncties voor het beheer.
--
-- Veiligheid:
--  * `admins` heeft RLS zonder policies: een gebruiker kan zichzelf dus nooit admin maken en de tabel niet lezen.
--    Alleen de security definer-functies hieronder (en de service role) komen erbij.
--  * Alle admin_*-functies controleren zelf `is_admin()` en weigeren anders.
--  * Admins krijgen geen brede leesrechten op de gebruikerstabellen: elke functie geeft bewust alleen de
--    kolommen terug die nodig zijn (geen e-mail, telefoon of dieetwensen van gasten).

create table if not exists public.admins (
  user_id uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);
alter table public.admins enable row level security;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (select 1 from public.admins a where a.user_id = (select auth.uid()));
$$;
revoke all on function public.is_admin() from public, anon;
grant execute on function public.is_admin() to authenticated;

-- Het bestaande beheerdersaccount.
insert into public.admins (user_id)
select id from auth.users where lower(email) = 'dvd17h@gmail.com'
on conflict do nothing;

-- ---------- Foutenlog ----------

create table if not exists public.app_errors (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  user_id uuid references auth.users (id) on delete set null,
  source text not null,
  severity text not null default 'error' check (severity in ('info', 'warning', 'error')),
  message text not null,
  path text,
  detail jsonb
);
create index if not exists app_errors_created_idx on public.app_errors (created_at desc);
create index if not exists app_errors_user_idx on public.app_errors (user_id);
alter table public.app_errors enable row level security;

create policy "admin leest fouten" on public.app_errors
  for select to authenticated using ((select public.is_admin()));
create policy "admin ruimt fouten op" on public.app_errors
  for delete to authenticated using ((select public.is_admin()));

-- De app (ook zonder ingelogde gebruiker, bijvoorbeeld op een uitnodigingslink) legt fouten hier vast.
-- Invoer wordt ingekort en er geldt een noodrem tegen overspoelen.
create or replace function public.log_app_error(
  p_source text,
  p_message text,
  p_path text default null,
  p_detail jsonb default null,
  p_severity text default 'error'
)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  if (select count(*) from public.app_errors where created_at > now() - interval '1 minute') > 200 then
    return;
  end if;
  insert into public.app_errors (user_id, source, severity, message, path, detail)
  values (
    (select auth.uid()),
    left(coalesce(nullif(p_source, ''), 'onbekend'), 60),
    case when p_severity in ('info', 'warning', 'error') then p_severity else 'error' end,
    left(coalesce(p_message, ''), 1000),
    left(p_path, 300),
    case
      when p_detail is null then null
      when pg_column_size(p_detail) > 8000 then jsonb_build_object('afgekapt', true)
      else p_detail
    end
  );
end;
$$;
revoke all on function public.log_app_error(text, text, text, jsonb, text) from public;
grant execute on function public.log_app_error(text, text, text, jsonb, text) to anon, authenticated;

-- ---------- Overzichten voor admins ----------

create or replace function public.admin_stats()
returns jsonb
language plpgsql
stable
security definer
set search_path = ''
as $$
begin
  if not (select public.is_admin()) then
    raise exception 'niet toegestaan' using errcode = '42501';
  end if;
  return jsonb_build_object(
    'users', (select count(*) from auth.users),
    'new_7d', (select count(*) from auth.users where created_at > now() - interval '7 days'),
    'active_7d', (select count(*) from auth.users where last_sign_in_at > now() - interval '7 days'),
    'with_invitation', (select count(distinct owner_id) from public.invitations),
    'invitations', (select count(*) from public.invitations),
    'guests', (select count(*) from public.guests),
    'invites_sent', (select count(*) from public.guests where invite_sent),
    'responded', (select count(*) from public.guests where rsvp_response is not null),
    'errors_24h', (select count(*) from public.app_errors where created_at > now() - interval '24 hours'),
    'errors_total', (select count(*) from public.app_errors)
  );
end;
$$;

create or replace function public.admin_users()
returns table (
  id uuid,
  email text,
  full_name text,
  partner_name text,
  wedding_date date,
  created_at timestamptz,
  last_sign_in_at timestamptz,
  confirmed boolean,
  is_admin boolean,
  invitations bigint,
  guests bigint,
  invites_sent bigint,
  responded bigint,
  todos_open bigint,
  errors bigint,
  last_activity timestamptz
)
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
  select
    u.id,
    u.email::text,
    p.full_name,
    p.partner_name,
    p.wedding_date,
    u.created_at,
    u.last_sign_in_at,
    (u.email_confirmed_at is not null),
    exists (select 1 from public.admins a where a.user_id = u.id),
    (select count(*) from public.invitations i where i.owner_id = u.id),
    (select count(*) from public.guests g where g.owner_id = u.id),
    (select count(*) from public.guests g where g.owner_id = u.id and g.invite_sent),
    (select count(*) from public.guests g where g.owner_id = u.id and g.rsvp_response is not null),
    (select count(*) from public.todos t where t.owner_id = u.id and not t.done),
    (select count(*) from public.app_errors e where e.user_id = u.id),
    greatest(
      u.last_sign_in_at,
      (select max(i.updated_at) from public.invitations i where i.owner_id = u.id),
      (select max(g.created_at) from public.guests g where g.owner_id = u.id),
      (select max(g.rsvp_responded_at) from public.guests g where g.owner_id = u.id)
    )
  from auth.users u
  left join public.profiles p on p.id = u.id
  order by u.created_at desc;
end;
$$;

-- Alles over één gebruiker in één keer. Gasten komen zonder e-mail, telefoon en dieetwensen terug.
create or replace function public.admin_user_detail(p_user uuid)
returns jsonb
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
  result jsonb;
begin
  if not (select public.is_admin()) then
    raise exception 'niet toegestaan' using errcode = '42501';
  end if;
  select jsonb_build_object(
    'user', jsonb_build_object(
      'id', u.id,
      'email', u.email,
      'created_at', u.created_at,
      'last_sign_in_at', u.last_sign_in_at,
      'confirmed', u.email_confirmed_at is not null,
      'is_admin', exists (select 1 from public.admins a where a.user_id = u.id)
    ),
    'profile', (select to_jsonb(p) - 'invite_message' from public.profiles p where p.id = u.id),
    'invitations', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', i.id,
        'theme_slug', i.theme_slug,
        'created_at', i.created_at,
        'updated_at', i.updated_at,
        'group', (select gr.name from public.guest_groups gr where gr.id = i.group_id),
        'partner1', i.config ->> 'partner1',
        'partner2', i.config ->> 'partner2',
        'date', i.config ->> 'date',
        'city', i.config ->> 'city',
        'palette', i.config ->> 'palette',
        'animation', i.config ->> 'animation',
        'blocks', coalesce(jsonb_array_length(i.config -> 'blocks'), 0)
      ) order by i.created_at)
      from public.invitations i where i.owner_id = u.id
    ), '[]'::jsonb),
    'groups', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', gr.id,
        'name', gr.name,
        'guests', (select count(*) from public.guests g where g.group_id = gr.id)
      ) order by gr.created_at)
      from public.guest_groups gr where gr.owner_id = u.id
    ), '[]'::jsonb),
    'guests', coalesce((
      select jsonb_agg(x) from (
        select jsonb_build_object(
          'id', g.id,
          'first_name', g.first_name,
          'last_name', g.last_name,
          'group', (select gr.name from public.guest_groups gr where gr.id = g.group_id),
          'rsvp_status', g.rsvp_status,
          'invite_sent', g.invite_sent,
          'created_at', g.created_at,
          'responded_at', g.rsvp_responded_at
        ) as x
        from public.guests g where g.owner_id = u.id
        order by g.created_at desc
        limit 300
      ) s
    ), '[]'::jsonb),
    'guest_counts', jsonb_build_object(
      'total', (select count(*) from public.guests g where g.owner_id = u.id),
      'attending', (select count(*) from public.guests g where g.owner_id = u.id and g.rsvp_status = 'attending'),
      'declined', (select count(*) from public.guests g where g.owner_id = u.id and g.rsvp_status = 'declined'),
      'pending', (select count(*) from public.guests g where g.owner_id = u.id and g.rsvp_status = 'pending'),
      'invites_sent', (select count(*) from public.guests g where g.owner_id = u.id and g.invite_sent)
    ),
    'todos', jsonb_build_object(
      'total', (select count(*) from public.todos t where t.owner_id = u.id),
      'done', (select count(*) from public.todos t where t.owner_id = u.id and t.done)
    )
  ) into result
  from auth.users u
  where u.id = p_user;
  return result;
end;
$$;

-- Tijdlijn met wat er gebeurd is, voor alle gebruikers of voor één gebruiker.
create or replace function public.admin_activity(p_user uuid default null, p_limit int default 60)
returns table (at timestamptz, user_id uuid, email text, kind text, detail text)
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
  select e.at, e.user_id, u.email::text, e.kind, e.detail
  from (
    select u2.created_at as at, u2.id as user_id, 'account'::text as kind, 'Account aangemaakt'::text as detail
      from auth.users u2
    union all
    select u2.last_sign_in_at, u2.id, 'login', 'Ingelogd'
      from auth.users u2 where u2.last_sign_in_at is not null
    union all
    select i.created_at, i.owner_id, 'uitnodiging', 'Uitnodiging aangemaakt (thema ' || i.theme_slug || ')'
      from public.invitations i
    union all
    select i.updated_at, i.owner_id, 'uitnodiging', 'Uitnodiging aangepast (thema ' || i.theme_slug || ')'
      from public.invitations i where i.updated_at > i.created_at + interval '1 minute'
    union all
    select g.created_at, g.owner_id, 'gast', 'Gast toegevoegd'
      from public.guests g
    union all
    select g.rsvp_responded_at, g.owner_id, 'reactie',
           case g.rsvp_response when 'attending' then 'Gast komt (RSVP)' else 'Gast komt niet (RSVP)' end
      from public.guests g where g.rsvp_responded_at is not null
    union all
    select er.created_at, er.user_id, 'fout', left(er.message, 160)
      from public.app_errors er where er.user_id is not null
  ) e
  left join auth.users u on u.id = e.user_id
  where p_user is null or e.user_id = p_user
  order by e.at desc
  limit greatest(1, least(p_limit, 500));
end;
$$;

revoke all on function public.admin_stats() from public, anon;
revoke all on function public.admin_users() from public, anon;
revoke all on function public.admin_user_detail(uuid) from public, anon;
revoke all on function public.admin_activity(uuid, int) from public, anon;
grant execute on function public.admin_stats() to authenticated;
grant execute on function public.admin_users() to authenticated;
grant execute on function public.admin_user_detail(uuid) to authenticated;
grant execute on function public.admin_activity(uuid, int) to authenticated;
