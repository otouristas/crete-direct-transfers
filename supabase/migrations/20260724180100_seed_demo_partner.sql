-- Optional seed partner for hotel referrals (Phase 5). Safe to re-run.
insert into public.partner_referrals (code, partner_name, partner_email, commission_percent, active)
values
  ('HOTEL-DEMO', 'Demo Hotel Partner', 'partners@transferaround.com', 10, true)
on conflict (code) do nothing;
