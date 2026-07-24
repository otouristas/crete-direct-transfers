import { View, StyleSheet } from "react-native";
import { Text } from "./text";
import { colors, radius, space } from "./tokens";

export function Divider({ inset = 0 }: { inset?: number }) {
  return <View style={[styles.divider, { marginHorizontal: inset }]} />;
}

/** Circular initials avatar. */
export function Avatar({
  name,
  size = 56,
  bg = colors.primary,
  fg = colors.inverse,
}: {
  name?: string | null;
  size?: number;
  bg?: string;
  fg?: string;
}) {
  const initials = (name ?? "")
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("");
  return (
    <View style={[styles.avatar, { width: size, height: size, borderRadius: size / 2, backgroundColor: bg }]}>
      <Text style={{ fontFamily: "PlusJakartaSans_700Bold", fontSize: size * 0.36, color: fg }}>
        {initials || "?"}
      </Text>
    </View>
  );
}

/** Compact metric tile for the driver dashboard row. */
export function StatTile({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon?: React.ReactNode;
}) {
  return (
    <View style={styles.tile}>
      {icon ? <View style={styles.tileIcon}>{icon}</View> : null}
      <Text style={styles.tileValue}>{value}</Text>
      <Text variant="caption" color={colors.textMuted}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  divider: { height: 1, backgroundColor: colors.border },
  avatar: { alignItems: "center", justifyContent: "center" },
  tile: {
    flex: 1,
    alignItems: "center",
    gap: 2,
    paddingVertical: space.md,
  },
  tileIcon: { marginBottom: 2 },
  tileValue: { fontFamily: "PlusJakartaSans_700Bold", fontSize: 20, color: colors.text },
});
