import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Image } from 'react-native';
import { useColorScheme } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Search, Mic, TrendingUp, Flame, Star, Music, Gamepad2, BookOpen, Award } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import { FontFamily, FontSize, Spacing, BorderRadius, Shadow } from '@/constants/Theme';
import HeaderBar from '@/components/HeaderBar';
import ContentCard from '@/components/ContentCard';

// Mock data
const trendingTopics = [
  { id: '1', name: 'Rwanda', count: '2.3K posts', icon: <TrendingUp size={20} color="#6D28D9" /> },
  { id: '2', name: 'Music Festival', count: '1.8K posts', icon: <Music size={20} color="#F97316" /> },
  { id: '3', name: 'Gaming', count: '1.5K posts', icon: <Gamepad2 size={20} color="#0D9488" /> },
  { id: '4', name: 'Education', count: '1.2K posts', icon: <BookOpen size={20} color="#EF4444" /> },
];

const exploreCategories = [
  { id: '1', name: 'Trending', icon: <Flame size={24} color="#F97316" /> },
  { id: '2', name: 'Popular', icon: <Star size={24} color="#EAB308" /> },
  { id: '3', name: 'Music', icon: <Music size={24} color="#8B5CF6" /> },
  { id: '4', name: 'Gaming', icon: <Gamepad2 size={24} color="#0D9488" /> },
  { id: '5', name: 'Education', icon: <BookOpen size={24} color="#3B82F6" /> },
  { id: '6', name: 'Awards', icon: <Award size={24} color="#EF4444" /> },
];

const featuredContent = [
  {
    id: '1',
    image: 'https://images.pexels.com/photos/7012886/pexels-photo-7012886.jpeg',
    title: 'Exploring the hills of Nyungwe Forest - a hidden gem',
    username: 'adventure_travel',
    avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg',
    likes: 3254,
    comments: 246,
    verified: true,
    isLive: false
  },
  {
    id: '2',
    image: 'https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg',
    title: 'Kigali Fashion Week 2025 - Highlights from the runway',
    username: 'fashion_trends',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg',
    likes: 2876,
    comments: 193,
    verified: true,
    isLive: false
  },
  {
    id: '3',
    image: 'https://images.pexels.com/photos/1157557/pexels-photo-1157557.jpeg',
    title: 'Rwanda coffee production hits record high - how farmers are celebrating',
    username: 'economic_news',
    avatar: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg',
    likes: 1964,
    comments: 145,
    verified: false,
    isLive: false
  },
];

export default function ExploreScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const insets = useSafeAreaInsets();
  
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <HeaderBar title="Explore" />
      
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: 60 + insets.top }
        ]}
      >
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={[
            styles.searchBar,
            { backgroundColor: colors.subtle, borderColor: colors.border }
          ]}>
            <Search size={20} color={colors.tabIconDefault} />
            <TextInput
              style={[styles.searchInput, { color: colors.text }]}
              placeholder="Search for people, topics, or keywords"
              placeholderTextColor={colors.tabIconDefault}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            <TouchableOpacity style={styles.micButton}>
              <Mic size={20} color={colors.tint} />
            </TouchableOpacity>
          </View>
        </View>
        
        {/* Trending Topics */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Trending Topics
          </Text>
          <View style={[
            styles.trendingCard,
            { backgroundColor: colors.card, borderColor: colors.border }
          ]}>
            {trendingTopics.map((topic, index) => (
              <React.Fragment key={topic.id}>
                <TouchableOpacity style={styles.trendingItem}>
                  <View style={styles.trendingIconContainer}>
                    {topic.icon}
                  </View>
                  <View style={styles.trendingContent}>
                    <Text style={[styles.trendingName, { color: colors.text }]}>
                      #{topic.name}
                    </Text>
                    <Text style={[styles.trendingCount, { color: colors.tabIconDefault }]}>
                      {topic.count}
                    </Text>
                  </View>
                </TouchableOpacity>
                {index < trendingTopics.length - 1 && (
                  <View style={[styles.divider, { backgroundColor: colors.border }]} />
                )}
              </React.Fragment>
            ))}
          </View>
        </View>
        
        {/* Explore Categories */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Browse Categories
          </Text>
          <View style={styles.categoriesGrid}>
            {exploreCategories.map((category) => (
              <TouchableOpacity 
                key={category.id}
                style={[
                  styles.categoryCard,
                  { backgroundColor: colors.card, borderColor: colors.border }
                ]}
              >
                <View style={styles.categoryIcon}>
                  {category.icon}
                </View>
                <Text style={[styles.categoryName, { color: colors.text }]}>
                  {category.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        
        {/* Featured Content */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Featured Content
          </Text>
          <View style={styles.featuredContainer}>
            {featuredContent.map((content) => (
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
  searchContainer: {
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.lg,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
  },
  searchInput: {
    flex: 1,
    marginLeft: Spacing.sm,
    fontFamily: FontFamily.regular,
    fontSize: FontSize.md,
  },
  micButton: {
    marginLeft: Spacing.sm,
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
  trendingCard: {
    marginHorizontal: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    overflow: 'hidden',
  },
  trendingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
  },
  trendingIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(109, 40, 217, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  trendingContent: {
    flex: 1,
  },
  trendingName: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.md,
    marginBottom: 2,
  },
  trendingCount: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.sm,
  },
  divider: {
    height: 1,
    width: '100%',
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: Spacing.md,
  },
  categoryCard: {
    width: '30%',
    aspectRatio: 1,
    margin: '1.66%',
    borderRadius: BorderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    ...Shadow.sm,
  },
  categoryIcon: {
    marginBottom: Spacing.sm,
  },
  categoryName: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.sm,
    textAlign: 'center',
  },
  featuredContainer: {
    alignItems: 'center',
  },
});