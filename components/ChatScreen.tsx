import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  Image,
  Dimensions,
  Platform,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColorScheme } from 'react-native';
import { ArrowLeft, Phone, Video, MoveVertical as MoreVertical, Send, Mic, Camera, Image as ImageIcon, Smile, Play, Pause, Check, CheckCheck, Clock } from 'lucide-react-native';
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

const ChatScreen: React.FC<ChatScreenProps> = ({ user, currentUserId, onBack }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [userTyping, setUserTyping] = useState(false);
  const [showVoiceRecording, setShowVoiceRecording] = useState(false);
  
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const insets = useSafeAreaInsets();
  const flatListRef = useRef<FlatList>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout>();
  
  const { socket, isConnected, sendMessage, sendTyping, markAsRead } = useWebSocket(currentUserId);
  const {
    isRecording,
    recordingDuration,
    startRecording,
    stopRecording,
    requestPermissions
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
    remoteStream
  } = useVideoCall(socket);

  useEffect(() => {
    if (socket) {
      socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        
        switch (data.type) {
          case 'message':
            setMessages(prev => [...prev, data.data]);
            break;
          case 'typing':
            if (data.data.senderId === user.id) {
              setUserTyping(data.data.isTyping);
            }
            break;
          case 'message_status':
            setMessages(prev => 
              prev.map(msg => 
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

  const handleSendMessage = () => {
    if (inputText.trim() && isConnected) {
      sendMessage({
        senderId: currentUserId,
        receiverId: user.id,
        content: inputText.trim(),
        type: 'text'
      });
      setInputText('');
    }
  };

  const handleInputChange = (text: string) => {
    setInputText(text);
    
    if (!isTyping && text.length > 0) {
      setIsTyping(true);
      sendTyping(user.id, true);
    }
    
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      sendTyping(user.id, false);
    }, 1000);
  };

  const handleVoiceRecording = async () => {
    if (isRecording) {
      const uri = await stopRecording();
      if (uri) {
        sendMessage({
          senderId: currentUserId,
          receiverId: user.id,
          content: uri,
          type: 'voice',
          voiceDuration: recordingDuration,
          voiceUrl: uri
        });
      }
      setShowVoiceRecording(false);
    } else {
      const hasPermission = await requestPermissions();
      if (hasPermission) {
        setShowVoiceRecording(true);
        await startRecording();
      } else {
        Alert.alert('Permission Required', 'Please grant microphone permission to record voice messages.');
      }
    }
  };

  const handleVideoCall = () => {
    startCall(user.id);
  };

  const handleVoiceCall = () => {
    // Implement voice call logic
    console.log('Starting voice call with', user.username);
  };

  const handleSendMessage = (content: string, type: 'text' | 'voice' | 'image') => {
    if (isConnected) {
      sendMessage({
        senderId: currentUserId,
        receiverId: user.id,
        content,
        type
      });
    }
  };

  const handleSendVoice = (uri: string, duration: number) => {
    if (isConnected) {
      sendMessage({
        senderId: currentUserId,
        receiverId: user.id,
        content: uri,
        type: 'voice',
        voiceDuration: duration,
        voiceUrl: uri
      });
    }
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

  const renderMessage = ({ item }: { item: ChatMessage }) => {
    const isOwnMessage = item.senderId === currentUserId;
    
    return (
      <View style={[
        styles.messageContainer,
        isOwnMessage ? styles.ownMessage : styles.otherMessage
      ]}>
        <View style={[
          styles.messageBubble,
          {
            backgroundColor: isOwnMessage ? '#00B4D8' : colors.card,
            borderColor: colors.border
          }
        ]}>
          {item.type === 'text' && (
            <Text style={[
              styles.messageText,
              { color: isOwnMessage ? '#FFF' : colors.text }
            ]}>
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
          
          <View style={styles.messageFooter}>
            <Text style={[
              styles.messageTime,
              { color: isOwnMessage ? 'rgba(255,255,255,0.7)' : colors.tabIconDefault }
            ]}>
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
        <View style={[styles.messageBubble, { backgroundColor: colors.card }]}>
          <View style={styles.typingIndicator}>
            <View style={[styles.typingDot, { backgroundColor: colors.tabIconDefault }]} />
            <View style={[styles.typingDot, { backgroundColor: colors.tabIconDefault }]} />
            <View style={[styles.typingDot, { backgroundColor: colors.tabIconDefault }]} />
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[
        styles.header,
        { 
          paddingTop: insets.top + 10,
          backgroundColor: colors.card,
          borderBottomColor: colors.border
        }
      ]}>
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={onBack} style={styles.backButton}>
            <ArrowLeft size={24} color={colors.text} />
          </TouchableOpacity>
          
          <View style={styles.userInfo}>
            <Image source={{ uri: user.avatar }} style={styles.headerAvatar} />
            <View style={styles.userDetails}>
              <Text style={[styles.userName, { color: colors.text }]}>
                {user.username}
              </Text>
              <Text style={[styles.userStatus, { color: colors.tabIconDefault }]}>
                {user.isOnline ? 'Online' : 'Last seen recently'}
              </Text>
            </View>
          </View>
          
          <View style={styles.headerActions}>
            <TouchableOpacity onPress={handleVoiceCall} style={styles.headerAction}>
              <Phone size={22} color={colors.text} />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleVideoCall} style={styles.headerAction}>
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
        onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
        ListFooterComponent={renderTypingIndicator}
      />

      {/* Input Area */}
      <View style={{ paddingBottom: insets.bottom }}>
        <ChatInput
          onSendMessage={handleSendMessage}
          onSendVoice={handleSendVoice}
          placeholder="Type a message..."
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
    borderWidth: 1,
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
});

export default ChatScreen;