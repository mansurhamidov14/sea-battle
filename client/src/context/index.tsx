import React from 'react';

import { GameplayProvider } from './Gameplay';
import { NotificationsProvider } from './Notifications';
import { PlayerProvider } from './Player';
import { SocketProvider } from './Socket';

export const Provider: React.FC = ({ children }) => (
    <SocketProvider>
        <GameplayProvider>
            <NotificationsProvider>
                <PlayerProvider>
                    {children}
                </PlayerProvider>
            </NotificationsProvider>
        </GameplayProvider>
    </SocketProvider>
);

Provider.displayName = 'Provider';
