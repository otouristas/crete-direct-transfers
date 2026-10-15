import { createFileRoute, Outlet } from "@tanstack/react-router";
import { buildHead } from "@/lib/seo";
import type { Locale } from "@/i18n";

export const Route = createFileRoute("/{-$locale}/flights")({
  head: ({ params }) => {
    const locale = (params.locale ?? "en") as Locale;
    return buildHead({
      locale,
      path: "/flights",
      title: "Flights · TransferAround",
      description: "Search flights with Nuitee Connect",
    });
  },
  component: FlightsLayout,
});

function FlightsLayout() {
  return <Outlet />;
}
