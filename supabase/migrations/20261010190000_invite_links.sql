-- Uitnodigingslinks: elke gast en elke groep krijgt een onraadbaar token. Met zo'n token kan
-- een bezoeker (zonder account) de uitnodiging bekijken, via `public_invitation`.
alter table public.guests
  add column if not exists invite_token text not null default replace(gen_random_uuid()::text, '-', '');
alter table public.guest_groups
  add column if not exists invite_token text not null default replace(gen_random_uuid()::text, '-', '');

create unique index if not exists guests_invite_token_key on public.guests (invite_token);
create unique index if not exists guest_groups_invite_token_key on public.guest_groups (invite_token);

create or replace function public.public_invitation(p_token text)
returns table (theme_slug text, config jsonb, guest_first_name text)
language sql
stable
security definer
set search_path = ''
as $$
  select i.theme_slug, i.config, g.first_name
  from public.guests g
  join public.invitations i on i.owner_id = g.owner_id
  where g.invite_token = p_token
  union all
  select i.theme_slug, i.config, null::text
  from public.guest_groups gr
  join public.invitations i on i.owner_id = gr.owner_id
  where gr.invite_token = p_token
  limit 1;
$$;

revoke all on function public.public_invitation(text) from public;
grant execute on function public.public_invitation(text) to anon, authenticated;
