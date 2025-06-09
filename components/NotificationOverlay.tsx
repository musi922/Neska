import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Dimensions,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColorScheme } from 'react-native';
import { 
  X,
  Heart,
  MessageCircle,
  UserPlus,
  Flame,
  Crown,
  Play,
  Camera,
  Users,
  Star,
  Gift,
  Bell,
  Eye,
  ThumbsUp,
  Share2,
  AtSign
} from 'lucide-react-native';
import Colors from '@/constants/Colors';
import { FontFamily, FontSize, Spacing } from '@/constants/Theme';
import { BlurView } from 'expo-blur';

const { width, height } = Dimensions.get('window');

// Mock notification data with Neska-specific features
const mockNotifications = [
  {
    id: '1',
    type: 'like',
    user: {
      name: 'Ornella',
      avatar: 'https://images.pexels.com/photos/1858175/pexels-photo-1858175.jpeg',
      isElite: false,
      hasStory: true
    },
    content: {
      type: 'post',
      thumbnail: 'https://images.pexels.com/photos/3889856/pexels-photo-3889856.jpeg'
    },
    time: '2m',
    isRead: false,
    flames: 5
  },
  {
    id: '2',
    type: 'comment',
    user: {
      name: 'Tetaa',
      avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg',
      isElite: true,
      hasStory: false
    },
    content: {
      type: 'post',
      thumbnail: 'https://images.pexels.com/photos/2263436/pexels-photo-2263436.jpeg',
      comment: 'Amazing shot! 🔥'
    },
    time: '5m',
    isRead: false,
    flames: 12
  },
  {
    id: '3',
    type: 'follow',
    user: {
      name: 'Shareen',
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg',
      isElite: false,
      hasStory: true
    },
    time: '1h',
    isRead: true,
    flames: 0
  },
  {
    id: '4',
    type: 'flame',
    user: {
      name: 'Edwine',
      avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg',
      isElite: true,
      hasStory: false
    },
    content: {
      type: 'live',
      thumbnail: 'https://images.pexels.com/photos/2263936/pexels-photo-2263936.jpeg'
    },
    time: '2h',
    isRead: true,
    flames: 25,
    flameCount: 25
  },
  {
    id: '5',
    type: 'live_join',
    user: {
      name: 'Kerry Rose',
      avatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg',
      isElite: false,
      hasStory: false
    },
    time: '3h',
    isRead: false,
    flames: 0
  },
  {
    id: '6',
    type: 'multiple_likes',
    users: [
      {
        name: 'Joan',
        avatar: 'https://images.pexels.com/photos/1858175/pexels-photo-1858175.jpeg',
        isElite: false
      },
      {
        name: 'Mike',
        avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg',
        isElite: true
      }
    ],
    content: {
      type: 'post',
      thumbnail: 'https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg'
    },
    time: '4h',
    isRead: true,
    totalLikes: 8,
    flames: 0
  },
  {
    id: '7',
    type: 'elite_upgrade',
    time: '1d',
    isRead: false,
    flames: 0
  },
  {
    id: '8',
    type: 'story_view',
    user: {
      name: 'Artist Paul',
      avatar: 'https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg',
      isElite: false,
      hasStory: true
    },
    time: '1d',
    isRead: true,
    flames: 3
  }
];

interface NotificationOverlayProps {
  isVisible: boolean;
  onClose: () => void;
}

const NotificationOverlay: React.FC<NotificationOverlayProps> = ({ isVisible, onClose }) => {
  const [activeTab, setActiveTab] = useState('All');
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const insets = useSafeAreaInsets();
  const neskaColor = '#00B4D8';

  const tabs = [
    { id: 'All', label: 'All', count: mockNotifications.filter(n => !n.isRead).length },
    { id: 'Likes', label: 'Likes', count: null },
    { id: 'Comments', label: 'Comments', count: null },
    { id: 'Follows', label: 'Follows', count: null },
    { id: 'Flames', label: 'Flames', count: null },
    { id: 'Live', label: 'Live', count: null },
  ];

  const getFilteredNotifications = () => {
    switch (activeTab) {
      case 'Likes':
        return mockNotifications.filter(n => n.type === 'like' || n.type === 'multiple_likes');
      case 'Comments':
        return mockNotifications.filter(n => n.type === 'comment');
      case 'Follows':
        return mockNotifications.filter(n => n.type === 'follow');
      case 'Flames':
        return mockNotifications.filter(n => n.type === 'flame' || n.flames > 0);
      case 'Live':
        return mockNotifications.filter(n => n.type === 'live_join' || n.content?.type === 'live');
      default:
        return mockNotifications;
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'like':
        return <Heart size={16} color="#FF6B6B" fill="#FF6B6B" />;
      case 'comment':
        return <MessageCircle size={16} color={neskaColor} />;
      case 'follow':
        return <UserPlus size={16} color="#4ADE80" />;
      case 'flame':
        return <Flame size={16} color="#FF8C42" />;
      case 'live_join':
        return <Play size={16} color="#8B5CF6" fill="#8B5CF6" />;
      case 'multiple_likes':
        return <Heart size={16} color="#FF6B6B" fill="#FF6B6B" />;
      case 'elite_upgrade':
        return <Crown size={16} color="#FFD700" />;
      case 'story_view':
        return <Eye size={16} color={neskaColor} />;
      default:
        return <Bell size={16} color={colors.text} />;
    }
  };

  const getNotificationText = (notification: any) => {
    switch (notification.type) {
      case 'like':
        return `liked your photo`;
      case 'comment':
        return `commented: "${notification.content.comment}"`;
      case 'follow':
        return `started following you`;
      case 'flame':
        return `and You have reached ${notification.flameCount} flames`;
      case 'live_join':
        return `joined your live stream`;
      case 'multiple_likes':
        return `and ${notification.totalLikes - 2} others liked your photo`;
      case 'elite_upgrade':
        return `Congratulations! You're now an Elite member 👑`;
      case 'story_view':
        return `viewed your story`;
      default:
        return `interacted with your content`;
    }
  };

  const getFlameColor = (count: number) => {
    if (count >= 30) return '#FF6B35';
    if (count >= 10) return '#FF8C42';
    if (count >= 5) return '#FFB347';
    return '#FFA500';
  };

  const renderNotificationItem = (notification: any) => (
    <TouchableOpacity 
      key={notification.id} 
      style={[
        styles.notificationItem,
        !notification.isRead && { backgroundColor: `${neskaColor}08` }
      ]}
    >
      <View style={styles.notificationContent}>
        {/* Avatar or Multiple Avatars */}
        <View style={styles.avatarContainer}>
          {notification.type === 'multiple_likes' ? (
            <View style={styles.multipleAvatars}>
              <Image 
                source={{ uri: notification.users[0].avatar }} 
                style={[styles.avatar, styles.overlappingAvatar]} 
              />
              <Image 
                source={{ uri: notification.users[1].avatar }} 
                style={[styles.avatar, styles.overlappingAvatar, { marginLeft: -15 }]} 
              />
            </View>
          ) : notification.type === 'elite_upgrade' ? (
            <View style={styles.systemAvatar}>
              <Crown size={24} color="#FFD700" />
            </View>
          ) : (
            <>
              <Image source={{ uri: notification.user.avatar }} style={styles.avatar} />
              {notification.user?.hasStory && (
                <View style={[styles.storyRing, { borderColor: neskaColor }]} />
              )}
              {notification.user?.isElite && (
                <View style={styles.eliteBadge}>
                  <Crown size={8} color="#FFD700" />
                </View>
              )}
            </>
          )}
        </View>

        {/* Notification Content */}
        <View style={styles.textContainer}>
          <View style={styles.notificationHeader}>
            <View style={styles.iconContainer}>
              {getNotificationIcon(notification.type)}
            </View>
            
            <Text style={[styles.notificationText, { color: colors.text }]} numberOfLines={2}>
              {notification.type === 'multiple_likes' ? (
                <>
                  <Text style={styles.boldText}>{notification.users[0].name}</Text>
                  {' '}
                  {getNotificationText(notification)}
                </>
              ) : notification.type === 'elite_upgrade' ? (
                getNotificationText(notification)
              ) : (
                <>
                  <Text style={styles.boldText}>{notification.user.name}</Text>
                  {' '}
                  {getNotificationText(notification)}
                </>
              )}
            </Text>
          </View>

          {/* Time and Flames */}
          <View style={styles.metaContainer}>
            <Text style={[styles.timeText, { color: colors.secondary }]}>
              {notification.time}
            </Text>
            {notification.flames > 0 && (
              <View style={styles.flameContainer}>
                <Flame size={12} color={getFlameColor(notification.flames)} />
                <Text style={[styles.flameText, { color: getFlameColor(notification.flames) }]}>
                  {notification.flames}
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* Content Thumbnail */}
        {notification.content?.thumbnail && (
          <Image 
            source={{ uri: notification.content.thumbnail }} 
            style={styles.contentThumbnail} 
          />
        )}

        {/* Unread Indicator */}
        {!notification.isRead && (
          <View style={[styles.unreadDot, { backgroundColor: neskaColor }]} />
        )}
      </View>
    </TouchableOpacity>
  );

  return isVisible ? (
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

      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <X size={24} color={colors.text} />
          </TouchableOpacity>
          
          <Text style={[styles.headerTitle, { color: colors.text }]}>Notifications</Text>
          
          <TouchableOpacity style={styles.markAllButton}>
            <Text style={[styles.markAllText, { color: neskaColor }]}>Mark all</Text>
          </TouchableOpacity>
        </View>

        {/* Tabs */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.tabsContainer}
          contentContainerStyle={styles.tabsContent}
        >
          {tabs.map((tab) => (
            <TouchableOpacity
              key={tab.id}
              style={[
                styles.tab,
                activeTab === tab.id && styles.activeTab,
                { borderBottomColor: activeTab === tab.id ? '#FFFFFF' : 'transparent' }
              ]}
              onPress={() => setActiveTab(tab.id)}
            >
              <View style={styles.tabContent}>
                <Text style={[
                  styles.tabText,
                  { color: activeTab === tab.id ? '#FFFFFF' : neskaColor }
                ]}>
                  {tab.label}
                </Text>
                {tab.count && tab.count > 0 && (
                  <View style={styles.tabBadge}>
                    <Text style={styles.tabBadgeText}>{tab.count}</Text>
                  </View>
                )}
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Notifications List */}
      <ScrollView 
        style={styles.notificationsList}
        showsVerticalScrollIndicator={false}
      >
        {getFilteredNotifications().map(renderNotificationItem)}
        
        {getFilteredNotifications().length === 0 && (
          <View style={styles.emptyState}>
            <Bell size={48} color={colors.secondary} />
            <Text style={[styles.emptyText, { color: colors.secondary }]}>
              No {activeTab.toLowerCase()} notifications
            </Text>
            <Text style={[styles.emptySubtext, { color: colors.secondary }]}>
              When you get notifications, they'll show up here
            </Text>
          </View>
        )}
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
  markAllButton: {
    padding: Spacing.xs,
  },
  markAllText: {
    fontSize: FontSize.sm,
    fontFamily: FontFamily.medium,
    fontWeight: '600',
  },
  tabsContainer: {
    marginTop: Spacing.sm,
  },
  tabsContent: {
    paddingRight: Spacing.md,
  },
  tab: {
    marginRight: Spacing.md,
    paddingVertical: Spacing.sm,
    borderBottomWidth: 2,
  },
  activeTab: {
    // Active tab styling handled by borderBottomColor
  },
  tabContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tabText: {
    fontSize: FontSize.sm,
    fontFamily: FontFamily.medium,
  },
  tabBadge: {
    backgroundColor: '#FF6B35',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginLeft: Spacing.xs,
  },
  tabBadgeText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: '600',
  },
  notificationsList: {
    flex: 1,
    paddingTop: Spacing.sm,
  },
  notificationItem: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: 8,
    marginHorizontal: Spacing.xs,
    marginVertical: 2,
  },
  notificationContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  avatarContainer: {
    position: 'relative',
    marginRight: Spacing.sm,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  multipleAvatars: {
    flexDirection: 'row',
    width: 60,
  },
  overlappingAvatar: {
    borderWidth: 2,
    borderColor: '#FFF',
  },
  systemAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#1F2937',
    justifyContent: 'center',
    alignItems: 'center',
  },
  storyRing: {
    position: 'absolute',
    top: -2,
    left: -2,
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
  },
  eliteBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#1F2937',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    flex: 1,
    marginRight: Spacing.sm,
  },
  notificationHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  iconContainer: {
    marginRight: Spacing.xs,
    marginTop: 2,
  },
  notificationText: {
    fontSize: FontSize.sm,
    fontFamily: FontFamily.regular,
    flex: 1,
    lineHeight: 18,
  },
  boldText: {
    fontFamily: FontFamily.semiBold,
    fontWeight: '600',
  },
  metaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  timeText: {
    fontSize: 12,
    fontFamily: FontFamily.regular,
  },
  flameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  flameText: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 2,
  },
  contentThumbnail: {
    width: 44,
    height: 44,
    borderRadius: 8,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    position: 'absolute',
    top: 8,
    right: 8,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: Spacing.xl,
  },
  emptyText: {
    fontSize: FontSize.lg,
    fontFamily: FontFamily.semiBold,
    marginTop: Spacing.md,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: FontSize.sm,
    fontFamily: FontFamily.regular,
    marginTop: Spacing.xs,
    textAlign: 'center',
  },
});

export default NotificationOverlay;