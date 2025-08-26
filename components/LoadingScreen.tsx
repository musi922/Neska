import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { FontFamily, FontSize, Spacing } from '@/constants/Theme';

interface LoadingScreenProps {
  message?: string;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ 
  message = "Loading..." 
}) => {
  return (
    <LinearGradient
      colors={['#00B4D8', '#8B5CF6']}
      style={styles.container}
    >
      <View style={styles.content}>
        <Text style={styles.logo}>GEN Z</Text>
        <ActivityIndicator size="large" color="#FFF" style={styles.spinner} />
        <Text style={styles.message}>{message}</Text>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
  },
  logo: {
    fontSize: 48,
    fontFamily: FontFamily.bold,
    color: '#FFF',
    marginBottom: Spacing.xl,
  },
  spinner: {
    marginBottom: Spacing.lg,
  },
  message: {
    fontSize: FontSize.md,
    fontFamily: FontFamily.medium,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
  },
});

export default LoadingScreen;