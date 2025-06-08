import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Dimensions,
  Image,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColorScheme } from 'react-native';
import { 
  Search, 
  Camera, 
  X, 
  Send, 
  Zap, 
  Crown, 
  Gift,
  Star,
  Flame,
  MessageSquare,
  Users,
  Clock,
  CheckCheck,
  Plus // Added for new message icon
} from 'lucide-react-native';
import Colors from '@/constants/Colors';
import { FontFamily, FontSize, Spacing } from '@/constants/Theme';
import { BlurView } from 'expo-blur';

const { width, height } = Dimensions.get('window');

// Mock data with Neska-specific features
const mockChats = [
  {
    id: '1',
    name: 'Ornella',
    avatar: 'https://images.pexels.com/photos/1858175/pexels-photo-1858175.jpeg',
    time: 'just now',
    flames: 3,
    isElite: false,
    messageType: 'delivered',
    hasStory: true,
    isActive: true
  },
  {
    id: '2',
    name: 'Tetaa',
    avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg',
    time: '5m',
    flames: 12,
    isElite: true,
    messageType: 'reply',
    hasStory: false,
    isActive: true
  },
  {
    id: '3',
    name: 'Shareen',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg',
    time: '2h',
    flames: 8,
    isElite: false,
    messageType: 'reply',
    hasStory: true,
    isActive: false
  },
  {
    id: '4',
    name: 'Edwine',
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg',
    time: '1d',
    flames: 33,
    isElite: true,
    messageType: 'reply',
    hasStory: false,
    isActive: true
  },
  {
    id: '5',
    name: 'Kerry Rose',
    avatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg',
    time: '3h',
    flames: 0,
    isElite: false,
    messageType: 'system',
    hasStory: false,
    isActive: false
  },
  {
    id: '6',
    name: 'Joan',
    avatar: 'https://images.pexels.com/photos/1858175/pexels-photo-1858175.jpeg',
    time: 'just now',
    flames: 200,
    isElite: false,
    messageType: 'seen',
    hasStory: true,
    isActive: true
  },
];

interface ChatOverlayProps {
  isVisible: boolean;
  onClose: () => void;
}

const ChatOverlay: React.FC<ChatOverlayProps> = ({ isVisible, onClose }) => {
  const [activeTab, setActiveTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const insets = useSafeAreaInsets();
  // Neska brand color
  const neskaColor = '#00B4D8';

  const tabs = [
    { id: 'All', label: 'All', icon: MessageSquare, count: null },
    { id: 'Unread', label: 'Unread', icon: null, count: 4 },
    { id: 'Flames', label: 'Flames', icon: Flame, count: null },
    { id: 'Elite', label: 'Elite', icon: Crown, count: null },
    { id: 'Groups', label: 'Groups', icon: Users, count: null },
  ];

  const getFilteredChats = () => {
    let filtered = mockChats;
    
    if (searchQuery) {
      filtered = filtered.filter(chat => 
        chat.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    switch (activeTab) {
      case 'Unread':
        return filtered.filter(chat => chat.messageType !== 'delivered');
      case 'Flames':
        return filtered.filter(chat => chat.flames > 0).sort((a, b) => b.flames - a.flames);
      case 'Elite':
        return filtered.filter(chat => chat.isElite);
      case 'Groups':
        return []; // Would contain group chats
      default:
        return filtered;
    }
  };

  const getFlameColor = (count: number) => {
    if (count >= 30) return '#FF6B35'; // Super flame
    if (count >= 10) return '#FF8C42'; // High flame
    if (count >= 5) return '#FFB347';  // Medium flame
    return '#FFA500'; // Regular flame
  };

  const handleNewMessage = () => {
    console.log('New message pressed');
  };

  const renderChatItem = (chat: any) => (
    <TouchableOpacity key={chat.id} style={styles.chatItem}>
      <View style={styles.avatarContainer}>
        <Image source={{ uri: chat.avatar }} style={styles.avatar} />
        {chat.hasStory && <View style={[styles.storyRing, { borderColor: neskaColor }]} />}
        {chat.isActive && <View style={styles.activeIndicator} />}
        {chat.isElite && (
          <View style={styles.eliteBadge}>
            <Crown size={8} color="#FFD700" />
          </View>
        )}
      </View>

      <View style={styles.chatContent}>
        <View style={styles.chatHeader}>
          <Text style={[styles.chatName, { color: colors.text }]} numberOfLines={1}>
            {chat.name}
          </Text>
        </View>

        <View style={styles.messageContainer}>
          <View style={styles.messageContent}>
            {chat.messageType === 'delivered' && (
              <View style={styles.deliveredIndicator}>
                <Send size={10} color={neskaColor}/>
                <Text style={[styles.replyText, { color: neskaColor }]}>Dropped</Text>
              </View>
            )}
            {chat.messageType === 'seen' && (
                <View style={styles.seenIndicator}>
                  <CheckCheck  size={10} color={neskaColor} style={styles.checkIcon} />
                  <Text style={[styles.replyText, { color: neskaColor }]}>Seen</Text>
                </View>
            )}
            {chat.messageType === 'reply' && (
              <View style={[styles.replyIndicator, { backgroundColor: `${neskaColor}15` }]}>
                <Text style={[styles.replyText, { color: neskaColor }]}>double-tap to reply</Text>
              </View>
            )}
            {chat.messageType === 'system' && (
              <Text style={[styles.systemMessage, { color: neskaColor }]} numberOfLines={1}>
                You are now friends 🎉
              </Text>
            )}
          </View>
        </View>
      </View>

      {/* Right side container with flame/time and camera aligned */}
      <View style={styles.rightContainer}>
        <View style={styles.chatMeta}>
          {chat.flames > 0 && (
            <View style={styles.flameContainer}>
              <Flame size={12} color={getFlameColor(chat.flames)} />
              <Text style={[styles.flameCount, { color: getFlameColor(chat.flames) }]}>
                {chat.flames}
              </Text>
            </View>
          )}
          <Text style={[styles.timeText, { color: neskaColor }]}>
            {chat.time}
          </Text>
        </View>
        
        <TouchableOpacity style={styles.cameraButton}>
          <Camera size={20} color={neskaColor} />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return isVisible ? (
    <View 
      style={[
        styles.overlay,
        {
          backgroundColor: colors.background,
        }
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
          
          <Text style={[styles.headerTitle, { color: colors.text }]}>Chat</Text>
          
          <TouchableOpacity 
            onPress={handleNewMessage} 
            style={styles.newMessageButton}
          >
            <Plus size={24} color={colors.text} />
          </TouchableOpacity>
        </View>

        {/* Search Container - Always visible now */}
        <View style={styles.searchContainer}>
          <View style={styles.searchInputContainer}>
            <Search size={16} color={colors.secondary} style={styles.searchIcon} />
            <TextInput
              style={[styles.searchInput, { 
                backgroundColor: colors.card, 
                color: colors.text,
                borderColor: colors.border 
              }]}
              placeholder="Search chats..."
              placeholderTextColor={colors.secondary}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
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
                {tab.icon && <tab.icon size={16} color={
                  activeTab === tab.id ? '#FFFFFF' : '#00B4D8'
                } />}
                <Text style={[
                  styles.tabText,
                  { color: activeTab === tab.id ? '#FFFFFF' : '#00B4D8' }
                ]}>
                  {tab.label}
                </Text>
                {tab.count && (
                  <View style={styles.tabBadge}>
                    <Text style={styles.tabBadgeText}>{tab.count}</Text>
                  </View>
                )}
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Chat List */}
      <ScrollView 
        style={styles.chatList}
        showsVerticalScrollIndicator={false}
      >
        {getFilteredChats().map(renderChatItem)}
        
        {getFilteredChats().length === 0 && (
          <View style={styles.emptyState}>
            <MessageSquare size={48} color={colors.secondary} />
            <Text style={[styles.emptyText, { color: colors.secondary }]}>
              {searchQuery ? 'No chats found' : `No ${activeTab.toLowerCase()} chats`}
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
  newMessageButton: {
    padding: Spacing.xs,
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
    paddingLeft: 36, // Space for search icon
    paddingRight: Spacing.md,
    fontSize: FontSize.md,
    borderWidth: 1,
    flex: 1,
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
    marginLeft: Spacing.xs,
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
  chatList: {
    flex: 1,
    paddingTop: Spacing.sm,
  },
  chatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: Spacing.sm,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  storyRing: {
    position: 'absolute',
    top: -2,
    left: -2,
    width: 54,
    height: 54,
    borderRadius: 27,
    borderWidth: 2,
  },
  activeIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#4ADE80',
    borderWidth: 2,
    borderColor: '#FFF',
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
  chatContent: {
    flex: 1,
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  chatName: {
    fontSize: FontSize.md,
    fontFamily: FontFamily.semiBold,
    flex: 1,
  },
  // New container for right side alignment
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  chatMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  flameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  flameCount: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 2,
  },
  timeText: {
    fontSize: 12,
    fontFamily: FontFamily.regular,
    fontWeight: '600',
  },
  messageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  messageContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  deliveredIndicator: {
    flexDirection: 'row',
    gap: 5,
    alignItems: 'center',
    marginRight: Spacing.xs,
  },
  replyIndicator: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginRight: Spacing.xs,
  },
  replyText: {
    fontSize: 11,
    fontWeight: '500',
    fontFamily: FontFamily.medium,
  },
  systemMessage: {
    fontSize: FontSize.sm,
    fontFamily: FontFamily.medium,
    fontWeight: '500',
  },
  cameraButton: {
    padding: Spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: FontSize.md,
    fontFamily: FontFamily.regular,
    marginTop: Spacing.md,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.md,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  quickAction: {
    alignItems: 'center',
  },
  quickActionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  quickActionText: {
    fontSize: 12,
    fontFamily: FontFamily.medium,
  },
  seenIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginRight: Spacing.xs,
  },
  checkIcon: {
    marginRight: 1
  }
});

export default ChatOverlay;