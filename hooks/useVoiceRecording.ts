import { useState, useRef } from 'react';
import { Audio } from 'expo-av';
import { Platform } from 'react-native';

interface VoiceRecordingHook {
  isRecording: boolean;
  recordingDuration: number;
  startRecording: () => Promise<void>;
  stopRecording: () => Promise<string | null>;
  playRecording: (uri: string) => Promise<void>;
  pauseRecording: () => Promise<void>;
  requestPermissions: () => Promise<boolean>;
}

export const useVoiceRecording = (): VoiceRecordingHook => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const recording = useRef<Audio.Recording | null>(null);
  const sound = useRef<Audio.Sound | null>(null);
  const durationInterval = useRef<NodeJS.Timeout | null>(null);

  const requestPermissions = async (): Promise<boolean> => {
    try {
      if (Platform.OS === 'web') {
        // For web, use navigator.mediaDevices
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        stream.getTracks().forEach(track => track.stop());
        return true;
      } else {
        const { status } = await Audio.requestPermissionsAsync();
        return status === 'granted';
      }
    } catch (error) {
      console.error('Failed to get audio permissions:', error);
      return false;
    }
  };

  const startRecording = async (): Promise<void> => {
    try {
      const hasPermission = await requestPermissions();
      if (!hasPermission) {
        throw new Error('Audio permission not granted');
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording: newRecording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );

      recording.current = newRecording;
      setIsRecording(true);
      setRecordingDuration(0);

      // Start duration timer
      durationInterval.current = setInterval(() => {
        setRecordingDuration(prev => prev + 1);
      }, 1000);

    } catch (error) {
      console.error('Failed to start recording:', error);
    }
  };

  const stopRecording = async (): Promise<string | null> => {
    try {
      if (!recording.current) return null;

      setIsRecording(false);
      if (durationInterval.current) {
        clearInterval(durationInterval.current);
        durationInterval.current = null;
      }

      await recording.current.stopAndUnloadAsync();
      const uri = recording.current.getURI();
      recording.current = null;

      return uri;
    } catch (error) {
      console.error('Failed to stop recording:', error);
      return null;
    }
  };

  const playRecording = async (uri: string): Promise<void> => {
    try {
      if (sound.current) {
        await sound.current.unloadAsync();
      }

      const { sound: newSound } = await Audio.Sound.createAsync({ uri });
      sound.current = newSound;
      await newSound.playAsync();
    } catch (error) {
      console.error('Failed to play recording:', error);
    }
  };

  const pauseRecording = async (): Promise<void> => {
    try {
      if (sound.current) {
        await sound.current.pauseAsync();
      }
    } catch (error) {
      console.error('Failed to pause recording:', error);
    }
  };

  return {
    isRecording,
    recordingDuration,
    startRecording,
    stopRecording,
    playRecording,
    pauseRecording,
    requestPermissions
  };
};