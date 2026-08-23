import { QueryClient } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

export const getRouter = () => {
  const queryClient = new QueryClient();

  // We own scroll position now (see scrollRestoration below), so stop the
  // browser replaying its own on reload and back/forward.
  if (typeof window !== "undefined" && "scrollRestoration" in window.history) {
    window.history.scrollRestoration = "manual";
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
