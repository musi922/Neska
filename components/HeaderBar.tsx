import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColorScheme } from 'react-native';
import { Bell, MessageCircle, Heart, User } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import { FontFamily, FontSize, Spacing } from '@/constants/Theme';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import ChatOverlay from './ChatOverlay';
import NotificationOverlay from './NotificationOverlay';
import ProfileOverlay from './ProfileOverlay';

interface HeaderBarProps {
  title?: string;
  showActions?: boolean;
  transparent?: boolean;
}

export default function HeaderBar({
  title = 'GEN Z',
  showActions = true,
  transparent = false,
}: HeaderBarProps) {
  const [showChat, setShowChat] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const insets = useSafeAreaInsets();

  const headerHeight = 60 + insets.top;

  const handleChatPress = () => {
    setShowChat(true);
  };

  const handleCloseChat = () => {
    setShowChat(false);
  };

  const handleNotificationPress = () => {
    setShowNotifications(true);
  };

  const handleCloseNotifications = () => {
    setShowNotifications(false);
  };

  const handleProfilePress = () => {
    setShowProfile(true);
  };

  const handleCloseProfile = () => {
    setShowProfile(false);
  };

  return (
    <>
      <View
        style={[
          styles.container,
          {
            height: headerHeight,
            paddingTop: insets.top,
            backgroundColor: transparent ? 'transparent' : colors.background,
            borderBottomColor: transparent ? 'transparent' : colors.border,
            borderBottomWidth: transparent ? 0 : StyleSheet.hairlineWidth,
          },
        ]}
      >
        {transparent && Platform.OS === 'ios' && (
          <BlurView
            tint={colorScheme === 'dark' ? 'dark' : 'light'}
            intensity={80}
            style={StyleSheet.absoluteFill}
          />
        )}

        <View style={styles.content}>
          <View style={styles.logoContainer}>
            <Text style={styles.title}>{title}</Text>
          </View>

          {showActions && (
            <View style={styles.actions}>
              
              {/* Updated Notification Button with badge */}
              <TouchableOpacity 
                style={styles.actionButton}
                onPress={handleNotificationPress}
              >
                <View style={styles.notificationIconContainer}>
                  <Heart size={24} color={colors.text} />
                  <View style={styles.notificationBadge}>
                    <Text style={styles.notificationText}>3</Text>
                  </View>
                </View>
              </TouchableOpacity>
              
              {/* Chat Button with notification badge */}
              <TouchableOpacity 
                style={styles.actionButton} 
                onPress={handleChatPress}
              >
                <View style={styles.chatIconContainer}>
                  <MessageCircle size={24} color={colors.text} />
                  <View style={styles.notificationBadge}>
                    <Text style={styles.notificationText}>4</Text>
                  </View>
                </View>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.profileButton} onPress={handleProfilePress}>
                <User size={20} color="#FFF" />
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>

      {/* Chat Overlay */}
      <ChatOverlay isVisible={showChat} onClose={handleCloseChat} />
      
      {/* Notification Overlay */}
      <NotificationOverlay isVisible={showNotifications} onClose={handleCloseNotifications} />

      {/* Profile Overlay */}
      <ProfileOverlay isVisible={showProfile} onClose={handleCloseProfile} />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    height: 60,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoGradient: {
    width: 34,
    height: 34,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    fontFamily: FontFamily.title,
    fontSize: FontSize.xl,
    fontWeight: '700',
  },
  title: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.lg,
    fontWeight: '700',
    marginLeft: Spacing.sm,
    color: '#00B4D8',
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    marginLeft: Spacing.md,
    position: 'relative',
  },
  chatIconContainer: {
    position: 'relative',
  },
  notificationIconContainer: {
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: -6,
    right: -6,
    backgroundColor: '#00B4D8',
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: '600',
    textAlign: 'center',
  },
  profileButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: Spacing.md,
  }
});