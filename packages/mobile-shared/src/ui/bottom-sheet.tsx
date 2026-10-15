import { useEffect, useRef, useState } from "react";
import {
  Animated,
  PanResponder,
  ScrollView,
  StyleSheet,
  View,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import { colors, radius, shadow, space } from "./tokens";

/**
 * Uber-style bottom sheet: handle drags between collapsed/expanded.
 * When expanded and content is scrolled to the top, a downward drag collapses.
 */
export function BottomSheetScaffold({
  children,
  minHeight,
  maxHeight,
  initial = "expanded",
  bottomInset = 0,
  contentStyle,
  onExpandedChange,
}: {
  children: React.ReactNode;
  minHeight: number;
  maxHeight: number;
  initial?: "collapsed" | "expanded";
  bottomInset?: number;
  contentStyle?: StyleProp<ViewStyle>;
  onExpandedChange?: (expanded: boolean) => void;
}) {
  const startValue = initial === "expanded" ? maxHeight : minHeight;
  const height = useRef(new Animated.Value(startValue)).current;
  const current = useRef(startValue);
  const dragStart = useRef(startValue);
  const scrollY = useRef(0);
  const expandedRef = useRef(initial === "expanded");
  const [scrollEnabled, setScrollEnabled] = useState(true);
  const minH = useRef(minHeight);
  const maxH = useRef(maxHeight);
  minH.current = minHeight;
  maxH.current = maxHeight;

  useEffect(() => {
    const id = height.addListener(({ value }) => {
      current.current = value;
      const expanded = value > (minH.current + maxH.current) / 2;
      if (expanded !== expandedRef.current) {
        expandedRef.current = expanded;
        onExpandedChange?.(expanded);
      }
    });
    return () => height.removeListener(id);
  }, [height, onExpandedChange]);

  const snapTo = (target: number) => {
    Animated.spring(height, {
      toValue: target,
      useNativeDriver: false,
      bounciness: 3,
      speed: 14,
    }).start(({ finished }) => {
      if (!finished) return;
      const expanded = target >= maxH.current - 1;
      expandedRef.current = expanded;
      setScrollEnabled(true);
      onExpandedChange?.(expanded);
    });
  };

  const pan = useRef(
    PanResponder.create({
      // Only the handle claims the gesture — never steal ScrollView touches.
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_e, g) => Math.abs(g.dy) > 6,
      onPanResponderGrant: () => {
        dragStart.current = current.current;
        setScrollEnabled(false);
      },
      onPanResponderMove: (_e, g) => {
        const next = Math.max(minH.current, Math.min(maxH.current, dragStart.current - g.dy));
        height.setValue(next);
      },
      onPanResponderRelease: (_e, g) => {
        const mid = (minH.current + maxH.current) / 2;
        let target: number;
        if (g.vy < -0.35) target = maxH.current;
        else if (g.vy > 0.35) target = minH.current;
        else target = current.current > mid ? maxH.current : minH.current;
        snapTo(target);
      },
      onPanResponderTerminate: () => {
        const mid = (minH.current + maxH.current) / 2;
        snapTo(current.current > mid ? maxH.current : minH.current);
      },
    }),
  ).current;

  /** Pull-down from top of expanded sheet content collapses it. */
  const contentPan = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponder: (_e, g) => {
        if (!expandedRef.current) return false;
        if (scrollY.current > 2) return false;
        return g.dy > 8 && Math.abs(g.dy) > Math.abs(g.dx);
      },
      onPanResponderGrant: () => {
        dragStart.current = current.current;
        setScrollEnabled(false);
      },
      onPanResponderMove: (_e, g) => {
        if (g.dy <= 0) return;
        const next = Math.max(minH.current, Math.min(maxH.current, dragStart.current - g.dy));
        height.setValue(next);
      },
      onPanResponderRelease: (_e, g) => {
        const mid = (minH.current + maxH.current) / 2;
        let target: number;
        if (g.vy > 0.35 || current.current < mid) target = minH.current;
        else target = maxH.current;
        snapTo(target);
      },
      onPanResponderTerminate: () => {
        const mid = (minH.current + maxH.current) / 2;
        snapTo(current.current > mid ? maxH.current : minH.current);
      },
    }),
  ).current;

  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    scrollY.current = e.nativeEvent.contentOffset.y;
  };

  return (
    <Animated.View style={[styles.sheet, shadow.sheet, { height }]}>
      <View style={styles.handleZone} {...pan.panHandlers}>
        <View style={styles.handle} />
      </View>
      <View style={styles.body} {...contentPan.panHandlers}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={[
            {
              padding: space.xl,
              paddingTop: space.sm,
              paddingBottom: bottomInset + space.xxl,
              gap: space.lg,
            },
            contentStyle,
          ]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          scrollEnabled={scrollEnabled}
          bounces
          onScroll={onScroll}
          scrollEventThrottle={16}
        >
          {children}
        </ScrollView>
      </View>
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
  body: { flex: 1 },
  scroll: { flex: 1 },
});
