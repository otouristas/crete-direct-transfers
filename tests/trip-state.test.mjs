import { test } from "node:test";
import assert from "node:assert/strict";
import {
  bookingGroup,
  nextDriverAction,
  journeyPhase,
} from "../packages/mobile-shared/src/trip-state.ts";

test("an active or unpaid journey never becomes completed just because pickup is in the past", () => {
  for (const status of ["pending", "claimed", "en_route"]) {
    assert.equal(bookingGroup({ status, pickup_at: "2000-01-01T00:00:00Z" }), "upcoming");
  }
  assert.equal(bookingGroup({ status: "completed" }), "completed");
  assert.equal(bookingGroup({ status: "no_show" }), "completed");
  assert.equal(bookingGroup({ status: "cancelled" }), "canceled");
});

test("driver actions preserve arrival and boarding before completion", () => {
  assert.equal(nextDriverAction({ status: "claimed", journey_stage: "to_pickup" }), "start");
  assert.equal(nextDriverAction({ status: "en_route", journey_stage: "to_pickup" }), "arrive");
  assert.equal(nextDriverAction({ status: "en_route", journey_stage: "at_pickup" }), "board");
  assert.equal(nextDriverAction({ status: "en_route", journey_stage: "on_trip" }), "complete");
  for (const status of ["pending", "completed", "cancelled", "no_show"])
    assert.equal(nextDriverAction({ status }), null);
});

test("unpaid bookings never announce a driver search or pay-on-arrival promise", () => {
  assert.equal(journeyPhase({ status: "pending", payment_status: "unpaid" }), "payment_pending");
  assert.equal(journeyPhase({ status: "pending", payment_status: "paid" }), "finding_driver");
  assert.equal(
    journeyPhase({ status: "pending", payment_status: "deposit_paid" }),
    "finding_driver",
  );
});
