import { Ionicons } from "@expo/vector-icons";
import { colors } from "./tokens";

export type IconName = keyof typeof Ionicons.glyphMap;

export function Icon({
  name,
  size = 20,
  color = colors.text,
}: {
  name: IconName;
  size?: number;
  color?: string;
}) {
  return <Ionicons name={name} size={size} color={color} />;
}

export { Ionicons };
