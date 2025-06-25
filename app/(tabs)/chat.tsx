import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { useColorScheme } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Search, MessageCirclePlus, Users, Settings } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import { FontFamily, FontSize, Spacing } from '@/constants/Theme';
import HeaderBar from '@/components/HeaderBar';
import ChatListItem from '@/components/ChatListItem';
import ChatScreen from '@/components/ChatScreen';
import { User, ChatMessage, useWebSocket } from '@/hooks/useWebSocket';

// Mock data
const mockUsers: User[] = [
  {
    id: '1',
    username: 'Ornella',
    avatar: 'https://images.pexels.com/photos/1858175/pexels-photo-1858175.jpeg',
    isOnline: true,
  },
  {
    id: '2',
    username: 'Tetaa',
    avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg',
    isOnline: false,
    lastSeen: Date.now() - 300000, // 5 minutes ago
  },
  {
    id: '3',
    username: 'Shareen',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg',
    isOnline: true,
  },
  {
    id: '4',
    username: 'Edwine',
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg',
    isOnline: false,
    lastSeen: Date.now() - 3600000, // 1 hour ago
  },
];

const mockLastMessages: { [key: string]: ChatMessage } = {
  '1': {
    id: '1',
    senderId: '1',
    receiverId: 'current_user',
    content: 'Hey! How are you doing?',
    type: 'text',
    timestamp: Date.now() - 300000,
    status: 'delivered'
  },
  '2': {
    id: '2',
    senderId: 'current_user',
    receiverId: '2',
    content: 'Thanks for the help earlier!',
    type: 'text',
    timestamp: Date.now() - 1800000,
    status: 'read'
  },
  '3': {
    id: '3',
    senderId: '3',
    receiverId: 'current_user',
    content: '',
    type: 'voice',
    timestamp: Date.now() - 7200000,
    status: 'delivered',
    voiceDuration: 15
  },
};

const mockUnreadCounts: { [key: string]: number } = {
  '1': 2,
  '3': 1,
};

export default function ChatTab() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [filteredUsers, setFilteredUsers] = useState(mockUsers);
  
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const insets = useSafeAreaInsets();
  
  const currentUserId = 'current_user';
  const { isConnected } = useWebSocket(currentUserId);

  useEffect(() => {
    if (searchQuery.trim()) {
      setFilteredUsers(
        mockUsers.filter(user =>
          user.username.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    } else {
      setFilteredUsers(mockUsers);
    }
  }, [searchQuery]);

  const handleUserPress = (user: User) => {
    setSelectedUser(user);
  };

  const handleBackFromChat = () => {
    setSelectedUser(null);
  };

  const handleVoiceCall = (user: User) => {
    Alert.alert(
      'Voice Call',
      `Start voice call with ${user.username}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Call', onPress: () => console.log('Starting voice call with', user.username) }
      ]
    );
  };

  const handleVideoCall = (user: User) => {
    Alert.alert(
      'Video Call',
      `Start video call with ${user.username}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Call', onPress: () => console.log('Starting video call with', user.username) }
      ]
    );
  };

  const renderChatItem = ({ item }: { item: User }) => (
    <ChatListItem
      user={item}
      lastMessage={mockLastMessages[item.id]}
      unreadCount={mockUnreadCounts[item.id]}
      onPress={() => handleUserPress(item)}
      onVoiceCall={() => handleVoiceCall(item)}
      onVideoCall={() => handleVideoCall(item)}
    />
  );

  if (selectedUser) {
    return (
      <ChatScreen
        user={selectedUser}
        currentUserId={currentUserId}
        onBack={handleBackFromChat}
      />
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <HeaderBar title="Chats" />
      
      <View style={[
        styles.content,
        { paddingTop: 60 + insets.top }
      ]}>
        {/* Connection Status */}
        {!isConnected && (
          <View style={[styles.connectionStatus, { backgroundColor: '#EF4444' }]}>
            <Text style={styles.connectionText}>Connecting...</Text>
          </View>
        )}

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={[
            styles.searchBar,
            { backgroundColor: colors.subtle, borderColor: colors.border }
          ]}>
            <Search size={20} color={colors.tabIconDefault} />
            <TextInput
              style={[styles.searchInput, { color: colors.text }]}
              placeholder="Search chats..."
              placeholderTextColor={colors.tabIconDefault}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <TouchableOpacity style={[
            styles.quickAction,
            { backgroundColor: colors.card, borderColor: colors.border }
          ]}>
            <MessageCirclePlus size={24} color="#00B4D8" />
            <Text style={[styles.quickActionText, { color: colors.text }]}>
              New Chat
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={[
            styles.quickAction,
            { backgroundColor: colors.card, borderColor: colors.border }
          ]}>
            <Users size={24} color="#00B4D8" />
            <Text style={[styles.quickActionText, { color: colors.text }]}>
              Groups
            </Text>
          </TouchableOpacity>
        </View>

        {/* Chat List */}
        <FlatList
          data={filteredUsers}
          renderItem={renderChatItem}
          keyExtractor={(item) => item.id}
          style={styles.chatList}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.chatListContent}
        />

        {filteredUsers.length === 0 && (
          <View style={styles.emptyState}>
            <MessageCirclePlus size={48} color={colors.tabIconDefault} />
            <Text style={[styles.emptyText, { color: colors.text }]}>
              {searchQuery ? 'No chats found' : 'No chats yet'}
            </Text>
            <Text style={[styles.emptySubtext, { color: colors.tabIconDefault }]}>
              {searchQuery 
                ? 'Try searching for a different name'
                : 'Start a conversation with someone!'
              }
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  connectionStatus: {
    paddingVertical: Spacing.xs,
    alignItems: 'center',
  },
  connectionText: {
    color: '#FFF',
    fontSize: FontSize.sm,
    fontFamily: FontFamily.medium,
  },
  searchContainer: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: 25,
    borderWidth: 1,
  },
  searchInput: {
    flex: 1,
    marginLeft: Spacing.sm,
    fontFamily: FontFamily.regular,
    fontSize: FontSize.md,
  },
  quickActions: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.sm,
  },
  quickAction: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.sm,
    marginHorizontal: Spacing.xs,
    borderRadius: 12,
    borderWidth: 1,
  },
  quickActionText: {
    fontSize: FontSize.sm,
    fontFamily: FontFamily.medium,
    marginLeft: Spacing.xs,
  },
  chatList: {
    flex: 1,
  },
  chatListContent: {
    paddingBottom: 100,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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