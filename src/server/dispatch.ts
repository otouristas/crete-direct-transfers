import { getServiceSupabase } from "@/integrations/supabase/service";
import { marketFromCountryCode, parsePickupPoint, type DispatchMarket } from "@/lib/dispatch";
import { formatEur } from "@/lib/pricing";
import { CONTACT_EMAIL } from "@/lib/site";
import {
  driverAssignedCustomerEmail,
  driverJobOfferEmail,
  offerExpiredOpsEmail,
  opsNotifyEmail,
  partnerNewJobEmail,
  sendEmailDirect,
} from "@/functions/email";
import { pushToUsers } from "@/server/push";

export type DispatchNewBookingInput = {
  bookingId: string;
  market?: DispatchMarket | null;
  countryCode?: string | null;
  lat?: number | null;
  lng?: number | null;
  preferredPartnerId?: string | null;
  locale?: string;
};

type OfferRow = { id: string; driver_id: string; expires_at: string; booking_id?: string };

async function notifyDriverOffers(input: {
  offers: OfferRow[];
  bookingId: string;
  routeLabel: string;
  pickupAt: string;
  priceLabel: string;
  locale?: string;
}) {
  const admin = getServiceSupabase();
  if (!admin) return;

  const driverIds = [...new Set(input.offers.map((o) => o.driver_id))];
  if (driverIds.length > 0) {
    const first = input.offers[0];
    const expiresInSec = first
      ? Math.max(30, Math.round((new Date(first.expires_at).getTime() - Date.now()) / 1000))
      : 90;
    await pushToUsers({
      userIds: driverIds,
      title: "New transfer offer",
      body: `${input.routeLabel} · ${input.priceLabel} · ${expiresInSec}s to respond`,
      data: {
        type: "job_offer",
        bookingId: input.bookingId,
        offerId: first?.id,
      },
      priority: "high",
    });
  }

  for (const offer of input.offers) {
    const { data: profile } = await admin
      .from("profiles")
      .select("full_name, id")
      .eq("id", offer.driver_id)
      .single();
    const { data: userData } = await admin.auth.admin.getUserById(offer.driver_id);
    const to = userData.user?.email;
    if (!to) continue;
    const expiresInSec = Math.max(
      30,
      Math.round((new Date(offer.expires_at).getTime() - Date.now()) / 1000),
    );
    await sendEmailDirect(
      driverJobOfferEmail({
        to,
        driverName: profile?.full_name ?? "Driver",
        bookingId: input.bookingId,
        routeLabel: input.routeLabel,
        pickupAt: input.pickupAt,
        priceLabel: input.priceLabel,
        expiresInSec,
        locale: input.locale,
      }),
    );
  }
}

export async function runDispatchNewBooking(input: DispatchNewBookingInput) {
  const admin = getServiceSupabase();
  if (!admin) {
    console.info("[dispatch] SUPABASE_SERVICE_ROLE_KEY missing — skip");
    return { ok: false as const, reason: "no_service_role" as const };
  }

  const { data: booking, error: bErr } = await admin
    .from("bookings")
    .select("*")
    .eq("id", input.bookingId)
    .single();
  if (bErr || !booking) {
    console.error("[dispatch] booking missing", input.bookingId, bErr);
    return { ok: false as const, reason: "booking_not_found" as const };
  }

  const point = parsePickupPoint(booking.pickup_point);
  const market: DispatchMarket =
    input.market ??
    (booking.market as DispatchMarket | null) ??
    marketFromCountryCode(input.countryCode);

  const { data: dispatched, error: dErr } = await admin.rpc("create_dispatch_for_booking", {
    p_booking_id: input.bookingId,
    p_market: market,
    p_lat: input.lat ?? point?.lat ?? undefined,
    p_lng: input.lng ?? point?.lng ?? undefined,
    p_preferred_partner_id: input.preferredPartnerId ?? undefined,
  });

  if (dErr || !dispatched) {
    console.error("[dispatch] create_dispatch failed", dErr);
    await sendEmailDirect(
      opsNotifyEmail({
        subject: `Dispatch failed · ${input.bookingId.slice(0, 8)}`,
        body: `Could not dispatch booking ${input.bookingId}: ${dErr?.message ?? "unknown"}`,
      }),
    );
    return { ok: false as const, reason: "rpc_failed" as const };
  }

  const row = dispatched as typeof booking;
  const routeLabel =
    [row.pickup_address, row.dropoff_address].filter(Boolean).join(" → ") || row.route_slug;
  const pickupAt = new Date(row.pickup_at).toLocaleString();
  const priceLabel = formatEur(row.price_cents / 100);

  if (row.dispatch_mode === "partner_assign" && row.partner_id) {
    const { data: partner } = await admin
      .from("partners")
      .select("*")
      .eq("id", row.partner_id)
      .single();
    if (partner?.dispatch_email) {
      await sendEmailDirect(
        partnerNewJobEmail({
          to: partner.dispatch_email,
          partnerName: partner.name,
          bookingId: row.id,
          routeLabel,
          pickupAt,
          priceLabel,
          locale: input.locale,
        }),
      );
    }
    return { ok: true as const, mode: "partner_assign" as const, bookingId: row.id };
  }

  const { data: offers } = await admin
    .from("job_offers")
    .select("id, driver_id, expires_at")
    .eq("booking_id", row.id)
    .eq("status", "pending");

  await notifyDriverOffers({
    offers: offers ?? [],
    bookingId: row.id,
    routeLabel,
    pickupAt,
    priceLabel,
    locale: input.locale,
  });

  if ((offers ?? []).length === 0 && row.partner_id) {
    const { data: partner } = await admin
      .from("partners")
      .select("*")
      .eq("id", row.partner_id)
      .single();
    if (partner?.dispatch_email) {
      await sendEmailDirect(
        partnerNewJobEmail({
          to: partner.dispatch_email,
          partnerName: partner.name,
          bookingId: row.id,
          routeLabel,
          pickupAt,
          priceLabel,
          locale: input.locale,
        }),
      );
    }
    await sendEmailDirect(
      opsNotifyEmail({
        subject: `No online drivers for offer · ${row.id.slice(0, 8)}`,
        body: `Booking ${row.id} (${routeLabel}) had zero online drivers. Partner notified: ${partner?.dispatch_email ?? "—"}. Ops: ${CONTACT_EMAIL}`,
      }),
    );
  }

  return {
    ok: true as const,
    mode: "offer" as const,
    bookingId: row.id,
    offers: (offers ?? []).length,
  };
}

export async function runExpireAndEscalate(locale?: string) {
  const admin = getServiceSupabase();
  if (!admin) return { ok: false as const };

  const since = new Date(Date.now() - 5_000).toISOString();
  const { data, error } = await admin.rpc("expire_job_offers");
  if (error) {
    console.error("[dispatch] expire failed", error);
    return { ok: false as const };
  }

  // Notify drivers on any new offer batches created by the cascade.
  const { data: freshOffers } = await admin
    .from("job_offers")
    .select("id, driver_id, expires_at, booking_id")
    .eq("status", "pending")
    .gte("created_at", since);

  const byBooking = new Map<string, OfferRow[]>();
  for (const offer of freshOffers ?? []) {
    const list = byBooking.get(offer.booking_id) ?? [];
    list.push(offer);
    byBooking.set(offer.booking_id, list);
  }

  for (const [bookingId, offers] of byBooking) {
    const { data: booking } = await admin.from("bookings").select("*").eq("id", bookingId).single();
    if (!booking || booking.driver_id) continue;
    const routeLabel =
      [booking.pickup_address, booking.dropoff_address].filter(Boolean).join(" → ") ||
      booking.route_slug;
    await notifyDriverOffers({
      offers,
      bookingId,
      routeLabel,
      pickupAt: new Date(booking.pickup_at).toLocaleString(),
      priceLabel: formatEur(booking.price_cents / 100),
      locale,
    });
  }

  const payload = data as { escalate?: string[] } | null;
  const escalate = payload?.escalate ?? [];
  for (const bookingId of escalate) {
    const { data: booking } = await admin.from("bookings").select("*").eq("id", bookingId).single();
    if (!booking || booking.driver_id || booking.status !== "pending") continue;

    const routeLabel =
      [booking.pickup_address, booking.dropoff_address].filter(Boolean).join(" → ") ||
      booking.route_slug;

    if (booking.partner_id) {
      const { data: partner } = await admin
        .from("partners")
        .select("*")
        .eq("id", booking.partner_id)
        .single();
      if (partner?.dispatch_email) {
        await sendEmailDirect(
          partnerNewJobEmail({
            to: partner.dispatch_email,
            partnerName: partner.name,
            bookingId: booking.id,
            routeLabel,
            pickupAt: new Date(booking.pickup_at).toLocaleString(),
            priceLabel: formatEur(booking.price_cents / 100),
            locale,
          }),
        );
      }
    }

    await sendEmailDirect(
      offerExpiredOpsEmail({
        bookingId: booking.id,
        routeLabel,
        pickupAt: new Date(booking.pickup_at).toLocaleString(),
        market: booking.market,
      }),
    );
  }

  return { ok: true as const, escalate: escalate.length, notifiedOffers: freshOffers?.length ?? 0 };
}

export async function notifyCustomerDriverAssigned(bookingId: string, locale?: string) {
  const admin = getServiceSupabase();
  if (!admin) return;

  const { data: booking } = await admin.from("bookings").select("*").eq("id", bookingId).single();
  if (!booking?.driver_id) return;

  const { data: info } = await admin.rpc("booking_driver_info", { p_booking_id: bookingId });
  const driver = Array.isArray(info) ? info[0] : null;
  if (!driver) return;

  await sendEmailDirect(
    driverAssignedCustomerEmail({
      to: booking.customer_email,
      name: booking.customer_name,
      bookingId: booking.id,
      driverName: driver.full_name,
      driverPhone: driver.phone,
      vehicleLabel: [driver.vehicle_make_model, driver.vehicle_plate].filter(Boolean).join(" · "),
      locale,
    }),
  );

  if (booking.user_id) {
    const routeLabel =
      [booking.pickup_address, booking.dropoff_address].filter(Boolean).join(" → ") ||
      booking.route_slug;
    await pushToUsers({
      userIds: [booking.user_id],
      title: "Driver assigned",
      body: `${driver.full_name ?? "Your driver"} is assigned · ${routeLabel}`,
      data: {
        type: "driver_assigned",
        bookingId: booking.id,
      },
      priority: "high",
    });
  }
}
