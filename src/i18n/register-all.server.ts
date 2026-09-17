/**
 * Server-side preload of every locale.
 *
 * Imported once from the Worker entry (`src/server.ts`) so SSR, server
 * functions and the sitemap can call `getDict()` / `getLocalized*()` for any
 * locale synchronously. The client never imports this module: it code-splits
 * the same files per locale and loads only the one it renders.
 */
import { registerDict } from "@/i18n";
import { registerContentOverlay } from "@/i18n/content";
import { el } from "./el";
import { de } from "./de";
import { fr } from "./fr";
import { it } from "./it";
import { nl } from "./nl";
import { es } from "./es";
import elOverlay from "./content/overlays/el";
import deOverlay from "./content/overlays/de";
import frOverlay from "./content/overlays/fr";
import itOverlay from "./content/overlays/it";
import nlOverlay from "./content/overlays/nl";
import esOverlay from "./content/overlays/es";

registerDict("el", el);
registerDict("de", de);
registerDict("fr", fr);
registerDict("it", it);
registerDict("nl", nl);
registerDict("es", es);

registerContentOverlay("el", elOverlay);
registerContentOverlay("de", deOverlay);
registerContentOverlay("fr", frOverlay);
registerContentOverlay("it", itOverlay);
registerContentOverlay("nl", nlOverlay);
registerContentOverlay("es", esOverlay);
