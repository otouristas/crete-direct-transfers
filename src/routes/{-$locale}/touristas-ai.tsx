import { createFileRoute } from "@tanstack/react-router";
import { TouristasChatShell } from "@/components/touristas-ai/chat-shell";
import { useTouristasChat } from "@/components/touristas-ai/use-touristas-chat";
import { getDict, type Locale } from "@/i18n";
import { buildHead } from "@/lib/seo";

export const Route = createFileRoute("/{-$locale}/touristas-ai")({
  head: ({ params }) => {
    const locale = (params.locale ?? "en") as Locale;
    const t = getDict(locale).touristasAi;
    return buildHead({
      locale,
      path: "/touristas-ai",
      title: t.fullPageMetaTitle,
      description: t.fullPageMetaDescription,
      noindex: true,
    });
  },
  component: TouristasAiPage,
});

function TouristasAiPage() {
  const chat = useTouristasChat();
  return <TouristasChatShell chat={chat} variant="page" />;
}
