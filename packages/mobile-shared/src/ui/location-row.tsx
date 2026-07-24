import { View, StyleSheet } from "react-native";
import { Text } from "./text";
import { colors, space } from "./tokens";

/**
 * Uber-style origin → destination rail: filled accent dot, dotted connector,
 * navy destination square, with a text row beside each node.
 */
export function RouteRail({
  from,
  to,
  fromLabel = "Pickup",
  toLabel = "Drop-off",
  compact = false,
}: {
  from: string;
  to: string;
  fromLabel?: string;
  toLabel?: string;
  compact?: boolean;
}) {
  return (
    <View style={styles.wrap}>
      <View style={styles.rail}>
        <View style={styles.dot} />
        <View style={styles.line} />
        <View style={styles.square} />
      </View>
      <View style={styles.rows}>
        <View style={[styles.row, compact ? null : styles.rowSpaced]}>
          {!compact ? (
            <Text variant="caption" color={colors.textFaint}>
              {fromLabel}
            </Text>
          ) : null}
          <Text variant="subtitle" numberOfLines={1}>
            {from}
          </Text>
        </View>
        <View style={styles.row}>
          {!compact ? (
            <Text variant="caption" color={colors.textFaint}>
              {toLabel}
            </Text>
          ) : null}
          <Text variant="subtitle" numberOfLines={1}>
            {to}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flexDirection: "row", gap: space.md, alignItems: "stretch" },
  rail: { width: 14, alignItems: "center", paddingVertical: 6 },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 3,
    borderColor: colors.accent,
    backgroundColor: colors.surface,
  },
  line: {
    flex: 1,
    width: 2,
    marginVertical: 3,
    borderRadius: 1,
    backgroundColor: colors.borderStrong,
  },
  square: {
    width: 11,
    height: 11,
    borderRadius: 3,
    backgroundColor: colors.primary,
  },
  rows: { flex: 1, justifyContent: "space-between", gap: space.md },
  row: { gap: 2 },
  rowSpaced: { marginBottom: space.sm },
});
