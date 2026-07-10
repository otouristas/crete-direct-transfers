-- Live DB rejects anon inserts on bookings (42501) even though the original
-- migration declared WITH CHECK (true) — recreate the policy and grants so the
-- public booking form works.
GRANT INSERT ON public.bookings TO anon, authenticated;

DROP POLICY IF EXISTS "anyone can create booking" ON public.bookings;
CREATE POLICY "anyone can create booking" ON public.bookings
  FOR INSERT TO anon, authenticated WITH CHECK (true);
