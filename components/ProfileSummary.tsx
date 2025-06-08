import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useColorScheme } from 'react-native';
import Colors from '@/constants/Colors';
import { FontFamily, FontSize, Spacing, BorderRadius } from '@/constants/Theme';

interface ProfileSummaryProps {
  avatar: string;
  username: string;
  isLive?: boolean;
  onPress?: () => void;
}

export default function ProfileSummary({
  avatar,
  username,
  isLive = false,
  onPress
}: ProfileSummaryProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  
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
  avatarContainer: {
    position: 'relative',
    marginBottom: Spacing.xs,
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
    borderColor: '#FFF',
  },
  username: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.xs,
    textAlign: 'center',
    marginBottom: 2,
  }
});