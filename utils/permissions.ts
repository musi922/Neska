import { Platform, Alert, Linking } from 'react-native';
import * as MediaLibrary from 'expo-media-library';
import { Camera } from 'expo-camera';
import { Audio } from 'expo-av';

export interface PermissionResult {
  granted: boolean;
  canAskAgain?: boolean;
}

export class PermissionManager {
  static async requestCameraPermission(): Promise<PermissionResult> {
    try {
      const { status, canAskAgain } = await Camera.requestCameraPermissionsAsync();
      
      if (status !== 'granted') {
        this.showPermissionAlert(
          'Camera Permission Required',
          'GEN Z needs access to your camera to take photos and videos.',
          'camera'
        );
      }

      return {
        granted: status === 'granted',
        canAskAgain,
      };
    } catch (error) {
      console.error('Error requesting camera permission:', error);
      return { granted: false };
    }
  }

  static async requestMicrophonePermission(): Promise<PermissionResult> {
    try {
      const { status, canAskAgain } = await Audio.requestPermissionsAsync();
      
      if (status !== 'granted') {
        this.showPermissionAlert(
          'Microphone Permission Required',
          'GEN Z needs access to your microphone for voice messages and calls.',
          'microphone'
        );
      }

      return {
        granted: status === 'granted',
        canAskAgain,
      };
    } catch (error) {
      console.error('Error requesting microphone permission:', error);
      return { granted: false };
    }
  }

  static async requestMediaLibraryPermission(): Promise<PermissionResult> {
    try {
      const { status, canAskAgain } = await MediaLibrary.requestPermissionsAsync();
      
      if (status !== 'granted') {
        this.showPermissionAlert(
          'Photo Library Permission Required',
          'GEN Z needs access to your photo library to save and share photos.',
          'photos'
        );
      }

      return {
        granted: status === 'granted',
        canAskAgain,
      };
    } catch (error) {
      console.error('Error requesting media library permission:', error);
      return { granted: false };
    }
  }

  static async checkCameraPermission(): Promise<boolean> {
    try {
      const { status } = await Camera.getCameraPermissionsAsync();
      return status === 'granted';
    } catch (error) {
      console.error('Error checking camera permission:', error);
      return false;
    }
  }

  static async checkMicrophonePermission(): Promise<boolean> {
    try {
      const { status } = await Audio.getPermissionsAsync();
      return status === 'granted';
    } catch (error) {
      console.error('Error checking microphone permission:', error);
      return false;
    }
  }

  static async checkMediaLibraryPermission(): Promise<boolean> {
    try {
      const { status } = await MediaLibrary.getPermissionsAsync();
      return status === 'granted';
    } catch (error) {
      console.error('Error checking media library permission:', error);
      return false;
    }
  }

  private static showPermissionAlert(title: string, message: string, type: string) {
    Alert.alert(
      title,
      message,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Settings',
          onPress: () => {
            if (Platform.OS === 'ios') {
              Linking.openURL('app-settings:');
            } else {
              Linking.openSettings();
            }
          },
        },
      ]
    );
  }

  static async requestAllPermissions(): Promise<{
    camera: boolean;
    microphone: boolean;
    mediaLibrary: boolean;
  }> {
    const [camera, microphone, mediaLibrary] = await Promise.all([
      this.requestCameraPermission(),
      this.requestMicrophonePermission(),
      this.requestMediaLibraryPermission(),
    ]);

    return {
      camera: camera.granted,
      microphone: microphone.granted,
      mediaLibrary: mediaLibrary.granted,
    };
  }
}