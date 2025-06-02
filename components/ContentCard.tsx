import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions } from 'react-native';
import { Heart, MessageCircle, Share2, DollarSign } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Colors from '@/constants/Colors';
import { FontFamily, FontSize, Spacing, BorderRadius, Shadow } from '@/constants/Theme';
import { useColorScheme } from 'react-native';

interface ContentCardProps {
  image: string;
  title: string;
  username: string;
  avatar: string;
  likes: number;
  comments: number;
  verified?: boolean;
  isLive?: boolean;
  viewers?: number;
  onPress?: () => void;
}

const { width } = Dimensions.get('window');
const cardWidth = width - Spacing.md * 2;

export default function ContentCard({
  image,
  title,
  username,
  avatar,
  likes,
  comments,
  verified = false,
  isLive = false,
  viewers,
  onPress,
}: ContentCardProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  return (
    <TouchableOpacity
      style={[
        styles.container,
        Shadow.md,
        { backgroundColor: colors.card, borderColor: colors.border }
      ]}
      onPress={onPress}
      activeOpacity={0.9}
    >
      {/* Profile info moved to top */}
      <View style={styles.topUserInfoContainer}>
        <Image source={{ uri: avatar }} style={styles.topAvatar} />
        <View style={styles.topUserTextContainer}>
          <Text style={[styles.topUsername, { color: colors.text }]}>{username}</Text>
          {verified && (
            <View style={styles.verifiedBadge}>
              <Text style={styles.verifiedText}>✓</Text>
            </View>
          )}
        </View>
        
        {isLive ? (
          <TouchableOpacity style={styles.supportButton}>
            <DollarSign size={14} color="#FFF" />
            <Text style={styles.supportText}>Support</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.followButton}>
            <Text style={styles.followText}>Follow</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.imageContainer}>
        <Image source={{ uri: image }} style={styles.image} />
        
        {isLive && (
          <View style={styles.liveIndicator}>
            <View style={styles.liveDot} />
            <Text style={styles.liveText}>LIVE</Text>
            {viewers && (
              <Text style={styles.viewersText}>{viewers} watching</Text>
            )}
          </View>
        )}
      </View>
      
      <View style={styles.contentContainer}>
        {/* Actions moved above text */}
        <View style={styles.actionsContainer}>
          <View style={styles.actionGroup}>
            <TouchableOpacity style={styles.actionButton}>
              <Heart size={22} color={colors.text} />
              <Text style={[styles.actionText, { color: colors.text }]}>{likes}</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.actionButton}>
              <MessageCircle size={22} color={colors.text} />
              <Text style={[styles.actionText, { color: colors.text }]}>{comments}</Text>
            </TouchableOpacity>
          </View>
          
          <TouchableOpacity style={styles.shareButton}>
            <Share2 size={20} color={colors.text} />
          </TouchableOpacity>
        </View>

        {/* Title with much smaller font */}
        <Text 
          style={[styles.title, { color: colors.text }]}
          numberOfLines={2}
        >
          {title}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: cardWidth,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.lg,
    borderWidth: 1,
    overflow: 'hidden',
  },
  // New top profile section styles
  topUserInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.sm,
    backgroundColor: 'transparent',
  },
  topAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  topUserTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: Spacing.sm,
    flex: 1,
  },
  topUsername: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.sm,
    marginRight: Spacing.xs,
  },
  imageContainer: {
    width: '100%',
    height: 240,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  verifiedBadge: {
    backgroundColor: '#3B82F6',
    width: 16,
    height: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  verifiedText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  followButton: {
    backgroundColor: '#00B4D8',
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
  },
  followText: {
    color: '#FFF',
    fontFamily: FontFamily.medium,
    fontSize: FontSize.xs,
  },
  supportButton: {
    backgroundColor: '#F97316',
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
    flexDirection: 'row',
    alignItems: 'center',
  },
  supportText: {
    color: '#FFF',
    fontFamily: FontFamily.medium,
    fontSize: FontSize.xs,
    marginLeft: 2,
  },
  contentContainer: {
    padding: Spacing.md,
  },
  title: {
    fontFamily: FontFamily.regular,
    fontSize: 12, // Much smaller font size
    marginTop: Spacing.sm,
    lineHeight: 16,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  actionGroup: {
    flexDirection: 'row',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  actionText: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.sm,
    marginLeft: Spacing.xs,
  },
  shareButton: {
    padding: Spacing.xs,
  },
  liveIndicator: {
    position: 'absolute',
    top: Spacing.sm,
    left: Spacing.sm,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: BorderRadius.full,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EF4444',
    marginRight: 4,
  },
  liveText: {
    color: '#FFF',
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.xs,
  },
  viewersText: {
    color: '#FFF',
    fontFamily: FontFamily.regular,
    fontSize: FontSize.xs,
    marginLeft: Spacing.xs,
  },
});