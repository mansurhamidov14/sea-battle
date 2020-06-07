import React from 'react';

import { EAvatarName, EEvents, EUserStatus } from '../enums';
import { useSocket, useGameplay } from '../hooks';
import { IUser } from '../models';
import { initialPlayerData } from './consts';

export interface IPlayerContext {
    player: IUser;
    setPlayerAvatar: (avatar: EAvatarName) => void;
    setPlayerName: (username: string) => void;
    createPlayer: () => void;
}

export const PlayerContext = React.createContext<IPlayerContext>(null as any);

export const PlayerProvider: React.FC = ({
    children
}) => {
    const socket = useSocket();
    const { setUserStatus } = useGameplay();
    const [player, setPlayerData] = React.useState<IUser>(initialPlayerData);
    const createPlayer = () => {
        socket.emit(EEvents.CREATE_USER, player, (userId: string) => {
            setPlayerData(state => ({ ...state, id: userId }));
            setUserStatus(EUserStatus.ONLINE);
        });
    };

    const setPlayerAvatar = (avatar: EAvatarName) => setPlayerData(state => ({ ...state, avatar }));
    const setPlayerName = (username: string) => setPlayerData(state => ({ ...state, username }));

    return (
        <PlayerContext.Provider value={{
            player,
            setPlayerAvatar,
            setPlayerName,
            createPlayer
        }}>
            {children}
        </PlayerContext.Provider>
    );
};

PlayerProvider.displayName = 'PlayerProvider';
