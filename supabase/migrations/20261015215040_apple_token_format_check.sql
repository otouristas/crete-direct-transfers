-- PostgreSQL regex repetition bounds stop at 255; validate length separately.
alter table public.native_device_tokens drop constraint native_device_tokens_token_check;
alter table public.native_device_tokens add constraint native_device_tokens_token_check
check (token ~ '^[a-f0-9]+$' and length(token) between 32 and 1024 and length(token) % 2 = 0);
