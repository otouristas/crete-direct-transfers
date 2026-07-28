import { createServerFn } from "@tanstack/react-start";
import type { DispatchMarket } from "@/lib/dispatch";
import {
  notifyCustomerDriverAssigned,
  runDispatchNewBooking,
  runExpireAndEscalate,
} from "@/server/dispatch";

export const dispatchNewBooking = createServerFn({ method: "POST" })
  .validator(
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
  .handler(async ({ data }) => runDispatchNewBooking(data));

export const expireOffersAndEscalate = createServerFn({ method: "POST" })
  .validator((d: { locale?: string } = {}) => d)
  .handler(async ({ data }) => runExpireAndEscalate(data.locale));

export const notifyDriverAssigned = createServerFn({ method: "POST" })
  .validator((d: { bookingId: string; locale?: string }) => d)
  .handler(async ({ data }) => {
    await notifyCustomerDriverAssigned(data.bookingId, data.locale);
    return { ok: true as const };
  });
