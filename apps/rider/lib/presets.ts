/** MVP presets — full place search stays on the website. */
export const PRESET_ROUTES = [
  {
    id: "her-chania",
    label: "Heraklion Airport → Chania",
    from: "Heraklion Airport (HER)",
    to: "Chania Town",
    routeSlug: "heraklion-airport-to-chania",
    priceCents: 9500,
    market: "greece" as const,
    countryCode: "GR",
  },
  {
    id: "her-rethymno",
    label: "Heraklion Airport → Rethymno",
    from: "Heraklion Airport (HER)",
    to: "Rethymno",
    routeSlug: "heraklion-airport-to-rethymno",
    priceCents: 7500,
    market: "greece" as const,
    countryCode: "GR",
  },
  {
    id: "her-heraklion",
    label: "Heraklion Airport → Heraklion City",
    from: "Heraklion Airport (HER)",
    to: "Heraklion City",
    routeSlug: "heraklion-airport-to-heraklion",
    priceCents: 3500,
    market: "greece" as const,
    countryCode: "GR",
  },
  {
    id: "bcn-city",
    label: "Barcelona Airport → City Centre",
    from: "Barcelona Airport (BCN)",
    to: "Barcelona City Centre",
    routeSlug: "barcelona-airport-to-city",
    priceCents: 4500,
    market: "spain" as const,
    countryCode: "ES",
  },
] as const;

export type PresetRoute = (typeof PRESET_ROUTES)[number];
