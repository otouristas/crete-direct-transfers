-- APNs tokens are variable length; never assume the historical 32-byte size.
alter table public.native_device_tokens
  drop constraint native_device_tokens_token_check;
alter table public.native_device_tokens
  add constraint native_device_tokens_token_check
  check (token ~ '^[a-f0-9]{32,1024}$' and length(token) % 2 = 0);
