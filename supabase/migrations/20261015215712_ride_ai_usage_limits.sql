create table transfer_private.ride_ai_usage (
  bucket text not null, period timestamptz not null, requests integer not null default 0,
  primary key(bucket,period)
);
alter table transfer_private.ride_ai_usage enable row level security;
revoke all on transfer_private.ride_ai_usage from public,anon,authenticated;
grant all on transfer_private.ride_ai_usage to service_role;
create function public.consume_ride_ai_request(p_user_id uuid) returns boolean
language plpgsql security definer set search_path='' as $$
declare h timestamptz:=date_trunc('hour',now()); d timestamptz:=date_trunc('day',now()); n integer;
begin
  if auth.role() is distinct from 'service_role' or p_user_id is null then raise exception 'not_authorized'; end if;
  perform pg_advisory_xact_lock(724831202610::bigint);
  if not exists(select 1 from auth.users where id=p_user_id and is_anonymous=false) then return false; end if;
  if coalesce((select requests from transfer_private.ride_ai_usage where bucket='global' and period=d),0)>=200
    or coalesce((select requests from transfer_private.ride_ai_usage where bucket=p_user_id::text||':day' and period=d),0)>=30
    or coalesce((select requests from transfer_private.ride_ai_usage where bucket=p_user_id::text||':hour' and period=h),0)>=10 then return false; end if;
  insert into transfer_private.ride_ai_usage(bucket,period,requests) values('global',d,1),(p_user_id::text||':day',d,1),(p_user_id::text||':hour',h,1)
    on conflict(bucket,period) do update set requests=transfer_private.ride_ai_usage.requests+1;
  delete from transfer_private.ride_ai_usage where period<now()-interval '8 days';
  return true;
end $$;
revoke all on function public.consume_ride_ai_request(uuid) from public,anon,authenticated;
grant execute on function public.consume_ride_ai_request(uuid) to service_role;
