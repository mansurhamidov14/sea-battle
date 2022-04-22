import React from 'react';
import io from 'socket.io-client';

const socket = io(':8080', { transports: ['websocket'] });
export const SocketContext = React.createContext<SocketIOClient.Socket>(null as any);

export const SocketProvider: React.FC = ({
    children
}) => (
    <SocketContext.Provider value={socket}>
        {children}
    </SocketContext.Provider>
);

SocketProvider.displayName = 'SocketProvider';
