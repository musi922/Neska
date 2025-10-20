import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, ScrollView, Animated } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Spacing } from '@/constants/Theme';

const HomeScreenSkeleton = () => {
  const shimmerAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const insets = useSafeAreaInsets();

  useEffect(() => {
    // Shimmer animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(shimmerAnim, {
          toValue: 0,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Pulse animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 0.85,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const shimmerTranslate = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-350, 350],
  });

  const SkeletonBox = ({ 
    width, 
    height, 
    borderRadius = 8, 
    style 
  }: { 
    width: number | string; 
    height: number; 
    borderRadius?: number; 
    style?: any 
  }) => (
    <Animated.View
      style={[
        styles.skeletonBox,
        {
          width,
          height,
          borderRadius,
          transform: [{ scale: pulseAnim }],
        },
        style,
      ]}
    >
      <Animated.View
        style={[
          styles.shimmer,
          {
            transform: [{ translateX: shimmerTranslate }],
          },
        ]}
      />
    </Animated.View>
  );

  const CategoryChipSkeleton = () => (
    <SkeletonBox width={80} height={32} borderRadius={16} style={{ marginRight: 8 }} />
  );

  const LiveStreamSkeleton = () => (
    <View style={{ marginRight: 12 }}>
      <SkeletonBox width={180} height={240} borderRadius={12} />
      <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8 }}>
        <SkeletonBox width={32} height={32} borderRadius={16} style={{ marginRight: 8 }} />
        <View style={{ flex: 1 }}>
          <SkeletonBox width="80%" height={12} style={{ marginBottom: 4 }} />
          <SkeletonBox width="50%" height={10} />
        </View>
      </View>
    </View>
  );

  const ContentCardSkeleton = () => (
    <View style={{ marginBottom: 24, width: '100%' }}>
      <SkeletonBox width="100%" height={300} borderRadius={16} style={{ marginBottom: 12 }} />
      <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
        <SkeletonBox width={40} height={40} borderRadius={20} />
        <View style={{ flex: 1, marginLeft: 12 }}>
          <SkeletonBox width="70%" height={14} style={{ marginBottom: 6 }} />
          <SkeletonBox width="90%" height={12} style={{ marginBottom: 8 }} />
          <View style={{ flexDirection: 'row' }}>
            <SkeletonBox width={60} height={10} style={{ marginRight: 16 }} />
            <SkeletonBox width={60} height={10} />
          </View>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header Skeleton */}
      <View style={[styles.header, { paddingTop: 50 + insets.top }]}>
        <SkeletonBox width={120} height={32} borderRadius={8} />
        <View style={{ flexDirection: 'row' }}>
          <SkeletonBox width={32} height={32} borderRadius={16} style={{ marginRight: 12 }} />
          <SkeletonBox width={32} height={32} borderRadius={16} />
        </View>
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={[styles.scrollContent, { paddingTop: 60 + insets.top }]}
      >
        {/* Categories Skeleton */}
        <View style={styles.categoriesContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesScroll}
          >
            {[...Array(5)].map((_, i) => (
              <CategoryChipSkeleton key={i} />
            ))}
          </ScrollView>
        </View>

        {/* Live Now Section */}
        <View style={styles.section}>
          <SkeletonBox width={100} height={24} style={{ marginBottom: 16, marginLeft: 16 }} />
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.liveScroll}
          >
            {[...Array(3)].map((_, i) => (
              <LiveStreamSkeleton key={i} />
            ))}
          </ScrollView>
        </View>

        {/* Feed Section */}
        <View style={styles.section}>
          <SkeletonBox width={80} height={24} style={{ marginBottom: 16, marginLeft: 16 }} />
          <View style={styles.feedContainer}>
            {[...Array(3)].map((_, i) => (
              <ContentCardSkeleton key={i} />
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: '#000',
  },
  scrollContent: {
        marginTop: 24,
    paddingBottom: 80,
  },
  categoriesContainer: {
    marginBottom: Spacing.md,
  },
  categoriesScroll: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  section: {
    marginBottom: 24,
  },
  liveScroll: {
    paddingHorizontal: 16,
  },
  feedContainer: {
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  skeletonBox: {
    backgroundColor: '#00B4D8',
    overflow: 'hidden',
  },
  shimmer: {
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    position: 'absolute',
  },
});

export default HomeScreenSkeleton;