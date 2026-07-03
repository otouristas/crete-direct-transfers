CREATE TABLE public.bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  route_slug text NOT NULL,
  vehicle_class text NOT NULL,
  passengers int NOT NULL,
  pickup_at timestamptz NOT NULL,
  customer_name text NOT NULL,
  customer_email text NOT NULL,
  customer_phone text NOT NULL,
  flight_number text,
  notes text,
  extras jsonb NOT NULL DEFAULT '{}'::jsonb,
  price_cents int NOT NULL,
  currency text NOT NULL DEFAULT 'EUR',
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT INSERT ON public.bookings TO anon, authenticated;
GRANT SELECT, UPDATE ON public.bookings TO authenticated;
GRANT ALL ON public.bookings TO service_role;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anyone can create booking" ON public.bookings FOR INSERT TO anon, authenticated WITH CHECK (true);