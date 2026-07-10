-- Return trips and luggage on bookings (widget v2)
ALTER TABLE public.bookings
  ADD COLUMN trip_type text NOT NULL DEFAULT 'oneway'
    CHECK (trip_type IN ('oneway', 'return')),
  ADD COLUMN return_at timestamptz,
  ADD COLUMN return_flight_number text,
  ADD COLUMN bags_checked int NOT NULL DEFAULT 0 CHECK (bags_checked BETWEEN 0 AND 20),
  ADD COLUMN bags_cabin int NOT NULL DEFAULT 0 CHECK (bags_cabin BETWEEN 0 AND 20);
