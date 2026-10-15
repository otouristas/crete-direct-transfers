
-- Practice sessions are isolated from bookings, profiles, payments and event_outbox.
create schema if not exists private;
revoke all on schema private from public, anon, authenticated;
create table if not exists private.transfer_practice_sessions (
  token_hash text primary key,
  state jsonb not null default '{"online":false,"trip":null,"events":[]}'::jsonb,
  expires_at timestamptz not null default (now() + interval '2 hours')
);
alter table private.transfer_practice_sessions enable row level security;
create index if not exists transfer_practice_expiry on private.transfer_practice_sessions(expires_at);
revoke all on private.transfer_practice_sessions from public, anon, authenticated;

-- The random bearer capability grants access ONLY to one short-lived fictional session.
-- No customer input, real dispatch, email, device tokens, or payment code is called here.
create or replace function public.transfer_practice(
  p_token text default null, p_action text default 'read', p_input jsonb default '{}'::jsonb
) returns jsonb language plpgsql security definer set search_path = '' as $$
declare
  v_token text; v_hash text; v_state jsonb; v_trip jsonb; v_event text;
  v_route text; v_from text; v_to text; v_cents integer; v_class text;
begin
  if p_action = 'create' then
    delete from private.transfer_practice_sessions where expires_at < now();
    if (select count(*) from private.transfer_practice_sessions) >= 2000 then
      raise exception 'Practice is busy. Please try again later.';
    end if;
    v_token := encode(extensions.gen_random_bytes(24), 'hex');
    v_hash := encode(extensions.digest(v_token, 'sha256'), 'hex');
    insert into private.transfer_practice_sessions(token_hash) values(v_hash)
      returning state into v_state;
    return jsonb_build_object('token',v_token,'state',v_state);
  end if;
  if p_token is null or p_token !~ '^[a-f0-9]{48}$' then
    raise exception 'Practice session not found. Start a new session.';
  end if;
  v_hash := encode(extensions.digest(p_token, 'sha256'), 'hex');
  select state into v_state from private.transfer_practice_sessions
    where token_hash = v_hash and expires_at > now() for update;
  if not found then raise exception 'Practice session expired. Start a new session.'; end if;
  v_trip := nullif(v_state->'trip', 'null'::jsonb);
  case p_action
    when 'read' then return jsonb_build_object('state',v_state);
    when 'online' then
      v_state := jsonb_set(v_state,'{online}', 'true'); v_event := 'Driver is online';
    when 'offline' then
      v_state := jsonb_set(v_state,'{online}', 'false'); v_event := 'Driver is offline';
    when 'request' then
      if v_trip is not null and v_trip->>'status' not in ('completed','cancelled') then
        raise exception 'Finish or cancel the current practice trip first.';
      end if;
      v_route := coalesce(p_input->>'route','chq-chania');
      case v_route
        when 'chq-chania' then v_from := 'Chania Airport (CHQ)'; v_to := 'Chania Old Town'; v_cents := 3500;
        when 'her-rethymno' then v_from := 'Heraklion Airport (HER)'; v_to := 'Rethymno Old Town'; v_cents := 7500;
        when 'her-elounda' then v_from := 'Heraklion Airport (HER)'; v_to := 'Elounda'; v_cents := 8500;
        else raise exception 'Choose a practice route.';
      end case;
      v_class := coalesce(p_input->>'vehicle','comfort');
      case v_class
        when 'economy' then null;
        when 'comfort' then v_cents := round(v_cents * 1.35 / 100) * 100;
        when 'minivan' then v_cents := round(v_cents * 1.6 / 100) * 100;
        else raise exception 'Choose a practice vehicle.';
      end case;
      v_trip := jsonb_build_object(
        'id',gen_random_uuid(),'from',v_from,'to',v_to,'route',v_route,
        'vehicle',v_class,'priceCents',v_cents,'passengers',2,
        'pickupAt',now() + interval '1 day','status','pending',
        'customerName','Alex Morgan','driverName','Nikos','vehicleName',
        case v_class when 'minivan' then 'Mercedes V-Class' when 'economy' then 'Skoda Octavia' else 'Mercedes E-Class' end,
        'plate','DEMO 2026'
      );
      v_event := 'Traveler requested a transfer';
    when 'accept' then
      if not (v_state->>'online')::boolean then raise exception 'Go online to accept a trip.'; end if;
      if v_trip is null or v_trip->>'status' <> 'pending' then raise exception 'No trip to accept.'; end if;
      v_trip := jsonb_set(v_trip,'{status}','"claimed"'); v_event := 'Nikos accepted the trip';
    when 'start' then
      if v_trip is null or v_trip->>'status' <> 'claimed' then raise exception 'Accept the trip first.'; end if;
      v_trip := jsonb_set(v_trip,'{status}','"en_route"'); v_event := 'Nikos is on the way';
    when 'complete' then
      if v_trip is null or v_trip->>'status' <> 'en_route' then raise exception 'Start the trip first.'; end if;
      v_trip := jsonb_set(v_trip,'{status}','"completed"'); v_event := 'Trip completed · practice payment only';
    when 'cancel' then
      if v_trip is null or v_trip->>'status' not in ('pending','claimed') then raise exception 'This trip cannot be cancelled.'; end if;
      v_trip := jsonb_set(v_trip,'{status}','"cancelled"'); v_event := 'Traveler cancelled the practice trip';
    when 'reset' then
      v_state := '{"online":false,"trip":null,"events":[]}'::jsonb;
      v_trip := null; v_event := 'Fresh practice session';
    else raise exception 'Unknown practice action.';
  end case;
  v_state := jsonb_set(v_state,'{trip}',coalesce(v_trip,'null'::jsonb));
  v_state := jsonb_set(v_state,'{events}',(
    select coalesce(jsonb_agg(e order by ord),'[]'::jsonb)
    from jsonb_array_elements(v_state->'events' || jsonb_build_array(
      jsonb_build_object('label',v_event,'at',now())
    )) with ordinality as a(e,ord)
    where ord > greatest(0,jsonb_array_length(v_state->'events')-18)
  ));
  update private.transfer_practice_sessions set state = v_state where token_hash = v_hash;
  return jsonb_build_object('state',v_state);
end;
$$;
revoke all on function public.transfer_practice(text,text,jsonb) from public;
grant execute on function public.transfer_practice(text,text,jsonb) to anon, authenticated;
