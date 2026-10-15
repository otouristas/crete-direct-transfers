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
  const res = await fetch(`${getApiUrl()}${path}`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      ...(accessToken ? { authorization: `Bearer ${accessToken}` } : {}),
    },
    body: JSON.stringify(body),
  });
  const text = await res.text();
  let data: unknown = null;
  if (text) {
    try {
      data = JSON.parse(text) as unknown;
    } catch {
      throw new ApiError(
        `Server returned non-JSON (${res.status}). Is the API running at ${getApiUrl()}?`,
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
      `Empty response from ${path} (${res.status}). Checkout API is not deployed at ${getApiUrl()}.`,
      res.status,
    );
  }
  return data as T;
}
