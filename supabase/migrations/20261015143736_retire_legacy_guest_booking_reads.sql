drop policy if exists "anon select booking id" on public.bookings;
revoke select on public.bookings from anon;
revoke select(id) on public.bookings from anon;
