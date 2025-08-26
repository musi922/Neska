import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, FlatList } from 'react-native';
import { useColorScheme } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Analytics, ANALYTICS_EVENTS } from '@/utils/analytics';
import Colors from '@/constants/Colors';
import { FontFamily, FontSize, Spacing } from '@/constants/Theme';
import HeaderBar from '@/components/HeaderBar';
import ContentCard from '@/components/ContentCard';
import LivestreamPreview from '@/components/LivestreamPreview';
import CategoryChip from '@/components/CategoryChip';
import ProfileSummary from '@/components/ProfileSummary';
import OfflineNotice from '@/components/OfflineNotice';

// Mock data
const categories = ['For You', 'Live', 'Following', 'Room'];

const liveStreams = [
  {
    id: '1',
    image: 'https://images.pexels.com/photos/2263936/pexels-photo-2263936.jpeg',
    username: 'musiclover243',
    avatar:
      'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg',
    viewers: 1542,
    category: 'Music',
  },
  {
    id: '2',
    image: 'https://images.pexels.com/photos/9072388/pexels-photo-9072388.jpeg',
    username: 'gamerpro99',
    avatar:
      'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg',
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
    avatar:
      'https://images.pexels.com/photos/1858175/pexels-photo-1858175.jpeg',
    viewers: 321,
    category: 'Music',
  },
  {
    id: '5',
    image: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg',
    username: 'dance_queen',
    avatar:
      'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg',
    viewers: 210,
    category: 'Dance',
  },
  {
    id: '6',
    image: 'https://images.pexels.com/photos/2218786/pexels-photo-2218786.jpeg',
    username: 'comedian_k',
    avatar:
      'https://images.pexels.com/photos/2218786/pexels-photo-2218786.jpeg',
    viewers: 145,
    category: 'Comedy',
  },
];

const creators = [
  {
    id: '1',
    username: 'amani_j',
    avatar:
      'https://images.pexels.com/photos/1858175/pexels-photo-1858175.jpeg',
    isLive: true,
    following: true,
  },
  {
    id: '2',
    username: 'tech_eric',
    avatar:
      'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg',
    isLive: false,
    following: false,
  },
  {
    id: '3',
    username: 'dance_queen',
    avatar:
      'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg',
    isLive: true,
    following: true,
  },
  {
    id: '4',
    username: 'artist_paul',
    avatar:
      'https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg',
    isLive: false,
    following: false,
  },
  {
    id: '5',
    username: 'comedian_k',
    avatar:
      'https://images.pexels.com/photos/2218786/pexels-photo-2218786.jpeg',
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
    avatar:
      'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg',
    likes: 843,
    comments: 76,
    verified: false,
    isLive: false,
    following: true,
  },
];

export default function HomeScreen() {
  const [activeCategory, setActiveCategory] = useState('For You');
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const insets = useSafeAreaInsets();

  // Track screen view
  React.useEffect(() => {
    Analytics.screen('Home', { category: activeCategory });
  }, [activeCategory]);

  // Filtered data for Following
  const followingFeed = feedContent.filter((item) => item.following);
  const followingCreators = creators.filter((c) => c.following);
  const followingLiveStreams = liveStreams.filter((stream) => {
    // Simulate: show live streams from followed creators only
    return followingCreators.some((c) => c.username === stream.username);
  });

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
    Analytics.track(ANALYTICS_EVENTS.USER_ACTION, { action: 'category_changed', category });
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
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

        {/* Popular Creators (show for all except 'Live') */}
        {activeCategory !== 'Live' && (
          <View style={styles.section}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.creatorsScroll}
            >
              {(activeCategory === 'Following'
                ? followingCreators
                : creators
              ).map((creator) => (
                <ProfileSummary
                  key={creator.id}
                  avatar={creator.avatar}
                  username={creator.username}
                  isLive={creator.isLive}
                />
              ))}
            </ScrollView>
          </View>
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
                      No one you follow is live right now.
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
        {/* Room: leave as-is for now */}
      </ScrollView>
    </View>
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
  creatorsScroll: {
    paddingHorizontal: Spacing.md,
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
});
