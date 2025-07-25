import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  Animated,
  Platform,
} from 'react-native';
import { useColorScheme } from 'react-native';
import {
  Send,
  Mic,
  Camera,
  Image as ImageIcon,
  Smile,
  Plus,
  X,
} from 'lucide-react-native';
import Colors from '@/constants/Colors';
import { FontFamily, FontSize, Spacing } from '@/constants/Theme';
import { useVoiceRecording } from '@/hooks/useVoiceRecording';
import CameraScreen from './CameraScreen';
import EmojiPicker from './EmojiPicker';

interface ChatInputProps {
  onSendMessage: (message: string, type: 'text' | 'voice' | 'image') => void;
  onSendVoice: (uri: string, duration: number) => void;
  placeholder?: string;
}

const ChatInput: React.FC<ChatInputProps> = ({
  onSendMessage,
  onSendVoice,
  placeholder = "Type a message...",
}) => {
  const [inputText, setInputText] = useState('');
  const [showAttachments, setShowAttachments] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [showEmoji, setShowEmoji] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const attachmentAnimation = useRef(new Animated.Value(0)).current;
  const typingTimeoutRef = useRef<NodeJS.Timeout>();
  
  const {
    isRecording,
    recordingDuration,
    startRecording,
    stopRecording,
    requestPermissions
  } = useVoiceRecording();

  const handleSendMessage = () => {
    if (inputText.trim()) {
      onSendMessage(inputText.trim(), 'text');
      setInputText('');
      setIsTyping(false);
    }
  };

  const handleInputChange = (text: string) => {
    setInputText(text);
    
    if (!isTyping && text.length > 0) {
      setIsTyping(true);
    }
    
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
    }, 1000);
  };

  const handleVoiceRecording = async () => {
    if (isRecording) {
      const uri = await stopRecording();
      if (uri) {
        onSendVoice(uri, recordingDuration);
      }
    } else {
      const hasPermission = await requestPermissions();
      if (hasPermission) {
        await startRecording();
      } else {
        Alert.alert('Permission Required', 'Please grant microphone permission to record voice messages.');
      }
    }
  };

  const toggleAttachments = () => {
    const toValue = showAttachments ? 0 : 1;
    setShowAttachments(!showAttachments);
    
    Animated.spring(attachmentAnimation, {
      toValue,
      useNativeDriver: true,
      tension: 100,
      friction: 8,
    }).start();
  };

  const handleCameraCapture = (uri: string) => {
    onSendMessage(uri, 'image');
    setShowCamera(false);
  };

  const handleEmojiSelect = (emoji: string) => {
    setInputText(prev => prev + emoji);
  };

  const attachmentScale = attachmentAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  const attachmentOpacity = attachmentAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  return (
    <>
      <View style={[
        styles.container,
        { 
          backgroundColor: colors.card,
          borderTopColor: colors.border,
        }
      ]}>
        {/* Attachment Options */}
        {showAttachments && (
          <Animated.View
            style={[
              styles.attachmentOptions,
              {
                transform: [{ scale: attachmentScale }],
                opacity: attachmentOpacity,
              },
            ]}
          >
            <TouchableOpacity
              style={[styles.attachmentButton, { backgroundColor: '#8B5CF6' }]}
              onPress={() => {
                setShowCamera(true);
                setShowAttachments(false);
              }}
            >
              <Camera size={24} color="#FFF" />
              <Text style={styles.attachmentText}>Camera</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.attachmentButton, { backgroundColor: '#10B981' }]}
            >
              <ImageIcon size={24} color="#FFF" />
              <Text style={styles.attachmentText}>Gallery</Text>
            </TouchableOpacity>
          </Animated.View>
        )}

        {/* Voice Recording Overlay */}
        {isRecording && (
          <View style={styles.recordingOverlay}>
            <View style={styles.recordingContent}>
              <View style={styles.recordingIndicator}>
                <View style={styles.recordingDot} />
                <Text style={[styles.recordingText, { color: colors.text }]}>
                  Recording... {recordingDuration}s
                </Text>
              </View>
              <TouchableOpacity onPress={handleVoiceRecording} style={styles.stopRecordingButton}>
                <Text style={styles.stopRecordingText}>Send</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Input Row */}
        <View style={styles.inputRow}>
          <TouchableOpacity
            onPress={toggleAttachments}
            style={[styles.attachButton, { backgroundColor: colors.subtle }]}
          >
            {showAttachments ? (
              <X size={20} color={colors.text} />
            ) : (
              <Plus size={20} color={colors.text} />
            )}
          </TouchableOpacity>

          <View style={[
            styles.textInputContainer,
            { backgroundColor: colors.subtle, borderColor: colors.border }
          ]}>
            <TextInput
              style={[styles.textInput, { color: colors.text }]}
              placeholder={placeholder}
              placeholderTextColor={colors.tabIconDefault}
              value={inputText}
              onChangeText={handleInputChange}
              multiline
              maxLength={1000}
            />
            
            <TouchableOpacity
              onPress={() => setShowEmoji(!showEmoji)}
              style={styles.emojiButton}
            >
              <Smile size={20} color={colors.tabIconDefault} />
            </TouchableOpacity>
          </View>
          
          {inputText.trim() ? (
            <TouchableOpacity onPress={handleSendMessage} style={styles.sendButton}>
              <Send size={20} color="#FFF" />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={handleVoiceRecording} style={styles.voiceButton}>
              <Mic size={20} color="#FFF" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Camera Screen */}
      <CameraScreen
        isVisible={showCamera}
        onClose={() => setShowCamera(false)}
        onCapture={handleCameraCapture}
      />

      {/* Emoji Picker */}
      {showEmoji && (
        <EmojiPicker
          onEmojiSelect={handleEmojiSelect}
          onClose={() => setShowEmoji(false)}
        />
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    borderTopWidth: 1,
    padding: Spacing.md,
  },
  attachmentOptions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: Spacing.md,
    paddingHorizontal: Spacing.md,
  },
  attachmentButton: {
    alignItems: 'center',
    padding: Spacing.md,
    borderRadius: 12,
    minWidth: 80,
  },
  attachmentText: {
    color: '#FFF',
    fontSize: FontSize.xs,
    fontFamily: FontFamily.medium,
    marginTop: Spacing.xs,
  },
  recordingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 180, 216, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  recordingContent: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    padding: Spacing.md,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  recordingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  recordingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EF4444',
    marginRight: Spacing.xs,
  },
  recordingText: {
    fontSize: FontSize.md,
    fontFamily: FontFamily.medium,
  },
  stopRecordingButton: {
    backgroundColor: '#00B4D8',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: 20,
  },
  stopRecordingText: {
    color: '#FFF',
    fontSize: FontSize.sm,
    fontFamily: FontFamily.semiBold,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  attachButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.sm,
  },
  textInputContainer: {
    flex: 1,
    borderRadius: 25,
    borderWidth: 1,
    marginRight: Spacing.sm,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  textInput: {
    flex: 1,
    fontSize: FontSize.md,
    fontFamily: FontFamily.regular,
    maxHeight: 100,
    minHeight: 40,
    textAlignVertical: 'center',
  },
  emojiButton: {
    marginLeft: Spacing.sm,
    paddingVertical: Spacing.xs,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#00B4D8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  voiceButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#00B4D8',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ChatInput;