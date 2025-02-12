import { useState, useEffect } from 'react';
import io, { Socket } from 'socket.io-client';

const SERVER_URL = 'http://localhost:8000';

// Custom hook to manage WebSocket connection
export const useSocketConnection = () => {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    // Initialize Socket.IO connection
    const socketInstance = io(SERVER_URL);
    setSocket(socketInstance);

    socketInstance.on('connect', () => {
      console.log('Connected to FastAPI WebSocket');
    });

    // Cleanup on unmount
    return () => {
      socketInstance.disconnect();
    };
  }, []);

  return socket;
};