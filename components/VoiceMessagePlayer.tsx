import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { Play, Pause } from 'lucide-react-native';
import { Audio } from 'expo-av';
import { FontFamily, FontSize, Spacing } from '@/constants/Theme';

interface VoiceMessagePlayerProps {
  uri: string;
  duration: number;
  isOwnMessage: boolean;
}

const VoiceMessagePlayer: React.FC<VoiceMessagePlayerProps> = ({
  uri,
  duration,
  isOwnMessage,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [sound, setSound] = useState<Audio.Sound | null>(null);

  const waveAnimations = useRef(
    Array.from({ length: 20 }, () => new Animated.Value(0.3))
  ).current;

  useEffect(() => {
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [sound]);

  useEffect(() => {
    if (isPlaying) {
      const animations = waveAnimations.map((anim, index) =>
        Animated.loop(
          Animated.sequence([
            Animated.timing(anim, {
              toValue: Math.random() * 0.7 + 0.3,
              duration: 200 + Math.random() * 200,
              useNativeDriver: true,
            }),
            Animated.timing(anim, {
              toValue: 0.3,
              duration: 200 + Math.random() * 200,
              useNativeDriver: true,
            }),
          ])
        )
      );

      animations.forEach((anim, index) => {
        setTimeout(() => anim.start(), index * 50);
      });

      return () => {
        animations.forEach((anim) => anim.stop());
      };
    } else {
      waveAnimations.forEach((anim) => {
        Animated.timing(anim, {
          toValue: 0.3,
          duration: 200,
          useNativeDriver: true,
        }).start();
      });
    }
  }, [isPlaying]);

  const playSound = async () => {
    try {
      if (sound) {
        if (isPlaying) {
          await sound.pauseAsync();
          setIsPlaying(false);
        } else {
          await sound.playAsync();
          setIsPlaying(true);
        }
      } else {
        const { sound: newSound } = await Audio.Sound.createAsync(
          { uri },
          { shouldPlay: true },
          onPlaybackStatusUpdate
        );
        setSound(newSound);
        setIsPlaying(true);
      }
    } catch (error) {
      console.error('Error playing sound:', error);
    }
  };

  const onPlaybackStatusUpdate = (status: any) => {
    if (status.isLoaded) {
      if (status.positionMillis) {
        setCurrentTime(Math.floor(status.positionMillis / 1000));
      }
      if (status.didJustFinish) {
        setIsPlaying(false);
        setCurrentTime(0);
        if (sound) {
          sound.setPositionAsync(0);
        }
      }
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const displayTime = isPlaying ? currentTime : duration;

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={playSound}
        style={[
          styles.playButton,
          {
            backgroundColor: isOwnMessage ? 'rgba(255,255,255,0.2)' : '#00B4D8',
          },
        ]}
      >
        {isPlaying ? (
          <Pause size={16} color="#FFF" />
        ) : (
          <Play size={16} color="#FFF" />
        )}
      </TouchableOpacity>

      <View style={styles.waveformContainer}>
        {waveAnimations.map((anim, index) => (
          <Animated.View
            key={index}
            style={[
              styles.waveBar,
              {
                backgroundColor: isOwnMessage
                  ? 'rgba(255,255,255,0.6)'
                  : '#00B4D8',
                transform: [{ scaleY: anim }],
              },
            ]}
          />
        ))}
      </View>

      <Text
        style={[
          styles.timeText,
          { color: isOwnMessage ? 'rgba(255,255,255,0.9)' : '#666' },
        ]}
      >
        {formatTime(displayTime)}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.xs,
    minWidth: 200,
  },
  playButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.sm,
  },
  waveformContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    height: 30,
    marginRight: Spacing.sm,
  },
  waveBar: {
    width: 3,
    height: 30,
    borderRadius: 1.5,
    marginHorizontal: 1.5,
  },
  timeText: {
    fontSize: FontSize.xs,
    fontFamily: FontFamily.medium,
    minWidth: 35,
  },
});

export default VoiceMessagePlayer;
