import { getApiUrl } from "./config";

export class ApiError extends Error {
  status: number;
  priceCents?: number;
  constructor(message: string, status: number, priceCents?: number) {
    super(message);
    this.status = status;
    this.priceCents = priceCents;
  }
}

/** POST JSON with safe empty-body handling (production 404s return ""). */
export async function postJson<T>(path: string, body: unknown, accessToken?: string): Promise<T> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 10000);
  let res: Response;
  try {
    res = await fetch(`${getApiUrl()}${path}`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        ...(accessToken ? { authorization: `Bearer ${accessToken}` } : {}),
      },
      body: JSON.stringify(body),
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timer);
  }
  const text = await res.text();
  let data: unknown = null;
  if (text) {
    try {
      data = JSON.parse(text) as unknown;
    } catch {
      throw new ApiError(
        "The booking service is temporarily unavailable. Please try again shortly.",
        res.status,
      );
    }
  }
  if (!res.ok) {
    const msg =
      data && typeof data === "object" && data !== null && "error" in data
        ? String((data as { error: unknown }).error)
        : text || `Request failed (${res.status})`;
    throw new ApiError(
      msg,
      res.status,
      data &&
        typeof data === "object" &&
        "priceCents" in data &&
        typeof data.priceCents === "number"
        ? data.priceCents
        : undefined,
    );
  }
  if (data == null) {
    throw new ApiError(
      "The booking service is temporarily unavailable. Please try again shortly.",
      res.status,
    );
  }
  return data as T;
}
