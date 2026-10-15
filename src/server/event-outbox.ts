import { getServiceSupabase } from "@/integrations/supabase/service";
import { runDispatchNewBooking, notifyCustomerDriverAssigned } from "@/server/dispatch";
import {
  bookingCreatedEmail,
  bookingCancelledEmail,
  incidentOpenedEmail,
  sendEmailDirect,
  opsNotifyEmail,
} from "@/functions/email";
import { settleApprovedRefunds } from "@/server/refunds";

/** Claimed DB rows survive webhook retries and process restarts. Run every minute. */
export async function processEventOutbox() {
  const admin = getServiceSupabase();
  if (!admin) return { ok: false, processed: 0, error: "Database service is not configured" };
  let refundError: string | undefined;
  try {
    await settleApprovedRefunds();
  } catch {
    refundError = "Approved refunds need a retry";
  }
  const { data: events, error } = await admin.rpc("claim_event_outbox", { p_limit: 10 });
  if (error) throw new Error("Could not claim booking events");
  let processed = 0;
  for (const event of events || []) {
    try {
      if (event.event_type === "booking.paid") {
        const { data: booking, error: readError } = await admin
          .from("bookings")
          .select("*")
          .eq("id", event.aggregate_id)
          .single();
        if (readError || !booking) throw new Error("Booking not found");
        if (booking.payment_status !== "paid") throw new Error("Payment is not settled");
        if (!booking.offered_at && !booking.driver_id && booking.status === "pending") {
          const result = await runDispatchNewBooking({
            bookingId: booking.id,
            locale: booking.locale,
          });
          if (!result.ok) throw new Error("Could not dispatch paid booking");
        }
        const email = bookingCreatedEmail({
          to: booking.customer_email,
          name: booking.customer_name,
          bookingId: booking.id,
          routeLabel: [booking.pickup_address, booking.dropoff_address].filter(Boolean).join(" → "),
          pickupAt: new Date(booking.pickup_at).toLocaleString("en-GB", {
            timeZone: "Europe/Athens",
          }),
          priceLabel: `€${(booking.price_cents / 100).toFixed(2)}`,
          locale: booking.locale,
        });
        const delivered = await sendEmailDirect({
          ...email,
          idempotencyKey: `booking-paid-${booking.id}`,
        });
        if (delivered.skipped) throw new Error("Email delivery is not configured");
      } else if (event.event_type === "driver.assigned") {
        await notifyCustomerDriverAssigned(event.aggregate_id);
      } else if (event.event_type === "booking.cancelled") {
        const { data: booking, error: readError } = await admin
          .from("bookings")
          .select("*")
          .eq("id", event.aggregate_id)
          .single();
        if (readError || !booking) throw new Error("Cancelled booking not found");
        const summary =
          booking.refund_status === "paid"
            ? "Your approved refund has been sent to your original payment method."
            : booking.refund_status === "credit_issued"
              ? "Your booking credit is recorded. Contact support to apply it to your next transfer."
              : booking.refund_status === "pending_review"
                ? "Your refund request is being reviewed."
                : "Your cancellation has been recorded.";
        const result = await sendEmailDirect({
          ...bookingCancelledEmail({
            to: booking.customer_email,
            name: booking.customer_name,
            bookingId: booking.id,
            refundSummary: summary,
          }),
          idempotencyKey: event.idempotency_key,
        });
        if (result.skipped) throw new Error("Email delivery is not configured");
      } else if (event.event_type.startsWith("incident.")) {
        const { data: incident } = await admin
          .from("booking_incidents")
          .select("booking_id,type")
          .eq("id", event.aggregate_id)
          .maybeSingle();
        if (incident) {
          const { data: booking } = await admin
            .from("bookings")
            .select("customer_email,customer_name")
            .eq("id", incident.booking_id)
            .maybeSingle();
          if (booking)
            await sendEmailDirect({
              ...incidentOpenedEmail({
                to: booking.customer_email,
                name: booking.customer_name,
                bookingId: incident.booking_id,
                typeLabel: incident.type,
              }),
              idempotencyKey: `incident-customer-${event.id}`,
            });
        }
        await sendEmailDirect({
          ...opsNotifyEmail({
            subject: "Transfer incident needs review",
            body: `Incident reference: ${event.aggregate_id}`,
          }),
          idempotencyKey: event.idempotency_key,
        });
      } else if (event.event_type !== "booking.created") {
        throw new Error(`Unsupported event: ${event.event_type}`);
      }
      // booking.created is deliberately held without fulfillment until booking.paid.
      const { error: completeError } = await admin.rpc("complete_event_outbox", {
        p_id: event.id,
        p_success: true,
      });
      if (completeError) throw completeError;
      processed++;
    } catch (e) {
      await admin.rpc("complete_event_outbox", {
        p_id: event.id,
        p_success: false,
        p_error: e instanceof Error ? e.message : "Processing failed",
      });
    }
  }
  return { ok: !refundError, processed, refundError };
}
