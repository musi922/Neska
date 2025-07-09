import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
  Alert,
  TextInput,
  Modal,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Clipboard,
  ToastAndroid,
} from 'react-native';
import {
  Heart,
  MessageCircle,
  Share2,
  DollarSign,
  Send,
  X,
  Instagram,
  Facebook,
  Twitter,
  Users as UsersIcon,
  Copy,
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Colors from '@/constants/Colors';
import {
  FontFamily,
  FontSize,
  Spacing,
  BorderRadius,
  Shadow,
} from '@/constants/Theme';
import { useColorScheme } from 'react-native';
import { BlurView } from 'expo-blur';
import Svg, { Path } from 'react-native-svg';

interface Reply {
  id: string;
  text: string;
  username: string;
  avatar: string;
  timestamp: string;
  likes: number;
  isLiked: boolean;
}

interface Comment {
  id: string;
  text: string;
  username: string;
  avatar: string;
  timestamp: string;
  likes: number;
  isLiked: boolean;
  replies: Reply[];
  showReplies: boolean;
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
  isFollowing?: boolean;
}

const { width, height } = Dimensions.get('window');
const cardWidth = width - Spacing.md * 2;

const mockFollowers = [
  {
    id: '1',
    name: 'Sarah K.',
    avatar:
      'https://images.pexels.com/photos/1858175/pexels-photo-1858175.jpeg',
  },
  {
    id: '2',
    name: 'Mike Artist',
    avatar:
      'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg',
  },
  {
    id: '3',
    name: 'Alex Photo',
    avatar:
      'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg',
  },
  {
    id: '4',
    name: 'Lina D.',
    avatar:
      'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg',
  },
  {
    id: '5',
    name: 'Rita M.',
    avatar:
      'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg',
  },
  {
    id: '6',
    name: 'John Doe',
    avatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg',
  },
  {
    id: '7',
    name: 'Emily S.',
    avatar: 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg',
  },
  {
    id: '8',
    name: 'Chris B.',
    avatar: 'https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg',
  },
];

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
  isFollowing: isFollowingProp = false,
}: ContentCardProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  // State for interactive elements
  const [isLiked, setIsLiked] = useState(false);
  const [isFollowing, setIsFollowing] = useState(isFollowingProp);
  const [likeCount, setLikeCount] = useState(likes);
  const [isSupporting, setIsSupporting] = useState(false);

  // Comment system state
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [commentsList, setCommentsList] = useState<Comment[]>([
    {
      id: '1',
      text: 'Amazing content! Keep it up! 🔥',
      username: 'sarah_k',
      avatar:
        'https://images.pexels.com/photos/1858175/pexels-photo-1858175.jpeg',
      timestamp: '2m ago',
      likes: 12,
      isLiked: false,
      replies: [
        {
          id: '1-1',
          text: 'Thanks! More coming soon 😊',
          username: username,
          avatar: avatar,
          timestamp: '1m ago',
          likes: 3,
          isLiked: false,
        },
        {
          id: '1-2',
          text: 'Love your work too!',
          username: 'alex_photo',
          avatar:
            'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg',
          timestamp: '30s ago',
          likes: 1,
          isLiked: true,
        },
      ],
      showReplies: false,
    },
    {
      id: '2',
      text: 'This is so inspiring! Thanks for sharing ❤️',
      username: 'mike_artist',
      avatar:
        'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg',
      timestamp: '5m ago',
      likes: 8,
      isLiked: true,
      replies: [
        {
          id: '2-1',
          text: 'Glad you liked it! 🙏',
          username: username,
          avatar: avatar,
          timestamp: '4m ago',
          likes: 5,
          isLiked: false,
        },
      ],
      showReplies: false,
    },
  ]);
  const [commentsCount, setCommentsCount] = useState(comments);

  // Add share overlay state
  const [showShare, setShowShare] = useState(false);

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikeCount((prev) => (isLiked ? prev - 1 : prev + 1));
  };

  const handleFollow = () => {
    setIsFollowing(!isFollowing);
  };

  const handleSupport = () => {
    setIsSupporting(!isSupporting);
    if (!isSupporting) {
      Alert.alert('Support Creator', `You are now supporting ${username}! 💖`, [
        { text: 'Awesome!', style: 'default' },
      ]);
    }
  };

  const handleComments = () => {
    setShowComments(true);
  };

  const handleSendComment = () => {
    if (commentText.trim()) {
      if (replyingTo) {
        // Add as reply to existing comment
        const replyText = commentText.replace(/@\w+\s/, '').trim();
        const newReply: Reply = {
          id: Date.now().toString(),
          text: replyText,
          username: 'you',
          avatar:
            'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg',
          timestamp: 'now',
          likes: 0,
          isLiked: false,
        };

        setCommentsList((prev) =>
          prev.map((comment) => {
            if (comment.id === replyingTo) {
              return {
                ...comment,
                replies: [newReply, ...comment.replies],
                showReplies: true,
              };
            }
            return comment;
          })
        );
        setReplyingTo(null);
      } else {
        // Add as new comment
        const newComment: Comment = {
          id: Date.now().toString(),
          text: commentText.trim(),
          username: 'you',
          avatar:
            'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg',
          timestamp: 'now',
          likes: 0,
          isLiked: false,
          replies: [],
          showReplies: false,
        };
        setCommentsList((prev) => [newComment, ...prev]);
        setCommentsCount((prev) => prev + 1);
      }
      setCommentText('');
    }
  };

  const handleCommentLike = (commentId: string) => {
    setCommentsList((prev) =>
      prev.map((comment) => {
        if (comment.id === commentId) {
          return {
            ...comment,
            isLiked: !comment.isLiked,
            likes: comment.isLiked ? comment.likes - 1 : comment.likes + 1,
          };
        }
        return comment;
      })
    );
  };

  const handleReplyLike = (commentId: string, replyId: string) => {
    setCommentsList((prev) =>
      prev.map((comment) => {
        if (comment.id === commentId) {
          return {
            ...comment,
            replies: comment.replies.map((reply) => {
              if (reply.id === replyId) {
                return {
                  ...reply,
                  isLiked: !reply.isLiked,
                  likes: reply.isLiked ? reply.likes - 1 : reply.likes + 1,
                };
              }
              return reply;
            }),
          };
        }
        return comment;
      })
    );
  };

  const handleCommentReply = (commentId: string, username: string) => {
    setReplyingTo(commentId);
    setCommentText(`@${username} `);
  };

  const toggleReplies = (commentId: string) => {
    setCommentsList((prev) =>
      prev.map((comment) => {
        if (comment.id === commentId) {
          return {
            ...comment,
            showReplies: !comment.showReplies,
          };
        }
        return comment;
      })
    );
  };

  const cancelReply = () => {
    setReplyingTo(null);
    setCommentText('');
  };

  const closeComments = () => {
    setShowComments(false);
  };

  const handleCardPress = () => {
    // Only call onPress if it's not a comment button press
    if (onPress) {
      onPress();
    }
  };

  // Handler for share button
  const handleShare = () => {
    setShowShare(true);
  };
  const closeShare = () => {
    setShowShare(false);
  };

  // Handler for copy link
  const handleCopyLink = () => {
    Clipboard.setString('https://neska.app/content/' + username);
    ToastAndroid.show('Link copied!', ToastAndroid.SHORT);
  };

  return (
    <>
      <TouchableOpacity
        style={[
          styles.container,
          Shadow.md,
          { backgroundColor: colors.card, borderColor: colors.border },
        ]}
        onPress={handleCardPress}
        activeOpacity={0.9}
      >
        {/* Profile info moved to top */}
        <View style={styles.topUserInfoContainer}>
          <Image source={{ uri: avatar }} style={styles.topAvatar} />
          <View style={styles.topUserTextContainer}>
            <Text style={[styles.topUsername, { color: colors.text }]}>
              {username}
            </Text>
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
                isSupporting && styles.supportingButton,
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
                isFollowing && styles.followingButton,
              ]}
              onPress={handleFollow}
            >
              <Text
                style={[styles.followText, isFollowing && styles.followingText]}
              >
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
                <Text
                  style={[
                    styles.actionText,
                    { color: isLiked ? '#EF4444' : colors.text },
                  ]}
                >
                  {likeCount}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.actionButton}
                onPress={handleComments}
                activeOpacity={0.7}
              >
                <MessageCircle size={22} color={colors.text} />
                <Text style={[styles.actionText, { color: colors.text }]}>
                  {commentsCount}
                </Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.shareButton}
              activeOpacity={0.7}
              onPress={handleShare}
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
      </TouchableOpacity>

      {/* Comments Modal - Instagram Style Overlay */}
      <Modal
        visible={showComments}
        animationType="slide"
        transparent={true}
        onRequestClose={closeComments}
      >
        <View style={styles.modalOverlay}>
          <Pressable style={styles.modalBackdrop} onPress={closeComments} />

          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={[
              styles.modalContainer,
              { backgroundColor: colors.background },
            ]}
          >
            {/* Modal Header */}
            <View
              style={[styles.modalHeader, { borderBottomColor: colors.border }]}
            >
              <View style={styles.modalHandle} />
              <Text
                style={[
                  styles.modalTitle,
                  { color: '#00B4D8', textAlign: 'left', flex: 1 },
                ]}
              >
                Comments
              </Text>
              <TouchableOpacity
                onPress={closeComments}
                style={styles.closeButton}
              >
                <X size={20} color={colors.text} />
              </TouchableOpacity>
            </View>

            {/* Comments List */}
            <ScrollView
              style={styles.commentsList}
              showsVerticalScrollIndicator={false}
            >
              {commentsList.map((comment) => (
                <View key={comment.id}>
                  {/* Main Comment */}
                  <View style={styles.commentItem}>
                    <Image
                      source={{ uri: comment.avatar }}
                      style={styles.commentAvatar}
                    />
                    <View style={styles.commentContent}>
                      <View style={styles.commentTextContainer}>
                        <Text
                          style={[
                            styles.commentUsername,
                            { color: colors.text },
                          ]}
                        >
                          {comment.username}
                        </Text>
                        <Text
                          style={[styles.commentText, { color: colors.text }]}
                        >
                          {comment.text}
                        </Text>
                      </View>
                      <View style={styles.commentActions}>
                        <Text
                          style={[
                            styles.commentTimestamp,
                            { color: colors.secondary },
                          ]}
                        >
                          {comment.timestamp}
                        </Text>
                        {comment.likes > 0 && (
                          <Text
                            style={[
                              styles.commentLikesCount,
                              { color: colors.secondary },
                            ]}
                          >
                            {comment.likes}{' '}
                            {comment.likes === 1 ? 'like' : 'likes'}
                          </Text>
                        )}
                        <TouchableOpacity
                          onPress={() =>
                            handleCommentReply(comment.id, comment.username)
                          }
                          style={styles.replyButton}
                        >
                          <Text
                            style={[
                              styles.replyText,
                              { color: colors.secondary },
                            ]}
                          >
                            Reply
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                    <TouchableOpacity
                      onPress={() => handleCommentLike(comment.id)}
                      style={styles.commentLikeButton}
                    >
                      <Heart
                        size={12}
                        color={comment.isLiked ? '#EF4444' : colors.secondary}
                        fill={comment.isLiked ? '#EF4444' : 'none'}
                      />
                    </TouchableOpacity>
                  </View>

                  {/* View Replies Button */}
                  {comment.replies.length > 0 && (
                    <TouchableOpacity
                      onPress={() => toggleReplies(comment.id)}
                      style={styles.viewRepliesButton}
                    >
                      <View style={styles.replyLine} />
                      <Text
                        style={[
                          styles.viewRepliesText,
                          { color: colors.secondary },
                        ]}
                      >
                        {comment.showReplies
                          ? 'Hide replies'
                          : `View ${comment.replies.length} ${
                              comment.replies.length === 1 ? 'reply' : 'replies'
                            }`}
                      </Text>
                    </TouchableOpacity>
                  )}

                  {/* Replies */}
                  {comment.showReplies &&
                    comment.replies.map((reply) => (
                      <View key={reply.id} style={styles.replyItem}>
                        <Image
                          source={{ uri: reply.avatar }}
                          style={styles.replyAvatar}
                        />
                        <View style={styles.commentContent}>
                          <View style={styles.commentTextContainer}>
                            <Text
                              style={[
                                styles.commentUsername,
                                { color: colors.text },
                              ]}
                            >
                              {reply.username}
                            </Text>
                            <Text
                              style={[
                                styles.commentText,
                                { color: colors.text },
                              ]}
                            >
                              {reply.text}
                            </Text>
                          </View>
                          <View style={styles.commentActions}>
                            <Text
                              style={[
                                styles.commentTimestamp,
                                { color: colors.secondary },
                              ]}
                            >
                              {reply.timestamp}
                            </Text>
                            {reply.likes > 0 && (
                              <Text
                                style={[
                                  styles.commentLikesCount,
                                  { color: colors.secondary },
                                ]}
                              >
                                {reply.likes}{' '}
                                {reply.likes === 1 ? 'like' : 'likes'}
                              </Text>
                            )}
                            <TouchableOpacity
                              onPress={() =>
                                handleCommentReply(comment.id, reply.username)
                              }
                              style={styles.replyButton}
                            >
                              <Text
                                style={[
                                  styles.replyText,
                                  { color: colors.secondary },
                                ]}
                              >
                                Reply
                              </Text>
                            </TouchableOpacity>
                          </View>
                        </View>
                        <TouchableOpacity
                          onPress={() => handleReplyLike(comment.id, reply.id)}
                          style={styles.commentLikeButton}
                        >
                          <Heart
                            size={12}
                            color={reply.isLiked ? '#EF4444' : colors.secondary}
                            fill={reply.isLiked ? '#EF4444' : 'none'}
                          />
                        </TouchableOpacity>
                      </View>
                    ))}
                </View>
              ))}
            </ScrollView>

            {/* Comment Input - Removed replying indicator */}
            <View
              style={[
                styles.commentInputContainer,
                {
                  borderTopColor: colors.border,
                  backgroundColor: colors.background,
                },
              ]}
            >
              <View style={styles.inputRow}>
                <Image
                  source={{
                    uri: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg',
                  }}
                  style={styles.inputAvatar}
                />
                <TextInput
                  style={[
                    styles.commentInput,
                    {
                      backgroundColor: colors.card,
                      color: colors.text,
                      borderColor: colors.border,
                    },
                  ]}
                  placeholder={
                    replyingTo ? 'Write a reply...' : 'Add a comment...'
                  }
                  placeholderTextColor={colors.secondary}
                  value={commentText}
                  onChangeText={setCommentText}
                  multiline={false}
                  maxLength={200}
                />
                <TouchableOpacity
                  onPress={handleSendComment}
                  style={[
                    styles.sendButton,
                    {
                      backgroundColor: commentText.trim()
                        ? '#00B4D8'
                        : colors.border,
                    },
                  ]}
                  disabled={!commentText.trim()}
                >
                  <Send
                    size={16}
                    color={commentText.trim() ? '#FFF' : colors.secondary}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </KeyboardAvoidingView>
        </View>
      </Modal>

      {/* Share Modal */}
      <Modal
        visible={showShare}
        animationType="slide"
        transparent={true}
        onRequestClose={closeShare}
      >
        <View style={styles.shareModalOverlay}>
          <Pressable style={styles.modalBackdrop} onPress={closeShare} />
          <View
            style={[
              styles.modalContainer,
              { backgroundColor: colors.background, padding: 20 },
            ]}
          >
            {/* Handle */}
            <View style={styles.shareModalHandle} />
            {/* Header */}
            <View style={styles.shareModalHeader}>
              <Text style={[styles.shareModalTitle, { color: '#00B4D8' }]}>
                Share
              </Text>
              <TouchableOpacity onPress={closeShare} style={styles.closeButton}>
                <X size={20} color={colors.text} />
              </TouchableOpacity>
            </View>
            {/* Add to Story and Copy Link Row */}
            <View style={styles.storyAndCopyRow}>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.socialIconsScroll}
                contentContainerStyle={styles.socialIconsRow}
              >
                <View style={[styles.addToStoryColumn, { marginTop: 10 }]}>
                  <View style={styles.addToStoryAvatarWrapper}>
                    <Image
                      source={{ uri: mockFollowers[0].avatar }}
                      style={styles.addToStoryAvatar}
                    />
                  </View>
                  <Text style={styles.addToStoryTextSmall}>Add to Story</Text>
                </View>
                <TouchableOpacity style={styles.socialIconButtonNoBg}>
                  <Copy size={22} color="#fff" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.socialIconButtonNoBg}>
                  <Instagram size={22} color="#fff" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.socialIconButtonNoBg}>
                  <Facebook size={22} color="#fff" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.socialIconButtonNoBg}>
                  <Twitter size={22} color="#fff" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.socialIconButtonNoBg}>
                  {/* TikTok SVG icon */}
                  <Svg width={22} height={22} viewBox="0 0 48 48">
                    <Path
                      d="M41.5 16.5c-3.6 0-6.5-2.9-6.5-6.5V6h-6v24.5c0 2.2-1.8 4-4 4s-4-1.8-4-4 1.8-4 4-4c.7 0 1.4.2 2 .5v-6.3c-.7-.1-1.3-.2-2-.2-5.5 0-10 4.5-10 10s4.5 10 10 10 10-4.5 10-10V22.7c1.9 1.1 4.1 1.8 6.5 1.8v-8z"
                      fill="#fff"
                    />
                  </Svg>
                </TouchableOpacity>
                <TouchableOpacity style={styles.socialIconButtonNoBg}>
                  {/* Accurate Snapchat ghost SVG icon */}
                  <Svg width={22} height={22} viewBox="0 0 48 48">
                    <Path
                      d="M24 6c-6.6 0-12 5.4-12 12 0 7.5 7.2 13.7 11.2 16.7.5.4 1.1.4 1.6 0C28.8 31.7 36 25.5 36 18c0-6.6-5.4-12-12-12z"
                      fill="#fff"
                      stroke="#000"
                      strokeWidth="1.5"
                    />
                    <Path
                      d="M16 36c1.5 1.5 4.5 2 8 2s6.5-.5 8-2"
                      stroke="#000"
                      strokeWidth="1.2"
                      fill="none"
                    />
                    <Path
                      d="M20 18c.5 1 1.5 1 2 0"
                      stroke="#000"
                      strokeWidth="1"
                      fill="none"
                    />
                    <Path
                      d="M26 18c.5 1 1.5 1 2 0"
                      stroke="#000"
                      strokeWidth="1"
                      fill="none"
                    />
                  </Svg>
                </TouchableOpacity>
              </ScrollView>
            </View>
            <Text style={[styles.followerListTitle, { color: '#fff' }]}>
              Share to friends
            </Text>
            <View style={styles.friendsRowsContainer}>
              <View style={styles.friendsRow}>
                {mockFollowers.slice(0, 4).map((follower) => (
                  <View key={follower.id} style={styles.followerItem}>
                    <Image
                      source={{ uri: follower.avatar }}
                      style={styles.followerAvatar}
                    />
                    <Text
                      style={[styles.followerName, { color: '#fff' }]}
                      numberOfLines={1}
                    >
                      {follower.name}
                    </Text>
                  </View>
                ))}
              </View>
              {mockFollowers.length > 4 && (
                <View style={styles.friendsRow}>
                  {mockFollowers.slice(4).map((follower) => (
                    <View key={follower.id} style={styles.followerItem}>
                      <Image
                        source={{ uri: follower.avatar }}
                        style={styles.followerAvatar}
                      />
                      <Text
                        style={[styles.followerName, { color: '#fff' }]}
                        numberOfLines={1}
                      >
                        {follower.name}
                      </Text>
                    </View>
                  ))}
                </View>
              )}
            </View>
          </View>
        </View>
      </Modal>
    </>
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
  // Instagram-style Modal Overlay styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalBackdrop: {
    flex: 1,
  },
  modalContainer: {
    height: height * 0.6, // Only 60% of screen height
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: Platform.OS === 'ios' ? 20 : 0,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    paddingTop: 16,
    position: 'relative',
  },
  modalHandle: {
    position: 'absolute',
    top: 8,
    left: '50%',
    marginLeft: -20,
    width: 40,
    height: 4,
    backgroundColor: '#CCCCCC',
    borderRadius: 2,
  },
  modalTitle: {
    fontFamily: FontFamily.semiBold,
    fontSize: 16,
    flex: 1,
    textAlign: 'center',
  },
  closeButton: {
    padding: 4,
  },
  commentsList: {
    flex: 1,
    paddingHorizontal: 12,
    paddingTop: 8,
  },
  commentItem: {
    flexDirection: 'row',
    marginBottom: 12,
    alignItems: 'flex-start',
  },
  commentAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    marginRight: 8,
  },
  commentContent: {
    flex: 1,
  },
  commentTextContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
  },
  commentUsername: {
    fontFamily: FontFamily.semiBold,
    fontSize: 11, // Reduced from 12 to 11
    marginRight: 6,
  },
  commentText: {
    fontFamily: FontFamily.regular,
    fontSize: 11, // Reduced from 12 to 11
    lineHeight: 15, // Reduced from 16 to 15
    flex: 1,
  },
  commentActions: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  commentTimestamp: {
    fontFamily: FontFamily.regular,
    fontSize: 9,
    marginRight: 12,
  },
  commentLikesCount: {
    fontFamily: FontFamily.regular,
    fontSize: 9, // Reduced from 10 to 9
    marginRight: 12,
  },
  replyButton: {
    paddingVertical: 2,
  },
  replyText: {
    fontFamily: FontFamily.medium,
    fontSize: 9, // Reduced from 10 to 9
  },
  commentLikeButton: {
    padding: 8,
    marginLeft: 4,
  },
  viewRepliesButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 36,
    marginBottom: 8,
    paddingVertical: 4,
  },
  replyLine: {
    width: 24,
    height: 1,
    backgroundColor: '#CCCCCC',
    marginRight: 8,
  },
  viewRepliesText: {
    fontFamily: FontFamily.medium,
    fontSize: 9, // Reduced from 10 to 9
  },
  replyItem: {
    flexDirection: 'row',
    marginBottom: 12,
    alignItems: 'flex-start',
    marginLeft: 36,
  },
  replyAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 8,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  commentInputContainer: {
    padding: 12,
    borderTopWidth: 1,
  },
  inputAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    marginRight: 8,
  },
  commentInput: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 8,
    fontSize: 12,
    maxHeight: 40,
  },
  sendButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  shareModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  shareModalContainer: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 40,
    minHeight: 320,
    elevation: 10,
    overflow: 'hidden',
  },
  shareModalHandle: {
    width: 40,
    height: 4,
    backgroundColor: '#E0E0E0',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 12,
  },
  shareModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  shareModalTitle: {
    fontFamily: FontFamily.semiBold,
    fontSize: 18,
    color: '#222',
  },
  storyAndCopyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
  },
  socialIconsScroll: {
    marginBottom: 18,
  },
  socialIconsRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  socialIconButtonNoBg: {
    backgroundColor: 'transparent',
    borderRadius: 16,
    padding: 10,
    marginRight: 14,
  },
  followerListTitle: {
    fontFamily: FontFamily.medium,
    fontSize: 13,
    color: '#888',
    marginBottom: 8,
  },
  friendsRowsContainer: {
    marginTop: 8,
  },
  friendsRow: {
    flexDirection: 'row',
    marginBottom: 4,
    justifyContent: 'space-between',
  },
  followerItem: {
    alignItems: 'center',
    marginRight: 18,
    width: 60,
  },
  followerAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginBottom: 4,
    borderWidth: 2,
    borderColor: '#00B4D8',
  },
  followerName: {
    fontFamily: FontFamily.regular,
    fontSize: 11,
    color: '#222',
    textAlign: 'center',
  },
  addToStoryTextSmall: {
    color: '#fff',
    fontFamily: FontFamily.medium,
    fontSize: 10,
    marginLeft: 6,
    marginTop: 2,
  },
  addToStoryColumn: {
    alignItems: 'center',
    marginRight: 18,
  },
  addToStoryAvatarWrapper: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#00B4D8',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 2,
  },
  addToStoryAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#fff',
  },
});
