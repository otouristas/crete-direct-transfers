export function pickupTimeZone(countryCode?: string | null) {
  return countryCode === "ES"
    ? "Europe/Madrid"
    : countryCode === "IT"
      ? "Europe/Rome"
      : "Europe/Athens";
}
export function isNightAtPickup(at: Date, timeZone = "Europe/Athens") {
  const hour = Number(
    new Intl.DateTimeFormat("en-GB", { timeZone, hour: "2-digit", hourCycle: "h23" }).format(at),
  );
  return hour >= 22 || hour < 6;
}
/** A pickup clock belongs to the destination, regardless of the traveler's device timezone. */
export function pickupClockToDate(value: string, timeZone = "Europe/Athens"): Date | null {
  if (/Z$|[+-]\d{2}:\d{2}$/.test(value)) {
    const d = new Date(value);
    return Number.isFinite(d.getTime()) ? d : null;
  }
  const m = value.match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})(?::(\d{2}))?$/);
  if (!m) return null;
  const parts = m.slice(1).map(Number);
  const wanted = Date.UTC(parts[0], parts[1] - 1, parts[2], parts[3], parts[4], parts[5] || 0);
  let instant = wanted;
  const formatter = new Intl.DateTimeFormat("en-GB", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  });
  for (let i = 0; i < 3; i++) {
    const p = Object.fromEntries(
      formatter.formatToParts(new Date(instant)).map((p) => [p.type, p.value]),
    );
    const shown = Date.UTC(
      Number(p.year),
      Number(p.month) - 1,
      Number(p.day),
      Number(p.hour),
      Number(p.minute),
      Number(p.second),
    );
    if (shown === wanted) return new Date(instant);
    instant += wanted - shown;
  }
  return null; // A nonexistent local time during the spring DST change.
}
