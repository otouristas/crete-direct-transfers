-- Ephemeral LiteAPI / Nuitee Connect checkout sessions (hotels + flights).
create table if not exists public.liteapi_sessions (
  id uuid primary key default gen_random_uuid(),
  kind text not null check (kind in ('hotel', 'flight')),
  user_id uuid references auth.users (id) on delete set null,
  offer_id text,
  prebook_id text,
  transaction_id text,
  secret_key text,
  payload jsonb not null default '{}'::jsonb,
  status text not null default 'created'
    check (status in ('created', 'prebooked', 'paid', 'confirmed', 'failed', 'expired')),
  expires_at timestamptz not null default (now() + interval '2 hours'),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_liteapi_sessions_prebook on public.liteapi_sessions (prebook_id);
create index if not exists idx_liteapi_sessions_expires on public.liteapi_sessions (expires_at);

alter table public.liteapi_sessions enable row level security;

create policy "liteapi_sessions_own_select"
  on public.liteapi_sessions for select
  using (auth.uid() = user_id or user_id is null);

comment on table public.liteapi_sessions is 'Nuitee Connect prebook/payment session state for hotels and flights';
