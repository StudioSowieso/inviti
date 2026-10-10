-- Naam van de partner, voor de gezamenlijke initialen (bijv. "A&M") in de profielfoto.
alter table public.profiles add column if not exists partner_name text;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, full_name, partner_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    nullif(trim(new.raw_user_meta_data->>'partner_name'), '')
  );

  insert into public.todos (owner_id, title, system_key) values
    (new.id, 'Gastenlijst aanmaken', 'guest_list'),
    (new.id, 'Uitnodigingen versturen', 'invitations_sent');
  return new;
end;
$$;
