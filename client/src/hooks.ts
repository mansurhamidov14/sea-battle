import { useContext } from 'react';

import { GameplayContext, IGameplayContext } from './context/Gameplay';
import { INotificationsContext, NotificationsContext } from './context/Notifications';
import { SocketContext } from './context/Socket';
import { IPlayerContext, PlayerContext } from './context/Player';

export function useNotifications (): INotificationsContext {
    return useContext(NotificationsContext);
}

export function useSocket () {
    return useContext(SocketContext);
}

export function useGameplay (): IGameplayContext {
    return useContext(GameplayContext);
}

export function usePlayer (): IPlayerContext {
    return useContext(PlayerContext);
}
