import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useColorScheme } from 'react-native';
import { Phone, Video, Mic } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import { FontFamily, FontSize, Spacing } from '@/constants/Theme';
import { User, ChatMessage } from '@/hooks/useWebSocket';

interface ChatListItemProps {
  user: User;
  lastMessage?: ChatMessage;
  unreadCount?: number;
  onPress: () => void;
  onVoiceCall: () => void;
  onVideoCall: () => void;
}

const ChatListItem: React.FC<ChatListItemProps> = ({
  user,
  lastMessage,
  unreadCount = 0,
  onPress,
  onVoiceCall,
  onVideoCall
}) => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const formatTime = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'now';
    if (minutes < 60) return `${minutes}m`;
    if (hours < 24) return `${hours}h`;
    return `${days}d`;
  };

  const getLastMessagePreview = () => {
    if (!lastMessage) return 'No messages yet';
    
    switch (lastMessage.type) {
      case 'voice':
        return '🎵 Voice message';
      case 'image':
        return '📷 Photo';
      case 'video':
        return '🎥 Video';
      default:
        return lastMessage.content;
    }
  };

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.avatarContainer}>
        <Image source={{ uri: user.avatar }} style={styles.avatar} />
        {user.isOnline && <View style={styles.onlineIndicator} />}
      </View>

      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={[styles.username, { color: colors.text }]} numberOfLines={1}>
            {user.username}
          </Text>
          {lastMessage && (
            <Text style={[styles.time, { color: colors.tabIconDefault }]}>
              {formatTime(lastMessage.timestamp)}
            </Text>
          )}
        </View>

        <View style={styles.messageRow}>
          <Text 
            style={[
              styles.lastMessage, 
              { 
                color: unreadCount > 0 ? colors.text : colors.tabIconDefault,
                fontFamily: unreadCount > 0 ? FontFamily.medium : FontFamily.regular
              }
            ]} 
            numberOfLines={1}
          >
            {getLastMessagePreview()}
          </Text>
          
          {unreadCount > 0 && (
            <View style={[styles.unreadBadge, { backgroundColor: '#00B4D8' }]}>
              <Text style={styles.unreadText}>
                {unreadCount > 99 ? '99+' : unreadCount}
              </Text>
            </View>
          )}
        </View>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity onPress={onVoiceCall} style={styles.actionButton}>
          <Phone size={18} color={colors.tabIconDefault} />
        </TouchableOpacity>
        <TouchableOpacity onPress={onVideoCall} style={styles.actionButton}>
          <Video size={18} color={colors.tabIconDefault} />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
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
  onlineIndicator: {
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
  content: {
    flex: 1,
    marginRight: Spacing.sm,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  username: {
    fontSize: FontSize.md,
    fontFamily: FontFamily.semiBold,
    flex: 1,
  },
  time: {
    fontSize: FontSize.xs,
    fontFamily: FontFamily.regular,
  },
  messageRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  lastMessage: {
    fontSize: FontSize.sm,
    flex: 1,
  },
  unreadBadge: {
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  unreadText: {
    color: '#FFF',
    fontSize: 10,
    fontFamily: FontFamily.semiBold,
  },
  actions: {
    flexDirection: 'row',
  },
  actionButton: {
    padding: Spacing.xs,
    marginLeft: Spacing.xs,
  },
});

export default ChatListItem;