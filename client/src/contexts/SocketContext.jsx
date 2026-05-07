import { createContext, useContext, useEffect, useState, useRef } from 'react';

const SocketContext = createContext(null);

export function SocketProvider({ children }) {
  const [onlineCount, setOnlineCount] = useState(1284);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const socketRef = useRef(null);

  useEffect(() => {
    // Mock online counter that fluctuates
    const interval = setInterval(() => {
      setOnlineCount(prev => prev + Math.floor(Math.random() * 11) - 5);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const sendMessage = (to, content, type = 'text') => {
    // In production, this sends via socket.io
    console.log('Sending message:', { to, content, type });
  };

  return (
    <SocketContext.Provider value={{ onlineCount, onlineUsers, sendMessage, socket: socketRef.current }}>
      {children}
    </SocketContext.Provider>
  );
}

export const useSocket = () => {
  const ctx = useContext(SocketContext);
  if (!ctx) throw new Error('useSocket must be used within SocketProvider');
  return ctx;
};
