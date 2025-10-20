import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, ScrollView, Animated } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

/**
 * Minimal ChatScreenSkeleton
 * - One compact chat row duplicated 7 times (avatar + two lines + timestamp bubble)
 */

const ChatScreenSkeleton = () => {
  const shimmerAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const insets = useSafeAreaInsets();

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerAnim, {
          toValue: 1,
          duration: 900,
          useNativeDriver: true,
        }),
        Animated.timing(shimmerAnim, {
          toValue: 0,
          duration: 900,
          useNativeDriver: true,
        }),
      ])
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 0.96,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const shimmerTranslate = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-220, 220],
  });

  const SkeletonBox = ({ width, height, borderRadius = 8, style }: any) => (
    <Animated.View
      style={[
        styles.skeletonBox,
        { width, height, borderRadius, transform: [{ scale: pulseAnim }] },
        style,
      ]}
    >
      <Animated.View
        style={[
          styles.shimmer,
          { transform: [{ translateX: shimmerTranslate }] },
        ]}
      />
    </Animated.View>
  );

  const ChatRow = () => (
    <View style={styles.row}>
      <SkeletonBox
        width={44}
        height={44}
        borderRadius={22}
        style={{ marginRight: 12 }}
      />
      <View style={styles.rowText}>
        <SkeletonBox width="55%" height={12} style={{ marginBottom: 6 }} />
        <SkeletonBox width="40%" height={10} />
      </View>
      <SkeletonBox width={48} height={28} borderRadius={14} />
    </View>
  );

  return (
    <ScrollView
      style={[styles.container, { paddingTop: insets.top + 10 }]}
      contentContainerStyle={{ paddingBottom: 24 }}
      showsVerticalScrollIndicator={false}
    >
      {[...Array(7)].map((_, i) => (
        <ChatRow key={i} />
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { backgroundColor: 'transparent' },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  rowText: { flex: 1, marginRight: 12 },
  skeletonBox: {
    backgroundColor: '#00B4D8',
    overflow: 'hidden',
    opacity: 0.95,
  },
  shimmer: {
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(255,255,255,0.06)',
    position: 'absolute',
  },
});

export default ChatScreenSkeleton;
