import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Dimensions,
  Platform,
  FlatList,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColorScheme } from 'react-native';
import { 
  X, 
  Settings,
  Share,
  Flame,
  Crown,
  Star,
  Users,
  Heart,
  MessageCircle,
  Camera,
  Video,
  Grid3X3,
  Play,
  Eye,
  Gift,
  Award,
  Zap,
  MoreHorizontal,
  UserPlus,
  UserCheck
} from 'lucide-react-native';
import Colors from '@/constants/Colors';
import { FontFamily, FontSize, Spacing } from '@/constants/Theme';
import { BlurView } from 'expo-blur';

const { width, height } = Dimensions.get('window');

// Mock user data
const userProfile = {
  id: '1',
  username: 'rich_kid',
  displayName: 'Richard Musime',
  avatar: 'https://images.pexels.com/photos/1858175/pexels-photo-1858175.jpeg',
  bio: '🇷🇼 Kigali • Content Creator\n✨ Living my best life in the land of a thousand hills\n🎬 Dance & Lifestyle',
  isVerified: true,
  isElite: true,
  isFollowing: false,
  stats: {
    followers: 12400,
    following: 890,
    posts: 234,
    flames: 15600,
    streaks: 45,
    gifts: 128
  },
  badges: ['Top Creator', 'Rising Star', 'Elite Member'],
  isLive: false,
  lastSeen: '2h ago'
};

// Mock posts data
const mockPosts = [
  {
    id: '1',
    type: 'image',
    thumbnail: 'https://images.pexels.com/photos/3889856/pexels-photo-3889856.jpeg',
    likes: 1200,
    comments: 89,
    flames: 245
  },
  {
    id: '2',
    type: 'video',
    thumbnail: 'https://images.pexels.com/photos/2263436/pexels-photo-2263436.jpeg',
    likes: 850,
    comments: 67,
    flames: 180,
    duration: '0:45'
  },
  {
    id: '3',
    type: 'video',
    thumbnail: 'https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg',
    likes: 2100,
    comments: 156,
    flames: 890,
    duration: '1:15'
  },
  {
    id: '4',
    type: 'image',
    thumbnail: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg',
    likes: 670,
    comments: 34,
    flames: 120
  },
  {
    id: '5',
    type: 'video',
    thumbnail: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg',
    likes: 1450,
    comments: 98,
    flames: 340,
    duration: '1:23'
  },
  {
    id: '6',
    type: 'image',
    thumbnail: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg',
    likes: 920,
    comments: 45,
    flames: 210
  },
  {
    id: '7',
    type: 'image',
    thumbnail: 'https://images.pexels.com/photos/3889856/pexels-photo-3889856.jpeg',
    likes: 560,
    comments: 23,
    flames: 89
  },
  {
    id: '8',
    type: 'video',
    thumbnail: 'https://images.pexels.com/photos/2263436/pexels-photo-2263436.jpeg',
    likes: 780,
    comments: 45,
    flames: 156,
    duration: '0:30'
  },
  {
    id: '9',
    type: 'image',
    thumbnail: 'https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg',
    likes: 1340,
    comments: 67,
    flames: 234
  }
];

interface ProfileOverlayProps {
  isVisible: boolean;
  onClose: () => void;
  userId?: string;
}

const ProfileOverlay: React.FC<ProfileOverlayProps> = ({ 
  isVisible, 
  onClose, 
  userId 
}) => {
  const [activeTab, setActiveTab] = useState('posts');
  const [isFollowing, setIsFollowing] = useState(userProfile.isFollowing);
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const insets = useSafeAreaInsets();
  const neskaColor = '#00B4D8';

  const tabs = [
    { id: 'posts', icon: Grid3X3, label: '' },
    { id: 'reels', icon: Play, label: '' }
  ];

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  const handleFollow = () => {
    setIsFollowing(!isFollowing);
  };

  const handleMessage = () => {
    console.log('Message user');
  };

  const handleShare = () => {
    console.log('Share profile');
  };

  const renderPost = ({ item }: { item: any }) => (
    <TouchableOpacity style={styles.postItem}>
      <Image source={{ uri: item.thumbnail }} style={styles.postImage} />
      
      {/* Video indicator */}
      {item.type === 'video' && (
        <View style={styles.videoIndicator}>
          <Play size={16} color="#FFF" fill="#FFF" />
        </View>
      )}
    </TouchableOpacity>
  );

  const renderReel = ({ item }: { item: any }) => (
    <TouchableOpacity style={styles.reelItem}>
      <Image source={{ uri: item.thumbnail }} style={styles.reelImage} />
      
      {/* Video indicator */}
      <View style={styles.videoIndicator}>
        <Play size={20} color="#FFF" fill="#FFF" />
      </View>
      
      {/* View count */}
      <View style={styles.reelStats}>
        <Eye size={12} color="#FFF" />
        <Text style={styles.reelViewCount}>{formatNumber(item.likes)}</Text>
      </View>
    </TouchableOpacity>
  );

  if (!isVisible) return null;

  const imageOnlyPosts = mockPosts.filter(post => post.type === 'image');
  const videoOnlyPosts = mockPosts.filter(post => post.type === 'video');

  return (
    <View 
      style={[
        styles.overlay,
        { backgroundColor: colors.background }
      ]}
    >
      {Platform.OS === 'ios' && (
        <BlurView
          tint={colorScheme === 'dark' ? 'dark' : 'light'}
          intensity={20}
          style={StyleSheet.absoluteFill}
        />
      )}

      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        stickyHeaderIndices={[1]}
      >
        {/* Header */}
        <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <X size={24} color={colors.text} />
          </TouchableOpacity>
          
          <Text style={[styles.headerTitle, { color: colors.text }]}>
            {userProfile.username}
          </Text>
          
          <TouchableOpacity onPress={handleShare} style={styles.shareButton}>
            <MoreHorizontal size={24} color={colors.text} />
          </TouchableOpacity>
        </View>

        {/* Profile Section */}
        <View style={styles.profileSection}>
          {/* Top Row: Avatar + Stats */}
          <View style={styles.topRow}>
            {/* Avatar */}
            <View style={styles.avatarContainer}>
              <Image source={{ uri: userProfile.avatar }} style={styles.avatar} />
              {userProfile.isElite && (
                <View style={styles.eliteBadge}>
                  <Crown size={10} color="#FFD700" />
                </View>
              )}
            </View>

            {/* Stats */}
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Text style={[styles.statNumber, { color: colors.text }]}>
                  {formatNumber(userProfile.stats.posts)}
                </Text>
                <Text style={[styles.statLabel, { color: colors.text }]}>Posts</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={[styles.statNumber, { color: colors.text }]}>
                  {formatNumber(userProfile.stats.followers)}
                </Text>
                <Text style={[styles.statLabel, { color: colors.text }]}>Followers</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={[styles.statNumber, { color: colors.text }]}>
                  {formatNumber(userProfile.stats.following)}
                </Text>
                <Text style={[styles.statLabel, { color: colors.text }]}>Following</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={[styles.statNumber, { color: '#FF6B35' }]}>
                  {formatNumber(userProfile.stats.flames)}
                </Text>
                <Text style={[styles.statLabel, { color: colors.text }]}>Flames</Text>
              </View>
            </View>
          </View>

          {/* Name and Bio */}
          <View style={styles.userInfoSection}>
            <View style={styles.nameRow}>
              <Text style={[styles.displayName, { color: colors.text }]}>
                {userProfile.displayName}
              </Text>
              {userProfile.isVerified && (
                <View style={styles.verifiedBadge}>
                  <Text style={styles.verifiedText}>✓</Text>
                </View>
              )}
            </View>
            
            <Text style={[styles.bio, { color: colors.text }]}>
              {userProfile.bio}
            </Text>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <TouchableOpacity 
              style={[styles.editProfileButton, { backgroundColor: colors.border }]}
              onPress={() => console.log('Edit Profile')}
            >
              <Text style={[styles.editProfileButtonText, { color: colors.text }]}>
                Edit Profile
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.iconButton, { backgroundColor: colors.border }]}>
              <UserPlus size={16} color={colors.text} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Tabs */}
        <View style={[styles.tabsContainer, { backgroundColor: colors.background }]}>
          {tabs.map((tab) => (
            <TouchableOpacity
              key={tab.id}
              style={[
                styles.tab,
                activeTab === tab.id && styles.activeTab
              ]}
              onPress={() => setActiveTab(tab.id)}
            >
              <tab.icon 
                size={24} 
                color={activeTab === tab.id ? colors.text : colors.secondary} 
              />
            </TouchableOpacity>
          ))}
        </View>

        {/* Content Grid */}
        <View style={styles.contentContainer}>
          {activeTab === 'posts' && (
            <FlatList
              data={imageOnlyPosts}
              renderItem={renderPost}
              numColumns={3}
              scrollEnabled={false}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.postsGrid}
              ItemSeparatorComponent={() => <View style={{ height: 2 }} />}
              columnWrapperStyle={styles.postRow}
            />
          )}
          
          {activeTab === 'reels' && (
            <FlatList
              data={videoOnlyPosts}
              renderItem={renderReel}
              numColumns={3}
              scrollEnabled={false}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.postsGrid}
              ItemSeparatorComponent={() => <View style={{ height: 2 }} />}
              columnWrapperStyle={styles.postRow}
            />
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: width,
    height: height,
    zIndex: 1000,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.sm,
  },
  closeButton: {
    padding: Spacing.xs,
  },
  headerTitle: {
    fontSize: FontSize.lg,
    fontFamily: FontFamily.semiBold,
    fontWeight: '600',
  },
  shareButton: {
    padding: Spacing.xs,
  },
  profileSection: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: Spacing.xl,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  eliteBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#1F2937',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFF',
  },
  statsRow: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 16,
    fontFamily: FontFamily.semiBold,
    fontWeight: '600',
  },
  statLabel: {
    fontSize: 12,
    fontFamily: FontFamily.regular,
    marginTop: 2,
  },
  userInfoSection: {
    marginBottom: Spacing.md,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  displayName: {
    fontSize: 14,
    fontFamily: FontFamily.semiBold,
    fontWeight: '600',
    marginRight: 6,
  },
  verifiedBadge: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#00B4D8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  verifiedText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: '700',
  },
  bio: {
    fontSize: 12,
    fontFamily: FontFamily.regular,
    lineHeight: 16,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: Spacing.md,
  },
  editProfileButton: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  editProfileButtonText: {
    fontSize: 14,
    fontFamily: FontFamily.semiBold,
    fontWeight: '600',
  },
  iconButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabsContainer: {
    flexDirection: 'row',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  tab: {
    flex: 1,
    paddingVertical: Spacing.md,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#000',
  },
  contentContainer: {
    flex: 1,
  },
  postsGrid: {
    paddingTop: 2,
  },
  postRow: {
    justifyContent: 'space-between',
    paddingHorizontal: 0,
    marginBottom: 2,
  },
  postItem: {
    width: (width - 4) / 3,
    height: (width - 4) / 3,
    position: 'relative',
  },
  postImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  reelItem: {
    width: (width - 4) / 3,
    height: (width - 4) / 3 * 1.3,
    position: 'relative',
  },
  reelImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  videoIndicator: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
  reelStats: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  reelViewCount: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: '600',
  },
});

export default ProfileOverlay;