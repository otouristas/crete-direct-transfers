import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { runBookingCheckout, type BookingCheckoutInput } from "@/server/booking-checkout";

export const bookingCheckout = createServerFn({ method: "POST" })
  .inputValidator((d: BookingCheckoutInput) => d)
  .handler(async ({ data }) => runBookingCheckout(data, getRequest().headers.get("authorization")));
