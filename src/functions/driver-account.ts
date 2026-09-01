import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export type ReleaseResult = {
  bookingId: string;
  tier: string;
  penaltyCents: number;
  incentiveCents: number;
  redispatched: boolean;
};

type ReleasePayload = {
  booking_id: string;
  tier: string;
  penalty_cents: number;
  incentive_cents: number;
};

/** Immediately fan the released booking back out to nearby online drivers. */
async function redispatch(bookingId: string): Promise<boolean> {
  try {
    const { runDispatchNewBooking } = await import("@/server/dispatch");
    const result = await runDispatchNewBooking({ bookingId });
    return result.ok !== false;
  } catch (error) {
    console.error("[driver-account] redispatch failed", bookingId, error);
    return false;
  }
}

/** Driver cancels a job they had accepted. Penalty is applied by the RPC. */
export const cancelMyJob = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { bookingId: string; reason?: string }) => {
    if (!d?.bookingId) throw new Error("booking_required");
    return d;
  })
  .handler(async ({ data, context }): Promise<ReleaseResult> => {
    const { data: result, error } = await context.supabase.rpc("driver_cancel_job", {
      p_booking_id: data.bookingId,
      p_reason: data.reason ?? undefined,
    });
    if (error) throw new Error(error.message);
    const payload = result as unknown as ReleasePayload;

    return {
      bookingId: payload.booking_id,
      tier: payload.tier,
      penaltyCents: payload.penalty_cents,
      incentiveCents: payload.incentive_cents,
      redispatched: await redispatch(data.bookingId),
    };
  });

/** Admin marks the assigned driver as a no-show: 100% penalty + instant release. */
export const adminMarkDriverNoShow = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { bookingId: string; note?: string }) => {
    if (!d?.bookingId) throw new Error("booking_required");
    return d;
  })
  .handler(async ({ data, context }): Promise<ReleaseResult> => {
    const { data: result, error } = await context.supabase.rpc("admin_mark_driver_no_show", {
      p_booking_id: data.bookingId,
      p_note: data.note ?? undefined,
    });
    if (error) throw new Error(error.message);
    const payload = result as unknown as ReleasePayload;

    return {
      bookingId: payload.booking_id,
      tier: payload.tier,
      penaltyCents: payload.penalty_cents,
      incentiveCents: payload.incentive_cents,
      redispatched: await redispatch(data.bookingId),
    };
  });
