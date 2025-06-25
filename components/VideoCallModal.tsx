import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Modal,
  Image,
} from 'react-native';
import {
  Phone,
  PhoneOff,
  Video,
  VideoOff,
  Mic,
  MicOff,
  Camera,
  MoreVertical
} from 'lucide-react-native';
import { useColorScheme } from 'react-native';
import Colors from '@/constants/Colors';
import { FontFamily, FontSize, Spacing } from '@/constants/Theme';
import { BlurView } from 'expo-blur';

const { width, height } = Dimensions.get('window');

interface VideoCallModalProps {
  isVisible: boolean;
  localStream: MediaStream | null;
  remoteStream: MediaStream | null;
  isVideoEnabled: boolean;
  isAudioEnabled: boolean;
  onEndCall: () => void;
  onToggleVideo: () => void;
  onToggleAudio: () => void;
  callerName: string;
  callerAvatar: string;
}

const VideoCallModal: React.FC<VideoCallModalProps> = ({
  isVisible,
  localStream,
  remoteStream,
  isVideoEnabled,
  isAudioEnabled,
  onEndCall,
  onToggleVideo,
  onToggleAudio,
  callerName,
  callerAvatar
}) => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  return (
    <Modal visible={isVisible} animationType="slide" presentationStyle="fullScreen">
      <View style={styles.container}>
        {/* Remote Video/Avatar */}
        <View style={styles.remoteVideoContainer}>
          {remoteStream ? (
            // In a real implementation, you'd use a WebRTC video component here
            <View style={styles.videoPlaceholder}>
              <Text style={styles.videoPlaceholderText}>Remote Video</Text>
            </View>
          ) : (
            <View style={styles.avatarContainer}>
              <Image source={{ uri: callerAvatar }} style={styles.callerAvatar} />
              <Text style={styles.callerName}>{callerName}</Text>
              <Text style={styles.callStatus}>Connecting...</Text>
            </View>
          )}
        </View>

        {/* Local Video */}
        {isVideoEnabled && localStream && (
          <View style={styles.localVideoContainer}>
            <View style={styles.localVideoPlaceholder}>
              <Text style={styles.localVideoText}>You</Text>
            </View>
          </View>
        )}

        {/* Call Controls */}
        <BlurView intensity={80} style={styles.controlsContainer}>
          <View style={styles.controls}>
            <TouchableOpacity
              onPress={onToggleAudio}
              style={[
                styles.controlButton,
                { backgroundColor: isAudioEnabled ? 'rgba(255,255,255,0.2)' : '#EF4444' }
              ]}
            >
              {isAudioEnabled ? (
                <Mic size={24} color="#FFF" />
              ) : (
                <MicOff size={24} color="#FFF" />
              )}
            </TouchableOpacity>

            <TouchableOpacity
              onPress={onEndCall}
              style={[styles.controlButton, styles.endCallButton]}
            >
              <PhoneOff size={28} color="#FFF" />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={onToggleVideo}
              style={[
                styles.controlButton,
                { backgroundColor: isVideoEnabled ? 'rgba(255,255,255,0.2)' : '#EF4444' }
              ]}
            >
              {isVideoEnabled ? (
                <Video size={24} color="#FFF" />
              ) : (
                <VideoOff size={24} color="#FFF" />
              )}
            </TouchableOpacity>
          </View>

          <View style={styles.secondaryControls}>
            <TouchableOpacity style={styles.secondaryButton}>
              <Camera size={20} color="#FFF" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.secondaryButton}>
              <MoreVertical size={20} color="#FFF" />
            </TouchableOpacity>
          </View>
        </BlurView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  remoteVideoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoPlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: '#1F2937',
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoPlaceholderText: {
    color: '#FFF',
    fontSize: FontSize.lg,
    fontFamily: FontFamily.medium,
  },
  avatarContainer: {
    alignItems: 'center',
  },
  callerAvatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: Spacing.lg,
  },
  callerName: {
    color: '#FFF',
    fontSize: FontSize.xl,
    fontFamily: FontFamily.semiBold,
    marginBottom: Spacing.xs,
  },
  callStatus: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: FontSize.md,
    fontFamily: FontFamily.regular,
  },
  localVideoContainer: {
    position: 'absolute',
    top: 60,
    right: 20,
    width: 120,
    height: 160,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#FFF',
  },
  localVideoPlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: '#374151',
    justifyContent: 'center',
    alignItems: 'center',
  },
  localVideoText: {
    color: '#FFF',
    fontSize: FontSize.sm,
    fontFamily: FontFamily.medium,
  },
  controlsContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingBottom: 50,
    paddingTop: Spacing.xl,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  controlButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: Spacing.lg,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  endCallButton: {
    backgroundColor: '#EF4444',
    width: 70,
    height: 70,
    borderRadius: 35,
  },
  secondaryControls: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  secondaryButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: Spacing.md,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
});

export default VideoCallModal;