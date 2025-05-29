import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, Dimensions } from 'react-native';
import { useColorScheme } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Heart, MessageCircle, Share2, Music, Play, Pause } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Colors from '@/constants/Colors';
import { FontFamily, FontSize, Spacing, BorderRadius } from '@/constants/Theme';
import HeaderBar from '@/components/HeaderBar';

// Mock data
const reelsData = [
  {
    id: '1',
    video: 'https://images.pexels.com/photos/5582866/pexels-photo-5582866.jpeg',
    title: 'Traditional dance performance in Kigali',
    username: 'dance_master',
    avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg',
    likes: 12543,
    comments: 873,
    shares: 346,
    music: 'Traditional Rwandan Beat',
    verified: true
  },
  {
    id: '2',
    video: 'https://images.pexels.com/photos/3538558/pexels-photo-3538558.jpeg',
    title: 'Hiking the Virunga Mountains',
    username: 'nature_explorer',
    avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg',
    likes: 9845,
    comments: 645,
    shares: 288,
    music: 'Adventures Ahead - Soundtrack',
    verified: false
  },
  {
    id: '3',
    video: 'https://images.pexels.com/photos/3742689/pexels-photo-3742689.jpeg',
    title: 'Cooking Rwandan cuisine - easy recipe',
    username: 'chef_marie',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg',
    likes: 8764,
    comments: 754,
    shares: 412,
    music: 'Cooking With Love - Playlist',
    verified: true
  },
  {
    id: '4',
    video: 'https://images.pexels.com/photos/7991443/pexels-photo-7991443.jpeg',
    title: 'My daily workout routine - try it at home!',
    username: 'fitness_coach',
    avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg',
    likes: 7653,
    comments: 542,
    shares: 211,
    music: 'Workout Beats 2025',
    verified: true
  }
];

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default function ReelsScreen() {
  const [activeReel, setActiveReel] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const insets = useSafeAreaInsets();
  
  const renderReel = ({ item, index }) => {
    return (
      <View style={styles.reelContainer}>
        <Image 
          source={{ uri: item.video }}
          style={styles.reelVideo}
        />
        
        {/* Video Overlay for Play/Pause */}
        <TouchableOpacity
          style={styles.videoOverlay}
          activeOpacity={1}
          onPress={() => setIsPlaying(!isPlaying)}
        >
          {!isPlaying && (
            <View style={styles.playIconContainer}>
              <Play size={50} color="#FFFFFF" />
            </View>
          )}
        </TouchableOpacity>
        
        {/* Gradient Overlay */}
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.8)']}
          style={styles.gradient}
        />
        
        {/* Side Actions */}
        <View style={[styles.sideActions, { bottom: insets.bottom + 80 }]}>
          <TouchableOpacity style={styles.actionButton}>
            <Heart size={32} color="#FFFFFF" />
            <Text style={styles.actionText}>{item.likes}</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton}>
            <MessageCircle size={32} color="#FFFFFF" />
            <Text style={styles.actionText}>{item.comments}</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton}>
            <Share2 size={32} color="#FFFFFF" />
            <Text style={styles.actionText}>{item.shares}</Text>
          </TouchableOpacity>
        </View>
        
        {/* Bottom Content */}
        <View style={[styles.bottomContent, { bottom: insets.bottom + 20 }]}>
          <View style={styles.userInfoContainer}>
            <Image source={{ uri: item.avatar }} style={styles.avatar} />
            <Text style={styles.username}>{item.username}</Text>
            {item.verified && (
              <View style={styles.verifiedBadge}>
                <Text style={styles.verifiedText}>✓</Text>
              </View>
            )}
            <TouchableOpacity style={styles.followButton}>
              <Text style={styles.followText}>Follow</Text>
            </TouchableOpacity>
          </View>
          
          <Text style={styles.title} numberOfLines={2}>
            {item.title}
          </Text>
          
          <View style={styles.musicContainer}>
            <Music size={16} color="#FFFFFF" />
            <Text style={styles.musicText}>
              {item.music}
            </Text>
          </View>
        </View>
      </View>
    );
  };
  
  return (
    <View style={styles.container}>
      <HeaderBar transparent={true} />
      
      <FlatList
        data={reelsData}
        renderItem={renderReel}
        keyExtractor={(item) => item.id}
        pagingEnabled
        snapToInterval={screenHeight}
        decelerationRate="fast"
        showsVerticalScrollIndicator={false}
        onMomentumScrollEnd={(event) => {
          const index = Math.round(
            event.nativeEvent.contentOffset.y / screenHeight
          );
          setActiveReel(index);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  reelContainer: {
    width: screenWidth,
    height: screenHeight,
    position: 'relative',
  },
  reelVideo: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  videoOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playIconContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 50,
    padding: 10,
  },
  gradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '50%',
  },
  sideActions: {
    position: 'absolute',
    right: Spacing.md,
    alignItems: 'center',
  },
  actionButton: {
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  actionText: {
    color: '#FFF',
    fontFamily: FontFamily.medium,
    fontSize: FontSize.sm,
    marginTop: 4,
  },
  bottomContent: {
    position: 'absolute',
    left: 0,
    right: 0,
    paddingHorizontal: Spacing.md,
  },
  userInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#FFF',
    marginRight: Spacing.sm,
  },
  username: {
    color: '#FFF',
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.md,
    marginRight: Spacing.xs,
  },
  verifiedBadge: {
    backgroundColor: '#3B82F6',
    width: 16,
    height: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.sm,
  },
  verifiedText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  followButton: {
    backgroundColor: '#6D28D9',
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
  },
  followText: {
    color: '#FFF',
    fontFamily: FontFamily.medium,
    fontSize: FontSize.xs,
  },
  title: {
    color: '#FFF',
    fontFamily: FontFamily.regular,
    fontSize: FontSize.md,
    marginBottom: Spacing.sm,
  },
  musicContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  musicText: {
    color: '#FFF',
    fontFamily: FontFamily.regular,
    fontSize: FontSize.sm,
    marginLeft: Spacing.xs,
  },
});