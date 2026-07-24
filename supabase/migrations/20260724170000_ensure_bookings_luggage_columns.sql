-- Ensure luggage / return / address columns exist on bookings.
-- Idempotent for Lovable publish when an earlier migration was not applied remotely.
ALTER TABLE public.bookings
  ADD COLUMN IF NOT EXISTS trip_type text NOT NULL DEFAULT 'oneway';

ALTER TABLE public.bookings
  ADD COLUMN IF NOT EXISTS return_at timestamptz;

ALTER TABLE public.bookings
  ADD COLUMN IF NOT EXISTS return_flight_number text;

ALTER TABLE public.bookings
  ADD COLUMN IF NOT EXISTS bags_checked int NOT NULL DEFAULT 0;

ALTER TABLE public.bookings
  ADD COLUMN IF NOT EXISTS bags_cabin int NOT NULL DEFAULT 0;

ALTER TABLE public.bookings
  ADD COLUMN IF NOT EXISTS pickup_address text;

ALTER TABLE public.bookings
  ADD COLUMN IF NOT EXISTS dropoff_address text;

ALTER TABLE public.bookings
  ADD COLUMN IF NOT EXISTS pickup_point jsonb;

ALTER TABLE public.bookings
  ADD COLUMN IF NOT EXISTS dropoff_point jsonb;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'bookings_trip_type_check'
  ) THEN
    ALTER TABLE public.bookings
      ADD CONSTRAINT bookings_trip_type_check
      CHECK (trip_type IN ('oneway', 'return'));
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'bookings_bags_checked_check'
  ) THEN
    ALTER TABLE public.bookings
      ADD CONSTRAINT bookings_bags_checked_check
      CHECK (bags_checked BETWEEN 0 AND 20);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'bookings_bags_cabin_check'
  ) THEN
    ALTER TABLE public.bookings
      ADD CONSTRAINT bookings_bags_cabin_check
      CHECK (bags_cabin BETWEEN 0 AND 20);
  END IF;
END $$;
