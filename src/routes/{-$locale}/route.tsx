import { createFileRoute, notFound, Outlet, useRouterState } from "@tanstack/react-router";
import { PREFIX_LOCALES, type Locale } from "@/i18n";
import { TouristasAiPanel } from "@/components/touristas-ai/panel";
import { TouristasAiProvider } from "@/components/touristas-ai/provider";

// Locale layout: EN at the root (param omitted), /el/* and /de/* prefixed.
// Unknown prefixes like /xx/about would otherwise match with locale="xx".
export const Route = createFileRoute("/{-$locale}")({
  beforeLoad: ({ params }) => {
    if (params.locale && !(PREFIX_LOCALES as readonly string[]).includes(params.locale)) {
      throw notFound();
    }
    return { locale: (params.locale ?? "en") as Locale };
  },
  component: LocaleLayout,
});

function LocaleLayout() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const hideAssistant =
    /\/(account|driver|login|signup|forgot-password|reset-password|ops)(\/|$)/.test(pathname);

  return (
    <TouristasAiProvider>
      <Outlet />
      {!hideAssistant && <TouristasAiPanel />}
    </TouristasAiProvider>
  );
}
