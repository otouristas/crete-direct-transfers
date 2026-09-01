import type { Dict } from "@/i18n";
import type { PriceLine } from "@/lib/pricing";

/** Localized label for a fare line, falling back to the persisted English label. */
export function priceLineLabel(t: Dict, line: PriceLine): string {
  const l = t.priceLines;
  switch (line.code) {
    case "vehicle":
      return l.vehicle(line.params?.vehicle ?? "");
    case "hourly":
      return l.hourly(line.params?.vehicle ?? "", line.params?.hours ?? 0);
    case "childSeat":
      return l.childSeat;
    case "extraStop":
      return l.extraStop;
    case "meetAndGreet":
      return l.meetAndGreet;
    case "nightSurcharge":
      return l.nightSurcharge;
    case "returnTrip":
      return l.returnTrip;
    case "returnDiscount":
      return l.returnDiscount;
    default:
      return line.label;
  }
}
