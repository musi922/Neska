import { useEffect, useRef, useState, useCallback } from 'react';

export interface ChatMessage {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  type: 'text' | 'voice' | 'image' | 'video';
  timestamp: number;
  status: 'sending' | 'sent' | 'delivered' | 'read';
  voiceDuration?: number;
  voiceUrl?: string;
}

export interface User {
  id: string;
  username: string;
  avatar: string;
  isOnline: boolean;
  lastSeen?: number;
}

interface WebSocketHookReturn {
  socket: WebSocket | null;
  isConnected: boolean;
  sendMessage: (message: Omit<ChatMessage, 'id' | 'timestamp' | 'status'>) => void;
  sendTyping: (receiverId: string, isTyping: boolean) => void;
  markAsRead: (messageId: string) => void;
  joinRoom: (roomId: string) => void;
  leaveRoom: (roomId: string) => void;
}

export const useWebSocket = (userId: string): WebSocketHookReturn => {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout>();
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = 5;

  const connect = useCallback(() => {
    try {
      // Replace with your WebSocket server URL
      const ws = new WebSocket(`ws://localhost:8080?userId=${userId}`);
      
      ws.onopen = () => {
        console.log('WebSocket connected');
        setIsConnected(true);
        reconnectAttempts.current = 0;
      };

      ws.onclose = () => {
        console.log('WebSocket disconnected');
        setIsConnected(false);
        
        // Attempt to reconnect
        if (reconnectAttempts.current < maxReconnectAttempts) {
          reconnectAttempts.current++;
          reconnectTimeoutRef.current = setTimeout(() => {
            connect();
          }, Math.pow(2, reconnectAttempts.current) * 1000);
        }
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
      };

      setSocket(ws);
    } catch (error) {
      console.error('Failed to connect to WebSocket:', error);
    }
  }, [userId]);

  useEffect(() => {
    connect();

    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (socket) {
        socket.close();
      }
    };
  }, [connect]);

  const sendMessage = useCallback((message: Omit<ChatMessage, 'id' | 'timestamp' | 'status'>) => {
    if (socket && isConnected) {
      const fullMessage: ChatMessage = {
        ...message,
        id: Date.now().toString(),
        timestamp: Date.now(),
        status: 'sending'
      };
      
      socket.send(JSON.stringify({
        type: 'message',
        data: fullMessage
      }));
    }
  }, [socket, isConnected]);

  const sendTyping = useCallback((receiverId: string, isTyping: boolean) => {
    if (socket && isConnected) {
      socket.send(JSON.stringify({
        type: 'typing',
        data: { receiverId, isTyping }
      }));
    }
  }, [socket, isConnected]);

  const markAsRead = useCallback((messageId: string) => {
    if (socket && isConnected) {
      socket.send(JSON.stringify({
        type: 'read',
        data: { messageId }
      }));
    }
  }, [socket, isConnected]);

  const joinRoom = useCallback((roomId: string) => {
    if (socket && isConnected) {
      socket.send(JSON.stringify({
        type: 'join_room',
        data: { roomId }
      }));
    }
  }, [socket, isConnected]);

  const leaveRoom = useCallback((roomId: string) => {
    if (socket && isConnected) {
      socket.send(JSON.stringify({
        type: 'leave_room',
        data: { roomId }
      }));
    }
  }, [socket, isConnected]);

  return {
    socket,
    isConnected,
    sendMessage,
    sendTyping,
    markAsRead,
    joinRoom,
    leaveRoom
  };
};