import React, { useState, useRef, useEffect } from 'react';
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
  Pause,
  Play,
} from 'lucide-react-native';
import Colors from '@/constants/Colors';
import { FontFamily, FontSize, Spacing } from '@/constants/Theme';
import { useVoiceRecording } from '@/hooks/useVoiceRecording';
import CameraScreen from './CameraScreen';
import EmojiPicker from './EmojiPicker';
import * as ImagePicker from 'expo-image-picker';

interface ChatInputProps {
  onSendMessage: (message: string, type: 'text' | 'voice' | 'image') => void;
  onSendVoice: (uri: string, duration: number) => void;
  placeholder?: string;
  showAttachments: boolean;
  setShowAttachments: (show: boolean) => void;
}

const ChatInput: React.FC<ChatInputProps> = ({
  onSendMessage,
  onSendVoice,
  placeholder = 'Type a message...',
  showAttachments,
  setShowAttachments,
}) => {
  const [inputText, setInputText] = useState('');
  const [showCamera, setShowCamera] = useState(false);
  const [showEmoji, setShowEmoji] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isDiscarding, setIsDiscarding] = useState(false);

  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const attachmentAnimation = useRef(new Animated.Value(0)).current;
  const typingTimeoutRef = useRef<NodeJS.Timeout>();

  const recordingWaveAnimations = useRef(
    Array.from({ length: 25 }, () => new Animated.Value(0.3))
  ).current;

  const {
    isRecording: recordingStatus,
    recordingDuration,
    startRecording,
    stopRecording,
    requestPermissions,
  } = useVoiceRecording();

  // Sync animation with showAttachments prop
  useEffect(() => {
    Animated.timing(attachmentAnimation, {
      toValue: showAttachments ? 1 : 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [showAttachments]);

  // Animate waveforms during recording
  useEffect(() => {
    if (recordingStatus && !isPaused) {
      const animations = recordingWaveAnimations.map((anim) =>
        Animated.loop(
          Animated.sequence([
            Animated.timing(anim, {
              toValue: Math.random() * 0.9 + 0.4,
              duration: 150 + Math.random() * 200,
              useNativeDriver: true,
            }),
            Animated.timing(anim, {
              toValue: 0.2 + Math.random() * 0.3,
              duration: 150 + Math.random() * 200,
              useNativeDriver: true,
            }),
          ])
        )
      );

      animations.forEach((anim, index) => {
        setTimeout(() => anim.start(), index * 20);
      });

      return () => {
        animations.forEach((anim) => anim.stop());
      };
    } else {
      recordingWaveAnimations.forEach((anim) => {
        anim.stopAnimation();
      });
    }
  }, [recordingStatus, isPaused]);

  const handleSendMessage = () => {
    if (inputText.trim()) {
      onSendMessage(inputText.trim(), 'text');
      setInputText('');
      setIsTyping(false);
      setShowEmoji(false); // Close emoji picker after sending
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
    if (recordingStatus) {
      const uri = await stopRecording();
      if (uri && !isDiscarding) {
        onSendVoice(uri, recordingDuration);
      }
      setIsPaused(false);
      setIsDiscarding(false);
    } else {
      const hasPermission = await requestPermissions();
      if (hasPermission) {
        await startRecording();
      } else {
        Alert.alert(
          'Permission Required',
          'Please grant microphone permission to record voice messages.'
        );
      }
    }
  };

  const handlePauseResume = async () => {
    try {
      if (isPaused) {
        await startRecording(true);
      } else {
        await stopRecording(true);
      }
      setIsPaused(!isPaused);
    } catch (error) {
      console.error('Error pausing/resuming recording:', error);
    }
  };

  const handleCancelRecording = async () => {
    setIsDiscarding(true);
    if (recordingStatus) {
      await stopRecording(false, true);
    }
    setIsPaused(false);
    setIsDiscarding(false);
  };

  const toggleAttachments = () => {
    setShowAttachments(!showAttachments);
  };

  const handleCameraCapture = (uri: string) => {
    onSendMessage(uri, 'image');
    setShowCamera(false);
    setShowAttachments(false);
  };

  const handleGalleryPick = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
        allowsMultipleSelection: false,
      });

      if (!result.canceled && result.assets[0]) {
        onSendMessage(result.assets[0].uri, 'image');
        setShowAttachments(false);
      }
    } catch (error) {
      console.error('Error picking image:', error);
    }
  };

  const handleEmojiSelect = (emoji: string) => {
    setInputText((prev) => prev + emoji);
  };

  const formatRecordingTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <>
      <View
        style={[
          styles.container,
          {
            backgroundColor: colors.card,
            borderTopColor: colors.border,
          },
        ]}
      >
        {recordingStatus ? (
          <View
            style={[
              styles.textInputContainer,
              styles.recordingContainer,
              { backgroundColor: colors.subtle, borderColor: colors.border },
            ]}
          >
            <TouchableOpacity
              onPress={handleCancelRecording}
              style={styles.cancelRecordButton}
            >
              <X size={18} color="#FF3B30" />
            </TouchableOpacity>

            <View style={styles.recordingWaveform}>
              {recordingWaveAnimations.map((anim, index) => (
                <Animated.View
                  key={index}
                  style={[
                    styles.recordingWaveBar,
                    {
                      transform: [{ scaleY: anim }],
                      backgroundColor: '#00B4D8',
                    },
                  ]}
                />
              ))}
            </View>

            <Text style={styles.recordingTimer}>
              {formatRecordingTime(recordingDuration)}
            </Text>

            <TouchableOpacity
              onPress={handlePauseResume}
              style={styles.pauseButton}
            >
              {isPaused ? (
                <Play size={18} color="#00B4D8" />
              ) : (
                <Pause size={18} color="#00B4D8" />
              )}
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleVoiceRecording}
              style={styles.sendRecordingButton}
            >
              <Send size={18} color="#FFF" />
            </TouchableOpacity>
          </View>
        ) : (
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

            <View
              style={[
                styles.textInputContainer,
                { backgroundColor: colors.subtle, borderColor: colors.border },
              ]}
            >
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
              <TouchableOpacity
                onPress={handleSendMessage}
                style={[styles.sendButton, { backgroundColor: '#00B4D8' }]}
              >
                <Send size={20} color="#FFF" />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                onPress={handleVoiceRecording}
                style={[styles.voiceButton, { backgroundColor: '#00B4D8' }]}
              >
                <Mic size={20} color="#FFF" />
              </TouchableOpacity>
            )}
          </View>
        )}

        {/* Attachments Menu */}
        {showAttachments && (
          <Animated.View
            style={[
              styles.attachmentsMenu,
              {
                backgroundColor: colors.card,
                transform: [
                  {
                    translateY: attachmentAnimation.interpolate({
                      inputRange: [0, 1],
                      outputRange: [200, 0],
                    }),
                  },
                ],
                opacity: attachmentAnimation,
              },
            ]}
          >
            <View style={styles.attachmentsContainer}>
              <TouchableOpacity
                style={styles.attachmentOption}
                onPress={() => {
                  setShowCamera(true);
                  setShowAttachments(false);
                }}
              >
                <View
                  style={[
                    styles.attachmentIcon,
                    { backgroundColor: '#4CAF50' },
                  ]}
                >
                  <Camera size={24} color="#FFF" />
                </View>
                <Text style={[styles.attachmentText, { color: colors.text }]}>
                  Camera
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.attachmentOption}
                onPress={handleGalleryPick}
              >
                <View
                  style={[
                    styles.attachmentIcon,
                    { backgroundColor: '#2196F3' },
                  ]}
                >
                  <ImageIcon size={24} color="#FFF" />
                </View>
                <Text style={[styles.attachmentText, { color: colors.text }]}>
                  Gallery
                </Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        )}
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
  recordingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginRight: Spacing.sm,
  },
  cancelRecordButton: {
    padding: 4,
    marginRight: 8,
  },
  recordingWaveform: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    height: 24,
    marginHorizontal: 8,
  },
  recordingWaveBar: {
    width: 2,
    height: 24,
    borderRadius: 1,
    marginHorizontal: 1,
  },
  recordingTimer: {
    fontSize: FontSize.sm,
    fontFamily: FontFamily.medium,
    color: '#666',
    marginHorizontal: 8,
    minWidth: 40,
    textAlign: 'center',
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
  sendRecordingButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#00B4D8',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 4,
  },
  pauseButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0,180,216,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 4,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
  },
  attachButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginHorizontal: Spacing.sm,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: 20,
    borderWidth: 1,
    maxHeight: 100,
  },
  textInput: {
    flex: 1,
    fontSize: FontSize.md,
    fontFamily: FontFamily.regular,
    maxHeight: 40,
    outlineStyle: 'none',
    marginTop: 12
      },
  emojiButton: {
    padding: 4,
  },
  attachmentsMenu: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: Spacing.md,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  attachmentsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: Spacing.md,
  },
  attachmentOption: {
    alignItems: 'center',
    marginHorizontal: Spacing.lg,
  },
  attachmentIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  attachmentText: {
    fontSize: FontSize.sm,
    fontFamily: FontFamily.medium,
  },
});

export default ChatInput;