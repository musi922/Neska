import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Alert,
  Image,
  ScrollView,
} from 'react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { useColorScheme } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  X,
  Camera,
  RotateCcw,
  Zap,
  ZapOff,
  Circle,
  Square,
  Download,
  Share2,
  Sparkles,
  Sun,
  Moon,
  Palette,
  Heart,
  Star,
  Smile,
} from 'lucide-react-native';
import * as MediaLibrary from 'expo-media-library';
import Colors from '@/constants/Colors';
import { FontFamily, FontSize, Spacing } from '@/constants/Theme';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

interface Filter {
  id: string;
  name: string;
  icon: React.ReactNode;
  style: any;
}

const filters: Filter[] = [
  {
    id: 'none',
    name: 'Original',
    icon: <Camera size={20} color="#FFF" />,
    style: {},
  },
  {
    id: 'vintage',
    name: 'Vintage',
    icon: <Sun size={20} color="#FFF" />,
    style: {
      opacity: 0.9,
      tintColor: '#F4A460',
    },
  },
  {
    id: 'cool',
    name: 'Cool',
    icon: <Moon size={20} color="#FFF" />,
    style: {
      opacity: 0.8,
      tintColor: '#87CEEB',
    },
  },
  {
    id: 'warm',
    name: 'Warm',
    icon: <Heart size={20} color="#FFF" />,
    style: {
      opacity: 0.85,
      tintColor: '#FFB6C1',
    },
  },
  {
    id: 'dramatic',
    name: 'Drama',
    icon: <Star size={20} color="#FFF" />,
    style: {
      opacity: 0.9,
      tintColor: '#8A2BE2',
    },
  },
  {
    id: 'bright',
    name: 'Bright',
    icon: <Sparkles size={20} color="#FFF" />,
    style: {
      opacity: 0.95,
      tintColor: '#FFD700',
    },
  },
];

interface CameraScreenProps {
  isVisible: boolean;
  onClose: () => void;
  onCapture?: (uri: string) => void;
}

const CameraScreen: React.FC<CameraScreenProps> = ({
  isVisible,
  onClose,
  onCapture,
}) => {
  const [facing, setFacing] = useState<CameraType>('back');
  const [flash, setFlash] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('none');
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  
  const [permission, requestPermission] = useCameraPermissions();
  const [mediaLibraryPermission, requestMediaLibraryPermission] = MediaLibrary.usePermissions();
  
  const cameraRef = useRef<CameraView>(null);
  const recordingInterval = useRef<NodeJS.Timeout>();
  
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const insets = useSafeAreaInsets();

  useEffect(() => {
    if (isRecording) {
      recordingInterval.current = setInterval(() => {
        setRecordingDuration(prev => prev + 1);
      }, 1000);
    } else {
      if (recordingInterval.current) {
        clearInterval(recordingInterval.current);
      }
      setRecordingDuration(0);
    }

    return () => {
      if (recordingInterval.current) {
        clearInterval(recordingInterval.current);
      }
    };
  }, [isRecording]);

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.permissionContainer}>
          <Camera size={64} color={colors.tabIconDefault} />
          <Text style={[styles.permissionText, { color: colors.text }]}>
            We need your permission to show the camera
          </Text>
          <TouchableOpacity
            style={[styles.permissionButton, { backgroundColor: colors.tint }]}
            onPress={requestPermission}
          >
            <Text style={styles.permissionButtonText}>Grant Permission</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const toggleCameraFacing = () => {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  };

  const toggleFlash = () => {
    setFlash(!flash);
  };

  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.8,
          base64: false,
        });
        
        if (photo) {
          setCapturedPhoto(photo.uri);
        }
      } catch (error) {
        console.error('Error taking picture:', error);
        Alert.alert('Error', 'Failed to take picture');
      }
    }
  };

  const startVideoRecording = async () => {
    if (cameraRef.current && !isRecording) {
      try {
        setIsRecording(true);
        const video = await cameraRef.current.recordAsync({
          quality: '720p',
          maxDuration: 60,
        });
        
        if (video) {
          setCapturedPhoto(video.uri);
        }
      } catch (error) {
        console.error('Error recording video:', error);
        Alert.alert('Error', 'Failed to record video');
      } finally {
        setIsRecording(false);
      }
    }
  };

  const stopVideoRecording = () => {
    if (cameraRef.current && isRecording) {
      cameraRef.current.stopRecording();
      setIsRecording(false);
    }
  };

  const saveToGallery = async () => {
    if (!capturedPhoto) return;

    try {
      if (!mediaLibraryPermission?.granted) {
        const { status } = await requestMediaLibraryPermission();
        if (status !== 'granted') {
          Alert.alert('Permission Required', 'Please grant media library permission to save photos');
          return;
        }
      }

      await MediaLibrary.saveToLibraryAsync(capturedPhoto);
      Alert.alert('Success', 'Photo saved to gallery!');
    } catch (error) {
      console.error('Error saving to gallery:', error);
      Alert.alert('Error', 'Failed to save photo');
    }
  };

  const sharePhoto = () => {
    if (capturedPhoto && onCapture) {
      onCapture(capturedPhoto);
      onClose();
    }
  };

  const retakePhoto = () => {
    setCapturedPhoto(null);
  };

  const formatRecordingTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!isVisible) return null;

  if (capturedPhoto) {
    return (
      <View style={styles.container}>
        <Image source={{ uri: capturedPhoto }} style={styles.previewImage} />
        
        {/* Preview Overlay */}
        <LinearGradient
          colors={['rgba(0,0,0,0.6)', 'transparent', 'rgba(0,0,0,0.6)']}
          style={styles.previewOverlay}
        >
          <View style={[styles.previewHeader, { paddingTop: insets.top + 10 }]}>
            <TouchableOpacity onPress={retakePhoto} style={styles.previewButton}>
              <X size={24} color="#FFF" />
            </TouchableOpacity>
            <TouchableOpacity onPress={saveToGallery} style={styles.previewButton}>
              <Download size={24} color="#FFF" />
            </TouchableOpacity>
          </View>

          <View style={[styles.previewFooter, { paddingBottom: insets.bottom + 20 }]}>
            <TouchableOpacity onPress={retakePhoto} style={styles.retakeButton}>
              <Text style={styles.retakeText}>Retake</Text>
            </TouchableOpacity>
            
            <TouchableOpacity onPress={sharePhoto} style={styles.shareButton}>
              <Share2 size={20} color="#FFF" />
              <Text style={styles.shareText}>Share</Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView
        ref={cameraRef}
        style={styles.camera}
        facing={facing}
        flash={flash ? 'on' : 'off'}
      >
        {/* Filter Overlay */}
        {selectedFilter !== 'none' && (
          <View
            style={[
              StyleSheet.absoluteFill,
              filters.find(f => f.id === selectedFilter)?.style,
            ]}
          />
        )}

        {/* Top Controls */}
        <View style={[styles.topControls, { paddingTop: insets.top + 10 }]}>
          <TouchableOpacity onPress={onClose} style={styles.controlButton}>
            <X size={24} color="#FFF" />
          </TouchableOpacity>

          <View style={styles.topRightControls}>
            <TouchableOpacity onPress={toggleFlash} style={styles.controlButton}>
              {flash ? (
                <Zap size={24} color="#FFD700" />
              ) : (
                <ZapOff size={24} color="#FFF" />
              )}
            </TouchableOpacity>
            
            <TouchableOpacity onPress={toggleCameraFacing} style={styles.controlButton}>
              <RotateCcw size={24} color="#FFF" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Recording Indicator */}
        {isRecording && (
          <View style={styles.recordingIndicator}>
            <View style={styles.recordingDot} />
            <Text style={styles.recordingText}>
              REC {formatRecordingTime(recordingDuration)}
            </Text>
          </View>
        )}

        {/* Filters */}
        <View style={styles.filtersContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filtersScroll}
          >
            {filters.map((filter) => (
              <TouchableOpacity
                key={filter.id}
                style={[
                  styles.filterButton,
                  selectedFilter === filter.id && styles.selectedFilter,
                ]}
                onPress={() => setSelectedFilter(filter.id)}
              >
                <View style={styles.filterIcon}>
                  {filter.icon}
                </View>
                <Text style={styles.filterName}>{filter.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Bottom Controls */}
        <View style={[styles.bottomControls, { paddingBottom: insets.bottom + 20 }]}>
          <View style={styles.captureControls}>
            <TouchableOpacity
              style={styles.captureButton}
              onPress={takePicture}
              disabled={isRecording}
            >
              <View style={[
                styles.captureButtonInner,
                isRecording && styles.captureButtonRecording,
              ]}>
                <Circle size={60} color="#FFF" fill="#FFF" />
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.videoButton}
              onPress={isRecording ? stopVideoRecording : startVideoRecording}
            >
              <Square 
                size={24} 
                color={isRecording ? "#EF4444" : "#FFF"} 
                fill={isRecording ? "#EF4444" : "none"}
              />
            </TouchableOpacity>
          </View>
        </View>
      </CameraView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  camera: {
    flex: 1,
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
  },
  permissionText: {
    fontSize: FontSize.lg,
    fontFamily: FontFamily.medium,
    textAlign: 'center',
    marginVertical: Spacing.lg,
  },
  permissionButton: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderRadius: 25,
  },
  permissionButtonText: {
    color: '#FFF',
    fontSize: FontSize.md,
    fontFamily: FontFamily.semiBold,
  },
  topControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
  },
  topRightControls: {
    flexDirection: 'row',
  },
  controlButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: Spacing.sm,
  },
  recordingIndicator: {
    position: 'absolute',
    top: 100,
    left: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: 20,
  },
  recordingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EF4444',
    marginRight: Spacing.xs,
  },
  recordingText: {
    color: '#FFF',
    fontSize: FontSize.sm,
    fontFamily: FontFamily.semiBold,
  },
  filtersContainer: {
    position: 'absolute',
    bottom: 120,
    left: 0,
    right: 0,
  },
  filtersScroll: {
    paddingHorizontal: Spacing.md,
  },
  filterButton: {
    alignItems: 'center',
    marginRight: Spacing.md,
    padding: Spacing.xs,
    borderRadius: 12,
  },
  selectedFilter: {
    backgroundColor: 'rgba(0,180,216,0.3)',
  },
  filterIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  filterName: {
    color: '#FFF',
    fontSize: FontSize.xs,
    fontFamily: FontFamily.medium,
  },
  bottomControls: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  captureControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.lg,
  },
  captureButtonInner: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButtonRecording: {
    backgroundColor: '#EF4444',
  },
  videoButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  previewOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'space-between',
  },
  previewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
  },
  previewButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
  },
  retakeButton: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderRadius: 25,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  retakeText: {
    color: '#FFF',
    fontSize: FontSize.md,
    fontFamily: FontFamily.semiBold,
  },
  shareButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderRadius: 25,
    backgroundColor: '#00B4D8',
  },
  shareText: {
    color: '#FFF',
    fontSize: FontSize.md,
    fontFamily: FontFamily.semiBold,
    marginLeft: Spacing.xs,
  },
});

export default CameraScreen;