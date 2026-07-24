-- Device tokens for Expo push (rider + driver apps).

create table public.device_tokens (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null check (role in ('customer', 'driver')),
  platform text not null check (platform in ('ios', 'android')),
  expo_push_token text not null,
  updated_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  unique (expo_push_token)
);

create index device_tokens_user_id_idx on public.device_tokens (user_id);
create index device_tokens_user_role_idx on public.device_tokens (user_id, role);

create trigger device_tokens_updated_at
  before update on public.device_tokens
  for each row execute function public.set_updated_at();

alter table public.device_tokens enable row level security;

revoke all on public.device_tokens from anon, authenticated;
grant select, insert, update, delete on public.device_tokens to authenticated;
grant all on public.device_tokens to service_role;

create policy "device_tokens_select_own"
  on public.device_tokens for select to authenticated
  using (user_id = auth.uid());

create policy "device_tokens_insert_own"
  on public.device_tokens for insert to authenticated
  with check (user_id = auth.uid());

create policy "device_tokens_update_own"
  on public.device_tokens for update to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

create policy "device_tokens_delete_own"
  on public.device_tokens for delete to authenticated
  using (user_id = auth.uid());
