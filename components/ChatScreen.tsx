import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Dimensions,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColorScheme } from 'react-native';
import {
  ArrowLeft,
  Phone,
  Video,
  MoreVertical,
  Check,
  CheckCheck,
  Clock,
} from 'lucide-react-native';
import Colors from '@/constants/Colors';
import { FontFamily, FontSize, Spacing } from '@/constants/Theme';
import { useWebSocket, ChatMessage, User } from '@/hooks/useWebSocket';
import { useVoiceRecording } from '@/hooks/useVoiceRecording';
import { useVideoCall } from '@/hooks/useVideoCall';
import VoiceMessagePlayer from './VoiceMessagePlayer';
import VideoCallModal from './VideoCallModal';
import ChatInput from './ChatInput';

const { width } = Dimensions.get('window');

interface ChatScreenProps {
  user: User;
  currentUserId: string;
  onBack: () => void;
}

const ChatScreen: React.FC<ChatScreenProps> = ({
  user,
  currentUserId,
  onBack,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [userTyping, setUserTyping] = useState(false);
  const [showAttachments, setShowAttachments] = useState(false);

  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const insets = useSafeAreaInsets();
  const flatListRef = useRef<FlatList>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout>();

  const { socket, isConnected, sendMessage, sendTyping, markAsRead } =
    useWebSocket(currentUserId);
  const {
    isRecording,
    recordingDuration,
    startRecording,
    stopRecording,
    requestPermissions,
  } = useVoiceRecording();

  const {
    isInCall,
    startCall,
    endCall,
    toggleVideo,
    toggleAudio,
    answerCall,
    rejectCall,
    isVideoEnabled,
    isAudioEnabled,
    localStream,
    remoteStream,
  } = useVideoCall(socket);

  // WebSocket message handling
  useEffect(() => {
    if (socket) {
      socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        console.log('Received websocket message:', data);

        switch (data.type) {
          case 'message':
            const newMessage: ChatMessage = {
              id: data.data.id,
              senderId: data.data.senderId,
              receiverId: data.data.receiverId,
              content: data.data.content,
              type: data.data.type || 'text',
              timestamp: data.data.timestamp || Date.now(),
              status: data.data.status || 'sent',
              voiceDuration: data.data.voiceDuration,
              voiceUrl: data.data.voiceUrl,
            };

            setMessages((prev) => {
              const messageExists = prev.some(
                (msg) => msg.id === newMessage.id
              );
              if (messageExists) {
                return prev;
              }
              return [...prev, newMessage];
            });

            setTimeout(
              () => flatListRef.current?.scrollToEnd({ animated: true }),
              100
            );
            break;
          case 'typing':
            if (data.data.senderId === user.id) {
              setUserTyping(data.data.isTyping);
            }
            break;
          case 'message_status':
            setMessages((prev) =>
              prev.map((msg) =>
                msg.id === data.data.messageId
                  ? { ...msg, status: data.data.status }
                  : msg
              )
            );
            break;
        }
      };
    }
  }, [socket, user.id]);

  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  const handleSendMessage = (
    content: string,
    type: 'text' | 'voice' | 'image' = 'text'
  ) => {
    if (content.trim() && isConnected) {
      const newMessage: ChatMessage = {
        id: Date.now().toString(),
        senderId: currentUserId,
        receiverId: user.id,
        content: content.trim(),
        type,
        timestamp: Date.now(),
        status: 'sending',
      };

      setMessages((prev) => [...prev, newMessage]);
      sendMessage(newMessage);

      setTimeout(
        () => flatListRef.current?.scrollToEnd({ animated: true }),
        100
      );
    }
  };

  const handleSendVoice = (uri: string, duration: number) => {
    if (isConnected) {
      const newMessage: ChatMessage = {
        id: Date.now().toString(),
        senderId: currentUserId,
        receiverId: user.id,
        content: uri,
        type: 'voice',
        voiceDuration: duration,
        voiceUrl: uri,
        timestamp: Date.now(),
        status: 'sending',
      };

      setMessages((prev) => [...prev, newMessage]);
      sendMessage(newMessage);

      setTimeout(
        () => flatListRef.current?.scrollToEnd({ animated: true }),
        100
      );
    }
  };

  const handleBack = () => {
    // Clear messages and reset state before going back
    setMessages([]);
    setShowAttachments(false);
    setUserTyping(false);
    onBack();
  };

  const handleVoiceCall = () => {
    console.log('Starting voice call with', user.username);
    startCall(user.id);
  };

  const handleVideoCall = () => {
    startCall(user.id);
  };

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getMessageStatusIcon = (status: ChatMessage['status']) => {
    switch (status) {
      case 'sending':
        return <Clock size={12} color={colors.tabIconDefault} />;
      case 'sent':
        return <Check size={12} color={colors.tabIconDefault} />;
      case 'delivered':
        return <CheckCheck size={12} color={colors.tabIconDefault} />;
      case 'read':
        return <CheckCheck size={12} color="#00B4D8" />;
      default:
        return null;
    }
  };

  const getMessageDateHeader = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();

    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const timeString = `${hours}:${minutes}`;

    return isToday ? `Today ${timeString}` : date.toLocaleDateString();
  };

  const renderMessage = ({ item }: { item: ChatMessage }) => {
    const isOwnMessage = item.senderId === currentUserId;

    return (
      <View
        style={[
          styles.messageContainer,
          isOwnMessage ? styles.ownMessage : styles.otherMessage,
        ]}
      >
        <View
          style={[
            styles.messageBubble,
            {
              backgroundColor: isOwnMessage ? '#00B4D8' : colors.card,
            },
            item.type === 'image' && styles.imageBubble,
            item.type === 'voice' && styles.voiceBubble,
          ]}
        >
          {item.type === 'text' && (
            <Text
              style={[
                styles.messageText,
                { color: isOwnMessage ? '#FFF' : colors.text },
              ]}
            >
              {item.content}
            </Text>
          )}

          {item.type === 'voice' && (
            <VoiceMessagePlayer
              uri={item.voiceUrl || item.content}
              duration={item.voiceDuration || 0}
              isOwnMessage={isOwnMessage}
            />
          )}

          {item.type === 'image' && (
            <View style={styles.imageMessageContainer}>
              <Image
                source={{ uri: item.content }}
                style={styles.messageImage}
                resizeMode="cover"
              />
            </View>
          )}

          <View style={styles.messageFooter}>
            <Text
              style={[
                styles.messageTime,
                {
                  color: isOwnMessage
                    ? 'rgba(255,255,255,0.7)'
                    : colors.tabIconDefault,
                },
              ]}
            >
              {formatTime(item.timestamp)}
            </Text>
            {isOwnMessage && (
              <View style={styles.messageStatus}>
                {getMessageStatusIcon(item.status)}
              </View>
            )}
          </View>
        </View>
      </View>
    );
  };

  const renderTypingIndicator = () => {
    if (!userTyping) return null;

    return (
      <View style={[styles.messageContainer, styles.otherMessage]}>
        <View
          style={[
            styles.messageBubble,
            { backgroundColor: colors.card },
          ]}
        >
          <View style={styles.typingIndicator}>
            <View
              style={[
                styles.typingDot,
                { backgroundColor: colors.tabIconDefault },
              ]}
            />
            <View
              style={[
                styles.typingDot,
                { backgroundColor: colors.tabIconDefault },
              ]}
            />
            <View
              style={[
                styles.typingDot,
                { backgroundColor: colors.tabIconDefault },
              ]}
            />
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View
        style={[
          styles.header,
          {
            paddingTop: insets.top + 10,
            backgroundColor: colors.card,
            borderBottomColor: colors.border,
          },
        ]}
      >
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <ArrowLeft size={24} color={colors.text} />
          </TouchableOpacity>

          <View style={styles.userInfo}>
            <Image source={{ uri: user.avatar }} style={styles.headerAvatar} />
            <View style={styles.userDetails}>
              <Text style={[styles.userName, { color: colors.text }]}>
                {user.username}
              </Text>
              <Text
                style={[styles.userStatus, { color: colors.tabIconDefault }]}
              >
                {user.isOnline ? 'Online' : 'Last seen recently'}
              </Text>
            </View>
          </View>

          <View style={styles.headerActions}>
            <TouchableOpacity
              onPress={handleVoiceCall}
              style={styles.headerAction}
            >
              <Phone size={22} color={colors.text} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleVideoCall}
              style={styles.headerAction}
            >
              <Video size={22} color={colors.text} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.headerAction}>
              <MoreVertical size={22} color={colors.text} />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Messages */}
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        style={styles.messagesList}
        contentContainerStyle={styles.messagesContent}
        onContentSizeChange={() =>
          flatListRef.current?.scrollToEnd({ animated: true })
        }
        ListHeaderComponent={() => (
          <Text style={[styles.dateHeader, { color: colors.tabIconDefault }]}>
            {messages.length > 0 ? getMessageDateHeader(messages[0].timestamp) : ''}
          </Text>
        )}
        ListFooterComponent={renderTypingIndicator}
      />

      {/* Input Area */}
      <View style={{ paddingBottom: insets.bottom }}>
        <ChatInput
          onSendMessage={(content, type) => {
            handleSendMessage(content, type);
            setShowAttachments(false);
          }}
          onSendVoice={handleSendVoice}
          placeholder="Type a message..."
          showAttachments={showAttachments}
          setShowAttachments={setShowAttachments}
        />
      </View>

      {/* Video Call Modal */}
      {isInCall && (
        <VideoCallModal
          isVisible={isInCall}
          localStream={localStream}
          remoteStream={remoteStream}
          isVideoEnabled={isVideoEnabled}
          isAudioEnabled={isAudioEnabled}
          onEndCall={endCall}
          onToggleVideo={toggleVideo}
          onToggleAudio={toggleAudio}
          callerName={user.username}
          callerAvatar={user.avatar}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    borderBottomWidth: 1,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.sm,
  },
  backButton: {
    marginRight: Spacing.sm,
  },
  userInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: Spacing.sm,
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: FontSize.md,
    fontFamily: FontFamily.semiBold,
  },
  userStatus: {
    fontSize: FontSize.xs,
    fontFamily: FontFamily.regular,
  },
  headerActions: {
    flexDirection: 'row',
  },
  headerAction: {
    marginLeft: Spacing.md,
  },
  messagesList: {
    flex: 1,
  },
  messagesContent: {
    padding: Spacing.md,
  },
  messageContainer: {
    marginBottom: Spacing.sm,
  },
  ownMessage: {
    alignItems: 'flex-end',
  },
  otherMessage: {
    alignItems: 'flex-start',
  },
  messageBubble: {
    maxWidth: width * 0.75,
    padding: Spacing.sm,
    borderRadius: 18,
  },
  imageBubble: {
    padding: 4,
    backgroundColor: 'transparent',
  },
  voiceBubble: {
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.sm,
  },
  messageText: {
    fontSize: FontSize.md,
    fontFamily: FontFamily.regular,
    lineHeight: 20,
  },
  messageFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: 4,
  },
  messageTime: {
    fontSize: FontSize.xs,
    fontFamily: FontFamily.regular,
  },
  messageStatus: {
    marginLeft: 4,
  },
  typingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.xs,
  },
  typingDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginHorizontal: 2,
  },
  imageMessageContainer: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 4,
  },
  messageImage: {
    width: width * 0.6,
    height: width * 0.6,
    borderRadius: 12,
    minHeight: 200,
  },
  dateHeader: {
    fontSize: FontSize.xs,
    fontFamily: FontFamily.regular,
    textAlign: 'center',
    marginVertical: Spacing.sm,
    opacity: 0.6,
  },
});

export default ChatScreen;