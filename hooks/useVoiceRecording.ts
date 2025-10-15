import { useState, useRef, useEffect } from 'react';
import { Audio } from 'expo-av';
import { Platform } from 'react-native';

interface VoiceRecordingHook {
  isRecording: boolean;
  recordingDuration: number;
  startRecording: () => Promise<void>;
  stopRecording: () => Promise<string | null>;
  requestPermissions: () => Promise<boolean>;
}

export const useVoiceRecording = (): VoiceRecordingHook => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const recording = useRef<Audio.Recording | null>(null);
  const durationTimer = useRef<NodeJS.Timer | null>(null);
  const lastDuration = useRef<number>(0);

  const requestPermissions = async (): Promise<boolean> => {
    try {
      if (Platform.OS === 'web') {
        // For web, use navigator.mediaDevices
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        stream.getTracks().forEach((track) => track.stop());
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

  const cleanupRecording = () => {
    if (durationTimer.current) {
      clearInterval(durationTimer.current);
      durationTimer.current = null;
    }
    setRecordingDuration(0);
    setIsRecording(false);
    recording.current = null;
  };

  const startRecording = async (isResume = false): Promise<void> => {
    try {
      if (!isResume) {
        // New recording
        const { recording: newRecording } = await Audio.Recording.createAsync(
          Audio.RecordingOptionsPresets.HIGH_QUALITY
        );
        recording.current = newRecording;
        lastDuration.current = 0;
        setRecordingDuration(0);
      } else {
        // Resume existing recording
        if (recording.current) {
          await recording.current.startAsync();
        }
      }

      setIsRecording(true);

      // Start or resume duration timer
      durationTimer.current = setInterval(() => {
        setRecordingDuration((prev) => {
          lastDuration.current = prev + 1;
          return prev + 1;
        });
      }, 1000);
    } catch (error) {
      console.error('Failed to start recording', error);
      cleanupRecording();
    }
  };

  const stopRecording = async (
    isPause = false,
    isCancel = false
  ): Promise<string | null> => {
    try {
      if (!recording.current) return null;

      if (durationTimer.current) {
        clearInterval(durationTimer.current);
        durationTimer.current = null;
      }

      if (isPause) {
        // Pause recording
        await recording.current.pauseAsync();
        return null;
      }

      // Stop recording
      await recording.current.stopAndUnloadAsync();
      const uri = recording.current.getURI();

      // Clean up everything except when pausing
      if (!isPause) {
        cleanupRecording();
      }

      return isCancel ? null : uri;
    } catch (error) {
      console.error('Failed to stop recording', error);
      cleanupRecording();
      return null;
    }
  };

  useEffect(() => {
    return () => {
      if (durationTimer.current) {
        clearInterval(durationTimer.current);
      }
      if (recording.current) {
        recording.current.stopAndUnloadAsync();
      }
    };
  }, []);

  return {
    isRecording,
    recordingDuration,
    startRecording,
    stopRecording,
    requestPermissions,
  };
};
