import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, ScrollView, Animated } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

/**
 * Minimal NotificationsSkeleton
 * - One compact notification row duplicated 7 times
 */

const NotificationsSkeleton = () => {
  const shimmerAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const insets = useSafeAreaInsets();

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(shimmerAnim, {
          toValue: 0,
          duration: 1000,
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
    outputRange: [-200, 200],
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

  const NotificationRow = () => (
    <View style={styles.notificationItem}>
      <View style={styles.notificationContent}>
        <SkeletonBox
          width={44}
          height={44}
          borderRadius={22}
          style={{ marginRight: 12 }}
        />
        <View style={styles.textContainer}>
          <SkeletonBox width="60%" height={12} style={{ marginBottom: 6 }} />
          <SkeletonBox width="40%" height={10} />
        </View>
        <SkeletonBox width={44} height={44} borderRadius={8} />
      </View>
    </View>
  );

  return (
    <ScrollView
      style={[styles.container, { paddingTop: insets.top + 10 }]}
      contentContainerStyle={{ paddingBottom: 24 }}
      showsVerticalScrollIndicator={false}
    >
      {[...Array(7)].map((_, i) => (
        <NotificationRow key={i} />
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { backgroundColor: 'transparent' },
  notificationItem: {
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  notificationContent: { flexDirection: 'row', alignItems: 'center' },
  textContainer: { flex: 1, marginRight: 12 },
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

export default NotificationsSkeleton;
