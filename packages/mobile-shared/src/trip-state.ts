/** Booking lifecycle shared by the website and both native apps. */
export type TripState = {
  status: string;
  journey_stage?: string;
  payment_status?: string;
};

export function bookingGroup(trip: TripState): "upcoming" | "completed" | "canceled" {
  if (trip.status === "cancelled") return "canceled";
  if (trip.status === "completed" || trip.status === "no_show") return "completed";
  // A late pickup or an overnight journey is still active until the server closes it.
  return "upcoming";
}

export function hasSettledPayment(trip: TripState): boolean {
  return trip.payment_status === "paid" || trip.payment_status === "deposit_paid";
}

export function nextDriverAction(trip: TripState) {
  if (trip.status === "claimed") return "start" as const;
  if (trip.status !== "en_route") return null;
  if (trip.journey_stage === "at_pickup") return "board" as const;
  if (trip.journey_stage === "on_trip") return "complete" as const;
  return "arrive" as const;
}

export function journeyPhase(trip: TripState) {
  if (["completed", "cancelled", "no_show"].includes(trip.status)) return trip.status;
  if (trip.status === "claimed") return "assigned";
  if (trip.status === "en_route") {
    if (trip.journey_stage === "at_pickup") return "at_pickup";
    if (trip.journey_stage === "on_trip") return "on_trip";
    return "to_pickup";
  }
  return hasSettledPayment(trip) ? "finding_driver" : "payment_pending";
}
