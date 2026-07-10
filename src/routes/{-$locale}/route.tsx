import { createFileRoute, notFound, Outlet } from "@tanstack/react-router";
import { PREFIX_LOCALES, type Locale } from "@/i18n";

// Locale layout: EN at the root (param omitted), /el/* and /de/* prefixed.
// Unknown prefixes like /xx/about would otherwise match with locale="xx".
export const Route = createFileRoute("/{-$locale}")({
  beforeLoad: ({ params }) => {
    if (params.locale && !(PREFIX_LOCALES as readonly string[]).includes(params.locale)) {
      throw notFound();
    }
    return { locale: (params.locale ?? "en") as Locale };
  },
  component: Outlet,
});
