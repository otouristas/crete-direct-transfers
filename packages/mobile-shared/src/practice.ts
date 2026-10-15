export type PracticeClient = {
  rpc: (
    name: "transfer_practice",
    args: { p_token?: string; p_action: string; p_input: { route?: string; vehicle?: string } },
  ) => PromiseLike<{ data: unknown; error: { message: string } | null }>;
};

export type PracticeAction =
  | "create"
  | "read"
  | "online"
  | "offline"
  | "request"
  | "accept"
  | "start"
  | "complete"
  | "cancel"
  | "reset";
export type PracticeTrip = {
  id: string;
  from: string;
  to: string;
  route: string;
  vehicle: "economy" | "comfort" | "minivan";
  vehicleName: string;
  plate: string;
  priceCents: number;
  passengers: number;
  pickupAt: string;
  status: "pending" | "claimed" | "en_route" | "completed" | "cancelled";
  customerName: string;
  driverName: string;
};
export type PracticeState = {
  driverLocation?: { lat: number; lng: number; capturedAt: string };
  online: boolean;
  trip: PracticeTrip | null;
  events: { label: string; at: string }[];
};
export const EMPTY_PRACTICE: PracticeState = { online: false, trip: null, events: [] };
export const PRACTICE_ROUTES = [
  {
    id: "chq-chania",
    from: "Chania Airport (CHQ)",
    to: "Chania Old Town",
    minutes: 25,
    baseCents: 3500,
  },
  {
    id: "her-rethymno",
    from: "Heraklion Airport (HER)",
    to: "Rethymno Old Town",
    minutes: 70,
    baseCents: 7500,
  },
  {
    id: "her-elounda",
    from: "Heraklion Airport (HER)",
    to: "Elounda",
    minutes: 65,
    baseCents: 8500,
  },
] as const;
export const PRACTICE_VEHICLES = [
  {
    id: "economy",
    name: "Economy",
    description: "A lovely, easy arrival",
    seats: 3,
    multiplier: 1,
  },
  {
    id: "comfort",
    name: "Comfort",
    description: "A little more room to unwind",
    seats: 3,
    multiplier: 1.35,
  },
  {
    id: "minivan",
    name: "Private van",
    description: "Your people. Your own space.",
    seats: 6,
    multiplier: 1.6,
  },
] as const;
export function practiceFare(baseCents: number, multiplier: number) {
  return Math.round((baseCents * multiplier) / 100) * 100;
}

/** Calls a capability-protected, short-lived simulation. Never writes real bookings. */
export async function runPractice(
  client: PracticeClient,
  token: string | null,
  action: PracticeAction,
  input: { route?: string; vehicle?: string } = {},
): Promise<{ token?: string; state: PracticeState }> {
  const { data, error } = await client.rpc("transfer_practice", {
    p_token: token ?? undefined,
    p_action: action,
    p_input: input,
  });
  if (error) throw new Error(error.message);
  const result = data as { token?: string; state?: PracticeState } | null;
  if (!result?.state || !Array.isArray(result.state.events))
    throw new Error("Practice is unavailable. Please try again.");
  return { token: result.token, state: result.state };
}
