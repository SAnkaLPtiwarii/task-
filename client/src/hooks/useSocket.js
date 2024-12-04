import { useEffect, useRef } from 'react';
import io from 'socket.io-client';

export const useSocket = () => {
  const socketRef = useRef(null);
  const SOCKET_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    // Create socket connection
    if (!socketRef.current) {
      socketRef.current = io(SOCKET_URL, {
        transports: ['polling', 'websocket'],
        path: '/socket.io',
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
        timeout: 20000,
        withCredentials: true,
        autoConnect: true
      });

      // Connection handlers
      socketRef.current.on('connect', () => {
        console.log('Socket connected successfully');
        // Join user room
        socketRef.current.emit('join', 'user123'); // Replace with actual user ID
      });

      socketRef.current.on('connect_error', (error) => {
        console.error('Socket connection error:', error);
      });

      socketRef.current.on('disconnect', (reason) => {
        console.log('Socket disconnected:', reason);
      });
    }

    // Cleanup on unmount
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [SOCKET_URL]);

  return socketRef.current;
}; 