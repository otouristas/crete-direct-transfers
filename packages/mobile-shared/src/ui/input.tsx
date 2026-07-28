import { useState } from "react";
import {
  Pressable,
  TextInput,
  View,
  StyleSheet,
  type TextInputProps,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import { Text } from "./text";
import { Icon, type IconName } from "./icon";
import { colors, radius, space } from "./tokens";

export type FieldProps = TextInputProps & {
  label?: string;
  error?: string | null;
  icon?: IconName;
  containerStyle?: StyleProp<ViewStyle>;
};

/** Labeled text field with a turquoise focus ring. */
export function Field({
  label,
  error,
  icon,
  containerStyle,
  style,
  onFocus,
  onBlur,
  ...rest
}: FieldProps) {
  const [focused, setFocused] = useState(false);
  return (
    <View style={[{ gap: space.sm }, containerStyle]}>
      {label ? (
        <Text variant="label" color={colors.textMuted}>
          {label}
        </Text>
      ) : null}
      <View style={[styles.field, focused ? styles.focused : null, error ? styles.errored : null]}>
        {icon ? <Icon name={icon} size={18} color={colors.textFaint} /> : null}
        <TextInput
          placeholderTextColor={colors.textFaint}
          {...rest}
          onFocus={(e) => {
            setFocused(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            onBlur?.(e);
          }}
          style={[styles.input, style]}
        />
      </View>
      {error ? (
        <Text variant="caption" color={colors.danger}>
          {error}
        </Text>
      ) : null}
    </View>
  );
}

/** Numeric +/- stepper (passenger / bag counts). */
export function Stepper({
  value,
  onChange,
  min = 1,
  max = 16,
}: {
  value: number;
  onChange: (next: number) => void;
  min?: number;
  max?: number;
}) {
  return (
    <View style={styles.stepper}>
      <Pressable
        onPress={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        style={({ pressed }) => [
          styles.stepBtn,
          pressed ? { backgroundColor: colors.surfaceMuted } : null,
          value <= min ? { opacity: 0.4 } : null,
        ]}
      >
        <Icon name="remove" size={20} color={colors.primary} />
      </Pressable>
      <Text variant="title" style={styles.stepValue}>
        {value}
      </Text>
      <Pressable
        onPress={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        style={({ pressed }) => [
          styles.stepBtn,
          pressed ? { backgroundColor: colors.surfaceMuted } : null,
          value >= max ? { opacity: 0.4 } : null,
        ]}
      >
        <Icon name="add" size={20} color={colors.primary} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  field: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.sm,
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: space.lg,
    minHeight: 52,
  },
  focused: { borderColor: colors.accent },
  errored: { borderColor: colors.danger },
  input: {
    flex: 1,
    paddingVertical: 14,
    fontFamily: "Inter_500Medium",
    fontSize: 15,
    color: colors.text,
  },
  stepper: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.pill,
    padding: 4,
    gap: space.md,
  },
  stepBtn: {
    width: 40,
    height: 40,
    borderRadius: radius.pill,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.surfaceMuted,
  },
  stepValue: { minWidth: 24, textAlign: "center" },
});
