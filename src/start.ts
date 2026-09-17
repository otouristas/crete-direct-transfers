import { createStart, createMiddleware } from "@tanstack/react-start";

import { renderErrorPage } from "./lib/error-page";
import { attachSupabaseAuth } from "@/integrations/supabase/auth-attacher";

/**
 * Registers every locale's dictionary and content overlay inside the SSR
 * module graph before a request is handled, so route heads, loaders and
 * server functions can read any locale synchronously. The `import.meta.env.SSR`
 * guard is a build-time constant: the client bundle drops this branch and
 * loads only its own locale (see `getRouter()`).
 */
async function ensureServerLocales() {
  if (import.meta.env.SSR) await import("@/i18n/register-all.server");
}

const localeMiddleware = createMiddleware().server(async ({ next }) => {
  await ensureServerLocales();
  return next();
});

const errorMiddleware = createMiddleware().server(async ({ next }) => {
  try {
    return await next();
  } catch (error) {
    if (error != null && typeof error === "object" && "statusCode" in error) {
      throw error;
    }
    console.error(error);
    return new Response(renderErrorPage(), {
      status: 500,
      headers: { "content-type": "text/html; charset=utf-8" },
    });
  }
});

export const startInstance = createStart(() => ({
  functionMiddleware: [attachSupabaseAuth],
  requestMiddleware: [localeMiddleware, errorMiddleware],
}));
