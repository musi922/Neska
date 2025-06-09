import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, TextInput } from 'react-native';
import { useColorScheme } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Play, Users, MessageCircle, Gift, Heart, Share2 } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import { FontFamily, FontSize, Spacing, BorderRadius, Shadow } from '@/constants/Theme';
import HeaderBar from '@/components/HeaderBar';
import CategoryChip from '@/components/CategoryChip';
import { LinearGradient } from 'expo-linear-gradient';

// Mock data
const categories = [
  'All', 'Music', 'Gaming', 'Talk Shows', 'Education', 'Sports', 'Art', 'Outdoor'
];

const popularStreams = [
  {
    id: '1',
    image: 'https://images.pexels.com/photos/1699161/pexels-photo-1699161.jpeg',
    title: 'Morning music vibes with DJ Amani',
    username: 'dj_amani',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg',
    viewers: 3420,
    category: 'Music',
    tags: ['music', 'afrobeats', 'morning']
  },
  {
    id: '2',
    image: 'https://images.pexels.com/photos/3945683/pexels-photo-3945683.jpeg',
    title: 'Pro gaming tournament - final day',
    username: 'pro_gamer',
    avatar: 'https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg',
    viewers: 12830,
    category: 'Gaming',
    tags: ['gaming', 'esports', 'tournament']
  },
  {
    id: '3',
    image: 'https://images.pexels.com/photos/7991318/pexels-photo-7991318.jpeg',
    title: 'Learning Kinyarwanda - Beginner lesson 5',
    username: 'language_teacher',
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg',
    viewers: 874,
    category: 'Education',
    tags: ['education', 'language', 'kinyarwanda']
  },
  {
    id: '4',
    image: 'https://images.pexels.com/photos/3808904/pexels-photo-3808904.jpeg',
    title: 'Traditional dance performance',
    username: 'cultural_arts',
    avatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg',
    viewers: 2756,
    category: 'Art',
    tags: ['dance', 'culture', 'performance']
  }
];

export default function StreamScreen() {
  const [activeCategory, setActiveCategory] = useState('All');
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const insets = useSafeAreaInsets();
  
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <HeaderBar />
      
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: 60 + insets.top }
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
                onPress={() => setActiveCategory(category)}
              />
            ))}
          </ScrollView>
        </View>
        
        {/* Start Streaming Card */}
        <View style={[
          styles.startStreamCard, 
          Shadow.md,
          { backgroundColor: colors.card, borderColor: colors.border }
        ]}>
          <LinearGradient
            colors={colors.gradient.primary}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.streamGradient}
          >
            <View style={styles.streamContent}>
              <View style={styles.streamIconContainer}>
                <Play size={28} color="#FFF" />
              </View>
              <View style={styles.streamTextContainer}>
                <Text style={styles.streamTitle}>Start Streaming</Text>
                <Text style={styles.streamDescription}>
                  Share your moments with your followers
                </Text>
              </View>
            </View>
            <TouchableOpacity style={styles.startButton}>
              <Text style={styles.startButtonText}>Go Live</Text>
            </TouchableOpacity>
          </LinearGradient>
        </View>
        
        {/* Popular Streams */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Popular Streams
          </Text>
          
          {popularStreams.map((stream) => (
            <TouchableOpacity 
              key={stream.id}
              style={[
                styles.streamCard,
                Shadow.sm,
                { backgroundColor: colors.card, borderColor: colors.border }
              ]}
              activeOpacity={0.9}
            >
              <View style={styles.streamCardImageContainer}>
                <Image source={{ uri: stream.image }} style={styles.streamCardImage} />
                <View style={styles.liveIndicator}>
                  <View style={styles.liveDot} />
                  <Text style={styles.liveText}>LIVE</Text>
                </View>
                <View style={styles.viewersContainer}>
                  <Users size={14} color="#FFF" />
                  <Text style={styles.viewersText}>{stream.viewers}</Text>
                </View>
              </View>
              
              <View style={styles.streamCardContent}>
                <View style={styles.streamCardHeader}>
                  <Image source={{ uri: stream.avatar }} style={styles.streamCardAvatar} />
                  <View style={styles.streamCardUserInfo}>
                    <Text style={[styles.streamCardUsername, { color: colors.text }]}>
                      {stream.username}
                    </Text>
                    <Text style={[styles.streamCardCategory, { color: colors.tabIconDefault }]}>
                      {stream.category}
                    </Text>
                  </View>
                  <TouchableOpacity style={[
                    styles.followButton,
                    { backgroundColor: colors.tint }
                  ]}>
                    <Text style={styles.followText}>Follow</Text>
                  </TouchableOpacity>
                </View>
                
                <Text 
                  style={[styles.streamCardTitle, { color: colors.text }]}
                  numberOfLines={2}
                >
                  {stream.title}
                </Text>
                
                <View style={styles.tagsContainer}>
                  {stream.tags.map((tag) => (
                    <View 
                      key={tag} 
                      style={[styles.tagChip, { backgroundColor: colors.subtle }]}
                    >
                      <Text style={[styles.tagText, { color: colors.text }]}>
                        #{tag}
                      </Text>
                    </View>
                  ))}
                </View>
                
                <View style={styles.actionsContainer}>
                  <TouchableOpacity style={styles.actionButton}>
                    <MessageCircle size={20} color={colors.text} />
                    <Text style={[styles.actionText, { color: colors.text }]}>Chat</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity style={styles.actionButton}>
                    <Gift size={20} color={colors.text} />
                    <Text style={[styles.actionText, { color: colors.text }]}>Support</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity style={styles.actionButton}>
                    <Share2 size={20} color={colors.text} />
                    <Text style={[styles.actionText, { color: colors.text }]}>Share</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>
          ))}
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
  categoriesContainer: {
    marginBottom: Spacing.md,
  },
  categoriesScroll: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  startStreamCard: {
    marginHorizontal: Spacing.md,
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    borderWidth: 1,
    marginBottom: Spacing.xl,
  },
  streamGradient: {
    padding: Spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  streamContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  streamIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  streamTextContainer: {
    flex: 1,
  },
  streamTitle: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.lg,
    color: '#FFF',
    marginBottom: 2,
  },
  streamDescription: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.sm,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  startButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
  },
  startButtonText: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.md,
    color: '#FFF',
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
  streamCard: {
    marginHorizontal: Spacing.md,
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    borderWidth: 1,
    marginBottom: Spacing.md,
  },
  streamCardImageContainer: {
    width: '100%',
    height: 180,
    position: 'relative',
  },
  streamCardImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  liveIndicator: {
    position: 'absolute',
    top: Spacing.sm,
    left: Spacing.sm,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: BorderRadius.full,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EF4444',
    marginRight: 4,
  },
  liveText: {
    color: '#FFF',
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.xs,
  },
  viewersContainer: {
    position: 'absolute',
    top: Spacing.sm,
    right: Spacing.sm,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: BorderRadius.full,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
  },
  viewersText: {
    color: '#FFF',
    fontFamily: FontFamily.medium,
    fontSize: FontSize.xs,
    marginLeft: 4,
  },
  streamCardContent: {
    padding: Spacing.md,
  },
  streamCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  streamCardAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: Spacing.sm,
  },
  streamCardUserInfo: {
    flex: 1,
  },
  streamCardUsername: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.md,
  },
  streamCardCategory: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.xs,
  },
  followButton: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
  },
  followText: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.xs,
    color: '#FFF',
  },
  streamCardTitle: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.md,
    marginBottom: Spacing.sm,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: Spacing.sm,
  },
  tagChip: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.full,
    marginRight: Spacing.xs,
    marginBottom: Spacing.xs,
  },
  tagText: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.xs,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: Spacing.sm,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionText: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.sm,
    marginLeft: 4,
  },
});