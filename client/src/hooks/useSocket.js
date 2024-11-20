import { useEffect, useRef } from 'react';
import io from 'socket.io-client';

export function useSocket() {
    const socket = useRef(null);

    useEffect(() => {
        const SOCKET_URL = import.meta.env.VITE_SOCKET_URL;

        if (!socket.current) {
            socket.current = io(SOCKET_URL, {
                withCredentials: true,
                transports: ['websocket'],
                reconnection: true,
                reconnectionDelay: 1000,
                reconnectionAttempts: 5
            });

            socket.current.on('connect', () => {
                console.log('Socket connected');
            });

            socket.current.on('connect_error', (error) => {
                console.error('Socket connection error:', error);
            });
        }

        return () => {
            if (socket.current) {
                socket.current.disconnect();
            }
        };
    }, []);

    return socket.current;
}
