import { CONTACT_EMAIL, SITE_NAME, SITE_URL } from "@/lib/site";
import { getServiceSupabase } from "@/integrations/supabase/service";
import { formatEur } from "@/lib/pricing";

type EmailPayload = {
  to: string;
  subject: string;
  html: string;
};

async function sendViaResend(payload: EmailPayload): Promise<{ ok: boolean; skipped?: boolean }> {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    console.info("[email] RESEND_API_KEY missing — skip send:", payload.subject, "→", payload.to);
    return { ok: true, skipped: true };
  }
  const from = process.env.RESEND_FROM ?? `${SITE_NAME} <noreply@transferaround.com>`;
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [payload.to],
      subject: payload.subject,
      html: payload.html,
      reply_to: CONTACT_EMAIL,
    }),
  });
  if (!res.ok) {
    const text = await res.text();
    console.error("[email] Resend failed", res.status, text);
    throw new Error("email_send_failed");
  }
  return { ok: true };
}

/** Server-side send without createServerFn (for webhooks / dispatch). */
export async function sendEmailDirect(payload: EmailPayload) {
  return sendViaResend(payload);
}

async function loadBooking(bookingId: string) {
  const admin = getServiceSupabase();
  if (!admin) throw new Error("Booking service is not configured");
  const { data, error } = await admin.from("bookings").select("*").eq("id", bookingId).single();
  if (error || !data) throw new Error("Booking not found");
  return data;
}

export async function notifyBookingCreated(bookingId: string) {
  const booking = await loadBooking(bookingId);
  const routeLabel =
    [booking.pickup_address, booking.dropoff_address].filter(Boolean).join(" → ") ||
    booking.route_slug;
  return sendViaResend(
    bookingCreatedEmail({
      to: booking.customer_email,
      name: booking.customer_name,
      bookingId: booking.id,
      routeLabel,
      pickupAt: new Date(booking.pickup_at).toLocaleString(),
      priceLabel: formatEur(booking.price_cents / 100),
      locale: "locale" in booking ? String(booking.locale) : "en",
    }),
  );
}

export async function notifyBookingCancelled(bookingId: string) {
  const booking = await loadBooking(bookingId);
  const refundSummary =
    booking.refund_status === "credit_issued"
      ? "A 100% booking credit has been issued."
      : booking.refund_percent === 100
        ? "A full refund was approved."
        : booking.refund_percent === 50
          ? "A 50% refund is pending review / processing."
          : "No prepaid refund applies.";
  return sendViaResend(
    bookingCancelledEmail({
      to: booking.customer_email,
      name: booking.customer_name,
      bookingId: booking.id,
      refundSummary,
    }),
  );
}

export async function notifyIncidentOpened(incidentId: string) {
  const admin = getServiceSupabase();
  if (!admin) throw new Error("Booking service is not configured");
  const { data: incident, error } = await admin
    .from("booking_incidents")
    .select("id, booking_id, type, note")
    .eq("id", incidentId)
    .single();
  if (error || !incident) throw new Error("Incident not found");
  const booking = await loadBooking(incident.booking_id);
  const typeLabel = incident.type.slice(0, 120);
  await sendViaResend(
    incidentOpenedEmail({
      to: booking.customer_email,
      name: booking.customer_name,
      bookingId: booking.id,
      typeLabel,
    }),
  );
  return sendViaResend(
    opsNotifyEmail({
      subject: `Incident ${typeLabel} · ${booking.id.slice(0, 8)}`,
      body: `${typeLabel}\n${(incident.note ?? "").slice(0, 2_000)}\nBooking ${booking.id}`,
    }),
  );
}

export function bookingCreatedEmail(input: {
  to: string;
  name: string;
  bookingId: string;
  routeLabel: string;
  pickupAt: string;
  priceLabel: string;
  locale?: string;
}) {
  const path = input.locale && input.locale !== "en" ? `/${input.locale}` : "";
  const url = `${SITE_URL}${path}/account/bookings/${input.bookingId}`;
  return {
    to: input.to,
    subject: `${SITE_NAME} booking received · ${input.bookingId.slice(0, 8)}`,
    html: `<p>Hi ${escapeHtml(input.name)},</p>
<p>We received your transfer request for <strong>${escapeHtml(input.routeLabel)}</strong> on <strong>${escapeHtml(input.pickupAt)}</strong>.</p>
<p>Total: <strong>${escapeHtml(input.priceLabel)}</strong></p>
<p><a href="${url}">View booking</a></p>
<p>We will send another update when a driver is assigned.</p>
<p>— ${SITE_NAME}</p>`,
  };
}

export function bookingCancelledEmail(input: {
  to: string;
  name: string;
  bookingId: string;
  refundSummary: string;
}) {
  return {
    to: input.to,
    subject: `${SITE_NAME} booking cancelled · ${input.bookingId.slice(0, 8)}`,
    html: `<p>Hi ${escapeHtml(input.name)},</p>
<p>Your booking <strong>${input.bookingId.slice(0, 8)}</strong> has been cancelled.</p>
<p>${escapeHtml(input.refundSummary)}</p>
<p>— ${SITE_NAME}</p>`,
  };
}

export function incidentOpenedEmail(input: {
  to: string;
  name: string;
  bookingId: string;
  typeLabel: string;
}) {
  return {
    to: input.to,
    subject: `${SITE_NAME} we received your report · ${input.bookingId.slice(0, 8)}`,
    html: `<p>Hi ${escapeHtml(input.name)},</p>
<p>We received your report (<strong>${escapeHtml(input.typeLabel)}</strong>) for booking ${input.bookingId.slice(0, 8)}. Our team will review and follow up.</p>
<p>— ${SITE_NAME}</p>`,
  };
}

export function refundProcessedEmail(input: {
  to: string;
  name: string;
  bookingId: string;
  amountLabel: string;
}) {
  return {
    to: input.to,
    subject: `${SITE_NAME} refund processed · ${input.bookingId.slice(0, 8)}`,
    html: `<p>Hi ${escapeHtml(input.name)},</p>
<p>A refund of <strong>${escapeHtml(input.amountLabel)}</strong> for booking ${input.bookingId.slice(0, 8)} has been processed.</p>
<p>— ${SITE_NAME}</p>`,
  };
}

/** Notify ops inbox (contact form / new incidents). */
export function opsNotifyEmail(input: { subject: string; body: string }) {
  return {
    to: CONTACT_EMAIL,
    subject: input.subject,
    html: `<pre style="font-family:sans-serif;white-space:pre-wrap">${escapeHtml(input.body)}</pre>`,
  };
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function safeSubject(value: string) {
  return value.replace(/[\r\n]+/g, " ").slice(0, 200);
}

export function driverJobOfferEmail(input: {
  to: string;
  driverName: string;
  bookingId: string;
  routeLabel: string;
  pickupAt: string;
  priceLabel: string;
  expiresInSec: number;
  locale?: string;
}) {
  const path = input.locale && input.locale !== "en" ? `/${input.locale}` : "";
  const url = `${SITE_URL}${path}/driver`;
  return {
    to: input.to,
    subject: safeSubject(`${SITE_NAME} new job offer · ${input.routeLabel}`),
    html: `<p>Hi ${escapeHtml(input.driverName)},</p>
<p>New transfer offer: <strong>${escapeHtml(input.routeLabel)}</strong> on <strong>${escapeHtml(input.pickupAt)}</strong>.</p>
<p>Fare: <strong>${escapeHtml(input.priceLabel)}</strong>. Expires in about ${Math.round(input.expiresInSec / 60)} min.</p>
<p>Customer details unlock after you accept.</p>
<p><a href="${url}">Open driver dashboard</a></p>
<p>— ${SITE_NAME}</p>`,
  };
}

export function partnerNewJobEmail(input: {
  to: string;
  partnerName: string;
  bookingId: string;
  routeLabel: string;
  pickupAt: string;
  priceLabel: string;
  locale?: string;
}) {
  const path = input.locale && input.locale !== "en" ? `/${input.locale}` : "";
  const url = `${SITE_URL}${path}/partner`;
  return {
    to: input.to,
    subject: `${SITE_NAME} assign driver · ${input.bookingId.slice(0, 8)}`,
    html: `<p>Hi ${escapeHtml(input.partnerName)},</p>
<p>New booking needs a driver: <strong>${escapeHtml(input.routeLabel)}</strong> on <strong>${escapeHtml(input.pickupAt)}</strong>.</p>
<p>Fare: <strong>${escapeHtml(input.priceLabel)}</strong></p>
<p><a href="${url}">Open partner inbox</a></p>
<p>— ${SITE_NAME}</p>`,
  };
}

export function driverAssignedCustomerEmail(input: {
  to: string;
  name: string;
  bookingId: string;
  driverName: string;
  driverPhone: string;
  vehicleLabel: string;
  locale?: string;
}) {
  const path = input.locale && input.locale !== "en" ? `/${input.locale}` : "";
  const url = `${SITE_URL}${path}/account/bookings/${input.bookingId}`;
  return {
    to: input.to,
    subject: `${SITE_NAME} driver assigned · ${input.bookingId.slice(0, 8)}`,
    html: `<p>Hi ${escapeHtml(input.name)},</p>
<p>Your driver is confirmed:</p>
<ul>
<li><strong>${escapeHtml(input.driverName)}</strong></li>
<li>Phone: ${escapeHtml(input.driverPhone)}</li>
<li>Vehicle: ${escapeHtml(input.vehicleLabel)}</li>
</ul>
<p><a href="${url}">View booking</a></p>
<p>— ${SITE_NAME}</p>`,
  };
}

export function offerExpiredOpsEmail(input: {
  bookingId: string;
  routeLabel: string;
  pickupAt: string;
  market?: string | null;
}) {
  return opsNotifyEmail({
    subject: `${SITE_NAME} unassigned after offer cascade · ${input.bookingId.slice(0, 8)}`,
    body: `Booking ${input.bookingId} still has no driver after offer batches.\nRoute: ${input.routeLabel}\nPickup: ${input.pickupAt}\nMarket: ${input.market ?? "—"}\nAssign via /ops or partner inbox.`,
  });
}
