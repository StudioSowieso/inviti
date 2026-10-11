-- Handmatig aangemaakte groepen blijven bestaan, ook zonder gasten (lege groepen die vanzelf ontstaan worden opgeruimd).
alter table public.guest_groups add column if not exists keep boolean not null default false;
