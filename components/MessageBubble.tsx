import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useColorScheme } from 'react-native';
import { Play, Download, Eye } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import { FontFamily, FontSize, Spacing } from '@/constants/Theme';
import { ChatMessage } from '@/hooks/useWebSocket';
import VoiceMessagePlayer from './VoiceMessagePlayer';

interface MessageBubbleProps {
  message: ChatMessage;
  isOwnMessage: boolean;
  onImagePress?: (uri: string) => void;
  onVideoPress?: (uri: string) => void;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  isOwnMessage,
  onImagePress,
  onVideoPress,
}) => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const renderMessageContent = () => {
    switch (message.type) {
      case 'text':
        return (
          <Text style={[
            styles.messageText,
            { color: isOwnMessage ? '#FFF' : colors.text }
          ]}>
            {message.content}
          </Text>
        );

      case 'voice':
        return (
          <VoiceMessagePlayer
            uri={message.voiceUrl || message.content}
            duration={message.voiceDuration || 0}
            isOwnMessage={isOwnMessage}
          />
        );

      case 'image':
        return (
          <TouchableOpacity
            onPress={() => onImagePress?.(message.content)}
            style={styles.imageContainer}
          >
            <Image source={{ uri: message.content }} style={styles.messageImage} />
            <View style={styles.imageOverlay}>
              <Eye size={16} color="#FFF" />
            </View>
          </TouchableOpacity>
        );

      case 'video':
        return (
          <TouchableOpacity
            onPress={() => onVideoPress?.(message.content)}
            style={styles.videoContainer}
          >
            <Image source={{ uri: message.content }} style={styles.messageImage} />
            <View style={styles.videoOverlay}>
              <Play size={24} color="#FFF" fill="#FFF" />
            </View>
          </TouchableOpacity>
        );

      default:
        return (
          <Text style={[
            styles.messageText,
            { color: isOwnMessage ? '#FFF' : colors.text }
          ]}>
            {message.content}
          </Text>
        );
    }
  };

  return (
    <View style={[
      styles.container,
      isOwnMessage ? styles.ownMessage : styles.otherMessage
    ]}>
      <View style={[
        styles.bubble,
        {
          backgroundColor: isOwnMessage ? '#00B4D8' : colors.card,
          borderColor: colors.border
        }
      ]}>
        {renderMessageContent()}
        
        <View style={styles.messageFooter}>
          <Text style={[
            styles.messageTime,
            { color: isOwnMessage ? 'rgba(255,255,255,0.7)' : colors.tabIconDefault }
          ]}>
            {formatTime(message.timestamp)}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.sm,
    paddingHorizontal: Spacing.md,
  },
  ownMessage: {
    alignItems: 'flex-end',
  },
  otherMessage: {
    alignItems: 'flex-start',
  },
  bubble: {
    maxWidth: '75%',
    padding: Spacing.sm,
    borderRadius: 18,
    borderWidth: 1,
  },
  messageText: {
    fontSize: FontSize.md,
    fontFamily: FontFamily.regular,
    lineHeight: 20,
  },
  messageFooter: {
    marginTop: 4,
    alignItems: 'flex-end',
  },
  messageTime: {
    fontSize: FontSize.xs,
    fontFamily: FontFamily.regular,
  },
  imageContainer: {
    position: 'relative',
    borderRadius: 12,
    overflow: 'hidden',
  },
  videoContainer: {
    position: 'relative',
    borderRadius: 12,
    overflow: 'hidden',
  },
  messageImage: {
    width: 200,
    height: 150,
    resizeMode: 'cover',
  },
  imageOverlay: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 12,
    padding: 4,
  },
  videoOverlay: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -12 }, { translateY: -12 }],
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 20,
    padding: 8,
  },
});

export default MessageBubble;