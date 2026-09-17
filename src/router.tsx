import { QueryClient } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";
import { localeFromPathname } from "@/i18n";
import { loadLocaleResources } from "@/i18n/locale-resources";

export const getRouter = async () => {
  const queryClient = new QueryClient();

  if (import.meta.env.SSR) {
    // Belt and braces next to the request middleware in start.ts: any server
    // path that builds a router has every locale registered first. The
    // client bundle drops this branch at build time.
    await import("@/i18n/register-all.server");
  } else if (typeof window !== "undefined") {
    // Dictionaries and content overlays are code-split per locale. Load the
    // one this URL renders before the router hydrates, so the client tree
    // matches the server markup. (The server registers every locale at boot.)
    await loadLocaleResources(localeFromPathname(window.location.pathname));

    // We own scroll position now (see scrollRestoration below), so stop the
    // browser replaying its own on reload and back/forward.
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
  }

  const router = createRouter({
    routeTree,
    context: { queryClient },
    // Every page opens at the top — including reloads and back/forward.
    // With restoration off the router still scrolls to (0,0) on each render and
    // still honours #hash targets; it just stops replaying a cached position,
    // which was landing reloads halfway down the page.
    scrollRestoration: false,
    defaultPreloadStaleTime: 0,
  });

  return router;
};
