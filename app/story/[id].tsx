import {
  View,
  Image,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  TextInput,
} from 'react-native';
import { useLocalSearchParams, Stack, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Colors from '@/constants/Colors';
import { FontFamily } from '@/constants/Theme';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const BRAND_COLOR = '#00B4D8';

// Import creators from the parent component or make it accessible via context/state management
const creators = [
  {
    id: '1',
    username: 'amani_j',
    avatar:
      'https://images.pexels.com/photos/1858175/pexels-photo-1858175.jpeg',
    isLive: true,
    following: true,
  },
  {
    id: '2',
    username: 'tech_eric',
    avatar:
      'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg',
    isLive: false,
    following: false,
  },
  {
    id: '3',
    username: 'dance_queen',
    avatar:
      'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg',
    isLive: true,
    following: true,
  },
  {
    id: '4',
    username: 'artist_paul',
    avatar:
      'https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg',
    isLive: false,
    following: false,
  },
  {
    id: '5',
    username: 'comedian_k',
    avatar:
      'https://images.pexels.com/photos/2218786/pexels-photo-2218786.jpeg',
    isLive: true,
    following: true,
  },
];

export default function StoryDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const creator = creators.find((c) => c.id === id);
  const insets = useSafeAreaInsets();

  if (!creator) return null;

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />

      {/* Story Content */}
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: creator.avatar }}
          style={styles.storyImage}
          resizeMode="cover"
        />
      </View>

      {/* Overlay Header */}
      <View style={[styles.header, { paddingTop: insets.top + 20 }]}>
        <View style={styles.profileInfo}>
          <Image
            source={{ uri: creator.avatar }}
            style={styles.profilePic}
          />
          <Text style={styles.username}>{creator.username}</Text>
          {creator.isLive && (
            <View style={styles.livePill}>
              <Text style={styles.liveText}>LIVE</Text>
            </View>
          )}
        </View>
        <TouchableOpacity
          onPress={() => {
            router.back(); // Navigate back to previous screen
          }}
          style={styles.closeButton}
        >
          <Ionicons name="close" size={28} color="#FFF" />
        </TouchableOpacity>
      </View>

      {/* Bottom Actions */}
      <View style={[styles.bottomActions, { paddingBottom: insets.bottom + 16 }]}>
        <View style={styles.messageContainer}>
          <TextInput
            placeholder="Send message..."
            placeholderTextColor="rgba(255,255,255,0.6)"
            style={styles.messageInput}
          />
          <TouchableOpacity style={styles.sendButton}>
            <Ionicons name="paper-plane" size={20} color="#FFF" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  imageContainer: {
    flex: 1,
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
  },
  storyImage: {
    width: '100%',
    height: '100%',
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profilePic: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
    borderWidth: 2,
    borderColor: BRAND_COLOR,
  },
  username: {
    color: '#FFF',
    fontSize: 16,
    fontFamily: FontFamily.semiBold,
    marginRight: 8,
  },
  livePill: {
    backgroundColor: BRAND_COLOR,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  liveText: {
    color: '#FFF',
    fontSize: 12,
    fontFamily: FontFamily.medium,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomActions: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  messageContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)', // Updated to match other buttons
    borderRadius: 24,
    marginRight: 12,
    paddingLeft: 16,
    paddingRight: 8,
  },
  messageInput: {
    flex: 1,
    color: '#FFF',
    height: 44,
    fontSize: 14,
    fontFamily: FontFamily.regular,
    outlineStyle: 'none', // Remove outline on web
  },
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    // Removed backgroundColor since it's inside messageContainer
  }
});
