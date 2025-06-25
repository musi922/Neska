import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Play, Pause } from 'lucide-react-native';
import { Audio } from 'expo-av';
import { useColorScheme } from 'react-native';
import Colors from '@/constants/Colors';
import { FontFamily, FontSize, Spacing } from '@/constants/Theme';

interface VoiceMessagePlayerProps {
  uri: string;
  duration: number;
  isOwnMessage: boolean;
}

const VoiceMessagePlayer: React.FC<VoiceMessagePlayerProps> = ({
  uri,
  duration,
  isOwnMessage
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [position, setPosition] = useState(0);
  const [playbackDuration, setPlaybackDuration] = useState(duration);
  
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  useEffect(() => {
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [sound]);

  const playPauseAudio = async () => {
    try {
      if (sound) {
        if (isPlaying) {
          await sound.pauseAsync();
        } else {
          await sound.playAsync();
        }
        setIsPlaying(!isPlaying);
      } else {
        const { sound: newSound } = await Audio.Sound.createAsync(
          { uri },
          { shouldPlay: true }
        );
        
        setSound(newSound);
        setIsPlaying(true);
        
        newSound.setOnPlaybackStatusUpdate((status) => {
          if (status.isLoaded) {
            setPosition(status.positionMillis || 0);
            setPlaybackDuration(status.durationMillis || duration * 1000);
            
            if (status.didJustFinish) {
              setIsPlaying(false);
              setPosition(0);
            }
          }
        });
      }
    } catch (error) {
      console.error('Error playing audio:', error);
    }
  };

  const formatTime = (milliseconds: number) => {
    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const progressPercentage = playbackDuration > 0 ? (position / playbackDuration) * 100 : 0;

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={playPauseAudio} style={[
        styles.playButton,
        { backgroundColor: isOwnMessage ? 'rgba(255,255,255,0.2)' : colors.subtle }
      ]}>
        {isPlaying ? (
          <Pause size={16} color={isOwnMessage ? '#FFF' : colors.text} />
        ) : (
          <Play size={16} color={isOwnMessage ? '#FFF' : colors.text} />
        )}
      </TouchableOpacity>
      
      <View style={styles.waveformContainer}>
        <View style={[
          styles.waveformBackground,
          { backgroundColor: isOwnMessage ? 'rgba(255,255,255,0.3)' : colors.border }
        ]}>
          <View style={[
            styles.waveformProgress,
            {
              width: `${progressPercentage}%`,
              backgroundColor: isOwnMessage ? '#FFF' : '#00B4D8'
            }
          ]} />
        </View>
        
        <Text style={[
          styles.durationText,
          { color: isOwnMessage ? 'rgba(255,255,255,0.8)' : colors.tabIconDefault }
        ]}>
          {formatTime(isPlaying ? position : playbackDuration)}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    minWidth: 150,
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
    justifyContent: 'center',
  },
  waveformBackground: {
    height: 4,
    borderRadius: 2,
    marginBottom: 4,
    overflow: 'hidden',
  },
  waveformProgress: {
    height: '100%',
    borderRadius: 2,
  },
  durationText: {
    fontSize: FontSize.xs,
    fontFamily: FontFamily.regular,
  },
});

export default VoiceMessagePlayer;