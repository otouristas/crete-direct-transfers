import {
  notifyBookingCancelled,
  notifyBookingCreated,
  notifyIncidentOpened,
} from "@/functions/email";
import { getServiceSupabase } from "@/integrations/supabase/service";
import type { Json, Tables } from "@/integrations/supabase/types";
import { notifyCustomerDriverAssigned, runDispatchNewBooking } from "@/server/dispatch";

type OutboxEvent = Tables<"event_outbox">;

function payloadObject(payload: Json): Record<string, Json | undefined> {
  return payload && typeof payload === "object" && !Array.isArray(payload)
    ? (payload as Record<string, Json | undefined>)
    : {};
}

async function deliver(event: OutboxEvent) {
  switch (event.event_type) {
    case "booking.created": {
      const result = await runDispatchNewBooking({ bookingId: event.aggregate_id });
      if (!result.ok) throw new Error(`dispatch_${result.reason}`);
      await notifyBookingCreated(event.aggregate_id);
      return;
    }
    case "booking.cancelled":
      await notifyBookingCancelled(event.aggregate_id);
      return;
    case "incident.opened": {
      const incidentId = payloadObject(event.payload).incident_id;
      if (typeof incidentId !== "string") throw new Error("incident_id_missing");
      await notifyIncidentOpened(incidentId);
      return;
    }
    case "driver.assigned":
      await notifyCustomerDriverAssigned(event.aggregate_id);
      return;
    default:
      throw new Error(`unsupported_event:${event.event_type}`);
  }
}

export async function processEventOutbox(limit = 20) {
  const admin = getServiceSupabase();
  if (!admin) throw new Error("SUPABASE_SERVICE_ROLE_KEY is not configured");

  const { data, error } = await admin.rpc("claim_event_outbox", { p_limit: limit });
  if (error) throw error;

  const events = (data ?? []) as OutboxEvent[];
  let sent = 0;
  let failed = 0;

  for (const event of events) {
    try {
      await deliver(event);
      const { error: completeError } = await admin.rpc("complete_event_outbox", {
        p_id: event.id,
        p_success: true,
      });
      if (completeError) throw completeError;
      sent += 1;
    } catch (eventError) {
      failed += 1;
      const message = eventError instanceof Error ? eventError.message : String(eventError);
      const { error: completeError } = await admin.rpc("complete_event_outbox", {
        p_id: event.id,
        p_success: false,
        p_error: message,
      });
      if (completeError) console.error("[outbox] could not release event", event.id, completeError);
      console.error("[outbox] delivery failed", event.id, event.event_type, eventError);
    }
  }

  return { ok: failed === 0, claimed: events.length, sent, failed };
}
