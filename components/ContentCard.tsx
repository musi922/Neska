import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions, Alert, TextInput, Modal, ScrollView, KeyboardAvoidingView, Platform, Pressable } from 'react-native';
import { Heart, MessageCircle, Share2, DollarSign, Send, X } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Colors from '@/constants/Colors';
import { FontFamily, FontSize, Spacing, BorderRadius, Shadow } from '@/constants/Theme';
import { useColorScheme } from 'react-native';

interface Comment {
  id: string;
  text: string;
  username: string;
  avatar: string;
  timestamp: string;
}

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

  // State for interactive elements
  const [isLiked, setIsLiked] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [likeCount, setLikeCount] = useState(likes);
  const [isSupporting, setIsSupporting] = useState(false);
  
  // Comment system state
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [commentsList, setCommentsList] = useState<Comment[]>([
    {
      id: '1',
      text: 'Amazing content! Keep it up! 🔥',
      username: 'sarah_k',
      avatar: 'https://images.pexels.com/photos/1858175/pexels-photo-1858175.jpeg',
      timestamp: '2m ago'
    },
    {
      id: '2',
      text: 'This is so inspiring! Thanks for sharing ❤️',
      username: 'mike_artist',
      avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg',
      timestamp: '5m ago'
    }
  ]);
  const [commentsCount, setCommentsCount] = useState(comments);

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikeCount(prev => isLiked ? prev - 1 : prev + 1);
  };

  const handleFollow = () => {
    setIsFollowing(!isFollowing);
  };

  const handleSupport = () => {
    setIsSupporting(!isSupporting);
    if (!isSupporting) {
      Alert.alert(
        "Support Creator",
        `You are now supporting ${username}! 💖`,
        [{ text: "Awesome!", style: "default" }]
      );
    }
  };

  const handleComments = () => {
    setShowComments(true);
  };

  const handleSendComment = () => {
    if (commentText.trim()) {
      const newComment: Comment = {
        id: Date.now().toString(),
        text: commentText.trim(),
        username: 'you',
        avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg',
        timestamp: 'now'
      };
      setCommentsList(prev => [newComment, ...prev]);
      setCommentsCount(prev => prev + 1);
      setCommentText('');
    }
  };

  const closeComments = () => {
    setShowComments(false);
  };

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
          <TouchableOpacity 
            style={[
              styles.supportButton,
              isSupporting && styles.supportingButton
            ]}
            onPress={handleSupport}
          >
            <DollarSign size={14} color="#FFF" />
            <Text style={styles.supportText}>
              {isSupporting ? 'Supporting' : 'Support'}
            </Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity 
            style={[
              styles.followButton,
              isFollowing && styles.followingButton
            ]}
            onPress={handleFollow}
          >
            <Text style={[
              styles.followText,
              isFollowing && styles.followingText
            ]}>
              {isFollowing ? 'Following' : 'Follow'}
            </Text>
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
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={handleLike}
              activeOpacity={0.7}
            >
              <Heart 
                size={22} 
                color={isLiked ? '#EF4444' : colors.text}
                fill={isLiked ? '#EF4444' : 'none'}
              />
              <Text style={[
                styles.actionText, 
                { color: isLiked ? '#EF4444' : colors.text }
              ]}>
                {likeCount}
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={handleComments}
              activeOpacity={0.7}
            >
              <MessageCircle size={22} color={colors.text} />
              <Text style={[styles.actionText, { color: colors.text }]}>{commentsCount}</Text>
            </TouchableOpacity>
          </View>
          
          <TouchableOpacity 
            style={styles.shareButton}
            activeOpacity={0.7}
          >
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

      {/* Comments Modal */}
      <Modal
        visible={showComments}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={[styles.modalContainer, { backgroundColor: colors.background }]}
        >
          {/* Modal Header */}
          <View style={[styles.modalHeader, { borderBottomColor: colors.border }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>Comments</Text>
            <TouchableOpacity onPress={closeComments} style={styles.closeButton}>
              <X size={24} color={colors.text} />
            </TouchableOpacity>
          </View>

          {/* Comments List */}
          <ScrollView 
            style={styles.commentsList}
            showsVerticalScrollIndicator={false}
          >
            {commentsList.map((comment) => (
              <View key={comment.id} style={styles.commentItem}>
                <Image source={{ uri: comment.avatar }} style={styles.commentAvatar} />
                <View style={styles.commentContent}>
                  <View style={styles.commentBubble}>
                    <Text style={[styles.commentUsername, { color: colors.text }]}>
                      {comment.username}
                    </Text>
                    <Text style={[styles.commentText, { color: colors.text }]}>
                      {comment.text}
                    </Text>
                  </View>
                  <Text style={[styles.commentTimestamp, { color: colors.secondary }]}>
                    {comment.timestamp}
                  </Text>
                </View>
              </View>
            ))}
          </ScrollView>

          {/* Comment Input */}
          <View style={[styles.commentInputContainer, { 
            borderTopColor: colors.border,
            backgroundColor: colors.background 
          }]}>
            <Image 
              source={{ uri: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg' }} 
              style={styles.inputAvatar} 
            />
            <TextInput
              style={[styles.commentInput, { 
                backgroundColor: colors.card,
                color: colors.text,
                borderColor: colors.border
              }]}
              placeholder="Add a comment..."
              placeholderTextColor={colors.secondary}
              value={commentText}
              onChangeText={setCommentText}
              multiline
              maxLength={500}
            />
            <TouchableOpacity
              onPress={handleSendComment}
              style={[
                styles.sendButton,
                { backgroundColor: commentText.trim() ? '#00B4D8' : colors.border }
              ]}
              disabled={!commentText.trim()}
            >
              <Send size={18} color={commentText.trim() ? '#FFF' : colors.secondary} />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>
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
    minWidth: 70,
    alignItems: 'center',
  },
  followingButton: {
    backgroundColor: '#10B981',
    borderWidth: 1,
    borderColor: '#10B981',
  },
  followText: {
    color: '#FFF',
    fontFamily: FontFamily.medium,
    fontSize: FontSize.xs,
  },
  followingText: {
    color: '#FFF',
  },
  supportButton: {
    backgroundColor: '#F97316',
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
    flexDirection: 'row',
    alignItems: 'center',
    minWidth: 80,
    justifyContent: 'center',
  },
  supportingButton: {
    backgroundColor: '#10B981',
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
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.xs,
    borderRadius: BorderRadius.sm,
  },
  actionText: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.sm,
    marginLeft: Spacing.xs,
  },
  shareButton: {
    padding: Spacing.xs,
    borderRadius: BorderRadius.sm,
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
  // Modal styles
  modalContainer: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.md,
    borderBottomWidth: 1,
    paddingTop: 60,
  },
  modalTitle: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.lg,
  },
  closeButton: {
    padding: Spacing.xs,
  },
  commentsList: {
    flex: 1,
    padding: Spacing.md,
  },
  commentItem: {
    flexDirection: 'row',
    marginBottom: Spacing.lg,
    alignItems: 'flex-start',
  },
  commentAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: Spacing.sm,
  },
  commentContent: {
    flex: 1,
  },
  commentBubble: {
    backgroundColor: 'rgba(0, 180, 216, 0.1)',
    borderRadius: BorderRadius.lg,
    padding: Spacing.sm,
    marginBottom: 4,
  },
  commentUsername: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.sm,
    marginBottom: 2,
  },
  commentText: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.sm,
    lineHeight: 18,
  },
  commentTimestamp: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.xs,
    marginLeft: Spacing.sm,
  },
  commentInputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: Spacing.md,
    borderTopWidth: 1,
    paddingBottom: 40,
  },
  inputAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: Spacing.sm,
  },
  commentInput: {
    flex: 1,
    borderWidth: 1,
    borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    marginRight: Spacing.sm,
    maxHeight: 100,
    fontSize: FontSize.sm,
  },
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
});