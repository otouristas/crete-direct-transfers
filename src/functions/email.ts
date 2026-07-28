import { createServerFn } from "@tanstack/react-start";
import { CONTACT_EMAIL, SITE_NAME, SITE_URL } from "@/lib/site";

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

export const sendTransactionalEmail = createServerFn({ method: "POST" })
  .validator((d: EmailPayload) => d)
  .handler(async ({ data }) => sendViaResend(data));

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
    subject: `${SITE_NAME} booking confirmed · ${input.bookingId.slice(0, 8)}`,
    html: `<p>Hi ${input.name},</p>
<p>Your transfer <strong>${input.routeLabel}</strong> on <strong>${input.pickupAt}</strong> is confirmed.</p>
<p>Total: <strong>${input.priceLabel}</strong></p>
<p><a href="${url}">View booking</a></p>
<p>Free cancel up to 24h before pickup. Free waiting: 60 min airports/ports, 30 min elsewhere.</p>
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
    html: `<p>Hi ${input.name},</p>
<p>Your booking <strong>${input.bookingId.slice(0, 8)}</strong> has been cancelled.</p>
<p>${input.refundSummary}</p>
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
    html: `<p>Hi ${input.name},</p>
<p>We received your report (<strong>${input.typeLabel}</strong>) for booking ${input.bookingId.slice(0, 8)}. Our team will review and follow up.</p>
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
    html: `<p>Hi ${input.name},</p>
<p>A refund of <strong>${input.amountLabel}</strong> for booking ${input.bookingId.slice(0, 8)} has been processed.</p>
<p>— ${SITE_NAME}</p>`,
  };
}

/** Notify ops inbox (contact form / new incidents). */
export function opsNotifyEmail(input: { subject: string; body: string }) {
  return {
    to: CONTACT_EMAIL,
    subject: input.subject,
    html: `<pre style="font-family:sans-serif;white-space:pre-wrap">${input.body}</pre>`,
  };
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
    subject: `${SITE_NAME} new job offer · ${input.routeLabel}`,
    html: `<p>Hi ${input.driverName},</p>
<p>New transfer offer: <strong>${input.routeLabel}</strong> on <strong>${input.pickupAt}</strong>.</p>
<p>Fare: <strong>${input.priceLabel}</strong>. Expires in about ${Math.round(input.expiresInSec / 60)} min.</p>
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
    html: `<p>Hi ${input.partnerName},</p>
<p>New booking needs a driver: <strong>${input.routeLabel}</strong> on <strong>${input.pickupAt}</strong>.</p>
<p>Fare: <strong>${input.priceLabel}</strong></p>
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
    html: `<p>Hi ${input.name},</p>
<p>Your driver is confirmed:</p>
<ul>
<li><strong>${input.driverName}</strong></li>
<li>Phone: ${input.driverPhone}</li>
<li>Vehicle: ${input.vehicleLabel}</li>
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
