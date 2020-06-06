import React from 'react';

import { GameplayProvider } from './Gameplay';
import { NotificationsProvider } from './Notifications';
import { PlayerProvider } from './Player';
import { SocketProvider } from './Socket';

export const Provider: React.FC = ({ children }) => (
    <PlayerProvider>
        <GameplayProvider>
            <NotificationsProvider>
                <SocketProvider>
                    {children}
                </SocketProvider>
            </NotificationsProvider>
        </GameplayProvider>
    </PlayerProvider>
);

Provider.displayName = 'Provider';
