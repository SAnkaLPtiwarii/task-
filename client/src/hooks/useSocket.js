import { useEffect, useRef } from 'react';
import io from 'socket.io-client';

export function useSocket() {
    const socket = useRef(null);

    useEffect(() => {
        socket.current = io('http://localhost:5000', {
            withCredentials: true
        });

        return () => {
            if (socket.current) {
                socket.current.disconnect();
            }
        };
    }, []);

    return socket.current;
}
