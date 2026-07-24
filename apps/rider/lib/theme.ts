// Design tokens now live in the shared kit. Re-exported here (with a few
// legacy aliases) so existing imports keep working after the Uber-style redesign.
import { colors as kit } from "@transferaround/mobile-shared/ui";

export const colors = {
  ...kit,
  /** @deprecated use `surface` */
  card: kit.surface,
  /** @deprecated use `textMuted` */
  muted: kit.textMuted,
  /** @deprecated use `highlight` */
  warn: kit.highlight,
};

export { tokens, space, radius, fonts, type, shadow } from "@transferaround/mobile-shared/ui";
