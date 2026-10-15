import { createFileRoute, Outlet } from "@tanstack/react-router";
import { buildHead } from "@/lib/seo";
import type { Locale } from "@/i18n";

export const Route = createFileRoute("/{-$locale}/hotels")({
  head: ({ params }) => {
    const locale = (params.locale ?? "en") as Locale;
    return buildHead({
      locale,
      path: "/hotels",
      title: "Hotels · TransferAround",
      description: "Search and book hotels with fixed-price transfers nearby",
    });
  },
  component: HotelsLayout,
});

function HotelsLayout() {
  return <Outlet />;
}
