-- Optional real device GPS for the capability-protected, two-hour test drive.
-- This function never touches bookings, driver profiles, payments, or payouts.
create function public.transfer_practice_gps(p_token text, p_position jsonb default null) returns jsonb
language plpgsql security definer set search_path = '' as $$
declare v_hash text; v_state jsonb; v_lat double precision; v_lng double precision; v_at timestamptz;
begin
  if p_token is null or p_token !~ '^[a-f0-9]{48}$' then raise exception 'invalid_practice_session'; end if;
  v_hash:=encode(extensions.digest(p_token,'sha256'),'hex');
  select state into v_state from private.transfer_practice_sessions where token_hash=v_hash and expires_at>now() for update;
  if not found then raise exception 'practice_session_expired'; end if;
  if p_position is null then
    v_state:=v_state-'driverLocation';
  else
    if v_state->'trip'->>'status' not in ('claimed','en_route') or v_state->'trip'->>'status' is null then
      raise exception 'practice_trip_not_active'; end if;
    v_lat:=(p_position->>'lat')::double precision;v_lng:=(p_position->>'lng')::double precision;
    v_at:=(p_position->>'capturedAt')::timestamptz;
    if v_lat is null or v_lng is null or v_at is null or not(v_lat between -90 and 90) or not(v_lng between -180 and 180)
      or v_at<clock_timestamp()-interval '1 minute' or v_at>clock_timestamp()+interval '1 minute' then raise exception 'invalid_gps_sample';end if;
    if v_at <= coalesce((v_state->'driverLocation'->>'capturedAt')::timestamptz,'epoch'::timestamptz) then return jsonb_build_object('state',v_state);end if;
    v_state:=jsonb_set(v_state,'{driverLocation}',jsonb_build_object('lat',v_lat,'lng',v_lng,'capturedAt',v_at));
  end if;
  update private.transfer_practice_sessions set state=v_state where token_hash=v_hash;
  return jsonb_build_object('state',v_state);
end $$;
revoke all on function public.transfer_practice_gps(text,jsonb) from public;
grant execute on function public.transfer_practice_gps(text,jsonb) to anon,authenticated;
