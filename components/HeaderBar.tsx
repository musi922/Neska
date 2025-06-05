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
import { Bell, MessageCircle, Heart, User, Coins } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import { FontFamily, FontSize, Spacing } from '@/constants/Theme';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import ChatOverlay from './ChatOverlay'; // Import the chat overlay

interface HeaderBarProps {
  title?: string;
  showActions?: boolean;
  transparent?: boolean;
  userCoins?: number;
}

export default function HeaderBar({
  title = 'Neska',
  showActions = true,
  transparent = false,
  userCoins = 10,
}: HeaderBarProps) {
  const [showChat, setShowChat] = useState(false);
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
              {/* Coin Display Button */}
              <TouchableOpacity style={styles.coinButton}>
                <View style={styles.coinContainer}>
                  <View style={styles.coinIcon}>
                    <Text style={styles.coinSymbol}>$</Text>
                  </View>
                  <Text style={styles.coinText}>{userCoins}RWF</Text>
                </View>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.actionButton}>
                <Heart size={24} color={colors.text} />
              </TouchableOpacity>
              
              {/* Updated Chat Button with notification badge */}
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
              
              <TouchableOpacity style={styles.profileButton}>
                <User size={20} color="#FFF" />
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>

      {/* Chat Overlay */}
      <ChatOverlay isVisible={showChat} onClose={handleCloseChat} />
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
  notificationBadge: {
    position: 'absolute',
    top: -6,
    right: -6,
    backgroundColor: '#FF6B35',
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFF',
  },
  notificationText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: '600',
    textAlign: 'center',
  },
  coinButton: {
    marginLeft: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
  },
  coinContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  coinText: {
    marginLeft: 4,
    fontSize: 16,
    fontWeight: '600',
    color: '#F59E0B',
    fontFamily: FontFamily.semiBold,
  },
  profileButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#00B4D8',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: Spacing.md,
  },
  coinIcon: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#F59E0B',
    justifyContent: 'center',
    alignItems: 'center',
  },
  coinSymbol: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
});