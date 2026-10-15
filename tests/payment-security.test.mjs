import { test } from "node:test";
import assert from "node:assert/strict";
import {
  isPaidCheckout,
  safeCheckoutPath,
  hashCheckoutToken,
} from "../src/server/payment-security.ts";
const settled = {
  payment_status: "paid",
  metadata: { booking_id: "booking" },
  amount_total: 3500,
  currency: "eur",
};
test("a completed checkout with delayed payment is not settled", () =>
  assert.equal(isPaidCheckout({ ...settled, payment_status: "unpaid" }), false));
test("only positive integer fares with a booking and currency can fulfill", () => {
  assert.equal(isPaidCheckout(settled), true);
  for (const patch of [
    { amount_total: 0 },
    { amount_total: 2.5 },
    { metadata: {} },
    { currency: null },
  ])
    assert.equal(isPaidCheckout({ ...settled, ...patch }), false);
});
test("redirects stay on the application origin", () => {
  for (const target of [
    "https://example.invalid",
    "//example.invalid",
    "/\\example.invalid",
    "/ok\r\nLocation: bad",
  ])
    assert.equal(safeCheckoutPath(target, "/book"), "/book");
  assert.equal(safeCheckoutPath("/el/book?retry=1", "/book"), "/el/book?retry=1");
});
test("guest access tokens are stored as one-way hashes", async () => {
  const a = await hashCheckoutToken("a".repeat(64));
  assert.match(a, /^[a-f0-9]{64}$/);
  assert.notEqual(a, "a".repeat(64));
  assert.equal(a, await hashCheckoutToken("a".repeat(64)));
  assert.notEqual(a, await hashCheckoutToken("b".repeat(64)));
});

// Billing and pickup times must be independent of the server/device timezone.
import {
  pickupClockToDate,
  isNightAtPickup,
  pickupTimeZone,
} from "../packages/mobile-shared/src/pickup-time.ts";
test("pickup clocks convert using destination timezone and seasonal offsets", () => {
  assert.equal(
    pickupClockToDate("2026-10-20T12:00", "Europe/Athens").toISOString(),
    "2026-10-20T09:00:00.000Z",
  );
  assert.equal(
    pickupClockToDate("2026-12-20T12:00", "Europe/Athens").toISOString(),
    "2026-12-20T10:00:00.000Z",
  );
  assert.equal(
    pickupClockToDate("2026-10-20T12:00", pickupTimeZone("ES")).toISOString(),
    "2026-10-20T10:00:00.000Z",
  );
});
test("night pricing follows pickup geography rather than host clock", () => {
  assert.equal(isNightAtPickup(new Date("2026-10-20T19:30:00Z"), "Europe/Athens"), true);
  assert.equal(isNightAtPickup(new Date("2026-10-20T19:30:00Z"), "Europe/Madrid"), false);
});
test("invalid clocks and nonexistent DST times cannot become bookings", () => {
  assert.equal(pickupClockToDate("invalid"), null);
  assert.equal(pickupClockToDate("2026-03-29T03:30", "Europe/Athens"), null);
});
