import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useColorScheme } from 'react-native';
import { Heart, MessageCircle } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import { FontFamily, FontSize, Spacing, BorderRadius } from '@/constants/Theme';

interface ProfileSummaryProps {
  avatar: string;
  username: string;
  isLive?: boolean;
  onPress?: () => void;
  timestamp?: string;
  likes?: number;
  comments?: number;
  showStats?: boolean;
  orientation?: 'vertical' | 'horizontal';
}

export default function ProfileSummary({
  avatar,
  username,
  isLive = false,
  onPress,
  timestamp,
  likes,
  comments,
  showStats = false,
  orientation = 'vertical'
}: ProfileSummaryProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  
  if (orientation === 'horizontal') {
    return (
      <View style={styles.horizontalContainer}>
        <TouchableOpacity 
          style={styles.horizontalLeft}
          onPress={onPress}
          activeOpacity={0.8}
        >
          <View style={styles.avatarContainer}>
            <Image source={{ uri: avatar }} style={styles.avatar} />
            {isLive && <View style={styles.liveIndicator} />}
          </View>
          <View style={styles.userInfo}>
            <Text style={[styles.usernameHorizontal, { color: colors.primary }]} numberOfLines={1}>
              {username}
            </Text>
            {timestamp && (
              <Text style={styles.timestamp}>{timestamp}</Text>
            )}
          </View>
        </TouchableOpacity>
        
        {showStats && (likes !== undefined || comments !== undefined) && (
          <View style={styles.statsContainer}>
            <View style={styles.statsRow}>
              {likes !== undefined && (
                <View style={styles.statButton}>
                  <Heart size={20} color="#00B4D8" fill="none" />
                  <Text style={styles.statCount}>{likes}</Text>
                </View>
              )}
              {comments !== undefined && (
                <View style={styles.statButton}>
                  <MessageCircle size={20} color="#00B4D8" fill="none" />
                  <Text style={styles.statCount}>{comments}</Text>
                </View>
              )}
            </View>
          </View>
        )}
      </View>
    );
  }
  
  return (
    <TouchableOpacity 
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.avatarContainer}>
        <Image source={{ uri: avatar }} style={styles.avatar} />
        {isLive && <View style={styles.liveIndicator} />}
      </View>
      <Text 
        style={[styles.username, { color: colors.text }]}
        numberOfLines={1}
      >
        {username}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginRight: Spacing.lg,
    width: 80,
  },
  horizontalContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  horizontalLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 2,
    borderColor: '#00B4D8',
  },
  liveIndicator: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#4ADE80',
    borderWidth: 2,
    borderColor: '#00B4D8',
  },
  username: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.xs,
    textAlign: 'center',
    marginBottom: 2,
  },
  userInfo: {
    marginLeft: 12,
    justifyContent: 'center',
  },
  usernameHorizontal: {
    fontFamily: FontFamily.semiBold,
    fontSize: 16,
    marginBottom: 4,
    color: '#00B4D8',
  },
  timestamp: {
    fontSize: 12,
    color: '#fff',
    fontFamily: FontFamily.regular,
  },
  statsContainer: {
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: 8,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 24,
  },
  countsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 24,
  },
  statButton: {
    flexDirection: 'column',
    alignItems: 'center',
    gap: 4,
  },
  statCount: {
    fontSize: 12,
    color: '#fff',
    fontFamily: FontFamily.medium,
  },
});