import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Animated } from 'react-native';
import { useColorScheme } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Analytics, ANALYTICS_EVENTS } from '@/utils/analytics';
import Colors from '@/constants/Colors';
import { FontFamily, FontSize, Spacing } from '@/constants/Theme';
import HeaderBar from '@/components/HeaderBar';
import ContentCard from '@/components/ContentCard';
import LivestreamPreview from '@/components/LivestreamPreview';
import CategoryChip from '@/components/CategoryChip';
import OfflineNotice from '@/components/OfflineNotice';
import { router } from 'expo-router';
import StoriesSection from '@/components/StoriesSection';
import HomeScreenSkeleton from '@/components/skeletons/HomeScreenSkeleton'; // Import the skeleton

// Mock data
const categories = ['For You', 'Stories', 'Watch', 'Live', 'Following'];

const liveStreams = [
  {
    id: '1',
    image: 'https://images.pexels.com/photos/2263936/pexels-photo-2263936.jpeg',
    username: 'musiclover243',
    avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg',
    viewers: 1542,
    category: 'Music',
  },
  {
    id: '2',
    image: 'https://images.pexels.com/photos/9072388/pexels-photo-9072388.jpeg',
    username: 'gamerpro99',
    avatar: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg',
    viewers: 872,
    category: 'Gaming',
  },
  {
    id: '3',
    image: 'https://images.pexels.com/photos/5650026/pexels-photo-5650026.jpeg',
    title: 'Cooking traditional Rwandan dishes',
    username: 'chef_marie',
    avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg',
    viewers: 693,
    category: 'Food',
  },
  {
    id: '4',
    image: 'https://images.pexels.com/photos/1858175/pexels-photo-1858175.jpeg',
    username: 'amani_j',
    avatar: 'https://images.pexels.com/photos/1858175/pexels-photo-1858175.jpeg',
    viewers: 321,
    category: 'Music',
  },
  {
    id: '5',
    image: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg',
    username: 'dance_queen',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg',
    viewers: 210,
    category: 'Dance',
  },
  {
    id: '6',
    image: 'https://images.pexels.com/photos/2218786/pexels-photo-2218786.jpeg',
    username: 'comedian_k',
    avatar: 'https://images.pexels.com/photos/2218786/pexels-photo-2218786.jpeg',
    viewers: 145,
    category: 'Comedy',
  },
];

const creators = [
  {
    id: '1',
    username: 'amani_j',
    avatar: 'https://images.pexels.com/photos/1858175/pexels-photo-1858175.jpeg',
    isLive: true,
    following: true,
  },
  {
    id: '2',
    username: 'tech_eric',
    avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg',
    isLive: false,
    following: false,
  },
  {
    id: '3',
    username: 'dance_queen',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg',
    isLive: true,
    following: true,
  },
  {
    id: '4',
    username: 'artist_paul',
    avatar: 'https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg',
    isLive: false,
    following: false,
  },
  {
    id: '5',
    username: 'comedian_k',
    avatar: 'https://images.pexels.com/photos/2218786/pexels-photo-2218786.jpeg',
    isLive: true,
    following: true,
  },
];

const feedContent = [
  {
    id: '1',
    image: 'https://images.pexels.com/photos/3889856/pexels-photo-3889856.jpeg',
    title: 'Sunset over Lake Kivu - the most beautiful place in Rwanda',
    username: 'travel_with_me',
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg',
    likes: 2463,
    comments: 184,
    verified: true,
    isLive: false,
    following: false,
  },
  {
    id: '2',
    image: 'https://images.pexels.com/photos/2263436/pexels-photo-2263436.jpeg',
    title: 'The new Kigali Convention Center looks amazing at night!',
    username: 'rwandan_architect',
    avatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg',
    likes: 1872,
    comments: 92,
    verified: true,
    isLive: false,
    following: false,
  },
  {
    id: '3',
    image: 'https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg',
    title: 'Join my live class tomorrow on digital marketing strategies',
    username: 'business_coach',
    avatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg',
    likes: 843,
    comments: 76,
    verified: false,
    isLive: false,
    following: true,
  },
];

const watchVideos = [
  {
    id: '1',
    thumbnail: 'https://images.pexels.com/photos/1190297/pexels-photo-1190297.jpeg',
    title: 'How to Make Traditional Rwandan Coffee | Complete Guide',
    username: 'coffee_master_rw',
    avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg',
    views: 45000,
    duration: '12:34',
    uploadedAt: '2 days ago',
    verified: true,
  },
  {
    id: '2',
    thumbnail: 'https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg',
    title: 'Stand-up Comedy Night in Kigali - Best Moments 2024',
    username: 'comedian_k',
    avatar: 'https://images.pexels.com/photos/2218786/pexels-photo-2218786.jpeg',
    views: 128000,
    duration: '25:18',
    uploadedAt: '1 week ago',
    verified: false,
  },
  {
    id: '3',
    thumbnail: 'https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg',
    title: 'Afrobeat Dance Tutorial - Learn the Latest Moves',
    username: 'dance_queen',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg',
    views: 89000,
    duration: '8:45',
    uploadedAt: '3 days ago',
    verified: true,
  },
  {
    id: '4',
    thumbnail: 'https://images.pexels.com/photos/1917838/pexels-photo-1917838.jpeg',
    title: 'Top 10 Places to Visit in Rwanda | Travel Vlog',
    username: 'travel_with_me',
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg',
    views: 210000,
    duration: '15:22',
    uploadedAt: '5 days ago',
    verified: true,
  },
  {
    id: '5',
    thumbnail: 'https://images.pexels.com/photos/1267697/pexels-photo-1267697.jpeg',
    title: 'Learn Python in 30 Minutes - Beginner Crash Course',
    username: 'tech_eric',
    avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg',
    views: 156000,
    duration: '30:15',
    uploadedAt: '1 week ago',
    verified: true,
  },
  {
    id: '6',
    thumbnail: 'https://images.pexels.com/photos/1109197/pexels-photo-1109197.jpeg',
    title: 'New Afrobeat Mix 2024 | Best African Music Playlist',
    username: 'musiclover243',
    avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg',
    views: 340000,
    duration: '45:00',
    uploadedAt: '2 weeks ago',
    verified: false,
  },
];

// Simulate data fetching
async function fetchData(): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, 2500)); // 2.5 seconds loading time
}

export default function HomeScreen() {
  const [activeCategory, setActiveCategory] = useState('For You');
  const [isLoading, setIsLoading] = useState(true);
  const fadeAnim = React.useRef(new Animated.Value(1)).current;
  const contentFadeAnim = React.useRef(new Animated.Value(0)).current;
  
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const insets = useSafeAreaInsets();

  useEffect(() => {
    // Fetch data on mount
    fetchData().then(() => {
      // Fade out skeleton
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }).start(() => {
        setIsLoading(false);
        // Fade in content
        Animated.timing(contentFadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }).start();
      });

// Key changes made:
// 1. Added HomeScreenSkeleton import at the top
// 2. Added isLoading state and fadeAnim refs for smooth transitions
// 3. fetchData() simulates 2.5 second loading (you can adjust this)
// 4. Skeleton shows first, then fades out
// 5. Real content fades in smoothly after skeleton disappears
// 6. Images load in the background while skeleton is visible
    });
  }, []);

  // Track screen view
  React.useEffect(() => {
    Analytics.screen('Home', { category: activeCategory });
  }, [activeCategory]);

  // Filtered data for Following
  const followingFeed = feedContent.filter((item) => item.following);
  const followingCreators = creators.filter((c) => c.following);
  const followingLiveStreams = liveStreams.filter((stream) => {
    return followingCreators.some((c) => c.username === stream.username);
  });

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
    Analytics.track(ANALYTICS_EVENTS.USER_ACTION, { action: 'category_changed', category });
  };

  // Show skeleton while loading
  if (isLoading) {
    return (
      <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
        <HomeScreenSkeleton />
      </Animated.View>
    );
  }

  // Show actual content after loading
  return (
    <Animated.View style={[styles.container, { backgroundColor: colors.background, opacity: contentFadeAnim }]}>
      <OfflineNotice />
      <HeaderBar />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: 60 + insets.top },
        ]}
      >
        {/* Categories */}
        <View style={styles.categoriesContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesScroll}
          >
            {categories.map((category) => (
              <CategoryChip
                key={category}
                label={category}
                isActive={activeCategory === category}
                onPress={() => handleCategoryChange(category)}
              />
            ))}
          </ScrollView>
        </View>

        {/* Show StoriesSection only when Stories category is selected */}
        {activeCategory === 'Stories' && (
          <StoriesSection 
            stories={creators} 
            onStoryPress={(story) => {
              console.log('Story pressed:', story.username);
              router.push(`/story/${story.id}`);
            }}
          />
        )}

        {/* Live Now (horizontal for For You/Following, vertical for Live) */}
        {(activeCategory === 'For You' ||
          activeCategory === 'Live' ||
          activeCategory === 'Following') && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Live Now
            </Text>
            {activeCategory === 'Live' ? (
              <View style={styles.liveColumn}>
                {liveStreams.map((stream) => (
                  <LivestreamPreview
                    key={stream.id}
                    image={stream.image}
                    username={stream.username}
                    avatar={stream.avatar}
                    viewers={stream.viewers}
                    category={stream.category}
                    style={{ width: '100%', marginRight: 0 }}
                  />
                ))}
              </View>
            ) : (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.liveScroll}
              >
                {activeCategory === 'Following' ? (
                  followingLiveStreams.length === 0 ? (
                    <Text
                      style={{
                        color: colors.text,
                        opacity: 0.6,
                        marginLeft: 16,
                        alignSelf: 'center',
                      }}
                    >
                      No one you follow is live
                    </Text>
                  ) : (
                    followingLiveStreams.map((stream) => (
                      <LivestreamPreview
                        key={stream.id}
                        image={stream.image}
                        username={stream.username}
                        avatar={stream.avatar}
                        viewers={stream.viewers}
                        category={stream.category}
                      />
                    ))
                  )
                ) : (
                  liveStreams.map((stream) => (
                    <LivestreamPreview
                      key={stream.id}
                      image={stream.image}
                      username={stream.username}
                      avatar={stream.avatar}
                      viewers={stream.viewers}
                      category={stream.category}
                    />
                  ))
                )}
              </ScrollView>
            )}
          </View>
        )}

        {/* Watch Section (show only for 'Watch') */}
        {activeCategory === 'Watch' && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Recommended Videos
            </Text>
            <View style={styles.watchContainer}>
              {watchVideos.map((video) => (
                <TouchableOpacity 
                  key={video.id} 
                  style={styles.videoCard}
                  onPress={() => console.log('Video pressed:', video.title)}
                >
                  <View style={styles.thumbnailContainer}>
                    <Image 
                      source={{ uri: video.thumbnail }} 
                      style={styles.videoThumbnail}
                      resizeMode="cover"
                    />
                    <View style={styles.durationBadge}>
                      <Text style={styles.durationText}>{video.duration}</Text>
                    </View>
                  </View>
                  <View style={styles.videoInfo}>
                    <Image 
                      source={{ uri: video.avatar }} 
                      style={styles.videoAvatar}
                    />
                    <View style={styles.videoDetails}>
                      <Text style={[styles.videoTitle, { color: colors.text }]} numberOfLines={2}>
                        {video.title}
                      </Text>
                      <View style={styles.videoMeta}>
                        <Text style={[styles.videoUsername, { color: colors.text }]}>
                          {video.username}
                          {video.verified && ' ✓'}
                        </Text>
                        <Text style={[styles.videoStats, { color: colors.text }]}>
                          {video.views.toLocaleString()} views • {video.uploadedAt}
                        </Text>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* For You Feed (show only for 'For You') */}
        {activeCategory === 'For You' && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              For You
            </Text>
            <View style={styles.feedContainer}>
              {feedContent.map((content) => (
                <ContentCard
                  key={content.id}
                  image={content.image}
                  title={content.title}
                  username={content.username}
                  avatar={content.avatar}
                  likes={content.likes}
                  comments={content.comments}
                  verified={content.verified}
                  isLive={content.isLive}
                />
              ))}
            </View>
          </View>
        )}

        {/* Following Feed (show only for 'Following') */}
        {activeCategory === 'Following' && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Following
            </Text>
            <View style={styles.feedContainer}>
              {followingFeed.length === 0 ? (
                <Text style={{ color: colors.text, opacity: 0.6 }}>
                  No posts from people you follow yet.
                </Text>
              ) : (
                followingFeed.map((content) => (
                  <ContentCard
                    key={content.id}
                    image={content.image}
                    title={content.title}
                    username={content.username}
                    avatar={content.avatar}
                    likes={content.likes}
                    comments={content.comments}
                    verified={content.verified}
                    isLive={content.isLive}
                    isFollowing={true}
                  />
                ))
              )}
            </View>
          </View>
        )}
      </ScrollView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
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
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.lg,
    marginHorizontal: Spacing.md,
    marginBottom: Spacing.md,
  },
  liveScroll: {
    paddingHorizontal: Spacing.md,
  },
  feedContainer: {
    alignItems: 'center',
  },
  liveColumn: {
    gap: 16,
    paddingHorizontal: Spacing.md,
  },
  watchContainer: {
    paddingHorizontal: Spacing.md,
    gap: 16,
  },
  videoCard: {
    marginBottom: 16,
  },
  thumbnailContainer: {
    position: 'relative',
    width: '100%',
    height: 200,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 12,
  },
  videoThumbnail: {
    width: '100%',
    height: '100%',
  },
  durationBadge: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.8)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  durationText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontFamily: FontFamily.medium,
  },
  videoInfo: {
    flexDirection: 'row',
    gap: 12,
  },
  videoAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  videoDetails: {
    flex: 1,
  },
  videoTitle: {
    fontFamily: FontFamily.semiBold,
    fontSize: 14,
    marginBottom: 4,
    lineHeight: 20,
  },
  videoMeta: {
    gap: 2,
  },
  videoUsername: {
    fontSize: 12,
    opacity: 0.7,
    fontFamily: FontFamily.medium,
  },
  videoStats: {
    fontSize: 12,
    opacity: 0.6,
    fontFamily: FontFamily.regular,
  },
});