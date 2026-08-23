-- Email capture for the homepage newsletter band.
-- Mirrors the contact_messages pattern: anon may insert only, reads are
-- service-role only, so the subscriber list can never be enumerated publicly.

CREATE TABLE public.newsletter_subscribers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL,
  -- Which locale the visitor was browsing when they subscribed, so campaigns
  -- can go out in the right language.
  locale text NOT NULL DEFAULT 'en',
  -- Where on the site the capture happened, for attribution.
  source text NOT NULL DEFAULT 'homepage',
  created_at timestamptz NOT NULL DEFAULT now()
);

-- One row per address: re-subscribing is a no-op rather than a duplicate.
CREATE UNIQUE INDEX newsletter_subscribers_email_key
  ON public.newsletter_subscribers (lower(email));

GRANT INSERT ON public.newsletter_subscribers TO anon;
GRANT INSERT ON public.newsletter_subscribers TO authenticated;
GRANT ALL ON public.newsletter_subscribers TO service_role;

ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "anyone can subscribe" ON public.newsletter_subscribers
  FOR INSERT TO anon, authenticated WITH CHECK (true);
