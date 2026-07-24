import { View, StyleSheet } from "react-native";
import { Text } from "./text";
import { Icon, type IconName } from "./icon";
import { colors, radius, space } from "./tokens";

export function EmptyState({
  icon = "sparkles-outline",
  title,
  subtitle,
}: {
  icon?: IconName;
  title: string;
  subtitle?: string;
}) {
  return (
    <View style={styles.wrap}>
      <View style={styles.chip}>
        <Icon name={icon} size={28} color={colors.accentDeep} />
      </View>
      <Text variant="title" center>
        {title}
      </Text>
      {subtitle ? (
        <Text variant="body" color={colors.textMuted} center>
          {subtitle}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: "center",
    gap: space.md,
    paddingVertical: space.xxxl,
    paddingHorizontal: space.xl,
  },
  chip: {
    width: 64,
    height: 64,
    borderRadius: radius.xl,
    backgroundColor: colors.accentSoft,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: space.xs,
  },
});
