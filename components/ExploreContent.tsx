import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Dimensions,
  Platform,
  useColorScheme
} from 'react-native';
import { Search, Mic, TrendingUp, Music, Gamepad2, BookOpen, Flame, Star, Award, X } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import Colors from '@/constants/Colors';
import { FontFamily, FontSize, Spacing, BorderRadius, Shadow } from '@/constants/Theme';
import CategoryChip from './CategoryChip';
import StoriesSection from './StoriesSection';

const { width, height } = Dimensions.get('window');

const trendingTopics = [
  { id: '1', name: 'Rwanda', count: '2.3K posts', icon: <TrendingUp size={20} color="#00B4D8" /> },
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

const CATEGORIES = ['Stories', 'For You', 'Live', 'Following'] as const;
type Category = typeof CATEGORIES[number];

interface ExploreContentProps {
  isVisible: boolean;
  onClose: () => void;
}

const ExploreContent: React.FC<ExploreContentProps> = ({ isVisible, onClose }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category>('For You');
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const insets = useSafeAreaInsets();
  const neskaColor = '#00B4D8';

  const renderContent = () => {
    switch (selectedCategory) {
      case 'Stories':
        return <StoriesSection />;
      case 'For You':
        return null;
      case 'Live':
        return null;
      case 'Following':
        return null;
      default:
        return null;
    }
  };

  return isVisible ? (
    <View style={[styles.overlay, { backgroundColor: colors.background }]}>
      {Platform.OS === 'ios' && (
        <BlurView
          tint={colorScheme === 'dark' ? 'dark' : 'light'}
          intensity={20}
          style={StyleSheet.absoluteFill}
        />
      )}

      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <X size={24} color={colors.text} />
          </TouchableOpacity>

          <Text style={[styles.headerTitle, { color: colors.text }]}>Explore</Text>

          <View style={styles.placeholder} />
        </View>

        {/* Search Container */}
        <View style={styles.searchContainer}>
          <View style={styles.searchInputContainer}>
            <Search size={16} color={colors.secondary} style={styles.searchIcon} />
            <TextInput
              style={[
                styles.searchInput,
                {
                  backgroundColor: colors.card,
                  color: colors.text,
                  borderColor: colors.border,
                },
              ]}
              placeholder="Search topics, users, posts..."
              placeholderTextColor={colors.secondary}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            <TouchableOpacity style={styles.micButton}>
              <Mic size={16} color={neskaColor} />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false} 
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
      >
        {/* Categories */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Browse Categories
          </Text>
          <View style={styles.categoriesGrid}>
            {exploreCategories.map((category) => (
              <TouchableOpacity
                key={category.id}
                style={[styles.categoryCard, { backgroundColor: colors.card }]}
              >
                <View style={styles.categoryIcon}>{category.icon}</View>
                <Text style={[styles.categoryName, { color: colors.text }]}>
                  {category.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Story Categories */}
        <View style={styles.categories}>
          {CATEGORIES.map((category) => (
            <CategoryChip
              key={category}
              label={category}
              selected={selectedCategory === category}
              onPress={() => setSelectedCategory(category)}
            />
          ))}
        </View>

        {/* Render Content Based on Selected Category */}
        {renderContent()}
      </ScrollView>
    </View>
  ) : null;
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: width,
    height: height,
    zIndex: 1000,
  },
  header: {
    paddingHorizontal: Spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.sm,
  },
  closeButton: {
    padding: Spacing.xs,
  },
  headerTitle: {
    fontSize: FontSize.xl,
    fontFamily: FontFamily.semiBold,
    fontWeight: '700',
  },
  placeholder: {
    width: 40, // Same width as close button for centering
  },
  searchContainer: {
    paddingVertical: Spacing.sm,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  searchIcon: {
    position: 'absolute',
    left: 12,
    zIndex: 1,
  },
  searchInput: {
    height: 40,
    borderRadius: 20,
    paddingLeft: 36,
    paddingRight: 40,
    fontSize: FontSize.md,
    borderWidth: 1,
    flex: 1,
  },
  micButton: {
    position: 'absolute',
    right: 12,
    padding: 4,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: Spacing.xl,
  },
  section: {
    marginTop: Spacing.md,
    paddingHorizontal: Spacing.md,
  },
  sectionTitle: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.lg,
    marginBottom: Spacing.md,
  },
  trendingCard: {
    borderRadius: BorderRadius.md,
    overflow: 'hidden',
    ...Shadow.sm,
  },
  trendingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
  },
  trendingIconContainer: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  trendingContent: {
    flex: 1,
  },
  trendingName: {
    fontFamily: FontFamily.medium,
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
    justifyContent: 'space-between',
  },
  categoryCard: {
    width: '48%',
    borderRadius: BorderRadius.md,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    alignItems: 'center',
    ...Shadow.sm,
  },
  categoryIcon: {
    marginBottom: Spacing.sm,
  },
  categoryName: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.md,
  },
  categories: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
});

export default ExploreContent;