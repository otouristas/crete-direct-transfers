import { createFileRoute } from "@tanstack/react-router";
import { RideAIPlanner } from "@/components/ride-ai-planner";
import { buildHead } from "@/lib/seo";
import { getDict, type Locale } from "@/i18n";

export const Route = createFileRoute("/{-$locale}/touristas-ai")({
  head: (ctx) => {
    const locale = (ctx.params.locale ?? "en") as Locale;
    const t = getDict(locale).touristasAi;
    return buildHead({
      locale,
      path: "/touristas-ai",
      title: t.fullPageMetaTitle,
      description: t.fullPageMetaDescription,
    });
  },
  component: TouristasAiPage,
});

function TouristasAiPage() {
  return (
    <div className="mx-auto h-[calc(100dvh-5rem)] min-h-[640px] max-w-3xl py-4">
      <h1 className="sr-only">Ride with AI by TransferAround</h1>
      <RideAIPlanner />
    </div>
  );
}
