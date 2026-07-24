import {
  RefreshControl,
  ScrollView,
  View,
  StyleSheet,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import { SafeAreaView, type Edge } from "react-native-safe-area-context";
import { Text } from "./text";
import { colors, space } from "./tokens";

/** Safe-area screen container. Set `scroll` for a padded ScrollView body. */
export function Screen({
  children,
  scroll = false,
  padded = true,
  refreshing,
  onRefresh,
  edges = ["top"],
  contentStyle,
  background = colors.bg,
}: {
  children: React.ReactNode;
  scroll?: boolean;
  padded?: boolean;
  refreshing?: boolean;
  onRefresh?: () => void;
  edges?: Edge[];
  contentStyle?: StyleProp<ViewStyle>;
  background?: string;
}) {
  const pad = padded ? styles.padded : null;
  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: background }]} edges={edges}>
      {scroll ? (
        <ScrollView
          style={styles.flex}
          contentContainerStyle={[styles.scrollContent, pad, contentStyle]}
          showsVerticalScrollIndicator={false}
          refreshControl={
            onRefresh ? (
              <RefreshControl
                refreshing={!!refreshing}
                onRefresh={onRefresh}
                tintColor={colors.accent}
                colors={[colors.accent]}
              />
            ) : undefined
          }
        >
          {children}
        </ScrollView>
      ) : (
        <View style={[styles.flex, pad, contentStyle]}>{children}</View>
      )}
    </SafeAreaView>
  );
}

/** Small uppercase section label. */
export function SectionLabel({ children }: { children: string }) {
  return (
    <Text variant="label" color={colors.textMuted} style={styles.section}>
      {children.toUpperCase()}
    </Text>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  flex: { flex: 1 },
  scrollContent: { gap: space.lg, paddingBottom: space.xxxl + space.lg },
  padded: { paddingHorizontal: space.lg, paddingTop: space.lg },
  section: { marginBottom: space.xs, marginTop: space.xs, letterSpacing: 0.6 },
});
