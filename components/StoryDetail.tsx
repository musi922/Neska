import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Heart, MessageCircle, Share2 } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import { FontFamily, FontSize, Spacing } from '@/constants/Theme';
import { useColorScheme } from 'react-native';

interface StoryDetailProps {
  username: string;
  songTitle?: string;
  mediaUrl: string;
  mediaType: 'image' | 'video';
  likes: number;
  comments: number;
  shares: number;
}

const StoryDetail: React.FC<StoryDetailProps> = ({
  username,
  songTitle,
  mediaUrl,
  mediaType,
  likes,
  comments,
  shares,
}) => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.userInfoBlock}>
        <Text style={[styles.username, { color: colors.text }]}>
          {username}
        </Text>
        {songTitle && (
          <Text style={[styles.songTitle, { color: colors.text }]}>
            ♪ {songTitle}
          </Text>
        )}
      </View>

      <View style={styles.mediaBlock}>
        <Image
          source={{ uri: mediaUrl }}
          style={styles.media}
          resizeMode="cover"
        />
      </View>

      <View style={styles.interactionBlock}>
        <TouchableOpacity style={styles.actionButton}>
          <Heart size={24} color={colors.text} />
          <Text style={[styles.actionText, { color: colors.text }]}>
            {likes}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton}>
          <MessageCircle size={24} color={colors.text} />
          <Text style={[styles.actionText, { color: colors.text }]}>
            {comments}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton}>
          <Share2 size={24} color={colors.text} />
          <Text style={[styles.actionText, { color: colors.text }]}>
            {shares}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  userInfoBlock: {
    padding: Spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#eee',
  },
  username: {
    fontSize: FontSize.lg,
    fontFamily: FontFamily.semiBold,
  },
  songTitle: {
    fontSize: FontSize.sm,
    marginTop: Spacing.sm,
    fontFamily: FontFamily.regular,
  },
  mediaBlock: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  media: {
    width: '100%',
    height: '100%',
  },
  interactionBlock: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: Spacing.md,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#eee',
  },
  actionButton: {
    alignItems: 'center',
  },
  actionText: {
    marginTop: Spacing.xs,
    fontSize: FontSize.sm,
    fontFamily: FontFamily.regular,
  },
});

export default StoryDetail;
