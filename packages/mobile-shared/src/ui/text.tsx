import { Text as RNText, type TextProps, type TextStyle } from "react-native";
import { colors, type as typeScale, type TypeVariant } from "./tokens";

export type AppTextProps = TextProps & {
  variant?: TypeVariant;
  color?: string;
  center?: boolean;
  muted?: boolean;
};

/** Brand-typographic text. `variant` selects size/family from the type scale. */
export function Text({
  variant = "body",
  color,
  center,
  muted,
  style,
  ...rest
}: AppTextProps) {
  const base = typeScale[variant] as TextStyle;
  return (
    <RNText
      {...rest}
      style={[
        base,
        { color: color ?? (muted ? colors.textMuted : colors.text) },
        center ? { textAlign: "center" } : null,
        style,
      ]}
    />
  );
}

/** Convenience heading — defaults to the h2 display style. */
export function Heading({ variant = "h2", ...rest }: AppTextProps) {
  return <Text variant={variant} {...rest} />;
}
