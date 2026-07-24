import {
  Pressable,
  View,
  StyleSheet,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import { colors, radius, shadow, space } from "./tokens";

export type CardProps = {
  children: React.ReactNode;
  onPress?: () => void;
  padded?: boolean;
  elevated?: boolean;
  bordered?: boolean;
  selected?: boolean;
  style?: StyleProp<ViewStyle>;
};

/** White surface card. Elevated by default; tap-able when `onPress` is set. */
export function Card({
  children,
  onPress,
  padded = true,
  elevated = true,
  bordered = true,
  selected = false,
  style,
}: CardProps) {
  const base: StyleProp<ViewStyle> = [
    styles.card,
    padded ? styles.padded : null,
    bordered ? styles.bordered : null,
    elevated ? shadow.card : null,
    selected ? styles.selected : null,
    style,
  ];

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [base, pressed ? { opacity: 0.9 } : null]}
      >
        {children}
      </Pressable>
    );
  }
  return <View style={base}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
  },
  padded: { padding: space.lg },
  bordered: { borderWidth: 1, borderColor: colors.border },
  selected: { borderColor: colors.accent, borderWidth: 2 },
});
