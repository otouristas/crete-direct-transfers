import { Pressable, View, StyleSheet } from "react-native";
import { Text } from "./text";
import { Icon, type IconName } from "./icon";
import { colors, radius, space } from "./tokens";

/** Uber-style list row: leading icon chip, title/subtitle, trailing slot + chevron. */
export function ListRow({
  icon,
  iconColor = colors.primary,
  iconBg = colors.primarySoft,
  title,
  subtitle,
  trailing,
  onPress,
  showChevron = true,
}: {
  icon?: IconName;
  iconColor?: string;
  iconBg?: string;
  title: string;
  subtitle?: string;
  trailing?: React.ReactNode;
  onPress?: () => void;
  showChevron?: boolean;
}) {
  const inner = (
    <>
      {icon ? (
        <View style={[styles.chip, { backgroundColor: iconBg }]}>
          <Icon name={icon} size={20} color={iconColor} />
        </View>
      ) : null}
      <View style={styles.body}>
        <Text variant="subtitle" numberOfLines={1}>
          {title}
        </Text>
        {subtitle ? (
          <Text variant="caption" color={colors.textMuted} numberOfLines={1}>
            {subtitle}
          </Text>
        ) : null}
      </View>
      {trailing}
      {onPress && showChevron ? (
        <Icon name="chevron-forward" size={18} color={colors.textFaint} />
      ) : null}
    </>
  );

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [
          styles.row,
          pressed ? { backgroundColor: colors.surfaceMuted } : null,
        ]}
      >
        {inner}
      </Pressable>
    );
  }
  return <View style={styles.row}>{inner}</View>;
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.md,
    paddingVertical: space.md,
    paddingHorizontal: space.md,
    borderRadius: radius.md,
  },
  chip: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    alignItems: "center",
    justifyContent: "center",
  },
  body: { flex: 1, gap: 2 },
});
