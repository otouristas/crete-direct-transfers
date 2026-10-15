import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { runRideAI } from "@/server/ride-ai";
import type {
  AssistantResponse,
  ChatMessage,
  TouristasPageContext,
} from "@/lib/touristas-ai/types";
import type { RideAIResult } from "@/lib/ride-ai";

/** Compatibility for older website chat surfaces. All inference now passes
 * through the authenticated, rate-limited Claude planner. Planning never books. */
export const chatTouristasAssistant = createServerFn({ method: "POST" })
  .inputValidator(
    (d: { messages: ChatMessage[]; locale?: string; pageContext?: TouristasPageContext }) => d,
  )
  .handler(async ({ data }): Promise<AssistantResponse> => {
    const request = new Request(new URL("/api/ride-ai", getRequest().url), {
      method: "POST",
      headers: getRequest().headers,
      body: JSON.stringify({
        messages: data.messages.filter((m) => m.role !== "system"),
        locale: data.locale || "en",
      }),
    });
    const response = await runRideAI(request);
    if (!response.ok) {
      const body = (await response.json()) as { error: string };
      return { reply: body.error };
    }
    const body = (await response.json()) as RideAIResult;
    return {
      reply: [body.reply, ...body.questions].join(" "),
      bookPath: body.recommendation?.bookPath,
      tripSummary:
        body.from && body.to
          ? { from: body.from.label, to: body.to.label, pax: body.intent.passengers ?? undefined }
          : undefined,
      quotes: body.recommendation
        ? [
            {
              id: body.recommendation.vehicleClass,
              label: body.recommendation.title,
              capacity: String(body.intent.passengers),
              bags: String(body.intent.bags),
              totalEur: body.recommendation.priceCents / 100,
            },
          ]
        : undefined,
    };
  });
