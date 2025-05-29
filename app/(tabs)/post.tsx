import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Platform } from 'react-native';
import { useColorScheme } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Camera, X, Image as ImageIcon, Video, Gif, Smile, MapPin, Film } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Colors from '@/constants/Colors';
import { FontFamily, FontSize, Spacing, BorderRadius, Shadow } from '@/constants/Theme';
import HeaderBar from '@/components/HeaderBar';

export default function PostScreen() {
  const [postType, setPostType] = useState<'content' | 'stream'>('content');
  const [postText, setPostText] = useState('');
  
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const insets = useSafeAreaInsets();
  
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <HeaderBar title="Create" />
      
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: 60 + insets.top, paddingBottom: 100 }
        ]}
      >
        {/* Tab Selector */}
        <View style={[
          styles.tabSelector,
          { backgroundColor: colors.subtle, borderColor: colors.border }
        ]}>
          <TouchableOpacity
            style={[
              styles.tabButton,
              postType === 'content' && { 
                backgroundColor: colors.card,
                ...Shadow.sm
              }
            ]}
            onPress={() => setPostType('content')}
          >
            <Text style={[
              styles.tabButtonText,
              { color: postType === 'content' ? colors.tint : colors.tabIconDefault }
            ]}>
              Content
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.tabButton,
              postType === 'stream' && { 
                backgroundColor: colors.card,
                ...Shadow.sm
              }
            ]}
            onPress={() => setPostType('stream')}
          >
            <Text style={[
              styles.tabButtonText,
              { color: postType === 'stream' ? colors.tint : colors.tabIconDefault }
            ]}>
              Go Live
            </Text>
          </TouchableOpacity>
        </View>
        
        {postType === 'content' ? (
          <>
            {/* Content Creation */}
            <View style={[
              styles.contentCard,
              { backgroundColor: colors.card, borderColor: colors.border }
            ]}>
              <TextInput
                style={[styles.contentInput, { color: colors.text }]}
                placeholder="What's on your mind?"
                placeholderTextColor={colors.tabIconDefault}
                multiline
                value={postText}
                onChangeText={setPostText}
              />
              
              <View style={styles.mediaPreviewContainer}>
                <View style={[
                  styles.mediaPlaceholder, 
                  { backgroundColor: colors.subtle }
                ]}>
                  <ImageIcon size={32} color={colors.tabIconDefault} />
                  <Text style={[styles.mediaPlaceholderText, { color: colors.tabIconDefault }]}>
                    Add Photos or Videos
                  </Text>
                </View>
              </View>
              
              <View style={[styles.divider, { backgroundColor: colors.border }]} />
              
              <View style={styles.mediaOptionsContainer}>
                <TouchableOpacity style={styles.mediaOption}>
                  <Camera size={22} color={colors.tint} />
                  <Text style={[styles.mediaOptionText, { color: colors.text }]}>
                    Camera
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.mediaOption}>
                  <ImageIcon size={22} color={colors.accent} />
                  <Text style={[styles.mediaOptionText, { color: colors.text }]}>
                    Photo
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.mediaOption}>
                  <Video size={22} color={colors.secondary} />
                  <Text style={[styles.mediaOptionText, { color: colors.text }]}>
                    Video
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.mediaOption}>
                  <Gif size={22} color={colors.tertiary} />
                  <Text style={[styles.mediaOptionText, { color: colors.text }]}>
                    GIF
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            
            <View style={[
              styles.optionsCard,
              { backgroundColor: colors.card, borderColor: colors.border }
            ]}>
              <TouchableOpacity style={styles.optionButton}>
                <Smile size={22} color={colors.text} />
                <Text style={[styles.optionText, { color: colors.text }]}>
                  Feeling/Activity
                </Text>
              </TouchableOpacity>
              
              <View style={[styles.divider, { backgroundColor: colors.border }]} />
              
              <TouchableOpacity style={styles.optionButton}>
                <MapPin size={22} color={colors.text} />
                <Text style={[styles.optionText, { color: colors.text }]}>
                  Location
                </Text>
              </TouchableOpacity>
            </View>
            
            <TouchableOpacity style={[
              styles.postButton,
              { backgroundColor: postText.trim() ? colors.tint : colors.subtle }
            ]}
            disabled={!postText.trim()}
            >
              <Text style={[
                styles.postButtonText,
                { color: postText.trim() ? '#FFF' : colors.tabIconDefault }
              ]}>
                Post Now
              </Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            {/* Stream Setup */}
            <View style={[
              styles.streamCard,
              { backgroundColor: colors.card, borderColor: colors.border }
            ]}>
              <Text style={[styles.streamCardTitle, { color: colors.text }]}>
                Stream Setup
              </Text>
              
              <View style={[
                styles.cameraPreview,
                { backgroundColor: colors.subtle }
              ]}>
                <Film size={50} color={colors.tabIconDefault} />
                <Text style={[styles.cameraPreviewText, { color: colors.tabIconDefault }]}>
                  Camera Preview
                </Text>
                <TouchableOpacity style={[
                  styles.cameraButton,
                  { backgroundColor: colors.tint }
                ]}>
                  <Camera size={24} color="#FFF" />
                  <Text style={styles.cameraButtonText}>Enable Camera</Text>
                </TouchableOpacity>
              </View>
              
              <View style={styles.formGroup}>
                <Text style={[styles.label, { color: colors.text }]}>Stream Title</Text>
                <TextInput
                  style={[
                    styles.input,
                    { 
                      backgroundColor: colors.subtle,
                      borderColor: colors.border,
                      color: colors.text
                    }
                  ]}
                  placeholder="Add a title to your stream"
                  placeholderTextColor={colors.tabIconDefault}
                />
              </View>
              
              <View style={styles.formGroup}>
                <Text style={[styles.label, { color: colors.text }]}>Description</Text>
                <TextInput
                  style={[
                    styles.textArea,
                    { 
                      backgroundColor: colors.subtle,
                      borderColor: colors.border,
                      color: colors.text
                    }
                  ]}
                  placeholder="Tell viewers what your stream is about"
                  placeholderTextColor={colors.tabIconDefault}
                  multiline
                  numberOfLines={4}
                />
              </View>
              
              <View style={styles.formGroup}>
                <Text style={[styles.label, { color: colors.text }]}>Category</Text>
                <View style={[
                  styles.select,
                  { 
                    backgroundColor: colors.subtle,
                    borderColor: colors.border
                  }
                ]}>
                  <Text style={{ color: colors.tabIconDefault }}>
                    Select a category
                  </Text>
                </View>
              </View>
            </View>
            
            <TouchableOpacity 
              style={styles.goLiveButtonContainer}
              activeOpacity={0.9}
            >
              <LinearGradient
                colors={colors.gradient.primary}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.goLiveButton}
              >
                <Text style={styles.goLiveButtonText}>
                  Start Streaming
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.md,
  },
  tabSelector: {
    flexDirection: 'row',
    borderRadius: BorderRadius.full,
    padding: Spacing.xs,
    marginBottom: Spacing.lg,
    borderWidth: 1,
  },
  tabButton: {
    flex: 1,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    alignItems: 'center',
  },
  tabButtonText: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.md,
  },
  contentCard: {
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  contentInput: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.lg,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  mediaPreviewContainer: {
    marginVertical: Spacing.md,
  },
  mediaPlaceholder: {
    height: 200,
    borderRadius: BorderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mediaPlaceholderText: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.md,
    marginTop: Spacing.sm,
  },
  divider: {
    height: 1,
    width: '100%',
    marginVertical: Spacing.md,
  },
  mediaOptionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  mediaOption: {
    alignItems: 'center',
  },
  mediaOptionText: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.xs,
    marginTop: 4,
  },
  optionsCard: {
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    marginBottom: Spacing.xl,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
  },
  optionText: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.md,
    marginLeft: Spacing.md,
  },
  postButton: {
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  postButtonText: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.lg,
  },
  streamCard: {
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    padding: Spacing.md,
    marginBottom: Spacing.xl,
  },
  streamCardTitle: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.xl,
    marginBottom: Spacing.md,
  },
  cameraPreview: {
    height: 200,
    borderRadius: BorderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  cameraPreviewText: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.md,
    marginTop: Spacing.sm,
    marginBottom: Spacing.md,
  },
  cameraButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
  },
  cameraButtonText: {
    color: '#FFF',
    fontFamily: FontFamily.medium,
    fontSize: FontSize.md,
    marginLeft: Spacing.xs,
  },
  formGroup: {
    marginBottom: Spacing.md,
  },
  label: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.md,
    marginBottom: Spacing.xs,
  },
  input: {
    height: 50,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    borderWidth: 1,
    fontFamily: FontFamily.regular,
    fontSize: FontSize.md,
  },
  textArea: {
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderWidth: 1,
    fontFamily: FontFamily.regular,
    fontSize: FontSize.md,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  select: {
    height: 50,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    borderWidth: 1,
    justifyContent: 'center',
  },
  goLiveButtonContainer: {
    overflow: 'hidden',
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.xl,
  },
  goLiveButton: {
    paddingVertical: Spacing.md,
    alignItems: 'center',
  },
  goLiveButtonText: {
    color: '#FFF',
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.lg,
  },
});