import { createServerFn } from "@tanstack/react-start";
import { buildSystemPrompt } from "@/lib/touristas-ai/prompts";
import {
  assistantResponseSchema,
  stripEmDashes,
  type AssistantResponse,
  type ChatMessage,
  type TouristasPageContext,
} from "@/lib/touristas-ai/types";
import {
  executeTool,
  offlineAssist,
  OPENAI_TOOLS,
  resolveTripWithContext,
  toolBuildBookUrl,
  toolQuoteVehicles,
} from "@/lib/touristas-ai/tools";

type OpenAiMessage = {
  role: "system" | "user" | "assistant" | "tool";
  content: string | null;
  tool_calls?: {
    id: string;
    type: "function";
    function: { name: string; arguments: string };
  }[];
  tool_call_id?: string;
};

function extractJsonObject(text: string): unknown {
  const cleaned = text
    .replace(/```json\s*/gi, "")
    .replace(/```/g, "")
    .trim();
  try {
    return JSON.parse(cleaned);
  } catch {
    const start = cleaned.indexOf("{");
    const end = cleaned.lastIndexOf("}");
    if (start >= 0 && end > start) {
      try {
        return JSON.parse(cleaned.slice(start, end + 1));
      } catch {
        return null;
      }
    }
    return null;
  }
}

function normalizeResponse(raw: AssistantResponse): AssistantResponse {
  return {
    ...raw,
    reply: stripEmDashes(raw.reply),
    followUps: raw.followUps?.map(stripEmDashes),
  };
}

function dispatchFromToolResult(
  toolName: string,
  result: unknown,
): AssistantResponse["dispatch"] | undefined {
  if (!result || typeof result !== "object") return undefined;
  const r = result as Record<string, unknown>;

  if (toolName === "request_asap_transfer" && r.ok === true && typeof r.bookingId === "string") {
    return {
      bookingId: r.bookingId,
      status: "searching",
      from: String(r.from ?? ""),
      to: String(r.to ?? ""),
      priceEur: typeof r.priceEur === "number" ? r.priceEur : undefined,
      etaMinutes: typeof r.etaHintMinutes === "number" ? r.etaHintMinutes : undefined,
      expiresAt: typeof r.expiresAt === "string" ? r.expiresAt : undefined,
    };
  }

  if (toolName === "get_dispatch_status" && typeof r.bookingId === "string") {
    const statusRaw = String(r.status ?? "pending");
    const expired = Boolean(r.expired);
    let status: NonNullable<AssistantResponse["dispatch"]>["status"] = "searching";
    if (expired || statusRaw === "cancelled") status = expired ? "expired" : "cancelled";
    else if (statusRaw === "claimed") status = "claimed";
    else if (statusRaw === "en_route") status = "en_route";
    else if (statusRaw === "pending") status = "searching";
    else status = "failed";

    return {
      bookingId: r.bookingId,
      status,
      from: String(r.pickupAddress ?? ""),
      to: String(r.dropoffAddress ?? ""),
      priceEur: typeof r.priceCents === "number" ? r.priceCents / 100 : undefined,
      etaMinutes: typeof r.etaMinutes === "number" ? r.etaMinutes : undefined,
      driverName: typeof r.driverFirstName === "string" ? r.driverFirstName : undefined,
      expiresAt: typeof r.expiresAt === "string" ? r.expiresAt : undefined,
    };
  }

  return undefined;
}

function hydrateFromTools(
  base: AssistantResponse,
  locale?: string,
  lastUser?: string,
  pageContext?: TouristasPageContext,
  toolDispatch?: AssistantResponse["dispatch"],
): AssistantResponse {
  const dispatch = base.dispatch ?? toolDispatch;
  if (dispatch) {
    return normalizeResponse({ ...base, dispatch });
  }
  if (base.quotes?.length && base.bookPath) return normalizeResponse(base);
  if (!lastUser) return normalizeResponse(base);

  const trip = resolveTripWithContext(lastUser, pageContext);
  if (trip.asap) return normalizeResponse(base);
  if (!trip.from || !trip.to || trip.from.lat == null || trip.to.lat == null) {
    return normalizeResponse(base);
  }

  const pickupAt = trip.date != null ? `${trip.date}T${trip.time ?? "12:00"}:00` : undefined;
  const { quotes, routeSlug } = toolQuoteVehicles({
    from: trip.from,
    to: trip.to,
    pickupAt,
    pax: trip.pax,
  });
  const bookPath =
    base.bookPath ??
    toolBuildBookUrl({
      locale,
      fromLabel: trip.from.label,
      toLabel: trip.to.label,
      fromLat: trip.from.lat,
      fromLng: trip.from.lng,
      toLat: trip.to.lat,
      toLng: trip.to.lng,
      routeSlug,
      vehicleClass: quotes[0]?.id,
      pax: trip.pax ?? 2,
      date: trip.date,
      time: trip.time,
    });

  return normalizeResponse({
    reply: base.reply,
    quotes: base.quotes?.length ? base.quotes : quotes,
    bookPath,
    followUps: base.followUps?.length
      ? base.followUps
      : ["Switch to a minivan", "Add a return trip", "What is free waiting?"],
    tripSummary: base.tripSummary ?? {
      from: trip.from.label,
      to: trip.to.label,
      when: trip.when,
      pax: trip.pax,
    },
  });
}

export const chatTouristasAssistant = createServerFn({ method: "POST" })
  .validator(
    (d: { messages: ChatMessage[]; locale?: string; pageContext?: TouristasPageContext }) => d,
  )
  .handler(async ({ data }): Promise<AssistantResponse> => {
    const lastUser = [...data.messages].reverse().find((m) => m.role === "user");
    const userText = lastUser?.content?.trim() || "";
    const locale = data.locale ?? data.pageContext?.locale ?? "en";
    const pageContext: TouristasPageContext = data.pageContext ?? {
      locale,
      path: "/",
      pageType: "home",
    };

    const apiKey = process.env.OPENAI_API_KEY ?? process.env.AI_API_KEY;
    if (!apiKey) {
      const offline = await offlineAssist(userText, locale, pageContext);
      if (offline.dispatch) {
        return normalizeResponse({
          reply: offline.reply,
          dispatch: offline.dispatch,
          followUps: offline.followUps,
          tripSummary: offline.tripSummary,
        });
      }
      if (offline.quotes?.length) {
        return normalizeResponse({
          reply: offline.reply,
          quotes: offline.quotes,
          bookPath: offline.bookPath,
          followUps: offline.followUps,
          tripSummary: offline.tripSummary,
        });
      }
      return normalizeResponse({
        reply: stripEmDashes(
          `${offline.reply} Touristas AI full chat needs OPENAI_API_KEY on the server.`,
        ),
        followUps: offline.followUps,
        tripSummary: offline.tripSummary,
      });
    }

    const baseUrl = process.env.OPENAI_BASE_URL ?? "https://api.openai.com/v1";
    const model = process.env.OPENAI_MODEL ?? "gpt-4o-mini";

    const messages: OpenAiMessage[] = [
      { role: "system", content: buildSystemPrompt(pageContext) },
      ...data.messages
        .filter((m) => m.role !== "system")
        .map((m) => ({ role: m.role as "user" | "assistant", content: m.content })),
      {
        role: "system",
        content:
          'When you are done calling tools, reply with ONLY a JSON object: {"reply":"...","quotes":[...],"bookPath":"...","followUps":[...],"tripSummary":{...},"dispatch":{...}}. Include dispatch after request_asap_transfer. No markdown.',
      },
    ];

    let toolDispatch: AssistantResponse["dispatch"] | undefined;

    try {
      for (let round = 0; round < 4; round++) {
        const res = await fetch(`${baseUrl}/chat/completions`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model,
            temperature: 0.2,
            tools: OPENAI_TOOLS,
            tool_choice: "auto",
            messages,
          }),
        });

        if (!res.ok) {
          const offline = await offlineAssist(userText, locale, pageContext);
          return normalizeResponse({
            reply: offline.reply,
            quotes: offline.quotes,
            bookPath: offline.bookPath,
            followUps: offline.followUps,
            tripSummary: offline.tripSummary,
            dispatch: offline.dispatch,
          });
        }

        const json = (await res.json()) as {
          choices?: {
            message?: OpenAiMessage;
            finish_reason?: string;
          }[];
        };

        const msg = json.choices?.[0]?.message;
        if (!msg) break;

        if (msg.tool_calls?.length) {
          messages.push({
            role: "assistant",
            content: msg.content,
            tool_calls: msg.tool_calls,
          });
          for (const call of msg.tool_calls) {
            const result = await executeTool(
              call.function.name,
              call.function.arguments,
              locale,
              pageContext,
            );
            const fromTool = dispatchFromToolResult(call.function.name, result);
            if (fromTool) toolDispatch = fromTool;
            messages.push({
              role: "tool",
              tool_call_id: call.id,
              content: JSON.stringify(result),
            });
          }
          continue;
        }

        const content = msg.content?.trim() ?? "";
        const parsed = extractJsonObject(content);
        const validated = assistantResponseSchema.safeParse(parsed);
        if (validated.success) {
          return hydrateFromTools(validated.data, locale, userText, pageContext, toolDispatch);
        }

        return hydrateFromTools(
          {
            reply: stripEmDashes(content || "I can help you book a transfer."),
            followUps: ["HER to Elounda tomorrow 3pm", "What is free waiting?"],
            dispatch: toolDispatch,
          },
          locale,
          userText,
          pageContext,
          toolDispatch,
        );
      }
    } catch {
      /* fall through */
    }

    const offline = await offlineAssist(userText, locale, pageContext);
    return normalizeResponse({
      reply: offline.reply,
      quotes: offline.quotes,
      bookPath: offline.bookPath,
      followUps: offline.followUps,
      tripSummary: offline.tripSummary,
      dispatch: offline.dispatch ?? toolDispatch,
    });
  });

/** @deprecated Use chatTouristasAssistant */
export const chatBookingAssistant = chatTouristasAssistant;
