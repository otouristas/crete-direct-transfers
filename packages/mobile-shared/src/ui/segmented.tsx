import { Pressable, View, StyleSheet } from "react-native";
import { Text } from "./text";
import { colors, radius, space } from "./tokens";

export type SegmentOption<T extends string> = { value: T; label: string };

/** Pill segmented control (e.g. one-way / round-trip). */
export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
}: {
  options: SegmentOption<T>[];
  value: T;
  onChange: (next: T) => void;
}) {
  return (
    <View style={styles.track}>
      {options.map((opt) => {
        const active = opt.value === value;
        return (
          <Pressable
            key={opt.value}
            onPress={() => onChange(opt.value)}
            style={[styles.segment, active ? styles.segmentActive : null]}
          >
            <Text variant="subtitle" color={active ? colors.primary : colors.textMuted}>
              {opt.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    flexDirection: "row",
    backgroundColor: colors.surfaceMuted,
    borderRadius: radius.pill,
    padding: 4,
    gap: 4,
  },
  segment: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    borderRadius: radius.pill,
  },
  segmentActive: {
    backgroundColor: colors.surface,
    shadowColor: "#0B2545",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
});
