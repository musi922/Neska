import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  Platform,
  Animated,
  TextInput,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColorScheme } from 'react-native';
import { X, Play, Heart, Share2, Send } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import { FontFamily, FontSize, Spacing } from '@/constants/Theme';

const { width, height } = Dimensions.get('window');

// Mock stories data
const mockStories = [
  {
    id: '1',
    type: 'image',
    url: 'https://images.pexels.com/photos/3889856/pexels-photo-3889856.jpeg',
    user: {
      name: 'Ornella',
      avatar:
        'https://images.pexels.com/photos/1858175/pexels-photo-1858175.jpeg',
    },
    time: '2m ago',
  },
  {
    id: '2',
    type: 'video',
    url: 'https://www.w3schools.com/html/mov_bbb.mp4',
    user: {
      name: 'Ornella',
      avatar:
        'https://images.pexels.com/photos/1858175/pexels-photo-1858175.jpeg',
    },
    time: '2m ago',
  },
  {
    id: '3',
    type: 'image',
    url: 'https://images.pexels.com/photos/2263436/pexels-photo-2263436.jpeg',
    user: {
      name: 'Ornella',
      avatar:
        'https://images.pexels.com/photos/1858175/pexels-photo-1858175.jpeg',
    },
    time: '2m ago',
  },
];

interface StoryOverlayProps {
  isVisible: boolean;
  onClose: () => void;
  stories?: typeof mockStories;
  initialIndex?: number;
}

const STORY_DURATION = 5000; // ms for image stories

const StoryOverlay: React.FC<StoryOverlayProps> = ({
  isVisible,
  onClose,
  stories = mockStories,
  initialIndex = 0,
}) => {
  const [current, setCurrent] = useState(initialIndex);
  const [paused, setPaused] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(123);
  const [reply, setReply] = useState('');
  const progress = useRef(new Animated.Value(0)).current;
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const insets = useSafeAreaInsets();

  useEffect(() => {
    if (!isVisible) return;
    if (stories[current].type === 'image' && !paused) {
      progress.setValue(0);
      Animated.timing(progress, {
        toValue: 1,
        duration: STORY_DURATION,
        useNativeDriver: false,
      }).start(({ finished }) => {
        if (finished) handleNext();
      });
    }
  }, [current, paused, isVisible]);

  const handleNext = () => {
    if (current < stories.length - 1) {
      setCurrent(current + 1);
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    if (current > 0) {
      setCurrent(current - 1);
    } else {
      onClose();
    }
  };

  const handleLike = () => {
    // Pause the story progress when liking
    setPaused(true);
    setIsLiked((prev) => !prev);
    setLikeCount((prev) => (isLiked ? prev - 1 : prev + 1));
    
    // Resume after a short delay
    setTimeout(() => {
      setPaused(false);
    }, 1000);
  };

  const handleShare = () => {
    // Implement share logic
    alert('Share feature coming soon!');
  };

  const handleSendReply = () => {
    if (reply.trim()) {
      alert('Reply sent: ' + reply);
      setReply('');
    }
  };

  if (!isVisible) return null;
  const story = stories[current];

  return (
    <View style={styles.overlay}>
      {Platform.OS === 'ios' && (
        <BlurView
          tint={colorScheme === 'dark' ? 'dark' : 'light'}
          intensity={30}
          style={StyleSheet.absoluteFill}
        />
      )}
      
      {/* Progress Bars */}
      <View style={[styles.progressRow, { top: insets.top + 12 }]}>
        {stories.map((s, idx) => (
          <View key={s.id} style={styles.progressBarBg}>
            <Animated.View
              style={[
                styles.progressBar,
                idx < current && { width: '100%' },
                idx === current && {
                  width: progress.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0%', '100%'],
                  }),
                },
                idx > current && { width: '0%' },
              ]}
            />
          </View>
        ))}
      </View>

      {/* Header - Moved higher and reduced font size */}
      <View style={[styles.header, { top: insets.top + 16 }]}>
        <View style={styles.userRow}>
          <Image source={{ uri: story.user.avatar }} style={styles.avatar} />
          <Text style={styles.username}>
            {story.user.name}
          </Text>
          <Text style={styles.time}>
            {story.time}
          </Text>
        </View>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <X size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* Story Content */}
      <TouchableOpacity
        style={styles.leftZone}
        onPress={handlePrev}
        activeOpacity={0.7}
      />
      <TouchableOpacity
        style={styles.rightZone}
        onPress={handleNext}
        activeOpacity={0.7}
      />

      <View style={styles.contentContainer}>
        {story.type === 'image' ? (
          <Image
            source={{ uri: story.url }}
            style={styles.storyMedia}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.videoContainer}>
            <Image
              source={{
                uri: 'https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg',
              }}
              style={styles.storyMedia}
              resizeMode="cover"
            />
            <View style={styles.playIconOverlay}>
              <Play size={50} color="#FFFFFF" />
              <Text style={styles.videoText}>Tap to play</Text>
            </View>
          </View>
        )}
      </View>

      {/* Bottom Actions - Like and Reply */}
      <View style={styles.bottomActions}>
        {/* Like Button - Removed like count */}
        <TouchableOpacity style={styles.actionButton} onPress={handleLike}>
          <Heart
            size={20}
            color={isLiked ? '#FF3040' : '#00B4D8'}
            fill={isLiked ? '#FF3040' : 'none'}
          />
        </TouchableOpacity>

        {/* Reply Input - Fixed styling */}
        <View style={styles.replyContainer}>
          <View style={styles.replyInputBox}>
            <TextInput
              style={styles.replyInput}
              placeholder="Reply..."
              placeholderTextColor="#B0B0B0"
              value={reply}
              onChangeText={setReply}
              onSubmitEditing={handleSendReply}
              returnKeyType="send"
              maxLength={100}
              underlineColorAndroid="transparent"
            />
            <TouchableOpacity
              style={[
                styles.sendButton,
                { 
                  backgroundColor: reply.trim() ? '#00B4D8' : 'rgba(0,180,216,0.3)',
                }
              ]}
              onPress={handleSendReply}
              disabled={!reply.trim()}
            >
              <Send size={16} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
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
    zIndex: 2000,
    backgroundColor: '#000000',
  },
  progressRow: {
    position: 'absolute',
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    zIndex: 10,
  },
  progressBarBg: {
    flex: 1,
    height: 3,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 1.5,
    marginHorizontal: 1,
    overflow: 'hidden',
  },
  progressBar: {
    height: 3,
    backgroundColor: '#00B4D8',
    borderRadius: 1.5,
    position: 'absolute',
    left: 0,
    top: 0,
  },
  header: {
    position: 'absolute',
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    zIndex: 20,
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  avatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    marginRight: 6,
  },
  username: {
    fontSize: 14,
    fontFamily: FontFamily.semiBold,
    fontWeight: '600',
    color: '#00B4D8',
    marginRight: 8,
  },
  time: {
    fontSize: 12,
    fontFamily: FontFamily.regular,
    color: '#CCCCCC',
  },
  closeButton: {
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderRadius: 20,
    padding: 8,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 80,
    paddingBottom: 120,
  },
  storyMedia: {
    width: width * 0.95,
    height: height * 0.80,
    borderRadius: 12,
  },
  videoContainer: {
    width: width * 0.95,
    height: height * 0.80,
    borderRadius: 12,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1A1A1A',
  },
  playIconOverlay: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 40,
    padding: 20,
  },
  videoText: {
    color: '#FFFFFF',
    fontSize: 12,
    marginTop: 8,
    fontFamily: FontFamily.medium,
  },
  leftZone: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: width * 0.3,
    height: height,
    zIndex: 30,
  },
  rightZone: {
    position: 'absolute',
    right: 0,
    top: 0,
    width: width * 0.3,
    height: height,
    zIndex: 30,
  },
  bottomActions: {
    position: 'absolute',
    bottom: 80,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 20,
    zIndex: 50,
  },
  actionButton: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 20,
    padding: 8,
    minWidth: 40,
  },
  replyContainer: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 16,
  },
  replyInputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderRadius: 25,
    paddingHorizontal: 16,
    paddingVertical: 8,
    width: '98%',
    maxWidth: '98%',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  replyInput: {
    flex: 1,
    color: '#FFFFFF', // Changed to white text
    fontSize: 16,
    fontFamily: FontFamily.regular,
    paddingVertical: 4,
    paddingHorizontal: 0,
    textAlignVertical: 'center',
  },
  sendButton: {
    marginLeft: 12,
    padding: 8, // Increased padding for better visibility
    borderRadius: 20, // Increased border radius for better look
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 32, // Minimum width to ensure visibility
    minHeight: 32, // Minimum height to ensure visibility
    elevation: 5, // Android shadow
    shadowColor: '#000', // iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
});

export default StoryOverlay;