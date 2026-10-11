-- Meerdere uitnodigingen per bruiloft: één per groep gasten (bijv. Dag-gasten en Avond-gasten).
alter table public.invitations drop constraint if exists invitations_owner_unique;
alter table public.invitations add column if not exists group_id uuid references public.guest_groups (id) on delete cascade;
create unique index if not exists invitations_group_id_key on public.invitations (group_id);

-- Een gast of groepslink toont de uitnodiging van de eigen groep (anders een andere van dezelfde eigenaar).
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
    where g.invite_token = p_token
    union all
    select i.theme_slug, i.config, null::text, (i.group_id = gr.id) as exact
    from public.guest_groups gr
    join public.invitations i on i.owner_id = gr.owner_id
    where gr.invite_token = p_token
  ) t
  order by t.exact desc
  limit 1;
$$;

revoke all on function public.public_invitation(text) from public;
grant execute on function public.public_invitation(text) to anon, authenticated;
