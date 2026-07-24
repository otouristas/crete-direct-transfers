import { View, StyleSheet } from "react-native";
import { Text } from "./text";
import { Icon } from "./icon";
import { colors, space } from "./tokens";

export type ProgressStep = { key: string; label: string };

/** Horizontal lifecycle stepper (pending → assigned → en route → completed). */
export function ProgressStepper({
  steps,
  currentIndex,
}: {
  steps: ProgressStep[];
  currentIndex: number;
}) {
  return (
    <View style={styles.wrap}>
      <View style={styles.track}>
        {steps.map((step, i) => {
          const done = i < currentIndex;
          const active = i === currentIndex;
          const reached = i <= currentIndex;
          return (
            <View key={step.key} style={styles.stepCol}>
              {i > 0 ? (
                <View
                  style={[
                    styles.connector,
                    { backgroundColor: reached ? colors.accent : colors.border },
                  ]}
                />
              ) : (
                <View style={styles.connectorSpacer} />
              )}
              <View
                style={[
                  styles.node,
                  reached ? styles.nodeReached : styles.nodeIdle,
                  active ? styles.nodeActive : null,
                ]}
              >
                {done ? (
                  <Icon name="checkmark" size={14} color={colors.inverse} />
                ) : (
                  <View
                    style={[
                      styles.innerDot,
                      { backgroundColor: reached ? colors.inverse : colors.textFaint },
                    ]}
                  />
                )}
              </View>
            </View>
          );
        })}
      </View>
      <View style={styles.labels}>
        {steps.map((step, i) => (
          <Text
            key={step.key}
            variant="caption"
            center
            color={i <= currentIndex ? colors.text : colors.textFaint}
            style={styles.label}
          >
            {step.label}
          </Text>
        ))}
      </View>
    </View>
  );
}

const NODE = 26;

const styles = StyleSheet.create({
  wrap: { gap: space.sm },
  track: { flexDirection: "row", alignItems: "center" },
  stepCol: { flex: 1, flexDirection: "row", alignItems: "center" },
  connector: { flex: 1, height: 3, borderRadius: 2 },
  connectorSpacer: { flex: 1 },
  node: {
    width: NODE,
    height: NODE,
    borderRadius: NODE / 2,
    alignItems: "center",
    justifyContent: "center",
  },
  nodeReached: { backgroundColor: colors.accent },
  nodeIdle: { backgroundColor: colors.surfaceMuted, borderWidth: 1, borderColor: colors.border },
  nodeActive: {
    shadowColor: colors.accent,
    shadowOpacity: 0.4,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 0 },
    elevation: 4,
  },
  innerDot: { width: 8, height: 8, borderRadius: 4 },
  labels: { flexDirection: "row" },
  label: { flex: 1 },
});
