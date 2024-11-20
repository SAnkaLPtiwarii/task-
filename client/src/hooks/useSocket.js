import { useEffect, useRef } from 'react';
import io from 'socket.io-client';

export const useSocket = () => {
    const socket = useRef(null);
    const SOCKET_URL = import.meta.env.VITE_API_URL || 'https://taskoo-g77y.onrender.com';

    useEffect(() => {
        if (!socket.current) {
            socket.current = io(SOCKET_URL, {
                withCredentials: true,
                transports: ['websocket', 'polling'],
                reconnection: true,
                reconnectionAttempts: 5,
                reconnectionDelay: 1000,
                timeout: 20000
            });

            socket.current.on('connect', () => {
                console.log('Socket connected successfully');
            });

            socket.current.on('connect_error', (error) => {
                console.error('Socket connection error:', error);
            });

            socket.current.on('error', (error) => {
                console.error('Socket error:', error);
            });
        }

        return () => {
            if (socket.current) {
                socket.current.disconnect();
                socket.current = null;
            }
        };
    }, [SOCKET_URL]);

    return socket.current;
};