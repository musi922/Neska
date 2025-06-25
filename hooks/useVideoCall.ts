import { useState, useRef, useCallback } from 'react';
import { Platform } from 'react-native';

interface VideoCallHook {
  isInCall: boolean;
  isVideoEnabled: boolean;
  isAudioEnabled: boolean;
  localStream: MediaStream | null;
  remoteStream: MediaStream | null;
  startCall: (receiverId: string) => Promise<void>;
  endCall: () => void;
  toggleVideo: () => void;
  toggleAudio: () => void;
  answerCall: () => Promise<void>;
  rejectCall: () => void;
}

export const useVideoCall = (socket: WebSocket | null): VideoCallHook => {
  const [isInCall, setIsInCall] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  
  const peerConnection = useRef<RTCPeerConnection | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);

  const initializePeerConnection = useCallback(() => {
    if (Platform.OS === 'web') {
      const configuration = {
        iceServers: [
          { urls: 'stun:stun.l.google.com:19302' },
          // Add TURN servers for production
        ]
      };

      peerConnection.current = new RTCPeerConnection(configuration);

      peerConnection.current.onicecandidate = (event) => {
        if (event.candidate && socket) {
          socket.send(JSON.stringify({
            type: 'ice_candidate',
            data: event.candidate
          }));
        }
      };

      peerConnection.current.ontrack = (event) => {
        setRemoteStream(event.streams[0]);
      };
    }
  }, [socket]);

  const getLocalStream = async (): Promise<MediaStream | null> => {
    try {
      if (Platform.OS === 'web') {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: isVideoEnabled,
          audio: isAudioEnabled
        });
        setLocalStream(stream);
        localStreamRef.current = stream;
        return stream;
      }
      return null;
    } catch (error) {
      console.error('Failed to get local stream:', error);
      return null;
    }
  };

  const startCall = async (receiverId: string): Promise<void> => {
    try {
      initializePeerConnection();
      const stream = await getLocalStream();
      
      if (stream && peerConnection.current) {
        stream.getTracks().forEach(track => {
          peerConnection.current?.addTrack(track, stream);
        });

        const offer = await peerConnection.current.createOffer();
        await peerConnection.current.setLocalDescription(offer);

        if (socket) {
          socket.send(JSON.stringify({
            type: 'call_offer',
            data: { receiverId, offer }
          }));
        }

        setIsInCall(true);
      }
    } catch (error) {
      console.error('Failed to start call:', error);
    }
  };

  const answerCall = async (): Promise<void> => {
    try {
      const stream = await getLocalStream();
      
      if (stream && peerConnection.current) {
        stream.getTracks().forEach(track => {
          peerConnection.current?.addTrack(track, stream);
        });

        setIsInCall(true);
      }
    } catch (error) {
      console.error('Failed to answer call:', error);
    }
  };

  const endCall = (): void => {
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => track.stop());
    }
    
    if (peerConnection.current) {
      peerConnection.current.close();
      peerConnection.current = null;
    }

    setIsInCall(false);
    setLocalStream(null);
    setRemoteStream(null);

    if (socket) {
      socket.send(JSON.stringify({
        type: 'call_end'
      }));
    }
  };

  const rejectCall = (): void => {
    if (socket) {
      socket.send(JSON.stringify({
        type: 'call_reject'
      }));
    }
  };

  const toggleVideo = (): void => {
    if (localStreamRef.current) {
      const videoTrack = localStreamRef.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoEnabled(videoTrack.enabled);
      }
    }
  };

  const toggleAudio = (): void => {
    if (localStreamRef.current) {
      const audioTrack = localStreamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsAudioEnabled(audioTrack.enabled);
      }
    }
  };

  return {
    isInCall,
    isVideoEnabled,
    isAudioEnabled,
    localStream,
    remoteStream,
    startCall,
    endCall,
    toggleVideo,
    toggleAudio,
    answerCall,
    rejectCall
  };
};