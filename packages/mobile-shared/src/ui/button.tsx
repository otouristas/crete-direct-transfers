import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  View,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import { Text } from "./text";
import { Icon, type IconName } from "./icon";
import { colors, radius, space } from "./tokens";

export type ButtonVariant = "primary" | "accent" | "outline" | "ghost" | "danger";
export type ButtonSize = "md" | "lg";

const VARIANTS: Record<
  ButtonVariant,
  { bg: string; bgPressed: string; fg: string; border?: string }
> = {
  primary: { bg: colors.primary, bgPressed: colors.primaryPressed, fg: colors.inverse },
  accent: { bg: colors.accent, bgPressed: colors.accentPressed, fg: colors.primary },
  outline: {
    bg: colors.surface,
    bgPressed: colors.surfaceMuted,
    fg: colors.text,
    border: colors.borderStrong,
  },
  ghost: { bg: "transparent", bgPressed: colors.surfaceMuted, fg: colors.primary },
  danger: { bg: colors.danger, bgPressed: "#B91C1C", fg: colors.inverse },
};

export function Button({
  title,
  onPress,
  variant = "primary",
  size = "lg",
  loading = false,
  disabled = false,
  fullWidth = false,
  icon,
  style,
}: {
  title: string;
  onPress?: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  icon?: IconName;
  style?: StyleProp<ViewStyle>;
}) {
  const v = VARIANTS[variant];
  const isDisabled = disabled || loading;
  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.base,
        size === "lg" ? styles.lg : styles.md,
        { backgroundColor: pressed ? v.bgPressed : v.bg },
        v.border ? { borderWidth: 1, borderColor: v.border } : null,
        fullWidth ? { alignSelf: "stretch" } : null,
        isDisabled ? { opacity: 0.55 } : null,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={v.fg} />
      ) : (
        <View style={styles.content}>
          {icon ? <Icon name={icon} size={18} color={v.fg} /> : null}
          <Text variant="subtitle" color={v.fg}>
            {title}
          </Text>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: radius.md,
    alignItems: "center",
    justifyContent: "center",
  },
  md: { paddingVertical: 12, paddingHorizontal: space.lg },
  lg: { paddingVertical: 16, paddingHorizontal: space.xl },
  content: { flexDirection: "row", alignItems: "center", gap: space.sm },
});
