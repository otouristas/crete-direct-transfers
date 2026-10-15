alter table public.event_outbox drop constraint event_outbox_event_type_check;
alter table public.event_outbox add constraint event_outbox_event_type_check
check(event_type in ('booking.created','booking.cancelled','incident.opened','driver.assigned','booking.paid'));
