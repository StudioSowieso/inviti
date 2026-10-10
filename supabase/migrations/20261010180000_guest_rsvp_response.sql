-- De officiële, digitale reactie van een gast via het RSVP-formulier. Staat los van
-- `rsvp_status`, die de organisator handmatig kan aanpassen.
alter table public.guests
  add column if not exists rsvp_response text check (rsvp_response in ('attending', 'declined')),
  add column if not exists rsvp_responded_at timestamptz;
