import { test } from "node:test";
import assert from "node:assert/strict";
import { matchingVehicle, rideIntentSchema } from "../src/lib/ride-ai.ts";
import { pickupClockToDate } from "../packages/mobile-shared/src/pickup-time.ts";

test("ride proposals fit both people and suitcases, even when a smaller class was requested", () => {
  assert.equal(matchingVehicle(2, 2, null), "economy");
  assert.equal(matchingVehicle(2, 2, "comfort"), "comfort");
  assert.equal(matchingVehicle(4, 2, "economy"), "minivan");
  assert.equal(matchingVehicle(2, 4, "comfort"), "minivan");
  assert.equal(matchingVehicle(7, 7, null), "minivan");
  assert.equal(matchingVehicle(8, 2, null), "minibus-12");
  assert.equal(matchingVehicle(2, 8, null), "minibus-12");
  assert.equal(matchingVehicle(17, 2, null), null);
});
test("AI output cannot inject prices or booking actions into the intent schema", () => {
  const intent = {
    reply: "Where are you going?",
    pickupQuery: "HER",
    destinationQuery: null,
    pickupDate: null,
    pickupTime: null,
    passengers: 2,
    bags: 2,
    flightNumber: null,
    specialRequirements: null,
    vehiclePreference: null,
    useCurrentLocation: false,
  };
  assert.equal(rideIntentSchema.safeParse(intent).success, true);
  for (const extra of [
    { priceCents: 0 },
    { bookingId: "fake" },
    { passengers: 99 },
    { pickupTime: "25:99" },
  ])
    assert.equal(rideIntentSchema.safeParse({ ...intent, ...extra }).success, false);
});
test("pickup clock follows local airport time and rejects nonexistent DST hours", () => {
  assert.equal(
    pickupClockToDate("2026-10-17T17:00:00", "Europe/Athens")?.toISOString(),
    "2026-10-17T14:00:00.000Z",
  );
  assert.equal(pickupClockToDate("2027-03-28T03:30:00", "Europe/Athens"), null);
});
