import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import type { DispatchMarket } from "@/lib/dispatch";
import {
  notifyCustomerDriverAssigned,
  runDispatchNewBooking,
  runExpireAndEscalate,
} from "@/server/dispatch";

export const dispatchNewBooking = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator(
    (d: {
      bookingId: string;
      market?: DispatchMarket | null;
      countryCode?: string | null;
      lat?: number | null;
      lng?: number | null;
      preferredPartnerId?: string | null;
      locale?: string;
    }) => d,
  )
  .handler(async ({ data, context }) => {
    const { data: booking } = await context.supabase
      .from("bookings")
      .select("id,user_id")
      .eq("id", data.bookingId)
      .maybeSingle();
    if (!booking || booking.user_id !== context.userId) throw new Error("Forbidden");
    return runDispatchNewBooking(data);
  });

export const expireOffersAndEscalate = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { locale?: string } = {}) => d)
  .handler(async ({ data, context }) => {
    const { data: allowed } = await context.supabase.rpc("is_admin");
    if (!allowed) throw new Error("Forbidden");
    return runExpireAndEscalate(data.locale);
  });

export const notifyDriverAssigned = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { bookingId: string; locale?: string }) => d)
  .handler(async ({ data, context }) => {
    const { data: booking } = await context.supabase
      .from("bookings")
      .select("driver_id")
      .eq("id", data.bookingId)
      .maybeSingle();
    if (booking?.driver_id !== context.userId) throw new Error("Forbidden");
    await notifyCustomerDriverAssigned(data.bookingId, data.locale);
    return { ok: true as const };
  });
