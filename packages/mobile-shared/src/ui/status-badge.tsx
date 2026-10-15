import { View, StyleSheet } from "react-native";
import { Text } from "./text";
import { colors, radius, space } from "./tokens";

type Tone = { bg: string; fg: string };

const NAVY: Tone = { bg: colors.primarySoft, fg: colors.primary };
const AMBER: Tone = { bg: colors.highlightSoft, fg: "#B45309" };
const TEAL: Tone = { bg: colors.accentSoft, fg: colors.accentDeep };
const GREEN: Tone = { bg: colors.successSoft, fg: colors.success };
const RED: Tone = { bg: colors.dangerSoft, fg: colors.danger };
const GRAY: Tone = { bg: colors.surfaceMuted, fg: colors.textMuted };

/** Maps a booking/job status string to a pill tone. */
function toneFor(status: string): Tone {
  const s = status.toLowerCase();
  if (["pending", "unpaid", "requested", "quote", "searching", "dispatching"].includes(s))
    return AMBER;
  if (["assigned", "confirmed", "accepted", "scheduled"].includes(s)) return NAVY;
  if (["en_route", "on_the_way", "arriving", "in_progress", "started"].includes(s)) return TEAL;
  if (["completed", "paid", "done", "finished"].includes(s)) return GREEN;
  if (["cancelled", "canceled", "no_show", "declined", "failed", "refunded"].includes(s))
    return RED;
  return GRAY;
}

function labelFor(status: string): string {
  return status.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export function StatusBadge({ status, dot = true }: { status: string; dot?: boolean }) {
  const tone = toneFor(status);
  return (
    <View style={[styles.badge, { backgroundColor: tone.bg }]}>
      {dot ? <View style={[styles.dot, { backgroundColor: tone.fg }]} /> : null}
      <Text variant="caption" color={tone.fg} style={styles.label}>
        {labelFor(status)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    alignSelf: "flex-start",
    paddingHorizontal: space.md,
    paddingVertical: 5,
    borderRadius: radius.pill,
  },
  dot: { width: 6, height: 6, borderRadius: 3 },
  label: { fontFamily: "Inter_600SemiBold", letterSpacing: 0.2 },
});
