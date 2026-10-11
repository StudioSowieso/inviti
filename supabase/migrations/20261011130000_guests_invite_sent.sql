alter table public.guests add column if not exists invite_sent boolean not null default false;
