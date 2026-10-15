import { pickupTimeZone } from "../../packages/mobile-shared/src/pickup-time";
import { z } from "zod";
import { getServiceSupabase } from "@/integrations/supabase/service";
import { getStripe } from "@/server/stripe-connect";
import { fetchTripRoute } from "@/lib/trip-route";
import { matchRouteSlug, searchLocalPlaces } from "@/lib/place-search";
import { quoteTrip, quoteHourly, bagCapacity } from "@/lib/pricing";
import { VEHICLE_CLASSES } from "@/data/routes";
import { runCreateCheckoutSession } from "@/server/stripe-checkout";
import { hashCheckoutToken } from "@/server/payment-security";

const place = z.object({
  id: z.string().max(200),
  label: z.string().trim().min(2).max(250),
  kind: z.enum(["airport", "port", "destination", "route-end", "address"]),
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
  countryCode: z.string().length(2).optional(),
});
export const bookingCheckoutSchema = z.object({
  requestId: z.string().uuid(),
  checkoutToken: z.string().regex(/^[a-f0-9]{64}$/),
  service: z.enum(["transfer", "hourly"]).default("transfer"),
  hours: z.number().int().min(2).max(12).default(4),
  from: place,
  to: place.nullable(),
  vehicleClass: z.enum([
    "economy",
    "comfort",
    "luxury",
    "suv",
    "minivan",
    "van-first",
    "minibus-12",
    "minibus-16",
  ]),
  passengers: z.number().int().min(1).max(16),
  bagsChecked: z.number().int().min(0).max(20).default(0),
  bagsCabin: z.number().int().min(0).max(20).default(0),
  pickupAt: z.string().datetime({ offset: true }),
  returnAt: z.string().datetime({ offset: true }).nullable().optional(),
  tripType: z.enum(["oneway", "return"]).default("oneway"),
  customerName: z.string().trim().min(2).max(100),
  customerEmail: z.string().trim().email().max(255),
  customerPhone: z.string().trim().min(5).max(30),
  flightNumber: z.string().max(20).optional(),
  returnFlightNumber: z.string().max(20).optional(),
  notes: z.string().max(500).optional(),
  extras: z
    .object({
      childSeat: z.boolean().optional(),
      extraStop: z.boolean().optional(),
      meetAndGreet: z.boolean().optional(),
    })
    .default({}),
  expectedPriceCents: z.number().int().positive(),
  locale: z.enum(["en", "el", "de", "fr", "it", "nl", "es"]).default("en"),
});
export type BookingCheckoutInput = z.input<typeof bookingCheckoutSchema>;
function canonicalPlace(input: z.infer<typeof place>) {
  const known = searchLocalPlaces(input.label, 12).find(
    (p) => p.label.toLowerCase() === input.label.toLowerCase(),
  );
  return known?.lat != null && known.lng != null ? known : input;
}

export async function runBookingCheckout(raw: unknown, authorization?: string | null) {
  const parsed = bookingCheckoutSchema.safeParse(raw);
  if (!parsed.success)
    return {
      ok: false as const,
      error: parsed.error.issues[0]?.message || "Check your trip details.",
      status: 400,
    };
  const d = parsed.data;
  const admin = getServiceSupabase();
  if (!admin || !getStripe() || !process.env.STRIPE_WEBHOOK_SECRET)
    return {
      ok: false as const,
      error:
        "Online payment is being connected. Please try again shortly; no booking or charge has been made.",
      status: 503,
    };
  if (new Date(d.pickupAt).getTime() <= Date.now() + 15 * 60_000)
    return {
      ok: false as const,
      error: "Please choose a pickup at least 15 minutes from now.",
      status: 400,
    };
  if (d.tripType === "return" && (!d.returnAt || new Date(d.returnAt) <= new Date(d.pickupAt)))
    return {
      ok: false as const,
      error: "Return pickup must be after your outward journey.",
      status: 400,
    };
  if (d.service === "transfer" && !d.to)
    return { ok: false as const, error: "Choose a destination.", status: 400 };
  const capacity = Number(
    VEHICLE_CLASSES.find((v) => v.id === d.vehicleClass)!.capacity.match(/\d+–(\d+)/)?.[1] || 3,
  );
  if (d.passengers > capacity || d.bagsChecked > bagCapacity(d.vehicleClass))
    return {
      ok: false as const,
      error: "Choose a larger vehicle for your passengers and luggage.",
      status: 400,
    };
  let userId: string | null = null;
  if (authorization?.startsWith("Bearer ")) {
    const { data, error } = await admin.auth.getUser(authorization.slice(7));
    if (error || !data.user)
      return {
        ok: false as const,
        error: "Your sign-in expired. Please sign in again.",
        status: 401,
      };
    userId = data.user.id;
  }
  const hash = await hashCheckoutToken(d.checkoutToken);
  const { data: existing, error: readError } = await admin
    .from("bookings")
    .select("*")
    .eq("id", d.requestId)
    .maybeSingle();
  if (readError) throw new Error("Booking service is temporarily unavailable.");
  if (existing) {
    if (existing.checkout_access_hash !== hash)
      return { ok: false as const, error: "This checkout cannot be accessed.", status: 403 };
    const checkout = await runCreateCheckoutSession({
      bookingId: existing.id,
      checkoutToken: d.checkoutToken,
    });
    return {
      ok: true as const,
      bookingId: existing.id,
      url: checkout.url,
      priceCents: existing.price_cents,
    };
  }
  const from = canonicalPlace(d.from);
  const to = d.to ? canonicalPlace(d.to) : null;
  const route = to ? matchRouteSlug(from, to) : undefined;
  const timeZone = pickupTimeZone(from.countryCode || to?.countryCode);
  const geometry = to
    ? await fetchTripRoute({ lat: from.lat!, lng: from.lng! }, { lat: to.lat!, lng: to.lng! })
    : null;
  const quote =
    d.service === "hourly"
      ? quoteHourly({
          hours: d.hours,
          vehicleClass: d.vehicleClass,
          pickupAt: new Date(d.pickupAt),
          timeZone,
        })
      : quoteTrip({
          routeSlug: route,
          distanceKm: geometry?.distanceKm,
          durationMin: geometry?.durationMin,
          vehicleClass: d.vehicleClass,
          pickupAt: new Date(d.pickupAt),
          timeZone,
          tripType: d.tripType,
          returnAt: d.returnAt ? new Date(d.returnAt) : undefined,
          extras: d.extras,
        });
  if (!quote || quote.totalEur <= 0)
    return {
      ok: false as const,
      error: "We could not price this journey. Please choose another route.",
      status: 422,
    };
  const priceCents = Math.round(quote.totalEur * 100);
  if (priceCents !== d.expectedPriceCents)
    return {
      ok: false as const,
      error: `Your updated fare is €${(priceCents / 100).toFixed(2)}. Review the price and continue.`,
      status: 409,
      priceCents,
    };
  const country = from.countryCode || to?.countryCode || "GR";
  const { error } = await admin.from("bookings").insert({
    id: d.requestId,
    checkout_access_hash: hash,
    user_id: userId,
    route_slug:
      route ||
      (d.service === "hourly"
        ? `hourly-${d.hours}h`
        : `distance-${Math.round(geometry?.distanceKm || 0)}km`),
    vehicle_class: d.vehicleClass,
    passengers: d.passengers,
    pickup_at: d.pickupAt,
    return_at: d.returnAt || null,
    trip_type: d.tripType,
    customer_name: d.customerName,
    customer_email: d.customerEmail,
    customer_phone: d.customerPhone,
    flight_number: d.flightNumber || null,
    return_flight_number: d.returnFlightNumber || null,
    notes: d.notes || null,
    extras: d.extras,
    price_cents: priceCents,
    currency: "EUR",
    status: "pending",
    payment_status: "unpaid",
    pickup_address: from.label,
    dropoff_address: to?.label || `${d.hours} hours · private chauffeur`,
    pickup_point: { lat: from.lat!, lng: from.lng! },
    dropoff_point: to ? { lat: to.lat!, lng: to.lng! } : null,
    bags_checked: d.bagsChecked,
    bags_cabin: d.bagsCabin,
    market: country === "ES" ? "spain" : country === "IT" ? "italy" : "greece",
    locale: d.locale,
  });
  if (error) {
    // A concurrent retry can win the insert; re-enter the ownership-checked path.
    if (error.code === "23505") return runBookingCheckout(raw, authorization);
    throw new Error("We could not save your checkout. Please try again.");
  }
  const checkout = await runCreateCheckoutSession({
    bookingId: d.requestId,
    checkoutToken: d.checkoutToken,
  });
  return { ok: true as const, bookingId: d.requestId, url: checkout.url, priceCents };
}
