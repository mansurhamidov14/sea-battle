import React from 'react';

import {
    EEvents,
    EPlayingMode,
    EUserStatus,
} from '../enums';
import { useSocket } from '../hooks';
import {
    IAwaitingUser,
    ICoordinates,
    IFleet,
    IOpponentFleet,
    IScore,
    IUser
} from '../models';
import {
    initialAwaitingUsers,
    initialFiredCoordinates,
    initialOpponent,
    initialOpponentFleets,
    initialPlayerFleets,
    initialScore,
    initialUserStatus,
} from './consts';

export interface IGameplayContext {
    awaitingUsers: IAwaitingUser[];
    firedCoordinatesOfOpponent: ICoordinates[];
    firedCoordinatesOfPlayer: ICoordinates[];
    isGameOver: boolean;
    isWinner?: boolean;
    opponent?: IUser;
    opponentFleets: IOpponentFleet[];
    playerFleets: IFleet[];
    playingMode?: EPlayingMode;
    score: IScore;
    userStatus: EUserStatus;
    finishBattle: () => void;
    fireOpponent: (V: number, H: number) => void;
    getFireResultByOpponent: (firedFleetId: number | null, fleets: IFleet[], coordinates: ICoordinates, gameOver: boolean) => void;
    requestRevenge: () => void;
    setAwaitingUsers: (users: IAwaitingUser[]) => void;
    setOpponent: (player: IUser) => void;
    setPlayerFleets: (fleets: IFleet[]) => void;
    setUserStatus: (status: EUserStatus) => void;
    startNewGame: () => void;
    submitPlayerFleets: (fleets: IFleet[]) => void;
    toggleFiring: (isFiring: boolean) => void;
    toggleUserInvited: (userId: string, invited: boolean) => void;
}

export const GameplayContext = React.createContext<IGameplayContext>(null as any);

export const GameplayProvider: React.FC = ({
    children
}) => {
    const socket = useSocket();
    const [awaitingUsers, setAwaitingUsers] = React.useState<IAwaitingUser[]>(initialAwaitingUsers);
    const [firedCoordinatesOfPlayer, setFiredCoordinatesOfPlayer] = React.useState<ICoordinates[]>(initialFiredCoordinates);
    const [firedCoordinatesOfOpponent, setFiredCoordinatesOfOpponent] = React.useState<ICoordinates[]>(initialFiredCoordinates);
    const [playerFleets, setPlayerFleets] = React.useState<IFleet[]>(initialPlayerFleets);
    const [opponentFleets, setFiredOpponentFleets] = React.useState<IOpponentFleet[]>(initialOpponentFleets);
    const [isGameOver, setGameOver] = React.useState<boolean>(false);
    const [isWinner, setWinning] = React.useState<boolean | undefined>();
    const [score, setScore] = React.useState<IScore>(initialScore);
    const [playingMode, setPlayingMode] = React.useState<EPlayingMode>(EPlayingMode.WATCHING);
    const [userStatus, setUserStatus] = React.useState<EUserStatus>(initialUserStatus);
    const [opponent, setOpponentData] = React.useState<IUser | undefined>(initialOpponent);

    const toggleUserInvited = (userId: string, hasBeenInvited: boolean) => {
        setAwaitingUsers(state => {
            return state.map(_player => {
                if (_player.id === userId) {
                    return {
                        ..._player,
                        hasBeenInvited
                    };
                }
                return _player
            });
        }); 
    };

    const setOpponent = (player: IUser) => setOpponentData(player);

    const toggleFiring = (isFiring: boolean) => setPlayingMode(isFiring ? EPlayingMode.FIRING : EPlayingMode.WATCHING);

    const getFireResultByOpponent = (
        firedFleetId: number | null,
        updatedFleets: IFleet[],
        coordinates: ICoordinates,
        gameOver: boolean
    ) => {
        toggleFiring(!firedFleetId);
        setPlayerFleets(state => firedFleetId ? updatedFleets : state);
        setWinning(gameOver ? false : undefined);
        setGameOver(gameOver);
        setScore(state => ({ ...state, lost: state.lost + Number(gameOver) }));
        if (!firedFleetId) {
            setFiredCoordinatesOfPlayer(state => [...state, coordinates]);
        }
    };

    const fireOpponent = (V: number, H: number) => {
        socket.emit(EEvents.FIRE, { V, H }, (firedFleetId: number | null, wasDestroyed: boolean, gameOver: boolean) => {
            toggleFiring(Boolean(firedFleetId));
            if (firedFleetId) {
                setFiredOpponentFleets(state => {
                    if (state.some(fleet => fleet.id === firedFleetId)) {
                        return state.map(fleet => {
                            if (fleet.id === firedFleetId) {
                                return {
                                    ...fleet,
                                    wasDestroyed,
                                    coordinates: [...fleet.coordinates, { V, H }]
                                };
                            }
                            return fleet;
                        });
                    } else {
                        return [
                            ...state,
                            {
                                id: firedFleetId,
                                wasDestroyed,
                                coordinates: [{ V, H }]
                            }
                        ];
                    }
                });
                setGameOver(gameOver);
                setWinning(gameOver || undefined);
                setScore(state => ({ ...state, won: state.won + Number(gameOver) }));
            } else {
                setFiredCoordinatesOfOpponent(state => [...state, { V, H }]);
            }
        });
    } 

    const submitPlayerFleets = (fleets: IFleet[]) => {
        socket.emit(EEvents.COMPLETE_FLEETS_LOCATING, fleets, () => {
            setPlayerFleets(fleets);
            setUserStatus(EUserStatus.FLEET_LOCATING_COMPLETED);
        });
    };

    const startNewGame = () => {
        setFiredCoordinatesOfOpponent(initialFiredCoordinates);
        setFiredCoordinatesOfPlayer(initialFiredCoordinates);
        setUserStatus(EUserStatus.FLEET_LOCATING_IN_PROGRESS);
        setPlayerFleets(initialPlayerFleets);
        setFiredOpponentFleets(initialOpponentFleets);
        setGameOver(false);
    };

    const finishBattle = () => {
        socket.emit(EEvents.FINISH_BATTLE, () => {
            setUserStatus(EUserStatus.ONLINE);
            setOpponentData(initialOpponent);
            setScore(initialScore);
        });
    };

    const requestRevenge = () => {
        socket.emit(EEvents.REVENGE_REQUESTED);
    };

    return (
        <GameplayContext.Provider value={{
            awaitingUsers,
            finishBattle,
            firedCoordinatesOfOpponent,
            firedCoordinatesOfPlayer,
            fireOpponent,
            getFireResultByOpponent,
            isGameOver,
            isWinner,
            opponent,
            opponentFleets,
            setAwaitingUsers,
            score,
            playerFleets,
            playingMode,
            requestRevenge,
            toggleFiring,
            toggleUserInvited,
            setOpponent,
            setPlayerFleets,
            setUserStatus,
            startNewGame,
            submitPlayerFleets,
            userStatus,
        }}>
            {children}
        </GameplayContext.Provider>
    );
};

GameplayProvider.displayName = 'GameplayProvider';
