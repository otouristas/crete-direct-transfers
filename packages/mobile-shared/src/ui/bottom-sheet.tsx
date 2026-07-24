import { useEffect, useRef } from "react";
import {
  Animated,
  PanResponder,
  ScrollView,
  StyleSheet,
  View,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import { colors, radius, shadow, space } from "./tokens";

/**
 * Uber-style draggable bottom sheet built on RN's own Animated + PanResponder
 * (no reanimated / gesture-handler native config). The grab handle drags the
 * sheet between `minHeight` and `maxHeight`; inner content scrolls freely.
 */
export function BottomSheetScaffold({
  children,
  minHeight,
  maxHeight,
  initial = "expanded",
  bottomInset = 0,
  contentStyle,
}: {
  children: React.ReactNode;
  minHeight: number;
  maxHeight: number;
  initial?: "collapsed" | "expanded";
  bottomInset?: number;
  contentStyle?: StyleProp<ViewStyle>;
}) {
  const startValue = initial === "expanded" ? maxHeight : minHeight;
  const height = useRef(new Animated.Value(startValue)).current;
  const current = useRef(startValue);
  const dragStart = useRef(startValue);

  useEffect(() => {
    const id = height.addListener(({ value }) => {
      current.current = value;
    });
    return () => height.removeListener(id);
  }, [height]);

  const pan = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_e, g) => Math.abs(g.dy) > 4,
      onPanResponderGrant: () => {
        dragStart.current = current.current;
      },
      onPanResponderMove: (_e, g) => {
        const next = Math.max(minHeight, Math.min(maxHeight, dragStart.current - g.dy));
        height.setValue(next);
      },
      onPanResponderRelease: (_e, g) => {
        const mid = (minHeight + maxHeight) / 2;
        let target: number;
        if (g.vy < -0.4) target = maxHeight;
        else if (g.vy > 0.4) target = minHeight;
        else target = current.current > mid ? maxHeight : minHeight;
        Animated.spring(height, {
          toValue: target,
          useNativeDriver: false,
          bounciness: 3,
          speed: 14,
        }).start();
      },
    }),
  ).current;

  return (
    <Animated.View style={[styles.sheet, shadow.sheet, { height }]}>
      <View style={styles.handleZone} {...pan.panHandlers}>
        <View style={styles.handle} />
      </View>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          { padding: space.xl, paddingTop: space.sm, paddingBottom: bottomInset + space.xxl, gap: space.lg },
          contentStyle,
        ]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {children}
      </ScrollView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  sheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    overflow: "hidden",
  },
  handleZone: { alignItems: "center", paddingTop: space.md, paddingBottom: space.xs },
  handle: {
    width: 44,
    height: 5,
    borderRadius: 3,
    backgroundColor: colors.borderStrong,
  },
  scroll: { flex: 1 },
});
